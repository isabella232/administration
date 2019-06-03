import { Application } from 'src/core/shopware';
import './component';
import './preview';

Application.getContainer('service').cmsService.registerCmsBlock({
    name: 'image-slider',
    label: 'Image slider',
    category: 'image',
    component: 'sw-cms-block-image-slider',
    previewComponent: 'sw-cms-preview-image-slider',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed'
    },
    slots: {
        imageSlider: 'image-slider'
    }
});
