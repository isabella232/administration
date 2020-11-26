/// <reference types="Cypress" />

describe('Dashboard:  Visual tests', () => {
    beforeEach(() => {
        cy.setToInitialStateVisual()
            .then(() => {
                // freezes the system time to Jan 1, 2018
                const now = new Date(2018, 1, 1);
                cy.clock(now);
            })
            .then(() => {
                cy.loginViaApi();
            })
            .then(() => {
                return cy.createProductFixture();
            })
            .then(() => {
                return cy.searchViaAdminApi({
                    endpoint: 'product',
                    data: {
                        field: 'name',
                        value: 'Product name'
                    }
                });
            })
            .then((result) => {
                return cy.createGuestOrder(result.id);
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}`);
            });
    });

    it('@visual: check appearance of basic dashboard workflow', () => {
        // Take snapshot for visual testing
        cy.changeElementStyling('.sw-data-grid__cell--orderDateTime', 'color : #fff');
        cy.get('.sw-dashboard-index__welcome-title')
            .invoke('prop', 'innerText', 'Oh, hello Cypress.');
        cy.get('.sw-dashboard-index__welcome-message')
            .invoke('prop', 'innerText', 'If it wasn\'t for you… This message would never happened.');
        cy.takeSnapshot('Dashboard overview', '.sw-dashboard-index__content');
    });
});
