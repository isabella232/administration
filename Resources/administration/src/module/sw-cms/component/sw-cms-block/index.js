import template from './sw-cms-block.html.twig';
import './sw-cms-block.scss';

const { Component } = Shopware;

Component.register('sw-cms-block', {
    template,

    inject: ['cmsService'],

    props: {
        block: {
            type: Object,
            required: true,
            default() {
                return {};
            }
        },

        active: {
            type: Boolean,
            required: false,
            default: false
        },

        buttonsEnabled: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    data() {
        return {
            backgroundUrl: null
        };
    },

    computed: {
        cmsBlocks() {
            return this.cmsService.getCmsBlockRegistry();
        },

        blockConfig() {
            return this.cmsBlocks[this.block.type];
        },

        customBlockClass() {
            return this.block.cssClass;
        },

        blockStyles() {
            const context = Shopware.Context.get();
            let backgroundMedia = null;

            if (this.block.backgroundMedia) {
                if (this.block.backgroundMedia.id) {
                    backgroundMedia = `url("${this.block.backgroundMedia.url}")`;
                } else {
                    backgroundMedia = `url('${context.assetsPath}${this.block.backgroundMedia.url}')`;
                }
            }

            return {
                'background-color': this.block.backgroundColor || 'transparent',
                'background-image': backgroundMedia,
                'background-size': this.block.backgroundMediaMode
            };
        },

        blockPadding() {
            return {
                'padding-top': this.block.marginTop || '0px',
                'padding-bottom': this.block.marginBottom || '0px',
                'padding-left': this.block.marginLeft || '0px',
                'padding-right': this.block.marginRight || '0px'
            };
        },

        overlayClasses() {
            return {
                'is--active': this.active
            };
        },

        toolbarClasses() {
            return {
                'is--active': this.active
            };
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            if (!this.block.backgroundMediaMode) {
                this.block.backgroundMediaMode = 'cover';
            }
        },

        onBlockOverlayClick() {
            this.$emit('block-overlay-click');
        },

        onBlockDelete() {
            this.$emit('block-delete');
        },

        onBlockDuplicate() {
            this.$emit('block-duplicate');
        }
    }
});
