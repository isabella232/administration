import { Component } from 'src/core/shopware';
import template from './sw-condition-not-found.html.twig';
import './sw-condition-not-found.scss';

/**
 * @public
 * @description TODO: Add description
 * @status prototype
 * @example-type code-only
 * @component-example
 * <sw-condition-not-found :condition="condition"></sw-condition-not-found>
 */
Component.extend('sw-condition-not-found', 'sw-condition-base', {
    template,

    computed: {
        errorMessage() {
            const fields = JSON.stringify(this.condition.value);
            return this.$tc('global.sw-condition.condition.not-found.error-message',
                Object.keys(this.condition.value).length,
                { type: this.condition.type, fields });
        },
        conditionClass() {
            return 'sw-condition-not-found';
        }
    },
    methods: {
        mountComponent() {
            // nothing to do
        }
    }
});
