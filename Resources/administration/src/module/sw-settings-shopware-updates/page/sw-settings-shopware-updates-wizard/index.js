import { Component, Mixin } from 'src/core/shopware';
import template from './sw-settings-shopware-updates-wizard.html.twig';
import './sw-settings-shopware-updates-wizard.scss';

Component.register('sw-settings-shopware-updates-wizard', {
    template,

    inject: ['updateService'],
    mixins: [
        Mixin.getByName('notification')
    ],

    data() {
        return {
            updateInfo: {
                version: null,
                changelog: null
            },
            requirements: [],
            plugins: [],
            isLoading: true,
            checkedBackupCheckbox: false,
            updateRunning: false,
            progressbarValue: 0,
            step: 'download',
            updaterIsRunning: false,
            updateModalShown: false
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.updateService.checkForUpdates().then(response => {
                this.updateInfo = response;

                if (response.version) {
                    this.updateService.checkRequirements().then(requirementsStore => {
                        this.requirements = requirementsStore;

                        this.updateService.pluginCompatibility().then(plugins => {
                            this.plugins = plugins;
                            this.isLoading = false;
                        });
                    });
                } else {
                    this.isLoading = false;
                }
            });
        },
        startUpdateProcess() {
            this.updateModalShown = false;
            this.$emit('update-started');
            this.updaterIsRunning = true;
            this.createNotificationSuccess({
                title: this.$t('sw-settings-shopware-updates.notifications.title'),
                message: this.$t('sw-settings-shopware-updates.notifications.updateStarted')
            });

            this.downloadUpdate(0);
        },

        downloadUpdate(offset) {
            this.updateService.downloadUpdate(offset).then(response => {
                this.progressbarValue = (Math.floor((response.offset / response.total) * 100));

                if (response.offset === response.total && response.success) {
                    this.progressbarValue = 0;
                    this.unpackUpdate(0);
                } else if (response.offset !== response.total && response.success) {
                    this.downloadUpdate(response.offset);
                } else {
                    this.createNotificationError({
                        title: this.$t('sw-settings-shopware-updates.notifications.title'),
                        message: this.$t('sw-settings-shopware-updates.notifications.downloadFailed')
                    });
                }
            }).catch(() => {
                this.createNotificationError({
                    title: this.$t('sw-settings-shopware-updates.notifications.title'),
                    message: this.$t('sw-settings-shopware-updates.notifications.downloadFailed')
                });
            });
        },

        unpackUpdate(offset) {
            this.step = 'unpack';
            this.updateService.unpackUpdate(offset).then(response => {
                this.progressbarValue = (Math.floor((response.offset / response.total) * 100));

                if (response.redirectTo) {
                    window.location.href = response.redirectTo;
                } else if (response.offset !== response.total && response.success) {
                    this.unpackUpdate(response.offset);
                } else {
                    this.createNotificationError({
                        title: this.$t('sw-settings-shopware-updates.notifications.title'),
                        message: this.$t('sw-settings-shopware-updates.notifications.unpackFailed')
                    });
                }
            });
        }
    },
    computed: {
        updatePossible() {
            let requirementsMet = true;
            this.requirements.forEach(item => {
                if (item.result === 0) {
                    requirementsMet = false;
                }
            });

            return requirementsMet;
        },
        updateButtonTooltip() {
            if (this.updatePossible) {
                return {
                    message: '',
                    disabled: true
                };
            }

            return {
                message: this.$t('sw-settings-shopware-updates.infos.requirementsNotMet'),
                position: 'bottom'
            };
        },
        changelog() {
            if (!this.updateInfo.version) {
                return '';
            }

            if (this.$i18n.locale.substr(0, 2) === 'de') {
                return this.updateInfo.changelog.de.changelog;
            }

            return this.updateInfo.changelog.en.changelog;
        },
        pluginUpdateState() {
            if (this.plugins.filter(p => p.statusName === 'updatableNow').length) {
                return 'updatableNow';
            }

            if (this.plugins.filter(p => p.statusName === 'notInStore').length) {
                return 'notInStore';
            }

            return 'allOkay';
        }
    }
});
