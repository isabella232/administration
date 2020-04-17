import { createLocalVue, shallowMount } from '@vue/test-utils';
import 'src/module/sw-import-export/component/sw-import-export-importer';
import 'src/app/component/form/select/entity/sw-entity-single-select';
import 'src/app/component/form/select/base/sw-select-base';
import 'src/app/component/form/field-base/sw-block-field';
import 'src/app/component/form/field-base/sw-base-field';
import 'src/app/component/form/select/base/sw-select-result-list';
import 'src/app/component/form/select/base/sw-select-result';
import 'src/app/component/base/sw-highlight-text';

const repositoryMockFactory = () => {
    return {
        get: () => Promise.resolve({}),
        search: (criteria) => {
            const profiles = [
                {
                    name: 'Default product',
                    sourceEntity: 'product',
                    config: []
                },
                {
                    name: 'Default configurator settings',
                    sourceEntity: 'product_configurator_setting',
                    config: []
                },
                {
                    name: 'Default category',
                    sourceEntity: 'category',
                    config: []
                },
                {
                    name: 'Default media',
                    sourceEntity: 'media',
                    config: []
                }
            ];

            return Promise.resolve(profiles.filter((profile) => {
                let isAllowed = true;

                criteria.filters.forEach(filter => {
                    if (filter.type === 'equals' && profile[filter.field] !== filter.value) {
                        isAllowed = false;
                    }
                });

                return isAllowed;
            }));
        }
    };
};

