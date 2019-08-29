import template from './sw-multi-select.html.twig';

const { Component } = Shopware;
const { debounce } = Shopware.Utils;

/**
 * @public
 * @status ready
 * @description Renders a multi select field with a defined list of options. This component uses the sw-field base
 * components. This adds the base properties such as <code>helpText</code>, <code>error</code>, <code>disabled</code> etc.
 * @example-type code-only
 * @component-example
 * <sw-multi-select
 *     label="Multi Select"
 *     :options="[
 *         { value 'uuid1', label 'Portia Jobson' },
 *         { value 'uuid2', label 'Baxy Eardley' },
 *         { value 'uuid3', label 'Arturo Staker' },
 *         { value 'uuid4', label 'Dalston Top' },
 *         { value 'uuid5', label 'Neddy Jensen' }
 *     ]"
 *     value="">
 * </sw-multi-select>
 */
Component.register('sw-multi-select', {
    template,
    inheritAttrs: false,

    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        options: {
            type: Array,
            required: true
        },
        value: {
            type: Array,
            required: true
        },
        labelProperty: {
            type: String,
            required: false,
            default: 'label'
        },
        valueProperty: {
            type: String,
            required: false,
            default: 'value'
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        valueLimit: {
            type: Number,
            required: false,
            default: 5
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: false
        },
        highlightSearchTerm: {
            type: Boolean,
            required: false,
            default: true
        },
        // Used to implement a custom search function. Parameters passed: { options, labelProperty, valueProperty }
        searchFunction: {
            type: Function,
            required: false,
            default({ options, labelProperty }) {
                return options.filter(option => {
                    const label = option[labelProperty];
                    if (!label) {
                        return false;
                    }
                    return label.toLowerCase().includes(this.searchTerm.toLowerCase());
                });
            }
        }
    },

    data() {
        return {
            searchTerm: '',
            limit: this.valueLimit
        };
    },

    computed: {
        visibleValues() {
            if (!this.currentValue || this.currentValue.length <= 0) {
                return [];
            }

            return this.options.filter((item) => {
                return this.currentValue.includes(item[this.valueProperty]);
            }).slice(0, this.limit);
        },

        totalValuesCount() {
            if (this.currentValue.length) {
                return this.currentValue.length;
            }

            return 0;
        },

        invisibleValueCount() {
            if (!this.currentValue) {
                return 0;
            }

            return Math.max(0, this.totalValuesCount - this.limit);
        },

        currentValue: {
            get() {
                return [...this.value];
            },
            set(newValue) {
                /** @dprecated Html select don't have an onInput event */
                this.$emit('input', newValue);
                this.$emit('change', newValue);
            }
        },

        visibleResults() {
            if (this.searchTerm) {
                return this.searchFunction(
                    { options: this.options, labelProperty: this.labelProperty, valueProperty: this.valueProperty }
                );
            }

            return this.options;
        }
    },

    methods: {
        isSelected(item) {
            return this.currentValue.includes(item[this.valueProperty]);
        },

        addItem(item) {
            const identifier = item[this.valueProperty];

            if (this.isSelected(item)) {
                this.remove(item);
                return;
            }

            this.$emit('item-add', item);

            this.currentValue = [...this.currentValue, identifier];

            this.$refs.selectionList.focus();
            this.$refs.selectionList.select();
        },

        remove(item) {
            this.$emit('item-remove', item);

            this.currentValue = this.currentValue.filter((value) => {
                return value !== item[this.valueProperty];
            });
        },

        removeLastItem() {
            if (!this.visibleValues.length) {
                return;
            }

            if (this.invisibleValueCount > 0) {
                this.expandValueLimit();
                return;
            }

            const lastSelection = this.visibleValues[this.visibleValues.length - 1];
            this.remove(lastSelection);
        },

        expandValueLimit() {
            this.$emit('display-values-expand');

            this.limit += this.limit;
        },

        onSearchTermChange: debounce(function updateSearchTerm(term) {
            this.searchTerm = term;
            this.$emit('search-term-change', this.searchTerm);
            this.resetActiveItem();
        }, 400),

        resetActiveItem() {
            this.$refs.swSelectResultList.setActiveItemIndex(0);
        },

        onSelectExpanded() {
            this.$refs.selectionList.focus();
        },

        onSelectCollapsed() {
            this.searchTerm = '';
            this.$refs.selectionList.blur();
        }
    }
});
