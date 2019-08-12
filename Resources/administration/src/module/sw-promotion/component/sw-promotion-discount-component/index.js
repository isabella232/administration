import { Component, Mixin } from 'src/core/shopware';
import Criteria from 'src/core/data-new/criteria.data';
import { DiscountTypes, DiscountScopes, PromotionPermissions } from 'src/module/sw-promotion/helper/promotion.helper';
import template from './sw-promotion-discount-component.html.twig';
import './sw-promotion-discount-component.scss';
import DiscountHandler from './handler';

const discountHandler = new DiscountHandler();

Component.register('sw-promotion-discount-component', {
    inject: ['repositoryFactory', 'context'],
    template,

    mixins: [
        Mixin.getByName('placeholder')
    ],

    props: {
        promotion: {
            type: Object,
            required: true
        },
        discount: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            displayAdvancedPrices: false,
            currencies: [],
            defaultCurrency: null,
            isLoading: false,
            showRuleModal: false,
            showDeleteModal: false,
            currencySymbol: null,
            allowProductRules: false,
            cartScope: this.discount.scope === DiscountScopes.CART,
            considerAdvancedRules: this.discount.considerAdvancedRules
        };
    },
    created() {
        this.createdComponent();
    },

    computed: {
        advancedPricesRepo() {
            return this.repositoryFactory.create('promotion_discount_prices');
        },

        currencyRepository() {
            return this.repositoryFactory.create('currency');
        },

        ruleFilter() {
            return Criteria.multi('AND', [
                Criteria.equalsAny('conditions.type', [
                    'cartLineItemOfType', 'cartLineItem', 'cartLineItemTotalPrice', 'cartLineItemUnitPrice',
                    'cartLineItemWithQuantity', 'cartLineItemTag'
                ]),
                Criteria.not('AND', [Criteria.equalsAny('conditions.type', ['cartCartAmount'])])
            ]);
        },

        currencyPriceColumns() {
            return [{
                property: 'currency.translated.name',
                label: this.$tc('sw-promotion.detail.main.discounts.pricesModal.labelCurrency')
            }, {
                property: 'price',
                dataIndex: 'price',
                label: this.$tc('sw-promotion.detail.main.discounts.pricesModal.labelPrice')
            }];
        },

        scopes() {
            return [
                { key: DiscountScopes.CART, name: this.$tc('sw-promotion.detail.main.discounts.valueScopeCart') },
                { key: DiscountScopes.DELIVERY, name: this.$tc('sw-promotion.detail.main.discounts.valueScopeDelivery') }
            ];
        },

        types() {
            return [
                { key: DiscountTypes.ABSOLUTE, name: this.$tc('sw-promotion.detail.main.discounts.valueTypeAbsolute') },
                { key: DiscountTypes.PERCENTAGE, name: this.$tc('sw-promotion.detail.main.discounts.valueTypePercentage') },
                { key: DiscountTypes.FIXED, name: this.$tc('sw-promotion.detail.main.discounts.valueTypeFixed') }
            ];
        },

        valueSuffix() {
            return discountHandler.getValueSuffix(this.discount.type, this.currencySymbol);
        },

        maxValueSuffix() {
            return this.currencySymbol;
        },

        showMaxValueSettings() {
            return this.discount.type === DiscountTypes.PERCENTAGE;
        },

        showAbsoluteAdvancedPricesSettings() {
            return (this.discount.type === DiscountTypes.ABSOLUTE || this.discount.type === DiscountTypes.FIXED);
        },

        // only show advanced max value settings if
        // at least a base max value has been set
        showMaxValueAdvancedPrices() {
            return this.discount.type === DiscountTypes.PERCENTAGE && this.discount.maxValue !== null;
        },

        maxValueAdvancedPricesTooltip() {
            if (this.discount.type === DiscountTypes.PERCENTAGE && this.discount.maxValue !== null && this.discount.promotionDiscountPrices.length > 0) {
                return this.$tc('sw-promotion.detail.main.discounts.helpTextMaxValueAdvancedPrices');
            }
            return '';
        },

        isEditingDisabled() {
            return !PromotionPermissions.isEditingAllowed(this.promotion);
        }
    },
    methods: {
        createdComponent() {
            this.currencyRepository.search(new Criteria(), this.context).then((response) => {
                this.currencies = response;
                this.defaultCurrency = this.currencies.find(currency => currency.isDefault);
                this.currencySymbol = this.defaultCurrency.symbol;
            });
        },

        // This function verifies the currently set value
        // depending on the discount type, and fixes it if
        // the min or maximum thresholds have been exceeded.
        onDiscountTypeChanged() {
            this.discount.value = discountHandler.getFixedValue(this.discount.value, this.discount.type);
        },

        onDiscountValueChanged(value) {
            this.discount.value = discountHandler.getFixedValue(value, this.discount.type);
        },

        // The number field does not allow a NULL input
        // so the value cannot be cleared anymore.
        // If the user removes the value, it will be 0 and converted
        // into NULL, which means no max value applies anymore.
        onMaxValueChanged(value) {
            if (value === 0) {
                // clear max value
                this.discount.maxValue = null;
                // clear any currency values if max value is gone
                this.clearAdvancedPrices();
            }
        },

        onClickAdvancedPrices() {
            this.currencies.forEach((currency) => {
                if (!this.isMemberOfCollection(currency)) {
                    // if we have a max-value setting active
                    // then our advanced prices is for this
                    // otherwise its for the promotion value itself
                    if (this.showMaxValueAdvancedPrices) {
                        this.prepareAdvancedPrices(currency, this.discount.maxValue);
                    } else {
                        this.prepareAdvancedPrices(currency, this.discount.value);
                    }
                }
            });
            this.displayAdvancedPrices = true;
        },

        prepareAdvancedPrices(currency, basePrice) {
            // first get the minimum value that is allowed
            let setPrice = discountHandler.getMinValue();
            // if basePrice is undefined take the minimum price
            if (basePrice !== undefined) {
                setPrice = basePrice;
            }
            // foreign currencies are translated at the exchange rate of the default currency
            setPrice *= currency.factor;
            // even if translated correctly the value may not be less than the allowed minimum value
            if (setPrice < discountHandler.getMinValue()) {
                setPrice = discountHandler.getMinValue();
            }
            // now create the value with the calculated and translated value
            const newAdvancedCurrencyPrices = this.advancedPricesRepo.create(this.context);
            newAdvancedCurrencyPrices.discountId = this.discount.id;
            newAdvancedCurrencyPrices.price = setPrice;
            newAdvancedCurrencyPrices.currencyId = currency.id;
            newAdvancedCurrencyPrices.currency = currency;

            this.discount.promotionDiscountPrices.add(newAdvancedCurrencyPrices);
        },

        clearAdvancedPrices() {
            const ids = this.discount.promotionDiscountPrices.getIds();
            let i;
            for (i = 0; i < ids.length; i += 1) {
                this.discount.promotionDiscountPrices.remove(ids[i]);
            }
        },

        isMemberOfCollection(currency) {
            let foundValue = false;
            const currencyID = currency.id;
            this.discount.promotionDiscountPrices.forEach((advancedPrice) => {
                if (advancedPrice.currencyId === currencyID) {
                    foundValue = true;
                    advancedPrice.currency = currency;
                }
            });
            return foundValue;
        },

        onCloseAdvancedPricesModal() {
            if (this.discount.maxValue === null) {
                // clear any currency values if max value is gone
                this.clearAdvancedPrices();
            } else {
                this.discount.promotionDiscountPrices.forEach((advancedPrice) => {
                    advancedPrice.price = discountHandler.getFixedValue(advancedPrice.price, DiscountTypes.ABSOLUTE);
                });
            }
            this.displayAdvancedPrices = false;
        },

        onShowDeleteModal() {
            this.showDeleteModal = true;
        },

        onCloseDeleteModal() {
            this.showDeleteModal = false;
        },

        onConfirmDelete() {
            this.onCloseDeleteModal();
            this.$nextTick(() => {
                this.$emit('discount-delete', this.discount);
            });
        },

        onDiscountScopeChanged(value) {
            if (value === DiscountScopes.DELIVERY) {
                this.discount.considerAdvancedRules = false;
                this.cartScope = false;
            } else {
                this.discount.considerAdvancedRules = this.considerAdvancedRules;
                this.cartScope = true;
            }
        }

    }
});
