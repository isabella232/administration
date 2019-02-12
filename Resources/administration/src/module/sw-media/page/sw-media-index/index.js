import { Component, State, Mixin } from 'src/core/shopware';
import CriteriaFactory from 'src/core/factory/criteria.factory';
import Utils from 'src/core/service/util.service';
import template from './sw-media-index.html.twig';
import './sw-media-index.scss';

Component.register('sw-media-index', {
    template,

    mixins: [
        Mixin.getByName('media-grid-listener'),
        Mixin.getByName('drag-selector')
    ],

    props: {
        routeFolderId: {
            type: String
        }
    },

    data() {
        return {
            isLoading: false,
            subFolders: [],
            mediaItems: [],
            uploadedItems: [],
            sortType: ['createdAt', 'dsc'],
            presentation: 'medium-preview',
            isLoadingMore: false,
            itemsLeft: 0,
            page: 1,
            limit: 50,
            term: '',
            total: 0,
            currentFolder: null,
            parentFolder: null
        };
    },

    computed: {
        mediaItemStore() {
            return State.getStore('media');
        },

        mediaFolderStore() {
            return State.getStore('media_folder');
        },

        uploadStore() {
            return State.getStore('upload');
        },

        mediaFolderConfigurationStore() {
            return State.getStore('media_folder_configuration');
        },

        selectableItems() {
            return [
                ...this.subFolders,
                ...this.uploadedItems,
                ...this.mediaItems
            ];
        },

        mediaFolderId() {
            return this.routeFolderId || null;
        },

        parentFolderName() {
            return this.parentFolder ? this.parentFolder.name : this.$tc('sw-media.index.rootFolderName');
        },

        currentFolderName() {
            return this.currentFolder ? this.currentFolder.name : this.$tc('sw-media.index.rootFolderName');
        },

        dragSelectorClass() {
            return 'sw-media-entity';
        },

        rootFolder() {
            const root = new this.mediaFolderStore.EntityClass(this.mediaFolderStore.entityName, null, null, null);
            root.name = this.$tc('sw-media.index.rootFolderName');

            return root;
        }
    },

    created() {
        this.createdComponent();
    },

    destroyed() {
        this.destroyedComponent();
    },

    watch: {
        uploadedItems() {
            this.debounceDisplayItems();
        },

        routeFolderId() {
            this.page = 1;
            this.createdComponent();
        }
    },

    methods: {
        createdComponent() {
            this.getList();
            this.getFolderEntities();
        },

        destroyedComponent() {
            this.$root.$off('search', this.onSearch);
        },

        debounceDisplayItems() {
            Utils.debounce(() => {
                if (this.$refs.scrollContainer) {
                    this.$refs.scrollContainer.scrollTop = 0;
                }
            }, 100)();
        },

        onUploadsAdded({ uploadTag, data }) {
            data.forEach((upload) => {
                upload.entity.isLoading = true;
                upload.entity.mediaFolderId = this.mediaFolderId;
                this.uploadedItems.unshift(upload.entity);
            });

            this.mediaItemStore.sync().then(() => {
                this.uploadStore.runUploads(uploadTag);
            });
        },

        onUploadFinished(mediaItem) {
            this.uploadedItems = this.uploadedItems.filter((upload) => {
                return mediaItem !== upload;
            });

            if (this.mediaFolderId === mediaItem.mediaFolderId &&
                !this.mediaItems.some((item) => {
                    return item.id === mediaItem.id;
                })
            ) {
                this.mediaItems.unshift(mediaItem);
            }
            mediaItem.isLoading = false;
        },

        onUploadFailed(mediaItem) {
            this.uploadedItems = this.uploadedItems.filter((upload) => {
                return mediaItem !== upload;
            });
        },

        getFolderEntities() {
            this.mediaFolderStore.getByIdAsync(this.mediaFolderId).then((folder) => {
                this.currentFolder = folder;

                this.mediaFolderStore.getByIdAsync(this.currentFolder.parentId).then((parent) => {
                    this.parentFolder = parent;
                }).catch(() => {
                    this.parentFolder = this.rootFolder;
                });
            }).catch(() => {
                this.currentFolder = this.rootFolder;
                this.parentFolder = null;
            });
        },

        getList() {
            this.clearSelection();
            this.isLoading = true;

            Promise.all([
                this.getSubFolders(),
                this.getMediaItemList()
            ]).then(() => {
                this.isLoading = false;
            });
        },

        onChangeLanguage() {
            this.getList();
        },

        getSubFolders() {
            return this.mediaFolderStore.getList({
                limit: 50,
                sortBy: 'name',
                criteria: CriteriaFactory.equals('parentId', this.mediaFolderId),
                associations: {
                    defaultFolders: {
                        page: 1,
                        limit: 5
                    }
                }
            }, true).then((response) => {
                this.subFolders = response.items;
            });
        },

        getMediaItemList() {
            const params = this.getListingParams();
            return this.mediaItemStore.getList(params, true).then((response) => {
                this.total = response.total;
                this.mediaItems = response.items;
                this.isLoading = false;
                this.itemsLeft = this.calcItemsLeft();

                return this.mediaItems;
            });
        },

        onLoadMore() {
            this.page += 1;
            this.extendList();
        },

        onSearch(value) {
            this.term = value;

            this.page = 1;
            this.getList();
        },

        extendList() {
            const params = this.getListingParams();
            this.isLoadingMore = true;

            return this.mediaItemStore.getList(params).then((response) => {
                this.mediaItems = this.mediaItems.concat(response.items);
                this.itemsLeft = this.calcItemsLeft();
                this.isLoadingMore = false;

                return this.mediaItems;
            });
        },

        getListingParams() {
            if (this.$route.query.mediaId) {
                return {
                    criteria: CriteriaFactory.equals('id', this.$route.query.mediaId)
                };
            }

            return {
                limit: this.limit,
                page: this.page,
                sortBy: this.sortType[0],
                sortDirection: this.sortType[1],
                term: this.term,
                criteria: CriteriaFactory.multi('and', this.folderQuery(), ...this.getQueries())
            };
        },

        folderQuery() {
            return CriteriaFactory.equals('mediaFolderId', this.mediaFolderId);
        },

        getQueries() {
            return this.uploadedItems.map((item) => {
                return CriteriaFactory.not('and', CriteriaFactory.equals('id', item.id));
            });
        },

        calcItemsLeft() {
            return this.total - this.mediaItems.length;
        },

        sortMediaItems(event) {
            this.sortType = event.split(':');
            this.page = 1;
            this.getList();
            this.debounceDisplayItems();
        },

        onMediaGridItemsDeleted(ids) {
            this.uploadedItems = this.uploadedItems.filter((uploadedItem) => {
                return ids.includes(uploadedItem.item);
            });
            this.getList();
        },

        onDragSelection({ originalDomEvent, item }) {
            item.selectItem(originalDomEvent);
        },

        onDragDeselection({ originalDomEvent, item }) {
            item.removeFromSelection(originalDomEvent);
        },

        scrollContainer() {
            return this.$refs.scrollContainer;
        },

        itemContainer() {
            return this.$refs.mediaGrid;
        },

        createFolder() {
            const newFolder = this.mediaFolderStore.create();

            newFolder.name = '';
            newFolder.parentId = this.mediaFolderId;
            if (this.mediaFolderId !== null) {
                newFolder.configurationId = this.currentFolder.configuration.id;
                newFolder.useParentConfiguration = true;
            } else {
                const configuration = this.mediaFolderConfigurationStore.create();
                configuration.createThumbnails = true;
                configuration.keepProportions = true;
                configuration.thumbnailQuality = 80;
                newFolder.configuration = configuration;
                newFolder.useParentConfiguration = false;
            }

            this.subFolders.unshift(newFolder);
        },

        onMediaFoldersRemoved(ids) {
            this.subFolders = this.subFolders.filter((folder) => {
                return !ids.includes(folder.id);
            });
        },

        onMediaFoldersDissolved(ids) {
            if (ids.includes(this.routeFolderId)) {
                let routeId = null;
                if (this.parentFolder) {
                    routeId = this.parentFolder.id;
                }

                this.$router.push({
                    name: 'sw.media.index',
                    params: {
                        folderId: routeId
                    }
                });
            }
            this.getList();
        },

        onMediaMoved() {
            this.getList();
        }
    }
});
