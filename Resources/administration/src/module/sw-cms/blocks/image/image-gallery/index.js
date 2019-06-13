import { Application } from 'src/core/shopware';
import './component';
import './preview';

Application.getContainer('service').cmsService.registerCmsBlock({
    name: 'image-gallery',
    label: 'Image gallery',
    category: 'image',
    component: 'sw-cms-block-image-gallery',
    previewComponent: 'sw-cms-preview-image-gallery',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed'
    },
    slots: {
        imageGallery: 'image-gallery'
    }
});
