/**
 * @param selector
 * @param value
 * @param resultPosition
 */
exports.command = function fillSingleSelect(selector, value, resultPosition = 0) {
    this.waitForElementVisible(selector)
        .click(selector)
        .waitForElementVisible(`${selector} .sw-single-select__results`)
        .assert.containsText(`${selector} .sw-single-select__results .sw-single-select-option--${resultPosition}`, value)
        .click(`${selector} .sw-single-select__results-list .sw-single-select-option--${resultPosition}`)
        .assert.containsText(`${selector} .sw-single-select__single-selection`, value)
        .keys(this.Keys.ESCAPE)
        .waitForElementNotPresent(`${selector} .sw-single-select__results`);
    return this;
};
