import { Component, State, Mixin } from 'src/core/shopware';
import { mapApiErrors } from 'src/app/service/map-errors.service';
import utils from 'src/core/service/util.service';
import ShopwareError from 'src/core/data/ShopwareError';
import Criteria from 'src/core/data-new/criteria.data';
import template from './sw-settings-salutation-detail.html.twig';


Component.register('sw-settings-salutation-detail', {
    template,

    inject: ['repositoryFactory', 'context'],

    mixins: [
        Mixin.getByName('notification'),
        Mixin.getByName('placeholder'),
        Mixin.getByName('discard-detail-page-changes')('salutation')
    ],

    props: {
        salutationId: {
            type: String,
            required: false,
            default: null
        }
    },

    shortcuts: {
        'SYSTEMKEY+S': 'onSave',
        ESCAPE: 'onCancel'
    },

    data() {
        return {
            entityName: 'salutation',
            isLoading: false,
            salutation: null,
            invalidKey: false,
            isKeyChecking: false,
            isSaveSuccessful: false
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle(this.identifier)
        };
    },

    computed: {
        identifier() {
            return this.placeholder(this.salutation, 'displayName');
        },

        salutationRepository() {
            return this.repositoryFactory.create('salutation');
        },

        languageStore() {
            return State.getStore('language');
        },

        entityDescription() {
            return this.placeholder(
                this.salutation,
                'salutationKey',
                this.$tc('sw-settings-salutation.detail.placeholderNewSalutation')
            );
        },

        invalidKeyError() {
            if (this.invalidKey && !this.isKeyChecking) {
                return new ShopwareError({ code: 'DUPLICATED_SALUTATION_KEY' });
            }
            return null;
        },

        tooltipSave() {
            const systemKey = this.$device.getSystemKey();

            return {
                message: `${systemKey} + S`,
                appearance: 'light'
            };
        },

        tooltipCancel() {
            return {
                message: 'ESC',
                appearance: 'light'
            };
        },

        ...mapApiErrors('salutation', ['displayName', 'letterName'])
    },

    watch: {
        salutationId() {
            if (!this.salutationId) {
                this.createdComponent();
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.isLoading = true;
            if (this.salutationId) {
                this.salutationRepository.get(this.salutationId, this.context).then((salutation) => {
                    this.salutation = salutation;
                    this.isLoading = false;
                });
                return;
            }

            this.languageStore.setCurrentId(this.languageStore.systemLanguageId);
            this.salutation = this.salutationRepository.create(this.context);
            this.isLoading = false;
        },

        onChangeLanguage() {
            this.createdComponent();
        },

        saveFinish() {
            this.isSaveSuccessful = false;
        },

        onSave() {
            this.isLoading = true;
            this.isSaveSuccessful = false;

            return this.salutationRepository.save(this.salutation, this.context).then(() => {
                this.isSaveSuccessful = true;
                if (!this.salutationId) {
                    this.$router.push({ name: 'sw.settings.salutation.detail', params: { id: this.salutation.id } });
                }

                this.salutationRepository.get(this.salutation.id, this.context).then((updatedSalutation) => {
                    this.salutation = updatedSalutation;
                    this.isLoading = false;
                });
            }).catch(() => {
                this.createNotificationError({
                    title: this.$tc('sw-settings-salutation.detail.notificationErrorTitle'),
                    message: this.$tc('sw-settings-salutation.detail.notificationErrorMessage')
                });
            });
        },

        onCancel() {
            this.$router.push({ name: 'sw.settings.salutation.index' });
        },

        onChange() {
            this.isKeyChecking = true;
            this.onChangeDebounce();
        },

        onChangeDebounce: utils.debounce(function executeChange() {
            if (!this.salutation) {
                return;
            }

            if (typeof this.salutation.salutationKey !== 'string' ||
                this.salutation.salutationKey.trim() === ''
            ) {
                this.invalidKey = false;
                this.isKeyChecking = false;
                return;
            }

            const criteria = new Criteria(1, 1);
            criteria.addFilter(
                Criteria.multi(
                    'AND',
                    [
                        Criteria.equals('salutationKey', this.salutation.salutationKey),
                        Criteria.not('AND', [Criteria.equals('id', this.salutation.id)])
                    ]
                )
            );

            this.salutationRepository.search(criteria, this.context).then(({ total }) => {
                this.invalidKey = total > 0;
                this.isKeyChecking = false;
            }).catch(() => {
                this.invalidKey = true;
                this.isKeyChecking = false;
            });
        }, 500)
    }
});
