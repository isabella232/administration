import { Component } from 'src/core/shopware';
import LocalStore from 'src/core/data/LocalStore';
import template from './sw-condition-different-addresses.html.twig';

/**
 * @public
 * @description TODO: Add description
 * @status prototype
 * @example-type code-only
 * @component-example
 * <sw-condition-different-addresses :condition="condition"></sw-condition-different-address>
 */
Component.extend('sw-condition-different-addresses', 'sw-condition-base', {
    template,

    computed: {
        selectValues() {
            const values = [
                {
                    label: this.$tc('global.sw-condition.condition.yes'),
                    value: 'true'
                },
                {
                    label: this.$tc('global.sw-condition.condition.no'),
                    value: 'false'
                }
            ];

            return new LocalStore(values, 'value');
        },
        fieldNames() {
            return ['isDifferent'];
        },
        defaultValues() {
            return {
                isDifferent: true
            };
        }
    },

    watch: {
        isDifferent: {
            handler(newValue) {
                this.condition.value.isDifferent = newValue === String(true);
            }
        }
    },

    data() {
        return {
            isDifferent: this.condition.value.isDifferent ? String(this.condition.value.isDifferent) : String(true)
        };
    }
});
