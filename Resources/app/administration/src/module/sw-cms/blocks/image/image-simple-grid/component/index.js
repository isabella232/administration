import template from './sw-cms-block-image-simple-grid.html.twig';
import './sw-cms-block-image-simple-grid.scss';

const { Component } = Shopware;

/**
 * @private since v6.5.0
 */
Component.register('sw-cms-block-image-simple-grid', {
    template,
});
