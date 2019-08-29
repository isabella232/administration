import { mapApiErrors } from 'src/app/service/map-errors.service';
import template from './sw-sales-channel-detail-base.html.twig';
import './sw-sales-channel-detail-base.scss';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('sw-sales-channel-detail-base', {
    template,

    mixins: [
        Mixin.getByName('notification'),
        Mixin.getByName('placeholder')
    ],

    inject: [
        'salesChannelService',
        'repositoryFactory',
        'context'
    ],

    props: {
        salesChannel: {
            required: true
        },

        customFieldSets: {
            type: Array,
            required: true
        },

        isLoading: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            showDeleteModal: false,
            defaultSnippetSetId: '71a916e745114d72abafbfdc51cbd9d0',
            isLoadingDomains: false,
            deleteDomain: null
        };
    },

    computed: {
        secretAccessKeyFieldType() {
            return this.showSecretAccessKey ? 'text' : 'password';
        },

        isStoreFront() {
            return this.salesChannel.typeId === '8a243080f92e4c719546314b577cf82b';
        },

        domainRepository() {
            return this.repositoryFactory.create(
                this.salesChannel.domains.entity,
                this.salesChannel.domains.source
            );
        },

        salesChannelRepository() {
            return this.repositoryFactory.create('sales_channel');
        },

        mainNavigationCriteria() {
            const criteria = new Criteria(1, 10);

            return criteria.addFilter(Criteria.equals('type', 'page'));
        },

        ...mapApiErrors('salesChannel',
            [
                'paymentMethodId',
                'shippingMethodId',
                'countryId',
                'currencyId',
                'languageId'
            ])
    },

    methods: {
        onGenerateKeys() {
            this.salesChannelService.generateKey().then((response) => {
                this.salesChannel.accessKey = response.accessKey;
            }).catch(() => {
                this.createNotificationError({
                    title: this.$tc('sw-sales-channel.detail.titleAPIError'),
                    message: this.$tc('sw-sales-channel.detail.messageAPIError')
                });
            });
        },

        onDefaultItemAdd(itemId, ref, property) {
            const defaultSelection = this.$refs[ref].singleSelection;
            if (!this.salesChannel[property].has(defaultSelection.id)) {
                this.salesChannel[property].push(defaultSelection);
            }
        },

        onRemoveItem(item, ref, property) {
            const defaultSelection = this.$refs[ref].singleSelection;
            if (defaultSelection !== null && item.id === defaultSelection.id) {
                this.salesChannel[property] = null;
            }
        },

        onCloseDeleteModal() {
            this.showDeleteModal = false;
        },

        onConfirmDelete() {
            this.showDeleteModal = false;

            this.$nextTick(() => {
                this.deleteSalesChannel(this.salesChannel.id);
                this.$router.push({ name: 'sw.dashboard.index' });
            });
        },

        deleteSalesChannel(salesChannelId) {
            this.salesChannelRepository.delete(salesChannelId, this.context).then(() => {
                this.$root.$emit('sales-channel-change');
            });
        },

        onClickAddDomain() {
            const newDomain = this.domainRepository.create(this.context);
            newDomain.snippetSetId = this.defaultSnippetSetId;

            this.salesChannel.domains.add(newDomain);
        },

        onClickDeleteDomain(domain) {
            if (domain.isNew()) {
                this.onConfirmDeleteDomain(domain);
            } else {
                this.deleteDomain = domain;
            }
        },

        onConfirmDeleteDomain(domain) {
            this.deleteDomain = null;

            this.$nextTick(() => {
                this.salesChannel.domains.remove(domain.id);

                if (domain.isNew()) {
                    return;
                }

                this.domainRepository.delete(domain.id, this.context);
            });
        },

        onCloseDeleteDomainModal() {
            this.deleteDomain = null;
        }
    }
});
