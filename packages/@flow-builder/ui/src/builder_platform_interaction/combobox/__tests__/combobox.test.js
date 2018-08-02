import { createElement } from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
import Combobox from 'builder_platform_interaction-combobox';
import { comboboxInitialConfig, secondLevelMenuData } from 'mock-combobox-data';
import { FilterMatchesEvent, FetchMenuDataEvent, ComboboxStateChangedEvent, NewResourceEvent, ItemSelectedEvent } from 'builder_platform_interaction-events';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction-screen-editor-utils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { validateTextWithMergeFields, validateMergeField, isTextWithMergeFields } from 'builder_platform_interaction-merge-field-lib';
import { removeCurlyBraces } from 'builder_platform_interaction-common-utils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction-system-lib';
import unknownMergeField from '@label/FlowBuilderMergeFieldValidation.unknownMergeField';
import { getValidDateTime, formatDateTime } from 'builder_platform_interaction-date-time-utils';
import { LABELS } from '../combobox-labels';

const SELECTORS = {
    COMBOBOX_PATH: 'builder_platform_interaction-combobox',
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
};

/**
 * Error message map for validation of literal value.
 *
 * Note that the labels here are not the actual labels, but rather the '<section_name.key_name>'.
 * This is due to the fact that we are importing labels via a Global Value Provider (GVP) and the
 * test runner returns default values for those imports. See the following for more info:
 *
 * http://raptor.sfdc.es/guide/testing-core.html#Handling-GVP-Imports
 */
const VALIDATION_ERROR_MESSAGE = {
    CURRENCY : 'FlowBuilderCombobox.currencyErrorMessage',
    NUMBER : 'FlowBuilderCombobox.numberErrorMessage',
    DATE : 'FlowBuilderCombobox.dateErrorMessage',
    DATE_TIME : 'FlowBuilderCombobox.datetimeErrorMessage',
    GENERIC : 'FlowBuilderCombobox.genericErrorMessage',
    REQUIRED : 'FlowBuilderValidation.cannotBeBlank',
};

jest.mock('builder_platform_interaction-merge-field-lib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockReturnValue(Promise.resolve([])),
        validateMergeField: jest.fn().mockReturnValue(Promise.resolve([])),
        isTextWithMergeFields: jest.fn().mockReturnValue(Promise.resolve([])),
    };
});

jest.mock('builder_platform_interaction-date-time-utils', () => {
    return {
        formatDateTime: jest.fn().mockName('builder_platform_interaction.formatDateTime'),
        getValidDateTime: jest.fn().mockName('builder_platform_interaction.getValidDateTime'),
    };
});

let combobox, groupedCombobox;

const createCombobox = (props) => {
    combobox = createElement(SELECTORS.COMBOBOX_PATH, {
        is: Combobox,
    });

    if (props) {
        Object.assign(combobox, props);
    }

    document.body.appendChild(combobox);
    groupedCombobox = getShadowRoot(combobox).querySelector(SELECTORS.GROUPED_COMBOBOX);
};

