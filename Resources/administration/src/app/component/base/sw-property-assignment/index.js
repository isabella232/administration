import Criteria from 'src/core/data-new/criteria.data';
import template from './sw-property-assignment.html.twig';
import './sw-property-assignment.scss';

export default {
    name: 'sw-property-assignment',
    template,

    inject: ['repositoryFactory', 'context'],

    props: {
        propertyCollection: {
            validator: (prop) => {
                // requires an EntityCollection Object
                return typeof prop === 'undefined' || typeof prop === 'object';
            },
            required: true
        }
    },

    data() {
        return {
            groups: [],
            displayTree: false,
            displaySearch: false,
            isLoading: false
        };
    },

    computed: {
        groupWithOptions() {
            if (!this.groups.items) {
                return [];
            }

            return Object.values(this.groups.items).reduce((acc, group) => {
                // set options to group
                group.options = Object.values(this.properties).filter((property) => property.groupId === group.id);

                acc.push(group);
                return acc;
            }, []);
        },

        properties() {
            if (this.propertyCollection) {
                return this.propertyCollection.items;
            }
            return {};
        },

        propertyRepository() {
            return this.repositoryFactory.create(
                this.propertyCollection.entity,
                this.propertyCollection.source
            );
        },

        groupRepository() {
            return this.repositoryFactory.create('property_group');
        }
    },

    watch: {
        propertyCollection: {
            handler() {
                if (this.propertyCollection) {
                    this.groupProperties();
                    this.isLoading = false;
                    this.$emit('options-load');
                }
            },
            immediate: true
        }
    },

    methods: {
        onSelectOption(selection) {
            const item = selection.item;

            // Check if it should be added or removed
            if (selection.selected === true) {
                // Add property
                this.propertyCollection.add(item);

                // update search field
                this.$refs.searchField.addOptionCount();
                this.$refs.searchField.refreshSelection();
            } else {
                // remove property
                this.propertyCollection.remove(item.id);
            }

            // update view
            this.groupProperties();
        },

        deleteOption(option) {
            this.propertyCollection.remove(option.id);
            this.groupProperties();
        },

        groupProperties() {
            // Get Ids
            const groupIds = Object.values(this.properties).reduce((acc, property) => {
                if (acc.indexOf(property.groupId) < 0) {
                    acc.push(property.groupId);
                }
                return acc;
            }, []);

            if (groupIds.length <= 0) {
                this.groups = [];
                return false;
            }

            const groupSearchCriteria = new Criteria(1, 500);
            groupSearchCriteria.addFilter(
                Criteria.equalsAny('id', groupIds)
            );

            // Fetch groups with options
            this.groupRepository.search(groupSearchCriteria, this.context).then((res) => {
                this.groups = res;
            });

            return true;
        }
    }
};
