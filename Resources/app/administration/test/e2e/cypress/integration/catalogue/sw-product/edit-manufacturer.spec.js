/// <reference types="Cypress" />

import ProductPageObject from '../../../support/pages/module/sw-product.page-object';

describe('Product: Edit manufacturer', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                cy.loginViaApi();
            })
            .then(() => {
                return cy.createProductFixture({
                    manufacturerId: null
                });
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/product/index`);
            });
    });

    it('@catalogue: should create new manufacturer by using select field', () => {
        cy.onlyOnFeature('FEATURE_NEXT_17546');

        const page = new ProductPageObject();

        // Request we want to wait for later
        cy.intercept({
            url: `${Cypress.env('apiPath')}/product-manufacturer`,
            method: 'POST'
        }).as('createManufacturer');
        cy.intercept({
            url: `${Cypress.env('apiPath')}/_action/sync`,
            method: 'POST'
        }).as('saveData');

        // Open base product
        cy.get('.sw-loader').should('not.exist');
        cy.clickContextMenuItem(
            '.sw-entity-listing__context-menu-edit-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`
        );

        // Create base manufacturer via select field
        cy.get('.sw-loader').should('not.exist');
        cy.get('.sw-select-product__select_manufacturer').click();
        cy.get('.sw-loader__element').should('not.exist');
        cy.get('.sw-select-product__select_manufacturer .sw-entity-single-select__selection-input')
            .typeAndCheck('Instant Manufacturer LLC');
        cy.contains('.sw-select-result__result-item-text', 'Create new Manufacturer').should('be.visible');
        cy.contains('.sw-highlight-text__highlight', 'Instant Manufacturer LLC').should('be.visible');
        cy.get('.sw-select-product__select_manufacturer .sw-entity-single-select__selection-input')
            .type('{enter}');

        // Verify manufacturer's creation on product detail
        cy.wait('@createManufacturer')
            .its('response.statusCode').should('equal', 204);
        cy.awaitAndCheckNotification(
            'The Manufacturer with the name "Instant Manufacturer LLC" was created successfully.'
        );

        // Verify manufacturer's creation in sw-manufacturer
        cy.visit(`${Cypress.env('admin')}#/sw/manufacturer/index`);
        cy.get('.sw-loader').should('not.exist');
        cy.get(`${page.elements.dataGridRow}--0`).contains('Instant Manufacturer LLC');
    });
});
