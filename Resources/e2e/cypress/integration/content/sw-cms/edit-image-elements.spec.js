// / <reference types="Cypress" />

import MediaPageObject from '../../../support/pages/module/sw-media.page-object';

describe('CMS: Check usage and editing of image elements', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                cy.loginViaApi();
            })
            .then(() => {
                return cy.createDefaultFixture('cms-page');
            })
            .then(() => {
                cy.viewport(1920, 1080);
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/cms/index`);
            });
    });

    it('@package @content: use simple image block' , () => {
        const page = new MediaPageObject();

        cy.server();
        cy.route({
            url: '/api/v1/cms-page/*',
            method: 'patch'
        }).as('saveData');

        cy.get('.sw-cms-list-item--0').click();

        // Add simple image block
        cy.contains('Add a block').click();
        cy.get('#sw-field--currentBlockCategory').select('Images');
        cy.get('.sw-cms-preview-image').should('be.visible');
        cy.get('.sw-cms-detail__block-preview:nth-of-type(1)')
            .dragTo('.sw-cms-detail__empty-stage');
        cy.get('.sw-cms-block').should('be.visible');
        cy.get('.sw-cms-slot .sw-cms-slot__overlay').invoke('show');
        cy.get('.sw-cms-slot .sw-cms-slot__settings-action').click();
        cy.get('.sw-cms-slot__config-modal').should('be.visible');

        // Upload image
        cy.fixture('img/sw-login-background.png').then(fileContent => {
            cy.get(`.sw-cms-slot__config-modal ${page.elements.uploadInput}`).upload(
                {
                    fileContent,
                    fileName: 'sw-login-background.png',
                    mimeType: 'image/png'
                }, {
                    subjectType: 'input'
                }
            );
        });
        cy.awaitAndCheckNotification('File has been saved.');
        cy.get('#sw-field--element-config-displayMode-value').select('Cover');
        cy.get('.sw-cms-slot__config-modal .sw-button--primary').click();

        // Save new page layout
        cy.get('.sw-cms-detail__save-action').click();
        cy.wait('@saveData').then(() => {
            cy.get('.sw-cms-detail__back-btn').click();
        });

        // Assign layout to root category
        cy.visit(`${Cypress.env('admin')}#/sw/category/index`);
        cy.get('.sw-tree-item__element').contains('Catalogue #1').click();
        cy.get('.sw-category-detail-base__layout').scrollIntoView();
        cy.get('.sw-category-detail-layout__change-layout-action').click();
        cy.get('.sw-modal__dialog').should('be.visible');
        cy.get('.sw-cms-layout-modal__content-item--0 .sw-field--checkbox').click();
        cy.get('.sw-modal .sw-button--primary').click();
        cy.get('.sw-category-detail-base__layout-preview .sw-cms-list-item__title').contains('Vierte Wand');
        cy.get('.sw-category-detail__save-action').click();

        // Verify layout in Storefront
        cy.visit('/');
        cy.get('.cms-image').should('be.visible');
        cy.get('.cms-image')
            .should('have.attr', 'src')
            .and('match', /sw-login-background/);
    });

    it('@package @content: use image slider block', () => {
        const page = new MediaPageObject();

        cy.server();
        cy.route({
            url: '/api/v1/cms-page/*',
            method: 'patch'
        }).as('saveData');

        cy.get('.sw-cms-list-item--0').click();

        // Add simple image block
        cy.contains('Add a block').click();
        cy.get('#sw-field--currentBlockCategory').select('Images');
        cy.get('.sw-cms-detail__block-preview:nth-of-type(10)').scrollIntoView();
        cy.get('.sw-cms-detail__block-preview:nth-of-type(10)')
            .dragTo('.sw-cms-detail__empty-stage');
        cy.get('.sw-cms-block').should('be.visible');
        cy.get('.sw-cms-slot .sw-cms-slot__overlay').invoke('show');
        cy.get('.sw-cms-slot .sw-cms-slot__settings-action').click();
        cy.get('.sw-cms-slot__config-modal').should('be.visible');

        // Add three slider images
        cy.fixture('img/sw-login-background.png').then(fileContent => {
            cy.get(`.sw-cms-slot__config-modal ${page.elements.uploadInput}`).upload(
                {
                    fileContent,
                    fileName: 'sw-login-background.png',
                    mimeType: 'image/png'
                }, {
                    subjectType: 'input'
                }
            );
        });
        cy.get('.sw-media-preview__item[alt="sw-login-background"]').should('be.visible');

        cy.fixture('img/sw-test-image.png').then(fileContent => {
            cy.get(`.sw-cms-slot__config-modal ${page.elements.uploadInput}`).upload(
                {
                    fileContent,
                    fileName: 'sw-test-image.png',
                    mimeType: 'image/png'
                }, {
                    subjectType: 'input'
                }
            );
        });
        cy.get('.sw-media-preview__item[alt="sw-test-image"]').should('be.visible');

        cy.fixture('img/sw-storefront-en.jpg').then(fileContent => {
            cy.get(`.sw-cms-slot__config-modal ${page.elements.uploadInput}`).upload(
                {
                    fileContent,
                    fileName: 'sw-storefront-en.jpg',
                    mimeType: 'image/jpg'
                }, {
                    subjectType: 'input'
                }
            );
        });
        cy.get('.sw-media-preview__item[alt="sw-storefront-en"]').should('be.visible');

        cy.awaitAndCheckNotification('File has been saved.');
        cy.get('.sw-modal__footer .sw-button--primary').click();


        // Save layout
        cy.get('.sw-cms-detail__save-action').click();
        cy.wait('@saveData').then(() => {
            cy.get('.sw-cms-detail__back-btn').click();
            cy.get('.sw-cms-list-item--0 .sw-cms-list-item__title').contains('Vierte Wand');
        });

        // Assign layout to root category
        cy.visit(`${Cypress.env('admin')}#/sw/category/index`);
        cy.get('.sw-tree-item__element').contains('Catalogue #1').click();
        cy.get('.sw-category-detail-base__layout').scrollIntoView();
        cy.get('.sw-category-detail-layout__change-layout-action').click();
        cy.get('.sw-modal__dialog').should('be.visible');
        cy.get('.sw-cms-layout-modal__content-item--0 .sw-field--checkbox').click();
        cy.get('.sw-modal .sw-button--primary').click();
        cy.get('.sw-category-detail-base__layout-preview .sw-cms-list-item__title').contains('Vierte Wand');
        cy.get('.sw-category-detail__save-action').click();

        // Verify layout in Storefront
        cy.visit('/');
        // TODO: reimplement validation after slider bug is fixed
    });
});
