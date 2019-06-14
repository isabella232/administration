import { Component, Mixin } from 'src/core/shopware';
import Criteria from 'src/core/data-new/criteria.data';
import template from './sw-product-stream-list.html.twig';
import './sw-product-stream-list.scss';

Component.register('sw-product-stream-list', {
    template,

    inject: [
        'repositoryFactory',
        'context'
    ],

    mixins: [
        Mixin.getByName('listing'),
        Mixin.getByName('notification')
    ],

    data() {
        return {
            productStreams: null,
            sortBy: 'createdAt',
            sortDirection: 'DESC',
            isLoading: false,
            showDeleteModal: false
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        productStreamRepository() {
            return this.repositoryFactory.create('product_stream');
        }
    },

    methods: {
        onInlineEditSave(promise, productStream) {
            promise.then(() => {
                this.createNotificationSuccess({
                    title: this.$tc('sw-product-stream.detail.titleSaveSuccess'),
                    message: this.$tc('sw-product-stream.detail.messageSaveSuccess', 0, { name: productStream.name })
                });
            }).catch(() => {
                this.getList();
                this.createNotificationError({
                    title: this.$tc('sw-product-stream.detail.titleSaveError'),
                    message: this.$tc('sw-product-stream.detail.messageSaveError')
                });
            });
        },

        onInlineEditCancel(productStream) {
            productStream.discardChanges();
        },

        onChangeLanguage() {
            this.getList();
        },

        getList() {
            this.isLoading = true;
            const criteria = new Criteria(this.page, this.limit);
            criteria.setTerm(this.term);
            const naturalSort = this.sortBy === 'createdAt';
            criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection, naturalSort));

            this.productStreamRepository.search(criteria, this.context).then((items) => {
                this.total = items.total;
                this.productStreams = items;
                this.isLoading = false;

                return items;
            }).catch(() => {
                this.isLoading = false;
            });
        },

        onDelete(id) {
            this.showDeleteModal = id;
        },

        onCloseDeleteModal() {
            this.showDeleteModal = false;
        },

        onConfirmDelete(id) {
            this.showDeleteModal = false;

            return this.productStreamRepository.delete(id, this.context).then(() => {
                this.getList();
            });
        },

        onDuplicate(id) {
            const productStream = this.productStreamStore.getById(id);
            productStream.getAssociation('filters').getList().then(() => {
                const duplicatedEntity = this.productStreamStore.duplicate(id, true);
                this.$router.push(
                    {
                        name: 'sw.product.stream.detail',
                        params: { id: duplicatedEntity.id }
                    }
                );
            });
        },

        getProductStreamColumns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                inlineEdit: 'string',
                label: this.$tc('sw-product-stream.list.columnName'),
                routerLink: 'sw.product.stream.detail',
                width: '250px',
                allowResize: true,
                primary: true
            }, {
                property: 'description',
                label: this.$tc('sw-product-stream.list.columnDescription'),
                width: '250px',
                allowResize: true
            }, {
                property: 'updatedAt',
                label: this.$tc('sw-product-stream.list.columnDateUpdated'),
                align: 'right',
                allowResize: true
            }, {
                property: 'invalid',
                label: this.$tc('sw-product-stream.list.columnStatus'),
                allowResize: true
            }];
        }
    }
});