describe('components/sw-import-export-importer', () => {
    let wrapper;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();

        wrapper = shallowMount(Shopware.Component.build('sw-import-export-importer'), {
            localVue,
            stubs: {
                'sw-entity-single-select': Shopware.Component.build('sw-entity-single-select'),
                'sw-select-base': Shopware.Component.build('sw-select-base'),
                'sw-block-field': Shopware.Component.build('sw-block-field'),
                'sw-base-field': Shopware.Component.build('sw-base-field'),
                'sw-loader': true,
                'sw-icon': true,
                'sw-field': true,
                'sw-field-error': true,
                'sw-import-export-progress': true,
                'sw-select-result-list': Shopware.Component.build('sw-select-result-list'),
                'sw-select-result': Shopware.Component.build('sw-select-result'),
                'sw-highlight-text': Shopware.Component.build('sw-highlight-text'),
                'sw-popover': true,
                'sw-alert': true,
                'sw-modal': true,
                'sw-button': true,
                'sw-file-input': true
            },
            mocks: {
                $tc: snippetPath => snippetPath
            },
            provide: {
                importExport: {
                    import: (profileId, importFile, cb, config) => {
                        if (!config.error) {
                            return Promise.resolve();
                        }

                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject({
                            response: {
                                data: {
                                    errors: [
                                        {
                                            code: 'This is an error code',
                                            detail: 'This is an detailed error message'
                                        }
                                    ]
                                }
                            }
                        });
                    }
                },
                repositoryFactory: {
                    create: () => repositoryMockFactory()
                }
            }
        });
    });

    afterEach(() => {
        localVue = null;
        wrapper.destroy();
    });

    it('should be a Vue.js component', () => {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('should not show the warning when nothing is selected', () => {
        expect(wrapper.find('.sw-import-export-importer__variants-warning').exists()).toBeFalsy();
    });

    it('should not show the warning when a product profile without variants is selected', async () => {
        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        const defaultProduct = wrapper.find('.sw-select-option--0');
        expect(defaultProduct.text()).toBe('Default product');

        defaultProduct.trigger('click');

        expect(wrapper.find('.sw-entity-single-select__selection-text').text()).toBe('Default product');
        expect(wrapper.find('.sw-import-export-importer__variants-warning').exists()).toBeFalsy();
    });

    it('should not show the warning when a product profile should not import variants', async () => {
        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        const defaultProduct = wrapper.find('.sw-select-option--0');
        expect(defaultProduct.text()).toBe('Default product');

        defaultProduct.trigger('click');

        expect(wrapper.find('.sw-entity-single-select__selection-text').text()).toBe('Default product');

        const variantsWarning = wrapper.find('.sw-import-export-importer__variants-warning');

        expect(variantsWarning.exists()).toBeFalsy();
    });

    it('should show the warning when a product profile should also import variants', async () => {
        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        const defaultProduct = wrapper.find('.sw-select-option--0');
        expect(defaultProduct.text()).toBe('Default product');

        defaultProduct.trigger('click');

        expect(wrapper.find('.sw-entity-single-select__selection-text').text()).toBe('Default product');

        wrapper.setData({
            config: {
                includeVariants: true
            }
        });

        const variantsWarning = wrapper.find('.sw-import-export-importer__variants-warning');

        expect(variantsWarning.exists()).toBeTruthy();
        expect(variantsWarning.text()).toContain('sw-import-export.importer.variantsWarning');
    });

    it('should show a warning which contains an open modal link', async () => {
        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('.sw-select-option--0').trigger('click');

        wrapper.setData({
            config: {
                includeVariants: true
            }
        });

        const variantsWarningLinks = wrapper.findAll('.sw-import-export-importer__variants-warning .sw-import-export-importer__link');
        expect(variantsWarningLinks.at(0).exists()).toBeTruthy();
        expect(variantsWarningLinks.at(0).text()).toContain('sw-import-export.importer.directImportVariantsLabel');

        expect(variantsWarningLinks.at(1).exists()).toBeTruthy();
        expect(variantsWarningLinks.at(1).text()).toContain('sw-import-export.importer.directImportPropertiesLabel');
    });

    it('should show a modal with an importer', async () => {
        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('.sw-select-option--0').trigger('click');

        wrapper.setData({
            config: {
                includeVariants: true
            }
        });

        const variantsWarningLink = wrapper.find('.sw-import-export-importer__variants-warning .sw-import-export-importer__link');
        variantsWarningLink.trigger('click');

        const modalExporter = wrapper.findAll({ name: 'sw-import-export-importer' }).at(1);

        expect(modalExporter.exists()).toBeTruthy();
    });

    it('should show a modal which only contains configurator settings profiles', async () => {
        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        wrapper.find('.sw-select-option--0').trigger('click');

        wrapper.setData({
            config: {
                includeVariants: true
            }
        });

        const variantsWarningLink = wrapper.find('.sw-import-export-importer__variants-warning .sw-import-export-importer__link');
        variantsWarningLink.trigger('click');

        const modalExporter = wrapper.findAll({ name: 'sw-import-export-importer' }).at(1);

        expect(modalExporter.props().sourceEntity).toBe('product_configurator_setting');
    });

    it('should show all profiles when sourceEntity is empty', async () => {
        wrapper.setProps({ sourceEntity: '' });

        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        const results = wrapper.findAll('.sw-select-result');
        const resultNames = results.wrappers.map(result => result.text());

        expect(resultNames).toContain('Default product');
        expect(resultNames).toContain('Default configurator settings');
        expect(resultNames).toContain('Default category');
        expect(resultNames).toContain('Default media');
    });

    it('should show only matching profiles when sourceEntity property is setted', async () => {
        wrapper.setProps({ sourceEntity: 'product_configurator_setting' });

        wrapper.find('.sw-import-export-importer__profile-select .sw-select__selection').trigger('click');
        await wrapper.vm.$nextTick();

        const results = wrapper.findAll('.sw-select-result');
        const resultNames = results.wrappers.map(result => result.text());

        expect(resultNames).not.toContain('Default product');
        expect(resultNames).toContain('Default configurator settings');
        expect(resultNames).not.toContain('Default category');
        expect(resultNames).not.toContain('Default media');
    });

    it('should throw an warning if the import fails hard', async () => {
        wrapper.setData({
            selectedProfileId: 'a1b2c3d4e5',
            config: {
                error: true
            }
        });

        wrapper.vm.createNotificationError = jest.fn();

        wrapper.vm.onStartProcess();

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.createNotificationError).toHaveBeenCalledWith({
            message: 'This is an error code: This is an detailed error message',
            title: 'sw-import-export.importer.errorNotificationTitle'
        });

        wrapper.vm.createNotificationError.mockRestore();
    });
});
