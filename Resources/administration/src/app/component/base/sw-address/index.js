import template from './sw-address.html.twig';
import './sw-address.scss';

/**
 * @public
 * @description Component to render a postal address
 * @status ready
 * @example-type static
 * @component-example
 * <sw-address headline="Billing address" :address="{
 *     salutation: 'Mister',
 *     title: 'Doctor',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     street: 'Main St 123',
 *     zipcode: '12456',
 *     city: 'Anytown',
 *     country: { name: 'Germany' }
 * }"></sw-address>
 */
export default {
    name: 'sw-address',
    template,

    props: {
        address: {
            type: Object,
            default() {
                return {
                    salutation: '',
                    title: '',
                    firstName: '',
                    lastName: '',
                    street: '',
                    zipcode: '',
                    city: '',
                    country: {
                        name: ''
                    }
                };
            }
        },

        headline: {
            type: String,
            required: false,
            default: ''
        },

        showEditButton: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        fullName() {
            const salutation = this.address.salutation.name ? `${this.address.salutation.name} ` : '';
            const title = this.address.title ? `${this.address.title} ` : '';
            const firstName = this.address.firstName ? `${this.address.firstName} ` : '';
            const lastName = this.address.lastName ? this.address.lastName : '';

            return salutation + title + firstName + lastName;
        },

        addressClasses() {
            return {
                'sw-address--headline': this.headline
            };
        }
    }
};