describe('Combobox Tests', () => {
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
            createCombobox();

            for (const attribute in comboboxInitialConfig) {
                if (comboboxInitialConfig.hasOwnProperty(attribute)) {
                    combobox[attribute] = comboboxInitialConfig[attribute];
                }
            }
        });

        it('has primitive combobox', () => {
            expect(groupedCombobox).toBeDefined();
        });

        it('has label', () => {
            expect(combobox.label).toEqual(groupedCombobox.label);
        });

        it('has value', () => {
            expect(combobox.value).toEqual(comboboxInitialConfig.value);
        });

        it('has menudata', () => {
            expect(combobox.menuData).toEqual(groupedCombobox.items);
        });

        it('has disabled', () => {
            expect(combobox.disabled).toEqual(groupedCombobox.disabled);
        });

        it('has placeholder', () => {
            expect(combobox.placeholder).toEqual(groupedCombobox.placeholder);
        });

        it('has required', () => {
            expect(combobox.required).toEqual(comboboxInitialConfig.required);
            // Not passing required to primitive combobox since it throws its own error in that case
        });

        it('has literalsAllowed', () => {
            expect(combobox.literalsAllowed).toEqual(comboboxInitialConfig.literalsAllowed);
        });

        it('has type', () => {
            expect(combobox.type).toEqual(comboboxInitialConfig.type);
        });

        it('has error message', () => {
            expect(groupedCombobox.validity).toEqual('testErrorMessage');
        });
    });

    describe('Value setter tests', () => {
        const resetText = 'reset';
        const testValues = [undefined, null, ''];
        let validItem;

        let validItemWithHasNext;

        let validItemWithHasNext2;

        let validItemWithHasNextFalse;

        beforeEach(() => {
            validItem = {
                value: 'validValue',
                displayText: 'This should work!',
                hasNext: false
            };

            validItemWithHasNext = {
                value: 'validValue',
                displayText: 'This should work!',
                hasNext: true
            };

            validItemWithHasNext2 = {
                value: 'validValue2',
                displayText: '{This should work2!}',
                hasNext: true
            };

            validItemWithHasNextFalse = {
                value: 'validValueFalse',
                displayText: 'This should workFalse!',
                hasNext: false
            };
        });

        it('Setting value with undefined/null/empty item value should result in error', () => {
            createCombobox();

            const item = {
                displayText: 'Should not work!'
            };
            const setValue = () => {
                combobox.value = item;
            };
            for (let i = 0; i < 3; i++) {
                combobox.value = resetText;
                item.value = testValues[i];
                expect(() => {
                    setValue();
                }).toThrow('Setting an item on Flow Combobox without a value property!');
            }
        });

        it('Setting value with undefined/null item displayText should result in empty string value', () => {
            createCombobox();

            const item = {
                value: 'testValue'
            };
            const expectedItem = {
                displayText: '',
                value: 'testValue',
            };
            for (let i = 0; i < 2; i++) {
                combobox.value = resetText;
                item.displayText = testValues[i];
                combobox.value = item;
                expect(combobox.value).toEqual(expectedItem);
            }
        });

        it('Setting undefined/null value should result in empty string displayText', () => {
            createCombobox();

            for (let i = 0; i < 2; i++) {
                combobox.value = resetText;
                combobox.value = testValues[i];
                expect(combobox.value).toEqual('');
            }
        });

        describe('Setting value with an item', () => {
            it('then setting value with a string should result in the string', () => {
                createCombobox();

                combobox.value = validItem;
                combobox.value = 'Should work!';
                expect(combobox.value).toEqual('Should work!');
            });

            it('then setting value with an item should result in the item', () => {
                createCombobox();

                combobox.value = 'Should get replaced';
                combobox.value = validItem;
                expect(combobox.value).toEqual(validItem);
            });

            describe('hasNext = true', () => {
                it('during initialization should not append a period', () => {
                    createCombobox({
                        value: validItemWithHasNext
                    });

                    return Promise.resolve().then(() => {
                        expect(groupedCombobox.inputText).toEqual(validItemWithHasNext.displayText);
                    });
                });

                it('after user blur should not append a period', () => {
                    createCombobox();

                    combobox.value = validItemWithHasNext;

                    return Promise.resolve().then(() => {
                        const blurEvent = new CustomEvent('blur');
                        groupedCombobox.dispatchEvent(blurEvent);

                        return Promise.resolve().then(() => {
                            combobox.value = validItemWithHasNext2;

                            return Promise.resolve().then(() => {
                                expect(groupedCombobox.inputText).toEqual(validItemWithHasNext2.displayText);
                            });
                        });
                    });
                });

                it('without blur should append a period', () => {
                    createCombobox();

                    const expectedDisplayText =
                        validItemWithHasNext2.displayText.substring(0, validItemWithHasNext2.displayText.length - 1) + '.}';

                    combobox.value = validItemWithHasNext;

                    return Promise.resolve().then(() => {
                        combobox._isUserBlurred = false;
                        combobox.value = validItemWithHasNext2;

                        return Promise.resolve().then(() => {
                            expect(groupedCombobox.inputText).toEqual(expectedDisplayText);
                        });
                    });
                });
            });

            it('hasNext = false should not append period', () => {
                createCombobox();

                combobox.value = validItemWithHasNextFalse;
                return Promise.resolve().then(() => {
                    expect(groupedCombobox.inputText).toEqual(validItemWithHasNextFalse.displayText);
                });
            });
        });
    });

    describe('Variant setter/getter tests', () => {
        it('Setting an invalid variant should result in an error', () => {
            createCombobox();

            const setVariant = () => {
                combobox.variant = 'standard-hidden';
            };
            expect(() => {
                setVariant();
            }).toThrow('Variant must either be \'standard\' or \'label-hidden\'!');
        });
        it('Setting a valid variant', () => {
            createCombobox();

            combobox.variant = LIGHTNING_INPUT_VARIANTS.STANDARD;
            expect(combobox.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });

    describe('Typing Autocomplete Tests', () => {
        beforeEach(() => {
            createCombobox();

            combobox.value = '{';
        });

        it('Typing {! should append }', () => {
            const textInputEvent = getTextInputEvent('{!');
            groupedCombobox.dispatchEvent(textInputEvent);
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputText).toEqual('{!}');
            });
        });

        it('textinput event with undefined text does nothing}', () => {
            const textInputEvent = getTextInputEvent(undefined);
            groupedCombobox.dispatchEvent(textInputEvent);
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputText).toEqual('{');
            });
        });
    });

    describe('Icon Tests', () => {
        it('Search icon when empty', () => {
            createCombobox();

            combobox.value = '';
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputIconName).toEqual('utility:search');
            });
        });

        it('Activity Indicator when fetching and filtering menu data', () => {
            createCombobox();

            combobox.value = '{!myAccount}';
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
    });

    describe('Events Testing', () => {
        let filterMatchesHandler, fetchMenuDataHandler, comboboxStateChangedHandler, selectHandler, itemSelectedHandler;
        let textInputEvent, blurEvent, selectEvent;
        beforeEach(() => {
            createCombobox();

            filterMatchesHandler = jest.fn();
            fetchMenuDataHandler = jest.fn();
            comboboxStateChangedHandler = jest.fn();
            selectHandler = jest.fn();
            itemSelectedHandler = jest.fn();

            combobox.addEventListener(FilterMatchesEvent.EVENT_NAME, filterMatchesHandler);
            combobox.addEventListener(FetchMenuDataEvent.EVENT_NAME, fetchMenuDataHandler);
            combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);
            combobox.addEventListener(NewResourceEvent.EVENT_NAME, selectHandler);
            combobox.addEventListener(ItemSelectedEvent.EVENT_NAME, itemSelectedHandler);

            for (const attribute in comboboxInitialConfig) {
                if (comboboxInitialConfig.hasOwnProperty(attribute)) {
                    combobox[attribute] = comboboxInitialConfig[attribute];
                }
            }
        });

        it('FilterMatches is fired with entered text', () => {
            const enteredText = 'foobar';
            textInputEvent = getTextInputEvent(enteredText);
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
            expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(enteredText);
        });

        it('FilterMatches is fired without curly braces for a merge field', () => {
            const enteredText = '{!foobar}';
            textInputEvent = getTextInputEvent(enteredText);
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
            expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(removeCurlyBraces(enteredText));
        });

        it('FilterMatches is fired with only the field portion of entered text for a merge field on the second level', () => {
            const value = secondLevelMenuData[0];
            value.parent = comboboxInitialConfig.menuData[1].items[0];
            combobox.value = value;

            const filterText = 'foobar';
            textInputEvent = getTextInputEvent('{!MyAccount.' + filterText + '}');
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
            expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(filterText);
        });

        it('FilterMatches is not fired if more than two levels', () => {
            const enteredText = '{!myAccount.foo.bar}';
            textInputEvent = getTextInputEvent(enteredText);
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(filterMatchesHandler).not.toHaveBeenCalled();
        });

        it('FetchMenuData is fired when a . is entered & item hasNext', () => {
            combobox.value = '{!MyAccount}';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');

                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
        });

        it('FetchMenuData is fired when a . is deleted', () => {
            combobox.value = '{!MyAccount}';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');
                groupedCombobox.dispatchEvent(textInputEvent);
                textInputEvent = getTextInputEvent('{!MyAccount}');
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
        });

        it('FetchMenuData is fired when the length of displayText is less than base length', () => {
            combobox.value = '{!MyAccount}';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');
                groupedCombobox.dispatchEvent(textInputEvent);
                textInputEvent = getTextInputEvent('{!MyAc}');
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
        });

        it('FetchMenuData is not fired third level data', () => {
            combobox.value = '{!MyAccount.name}';
            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.name.}');
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(0);
            });
        });

        it('ItemSelected is fired when a selection is made (tests findItem), and deleting everything fires FetchMenuData on previous level', () => {
            combobox.value = '';
            combobox.menuData = comboboxInitialConfig.menuData;
            selectEvent = getSelectEvent(comboboxInitialConfig.menuData[1].items[0].value);
            groupedCombobox.dispatchEvent(selectEvent);
            expect(itemSelectedHandler).toHaveBeenCalledTimes(1);
            expect(itemSelectedHandler.mock.calls[0][0].detail.item).toEqual(comboboxInitialConfig.menuData[1].items[0]);
            textInputEvent = getTextInputEvent('');
            expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
        });

        it('ItemSelected is fired when a period is entered and matches with a menu item', () => {
            combobox.value = '';
            const textInputValue = comboboxInitialConfig.menuData[1].items[0].displayText;
            const textInputValueWithPeriod = textInputValue.substring(0, textInputValue.length - 1) + '.' + textInputValue.substring(textInputValue.length - 1);
            combobox.menuData = comboboxInitialConfig.menuData;
            textInputEvent = getTextInputEvent(textInputValue);
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(itemSelectedHandler).not.toHaveBeenCalled();
            textInputEvent = getTextInputEvent(textInputValueWithPeriod);
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(itemSelectedHandler).toHaveBeenCalledTimes(1);
        });

        it('ItemSelected is not fired when a period is entered but does not match a menu item', () => {
            combobox.value = '';
            combobox.menuData = comboboxInitialConfig.menuData;
            textInputEvent = getTextInputEvent('{!Blah}');
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(itemSelectedHandler).not.toHaveBeenCalled();
            textInputEvent = getTextInputEvent('{!Blah.}');
            groupedCombobox.dispatchEvent(textInputEvent);
            expect(itemSelectedHandler).not.toHaveBeenCalled();
        });

        it('ComboboxStateChanged is fired on blur (tests matchTextWithItem)', () => {
            const initialValue = '{!foobar}';
            let blurValue = '{!Blah}';

            combobox.value = initialValue;
            textInputEvent = getTextInputEvent(blurValue);
            groupedCombobox.dispatchEvent(textInputEvent);
            blurEvent = new CustomEvent('blur');
            groupedCombobox.dispatchEvent(blurEvent);
            expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
            expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(null);
            expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual(blurValue);

            // This second part tests matchTextWithItem as well
            blurValue = '{!MyAccount}';
            combobox.value = initialValue;
            combobox.menuData = comboboxInitialConfig.menuData;
            textInputEvent = getTextInputEvent(blurValue);
            groupedCombobox.dispatchEvent(textInputEvent);
            groupedCombobox.dispatchEvent(blurEvent);
            expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(2);
            expect(comboboxStateChangedHandler.mock.calls[1][0].detail.item).toEqual(comboboxInitialConfig.menuData[1].items[0]);
            expect(comboboxStateChangedHandler.mock.calls[1][0].detail.displayText).toEqual(blurValue);
        });

        it('ComboboxStateChanged does not have an item if value is empty string (tests matchTextWithItem)', () => {
            combobox.menuData = [{
                text: 'Empty Display Text Item',
                subtext: 'Empty Display Text Item',
                value: 'VAR1',
                displayText: '',
                type: 'option-card',
            }];
            combobox.value = '';
            groupedCombobox.dispatchEvent(blurEvent);
            expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
            expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(null);
        });

        it('ComboboxStateChanged is not fired on blur if value has not changed', () => {
            blurEvent = new CustomEvent('blur');

            groupedCombobox.dispatchEvent(blurEvent);

            // Called initially when set type is called
            expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
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
                { value: '{!MyVar1.secondLevel.thirdLevel}', isLiteralsAllowed: false, error: null }, // no validation for more than 2 levels
                { value: '{!MyVar1.}', isLiteralsAllowed: false, error: null }, // no error since last dot is removed before validation
                { value: '{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}', error: null },
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
            SObject :   [
                { value: '{!StartDateVar}', error: null },
                { value: '{! test}', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: 'literal', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: 'literal', isLiteralsAllowed: true, error: VALIDATION_ERROR_MESSAGE.GENERIC },
            ],
            Boolean : [
                { value: 'true', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: 'true', isLiteralsAllowed: true, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{!' + GLOBAL_CONSTANTS.BOOLEAN_TRUE + '}', error: null },
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
        let comboboxStateChangedHandler;
        const ignoreTZRegex = new RegExp('^.*?GMT');

        beforeEach(() => {
            createCombobox();

            blurEvent = new CustomEvent('blur');
            combobox.menuData = comboboxInitialConfig.menuData;

            comboboxStateChangedHandler = jest.fn();
            combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);

            isTextWithMergeFields.mockReturnValue(false);
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

                    expect(comboboxStateChangedHandler.mock.calls[0][0].detail.error).toEqual(testData.error);
                    if (testData.expectedValue) {
                        if (dataType !== 'DateTime') {
                            expect(combobox.value).toEqual(testData.expectedValue);
                        } else {
                            expect(ignoreTZRegex.exec(combobox.value)[0]).toEqual(ignoreTZRegex.exec(testData.expectedValue)[0]);
                        }
                    }
                });
            });
        });

        it('for required', () => {
            combobox.required = true;
            combobox.displayText = '';
            groupedCombobox.dispatchEvent(blurEvent);
            expect(comboboxStateChangedHandler.mock.calls[0][0].detail.error).toEqual(VALIDATION_ERROR_MESSAGE.REQUIRED);
        });

        it('for invalid data type', () => {
            const dataType = 'InvalidDataType';
            try {
                combobox.type = dataType;
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toEqual(`Data type must be a valid Flow Data Type but instead was ${dataType}`);
            }
            expect.assertions(2);
        });

        it('validateTextWithMergeFields sets the error message for strings with invalid merge fields', () => {
            isTextWithMergeFields.mockReturnValueOnce(true);
            validateTextWithMergeFields.mockReturnValueOnce(Promise.resolve([{
                message: unknownMergeField,
            }]));
            combobox.type = FLOW_DATA_TYPE.STRING.value;
            combobox.value = 'Hey, my name is {!blah}';
            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toEqual(unknownMergeField);
            });
        });

        it('for merge fields that does not exists.', () => {
            isTextWithMergeFields.mockReturnValueOnce(false);
            validateMergeField.mockReturnValueOnce(Promise.resolve([{
                message: LABELS.genericErrorMessage,
            }]));
            combobox.type = FLOW_DATA_TYPE.STRING.value;
            combobox.value = '{!vardoesnotexists}';
            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toEqual(LABELS.genericErrorMessage);
            });
        });
    });

    describe('datetime validation', () => {
        let blurEvent;

        beforeEach(() => {
            createCombobox();

            blurEvent = new CustomEvent('blur');
        });

        it('calls getValidDateTime when validating date', () => {
            combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
            const string = '01/29/1995';
            combobox.value = string;
            groupedCombobox.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(getValidDateTime).toHaveBeenCalledTimes(1);
            });
        });

        it('calls getValidDateTime when validating date time', () => {
            combobox.type = FLOW_DATA_TYPE.DATE.value;
            const string = '01/29/1995';
            combobox.value = string;
            groupedCombobox.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(getValidDateTime).toHaveBeenCalledTimes(1);
            });
        });

        it('calls formatDateTime when given a date literal to validate', () => {
            combobox.type = FLOW_DATA_TYPE.DATE.value;
            const string = '01/29/1995';
            combobox.value = string;
            getValidDateTime.mockReturnValueOnce(new Date());
            groupedCombobox.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(formatDateTime).toHaveBeenCalledTimes(1);
            });
        });

        it('sets the error message when given an invalid date or date time', () => {
            combobox.type = FLOW_DATA_TYPE.DATE.value;
            const string = '01/29/1995';
            combobox.value = string;
            getValidDateTime.mockReturnValueOnce(null);

            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(getValidDateTime).toHaveBeenCalledTimes(1);
                expect(formatDateTime).not.toHaveBeenCalled();
                expect(combobox.errorMessage).toEqual(LABELS.dateErrorMessage);
            });
        });
    });
});
