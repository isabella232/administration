// / <reference types="Cypress" />

import CustomerPageObject from '../../../support/pages/module/sw-customer.page-object';

let customer = {
    salutation: 'Mr.',
    country: 'Germany'
};

describe('Customer: Test crud operations', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                cy.loginViaApi();
            })
            .then(() => {
                return cy.createCustomerFixture();
            })
            .then(() => {
                return cy.fixture('customer');
            })
            .then((result) => {
                customer = Cypress._.merge(customer, result);

                return cy.fixture('customer-address');
            })
            .then((result) => {
                customer = Cypress._.merge(customer, result);
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/customer/index`);
            });
    });

    it('@package @customer: create customer', () => {
        const page = new CustomerPageObject();

        // Request we want to wait for later
        cy.server();
        cy.route({
            url: '/api/v1/customer',
            method: 'post'
        }).as('saveData');

        // Fill in basic data
        cy.get('a[href="#/sw/customer/create"]').click();
        cy.get('select[name=sw-field--customer-salutationId]').select('Mr.');
        cy.get('input[name=sw-field--customer-firstName]').type(customer.firstName);
        cy.get('input[name=sw-field--customer-lastName]').type(customer.lastName);
        cy.get(page.elements.customerMailInput).type('test@example.com');
        cy.get('.sw-field--customer-groupId .sw-field__select-load-placeholder')
            .should('not.exist');
        cy.get('select[name=sw-field--customer-groupId]').select('Standard customer group');
        cy.get('.sw-field--customer-salesChannelId .sw-field__select-load-placeholder')
            .should('not.exist');
        cy.get('select[name=sw-field--customer-salesChannelId]').select('Storefront');
        cy.get('.sw-field--customer-defaultPaymentMethodId .sw-field__select-load-placeholder')
            .should('not.exist');
        cy.get('select[name=sw-field--customer-defaultPaymentMethodId]').select('Invoice');

        // Fill in address and save
        page.createBasicAddress(customer);
        cy.get('.sw-field--address-countryId .sw-field__select-load-placeholder')
            .should('not.exist');
        cy.get('select[name=sw-field--address-countryId]').select('Germany');
        cy.get(page.elements.customerSaveAction).click();

        // Verify new customer in detail
        cy.wait('@saveData').then(() => {
            cy.get(`${page.elements.customerMetaData}-customer-name`)
                .contains(`${customer.firstName} ${customer.lastName}`);
            cy.get('.sw-customer-card-email-link').contains('test@example.com');
            cy.get('.sw-customer-base__label-customer-number').contains('1');
            cy.get('.sw-address__location').contains(customer.addresses[0].zipcode);
        });
    });

    it('@package @customer: edit customers\' base data', () => {
        const page = new CustomerPageObject();

        // Request we want to wait for later
        cy.server();
        cy.route({
            url: '/api/v1/customer/*',
            method: 'patch'
        }).as('saveData');

        // Open customer
        cy.clickContextMenuItem(
            '.sw-customer-list__view-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`
        );

        // Open and swap default in addresses
        cy.get('.sw-customer-detail__open-edit-mode-action').click();
        cy.get('#sw-field--customer-firstName').clear().type('Ronald');
        cy.get('#sw-field--customer-lastName').clear().type('Weasley');
        cy.get(page.elements.customerSaveAction).click();

        // Verify updated customer
        cy.wait('@saveData').then(() => {
            cy.get(page.elements.smartBarBack).click();
            cy.get('.sw-data-grid__cell--firstName').contains('Ronald Weasley');
        });
    });

    it('@customer: delete customer', () => {
        const page = new CustomerPageObject();

        // Request we want to wait for later
        cy.server();
        cy.route({
            url: '/api/v1/customer/*',
            method: 'delete'
        }).as('deleteData');

        cy.clickContextMenuItem(
            '.sw-context-menu-item--danger',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`
        );
        cy.get(`${page.elements.modal} .sw-customer-list__confirm-delete-text`).contains(
            'Are you sure you want to delete the customer "Pep Eroni"?'
        );
        cy.get(`${page.elements.modal}__footer ${page.elements.primaryButton}`).click();

        // Verify updated customer
        cy.wait('@deleteData').then(() => {
            cy.get(page.elements.emptyState).should('be.visible');
            cy.get(page.elements.smartBarAmount).contains('(0)');
            cy.get('input.sw-search-bar__input').typeAndCheckSearchField('Pep Eroni');
            cy.get(page.elements.smartBarAmount).contains('(0)');
        });
    });
});
