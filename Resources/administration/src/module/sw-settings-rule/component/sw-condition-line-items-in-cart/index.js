import { Component, State } from 'src/core/shopware';
import template from './sw-condition-line-items-in-cart.html.twig';

/**
 * @public
 * @description TODO: Add description
 * @status prototype
 * @example-type code-only
 * @component-example
 * <sw-condition-line-items-in-cart :condition="condition"></sw-condition-line-items-in-cart>
 */
Component.extend('sw-condition-line-items-in-cart', 'sw-condition-base', {
    template,

    computed: {
        operators() {
            return this.conditionStore.operatorSets.multiStore;
        },
        fieldNames() {
            return ['operator', 'identifiers'];
        },
        defaultValues() {
            return {
                operator: this.conditionStore.operators.isOneOf.identifier
            };
        }
    },

    methods: {
        getProductStore() {
            return State.getStore('product');
        }
    }
});
