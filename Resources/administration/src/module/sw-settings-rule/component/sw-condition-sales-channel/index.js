import { Component, State } from 'src/core/shopware';
import template from './sw-condition-sales-channel.html.twig';

/**
 * @public
 * @description TODO: Add description
 * @status prototype
 * @example-type code-only
 * @component-example
 * <sw-condition-sales-channel :condition="condition"></sw-condition-sales-channel>
 */
Component.extend('sw-condition-sales-channel', 'sw-condition-base', {
    template,

    computed: {
        operators() {
            return this.conditionStore.operatorSets.multiStore;
        },
        fieldNames() {
            return ['operator', 'salesChannelIds'];
        },
        defaultValues() {
            return {
                operator: this.conditionStore.operators.isOneOf.identifier
            };
        }
    },

    methods: {
        getSalesChannelStore() {
            return State.getStore('sales_channel');
        }
    }
});
