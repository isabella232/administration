import { shallowMount } from '@vue/test-utils';
import 'src/app/component/media/sw-media-folder-item';
import cmsModule from 'src/module/sw-cms/index';
import mailTemplateModule from 'src/module/sw-mail-template/index';
import productModule from 'src/module/sw-product/index';
import importExportModule from 'src/module/sw-import-export/index';

Shopware.State.registerModule('cms', cmsModule);
Shopware.State.registerModule('settings', mailTemplateModule);
Shopware.State.registerModule('product', productModule);
Shopware.State.registerModule('importExport', importExportModule);

const ID_MAILTEMPLATE_FOLDER = '4006d6aa64ce409692ac2b952fa56ade';
const ID_PRODUCTS_FOLDER = '0e6b005ca7a1440b8e87ac3d45ed5c9f';
const ID_CONTENT_FOLDER = '08bc82b315c54cb097e5c3fb30f6ff16';

function createWrapper(defaultFolderId) {
    return shallowMount(Shopware.Component.build('sw-media-folder-item'), {
        propsData: {
            item: {
                useParentConfiguration: false,
                configurationId: 'a73ef286f6c748…deacdbdfd5aab3cca7',
                defaultFolderId: defaultFolderId,
                parentId: null,
                childCount: 0,
                name: 'Cms Page Media',
                customFields: null,
                createdAt: '2020-06-03T09:44:51+00:00',
                updatedAt: null,
                id: 'af46d5250e34403485e045ba7049dec7',
                children: [],
                media: []
            },
            showSelectionIndicator: false,
            showContextMenuButton: true,
            selected: false,
            isList: true
        },
        provide: {
            repositoryFactory: {
                create: () => ({
                    search: () => Promise.resolve(),
                    get: (folderId) => {
                        switch (folderId) {
                            case ID_PRODUCTS_FOLDER:
                                return {
                                    entity: 'product'
                                };
                            case ID_CONTENT_FOLDER:
                                return {
                                    entity: 'cms_page'
                                };
                            case ID_MAILTEMPLATE_FOLDER:
                                return {
                                    entity: 'mail_template'
                                };
                            default:
                                return 'test';
                        }
                    }
                })
            }
        },
        stubs: {
            'sw-media-base-item': '<div></div>'
        }
    });
}

describe('components/media/sw-media-folder-item', () => {
    let wrapper;

    afterEach(() => {
        wrapper.destroy();
    });

    it('should be a Vue.js component', () => {
        wrapper = createWrapper(ID_PRODUCTS_FOLDER);

        expect(wrapper.isVueInstance()).toBe(true);
    });

    it('should provide correct folder color for product module', async () => {
        wrapper = createWrapper(ID_PRODUCTS_FOLDER);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.iconName).toBe('multicolor-folder-thumbnail--green');
    });

    it('should provide correct folder color for mail template module', async () => {
        wrapper = createWrapper(ID_MAILTEMPLATE_FOLDER);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.iconName).toBe('multicolor-folder-thumbnail--grey');
    });

    it('should provide correct folder color for cms module', async () => {
        wrapper = createWrapper(ID_CONTENT_FOLDER);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.iconName).toBe('multicolor-folder-thumbnail--pink');
    });

    it('should provide fallback folder color', async () => {
        wrapper = createWrapper();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.iconName).toBe('multicolor-folder-thumbnail');
    });
});
