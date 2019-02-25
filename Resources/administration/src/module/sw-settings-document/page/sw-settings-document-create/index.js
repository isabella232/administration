import { Component } from 'src/core/shopware';
import utils from 'src/core/service/util.service';

Component.extend('sw-settings-document-create', 'sw-settings-document-detail', {

    beforeRouteEnter(to, from, next) {
        if (to.name.includes('sw.settings.document.create') && !to.params.id) {
            to.params.id = utils.createId();
        }

        next();
    },

    methods: {
        createdComponent() {
            if (this.$route.params.id) {
                this.documentConfig = this.documentBaseConfigStore.create(this.$route.params.id);
            } else {
                this.documentConfig = this.documentBaseConfigStore.create();
            }

            this.$super.createdComponent();
            this.documentConfig.isLoading = false;
        },

        onSave() {
            this.$super.onSave().then(() => {
                this.$router.push({ name: 'sw.settings.document.detail', params: { id: this.documentConfig.id } });
            });
        }
    }
});
