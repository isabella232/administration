import { Component, State, Mixin } from 'src/core/shopware';
import template from './sw-order-list.html.twig';
import './sw-order-list.scss';

Component.register('sw-order-list', {
    template,

    mixins: [
        Mixin.getByName('listing')
    ],

    data() {
        return {
            orders: [],
            isLoading: false
        };
    },

    computed: {
        orderStore() {
            return State.getStore('order');
        }
    },

    methods: {
        onEdit(order) {
            if (order && order.id) {
                this.$router.push({
                    name: 'sw.order.detail',
                    params: {
                        id: order.id
                    }
                });
            }
        },

        onInlineEditSave(order) {
            this.isLoading = true;

            order.save().then(() => {
                this.isLoading = false;
            }).catch(() => {
                this.isLoading = false;
            });
        },

        onChangeLanguage() {
            this.getList();
        },

        getList() {
            this.isLoading = true;
            const params = this.getListingParams();

            this.orders = [];

            // Use the order date as the default sorting
            if (!params.sortBy && !params.sortDirection) {
                params.sortBy = 'date';
                params.sortDirection = 'DESC';
            }

            return this.orderStore.getList(params, true).then((response) => {
                this.total = response.total;
                this.orders = response.items;

                this.isLoading = false;

                return this.orders;
            });
        },
        getBillingAddress(order) {
            return order.addresses.find((address) => {
                return address.id === order.billingAddressId;
            });
        }
    }
});
