const ruleBuilderPage = require('administration/page-objects/module/sw-rule.page-object.js');

module.exports = {
    '@tags': ['settings', 'rule', 'rule-create', 'create'],
    '@disabled': !global.flags.isActive('next516'),
    'navigate to rule index': (browser) => {
        browser
            .openMainMenuEntry({
                targetPath: '#/sw/settings/rule/index',
                mainMenuId: 'sw-settings',
                subMenuId: 'sw-settings-country'
            });
    },
    'create new rule with basic condition': (browser) => {
        const page = ruleBuilderPage(browser);

        browser
            .click('a[href="#/sw/settings/rule/create"]')
            .waitForElementVisible('.sw-settings-rule-detail .sw-card__content')
            .assert.urlContains('#/sw/settings/rule/create')
            .expect.element(page.elements.smartBarHeader).to.have.text.that.contains('New rule');

        page.createBasicRule('Rule 1st');
    },
    'verify and search the new rule': (browser) => {
        const page = ruleBuilderPage(browser);

        browser
            .click(page.elements.smartBarBack)
            .waitForElementNotPresent(page.elements.loader)
            .expect.element(page.elements.columnName).to.have.text.that.contains('Rule 1st');

        browser
            .fillGlobalSearchField('Rule them all')
            .waitForElementNotPresent(page.elements.loader)
            .expect.element(page.elements.smartBarAmount).to.have.text.that.contains('(1)');
    },
    after: (browser) => {
        browser.end();
    }
};
