import { Component } from 'src/core/shopware';
import template from './sw-condition-cart-amount.html.twig';

/**
 * @public
 * @description TODO: Add description
 * @status prototype
 * @example-type code-only
 * @component-example
 * <sw-condition-cart-amount :condition="condition"></sw-condition-cart-amount>
 */
Component.extend('sw-condition-cart-amount', 'sw-condition-base', {
    template,
    inject: ['ruleConditionDataProviderService'],

    computed: {
        fieldNames() {
            return ['operator', 'amount'];
        },
        defaultValues() {
            return {
                operator: this.ruleConditionDataProviderService.operators.equals.identifier
            };
        }
    }
});
