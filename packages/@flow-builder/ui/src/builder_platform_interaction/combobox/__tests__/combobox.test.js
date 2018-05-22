import { createElement } from 'engine';
import Combobox from 'builder_platform_interaction-combobox';
import { comboboxInitialConfig } from 'mock-combobox-data';
import { ComboboxValueChangedEvent, NewResourceEvent } from 'builder_platform_interaction-events';

const SELECTORS = {
    COMBOBOX_PATH: 'builder_platform_interaction-combobox',
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
};

/**
 * Error message map for validation of literal value.
 * TODO: Use labels. W-4813532
 */
const VALIDATION_ERROR_MESSAGE = {
    CURRENCY : 'Not a valid currency. Re-enter in decimal format.',
    NUMBER : 'Not a valid number. Re-enter in decimal format.',
    DATE : 'Re-enter date as MM/DD/YYYY.',
    DATE_TIME : 'Re-enter datetime as MM/DD/YYYY HH:mm:ss TZD.',
    GENERIC : 'You have entered an invalid value.',
};

describe('Combobox Tests', () => {
    let combobox, groupedCombobox;
    beforeEach(() => {
        combobox = createElement(SELECTORS.COMBOBOX_PATH, {
            is: Combobox,
        });
        document.body.appendChild(combobox);
        groupedCombobox = combobox.querySelector(SELECTORS.GROUPED_COMBOBOX);
    });

    const getTextInputEvent = function (inputValue) {
        return new CustomEvent('textinput', {
            detail: {text: inputValue},
        });
    };

    const getSelectEvent = function (inputValue) {
        return new CustomEvent('select', {
            detail: {value: inputValue},
        });
    };

    describe('Property sanity checks', () => {
        beforeEach(() => {
            for (const attribute in comboboxInitialConfig) {
                if (comboboxInitialConfig.hasOwnProperty(attribute)) {
                    combobox[attribute] = comboboxInitialConfig[attribute];
                }
            }
        });

        it('has primitive combobox', () => {
            expect(groupedCombobox).toBeDefined();
        });

        // check value/item

        it('has displayText', () => {
            expect(combobox.displayText).toBeDefined();
            expect(combobox.displayText).toEqual(groupedCombobox.inputText);
        });

        it('has menudata', () => {
            expect(combobox.menuData).toBeDefined();
            expect(combobox.menuData).toEqual(groupedCombobox.items);
        });

        it('has disabled', () => {
            expect(combobox.disabled).toBeDefined();
            expect(combobox.disabled).toEqual(groupedCombobox.disabled);
        });

        it('has placeholder', () => {
            expect(combobox.placeholder).toBeDefined();
            expect(combobox.placeholder).toEqual(groupedCombobox.placeholder);
        });

        it('has required', () => {
            expect(combobox.required).toBeDefined();
            expect(combobox.required).toEqual(true);
            // Not passing required to primitive combobox since it throws its own error in that case
        });

        it('has error message', () => {
            expect(groupedCombobox.validity).toEqual('testErrorMessage');
        });
    });

    describe('Display Text Tests', () => {
        beforeEach(() => {
            combobox.displayText = '{';
        });

        it('Typing {! should append }', () => {
            const textInputEvent = getTextInputEvent('{!');
            groupedCombobox.dispatchEvent(textInputEvent);
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputText).toEqual('{!}');
            });
        });
    });

    describe('Icon Tests', () => {
        it('Search icon when empty', () => {
            combobox.displayText = '';
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputIconName).toEqual('utility:search');
            });
        });

        it('Activity Indicator when fetching and filtering menu data', () => {
            combobox.displayText = '{!myAccount}';
            const textInputEvent = getTextInputEvent('{!myAccount.}');
            return Promise.resolve().then(() => {
                groupedCombobox.dispatchEvent(textInputEvent);

                return Promise.resolve().then(() => {
                    expect(groupedCombobox.showActivityIndicator).toEqual(true);
                    combobox.menuData = comboboxInitialConfig.menuData;
                    return Promise.resolve().then(() => {
                        expect(groupedCombobox.showActivityIndicator).toEqual(false);
                    });
                });
            });
        });

        // TODO Make sure only clicking on clear icon clears value
        // TODO Clicking on search icon opens up menu

        it('Clear icon when there is a value', () => {
            combobox.displayText = 'testvalue';
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputIconName).toEqual('utility:clear');
            });
        });
    });

    describe('Events Testing', () => {
        let fetchMenuDataHandler, comboboxValueChangedHandler, selectHandler;
        let textInputEvent, blurEvent, selectEvent;
        beforeEach(() => {
            fetchMenuDataHandler = jest.fn();
            comboboxValueChangedHandler = jest.fn();
            selectHandler = jest.fn();

            combobox.addEventListener('fetchmenudata', fetchMenuDataHandler);
            combobox.addEventListener(ComboboxValueChangedEvent.EVENT_NAME, comboboxValueChangedHandler);
            combobox.addEventListener(NewResourceEvent.EVENT_NAME, selectHandler);

            for (const attribute in comboboxInitialConfig) {
                if (comboboxInitialConfig.hasOwnProperty(attribute)) {
                    combobox[attribute] = comboboxInitialConfig[attribute];
                }
            }
        });

        it('FetchMenuData is fired when a . is entered & item hasNext', () => {
            // combobox.displayText = '{!MyAccount}';
            combobox.value = {
                text: 'MyAccount',
                subText: 'Account',
                value: 'GUID1',
                displayText: '{!MyAccount}',
                hasNext: true,
                iconName: 'standard:account',
                type: 'option-card',
            };
            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
        });

        it('FetchMenuData is fired when a . is deleted', () => {
            combobox.value = {
                text: 'MyAccount',
                subText: 'Account',
                value: 'GUID1',
                displayText: '{!MyAccount}',
                hasNext: true,
                iconName: 'standard:account',
                type: 'option-card',
            };
            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');
                groupedCombobox.dispatchEvent(textInputEvent);
                textInputEvent = getTextInputEvent('{!MyAccount}');
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
        });

        it('FetchMenuData is not fired third level data', () => {
            combobox.displayText = '{!MyAccount.name}';
            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.name.}');
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(0);
            });
        });

        it('ValueChanged is fired on blur', () => {
            combobox.displayText = '{!newValueForBlur.}';
            textInputEvent = getTextInputEvent('{!newValueForBlur}');
            groupedCombobox.dispatchEvent(textInputEvent);
            blurEvent = new CustomEvent('blur');
            groupedCombobox.dispatchEvent(blurEvent);
            expect(comboboxValueChangedHandler).toHaveBeenCalledTimes(1);
        });

        it('ValueChanged is not fired on blur if value has not changed', () => {
            blurEvent = new CustomEvent('blur');

            groupedCombobox.dispatchEvent(blurEvent);

            expect(comboboxValueChangedHandler).toHaveBeenCalledTimes(0);
        });

        it('NewResource event is fired when New Resource is selected.', () => {
            selectEvent = getSelectEvent('%%NewResource%%');

            groupedCombobox.dispatchEvent(selectEvent);

            expect(selectHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('Validation Tests', () => {
        const validationTestData = {
            String : [
                { value: '{!MyVar1}', isLiteralsAllowed: false, error: null },
                { value: '{!^textVar}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{! textVar}', error: null },
                { value: '!@#$test', error: null },
                { value: '{!}', error: null },
                { value: '{! }', error: null },
                { value: '{!9var}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{!_test_}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{!_test_}', error: null },
                { value: '{!textVarDoesNotExists}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{!MyVar1.secondLevel.thirdLevel}', isLiteralsAllowed: false, error: null },
            ],
            Number : [
                { value: '-.9', error: null},
                { value: '122', error: null },
                { value: '876.87', error: null },
                { value: '.23', error: null },
                { value: '{!123}', error: VALIDATION_ERROR_MESSAGE.NUMBER },
            ],
            Currency : [
                { value: '0.8', error: null },
                { value: '6.', error: null },
                { value: '-12.9', error: null },
                { value: '-93.', error: null },
                { value: '-.', error: VALIDATION_ERROR_MESSAGE.CURRENCY },
                { value: '$123.87', error: VALIDATION_ERROR_MESSAGE.CURRENCY },
            ],
            Date : [
                { value: '12/31/2018', error: null, expectedValue: '12/31/2018' },
                { value: '12-12-2009', error: null, expectedValue: '12/12/2009' },
                { value: '1 1 2018', error: null, expectedValue: '01/01/2018' },
                { value: '31-12-2008', error: VALIDATION_ERROR_MESSAGE.DATE },
                { value: '0187', error: VALIDATION_ERROR_MESSAGE.DATE },
                { value: 'invalid date', error: VALIDATION_ERROR_MESSAGE.DATE },
            ],
            DateTime : [
                { value: '12/31/2018', error: null, expectedValue: '12/31/2018 00:00:00 GMT-0800 (PST)' },
                { value: '12-12-2009 11:32:59', error: null, expectedValue: '12/12/2009 11:32:59 GMT-0800 (PST)' },
                { value: '1 1 2018 10:11', error: null, expectedValue: '01/01/2018 10:11:00 GMT-0800 (PST)' },
                { value: '12/31/2018 60:60:60', error: VALIDATION_ERROR_MESSAGE.DATE_TIME },
                { value: 'invalid date', error: VALIDATION_ERROR_MESSAGE.DATE_TIME },
            ],
            SObject :   [
                { value: '{!StartDateVar}', error: null },
                { value: '{! test}', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: 'literal', error: VALIDATION_ERROR_MESSAGE.GENERIC },
            ],
            Boolean : [
                { value: 'true', error: 'You have entered an invalid value.' },
                { value: '{!MyBooleanVar}', error: null },
            ],
            Picklist : [
                { value: 'test picklist value', error: null },
            ],
            Multipicklist : [
                { value: 'test multi picklist value', error: null },
            ],
        };

        let blurEvent;
        let testName;
        const ignoreTZRegex = new RegExp('^.*?GMT');

        beforeEach(() => {
            blurEvent = new CustomEvent('blur');
            combobox.menuData = comboboxInitialConfig.menuData;
        });

        Object.keys(validationTestData).forEach(dataType => {
            validationTestData[dataType].forEach(testData => {
                testName = !testData.isLiteralsAllowed ? `for data type ${dataType} and value ${testData.value}`
                    : `for data type ${dataType} value ${testData.value} and literalsAllowed ${testData.isLiteralsAllowed}`;
                testName = testData.error ? testName += ' shows error.' : testName;

                it(testName, () => {
                    if (typeof testData.isLiteralsAllowed === 'boolean' && testData.isLiteralsAllowed === false) {
                        combobox.literalsAllowed = 'false';
                    } else {
                        combobox.literalsAllowed = 'true';
                    }
                    combobox.type = dataType;

                    const textInputEvent = getTextInputEvent(testData.value);

                    groupedCombobox.dispatchEvent(textInputEvent);
                    groupedCombobox.dispatchEvent(blurEvent);

                    expect(groupedCombobox.validity).toEqual(testData.error);
                    if (testData.expectedValue) {
                        if (dataType !== 'DateTime') {
                            expect(combobox.displayText).toEqual(testData.expectedValue);
                        } else {
                            expect(ignoreTZRegex.exec(combobox.displayText)[0]).toEqual(ignoreTZRegex.exec(testData.expectedValue)[0]);
                        }
                    }
                });
            });
        });

        it('for required', () => {
            combobox.required = true;
            combobox.displayText = '';
            groupedCombobox.dispatchEvent(blurEvent);
            expect(groupedCombobox.validity).toEqual('You have entered an invalid value.');
        });

        it('for invalid data type', () => {
            const dataType = 'InvalidDataType';
            try {
                combobox.type = dataType;
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toEqual(`Data type must be non-empty and a valid Flow Data Type but instead was ${dataType}`);
            }
            expect.assertions(2);
        });
    });
});
