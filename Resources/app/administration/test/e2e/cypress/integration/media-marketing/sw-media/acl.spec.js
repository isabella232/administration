/// <reference types="Cypress" />

import MediaPageObject from "../../../support/pages/module/sw-media.page-object";

describe('Property: Test ACL privileges', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                cy.loginViaApi();
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/media/index`);
            });
    });

    it('@media: has no access to media module', () => {
        cy.window().then((win) => {
            if (!win.Shopware.Feature.isActive('FEATURE_NEXT_3722')) {
                return;
            }

            cy.loginAsUserWithPermissions([
                {
                    key: 'property',
                    role: 'viewer'
                }
            ]).then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/media/index`);
            });

            // open media-payment without permissions
            cy.get('.sw-privilege-error__access-denied-image').should('be.visible');
            cy.get('h1').contains('Access denied');
            cy.get('.sw-media-library').should('not.exist');

            // see menu without media-payment menu item
            cy.get('.sw-content > span.sw-admin-menu__navigation-link').click();
            cy.get('.sw-admin-menu__navigation-list-item.sw-media').should('not.exist');
        });
    });

    it('@media: can view media', () => {
        const page = new MediaPageObject();

        cy.window().then((win) => {
            if (!win.Shopware.Feature.isActive('FEATURE_NEXT_3722')) {
                return;
            }

            cy.loginAsUserWithPermissions([
                {
                    key: 'media',
                    role: 'viewer'
                }
            ]).then(() => {
                cy.visit(`${Cypress.env('admin')}#/sw/media/index`);
            });

            // check upload
            cy.get('.sw-media-upload-v2__button-compact-upload').should('be.disabled');
            cy.get('.sw-media-upload-v2__button-context-menu').should('be.disabled');

            cy.clickContextMenuItem(
                '.sw-media-context-item__show-media-action',
                page.elements.contextMenuButton,
                '.sw-media-grid-item__item--0'
            );
            cy.get('.sw-media-sidebar__quickaction--disabled.quickaction--move').should('be.visible');
        });
    });

    it('@media: can edit media', () => {
        cy.window().then((win) => {
            if (!win.Shopware.Feature.isActive('FEATURE_NEXT_3722')) {
                return;
            }

            // Request we want to wait for later
            cy.server();
            cy.route({
                url: '/api/v*/media-method/*',
                method: 'patch'
            }).as('savePayment');

            const page = new MediaPageObject();

            cy.loginAsUserWithPermissions([
                {
                    key: 'media',
                    role: 'viewer'
                }, {
                    key: 'media',
                    role: 'editor'
                }
            ]).then(() => {
                cy.visit(`${Cypress.env('admin')}#/sw/media/index`);
            });
            cy.get('.sw-media-upload-v2__button-compact-upload').should('be.disabled');
            cy.get('.sw-media-upload-v2__button-context-menu').should('be.disabled');

            // open media method
            cy.clickContextMenuItem(
                '.sw-media-context-item__show-media-action',
                page.elements.contextMenuButton,
                '.sw-media-grid-item__item--0'
            );
            cy.get('.sw-media-sidebar__quickaction--disabled.quickaction--move').should('not.exist');
        });
    });

    it('@media: can create media', () => {
        cy.window().then((win) => {
            if (!win.Shopware.Feature.isActive('FEATURE_NEXT_3722')) {
                return;
            }

            cy.server();
            cy.route({
                url: `${Cypress.env('apiPath')}/_action/media/**/upload?extension=png&fileName=sw-login-background`,
                method: 'post'
            }).as('saveDataFileUpload');

            cy.route({
                url: `${Cypress.env('apiPath')}/_action/media/**/upload?extension=png&fileName=sw_logo_white`,
                method: 'post'
            }).as('saveDataUrlUpload');

            const page = new MediaPageObject();

            cy.loginAsUserWithPermissions([
                {
                    key: 'media',
                    role: 'viewer'
                }, {
                    key: 'media',
                    role: 'editor'
                }, {
                    key: 'media',
                    role: 'creator'
                }
            ]).then(() => {
                cy.visit(`${Cypress.env('admin')}#/sw/media/index`);
            });

            cy.get('.sw-media-upload-v2__button-compact-upload').should('be.enabled');
            cy.get('.sw-media-upload-v2__button-context-menu').should('be.enabled');

            if (Cypress.isBrowser({ family: 'chromium' })) {
                page.uploadImageUsingFileUpload('img/sw-login-background.png', 'sw-login-background.png');

                cy.wait('@saveDataFileUpload').then((xhr) => {
                    cy.awaitAndCheckNotification('File has been saved.');
                    expect(xhr).to.have.property('status', 204);
                });
                cy.get('.sw-media-base-item__name[title="sw-login-background.png"]')
                    .should('be.visible');
            }

            if (Cypress.isBrowser('firefox')) {
                // Upload medium
                cy.clickContextMenuItem(
                    '.sw-media-upload-v2__button-url-upload',
                    '.sw-media-upload-v2__button-context-menu'
                );
                page.uploadImageUsingUrl('http://assets.shopware.com/sw_logo_white.png');

                cy.wait('@saveDataUrlUpload').then((xhr) => {
                    cy.awaitAndCheckNotification('File has been saved.');
                    expect(xhr).to.have.property('status', 204);
                });
                cy.get('.sw-media-base-item__name[title="sw_logo_white.png"]')
                    .should('be.visible');

            }
        });
    });

    it('@media: can delete media', () => {
        cy.window().then((win) => {
            if (!win.Shopware.Feature.isActive('FEATURE_NEXT_3722')) {
                return;
            }
            const page = new MediaPageObject();

            cy.loginAsUserWithPermissions([
                {
                    key: 'media',
                    role: 'deleter'
                }
            ]).then(() => {
                cy.visit(`${Cypress.env('admin')}#/sw/media/index`);
            });

            // check upload
            cy.get('.sw-media-upload-v2__button-compact-upload').should('be.disabled');
            cy.get('.sw-media-upload-v2__button-context-menu').should('be.disabled');

            cy.clickContextMenuItem(
                '.sw-media-context-item__show-media-action',
                page.elements.contextMenuButton,
                '.sw-media-grid-item__item--0'
            );
            cy.get('.sw-media-sidebar__quickaction--disabled.quickaction--move').should('be.visible');
            cy.get('.sw-media-sidebar__quickaction--disabled.quickaction--deleter').should('not.exist');
        });
    });
});
