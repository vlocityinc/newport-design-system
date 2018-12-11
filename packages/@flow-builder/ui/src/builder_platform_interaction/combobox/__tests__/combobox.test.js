import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import Combobox from "builder_platform_interaction/combobox";
import { comboboxInitialConfig, secondLevelMenuData } from "mock/comboboxData";
import { FilterMatchesEvent, FetchMenuDataEvent, ComboboxStateChangedEvent, NewResourceEvent, ItemSelectedEvent } from "builder_platform_interaction/events";
import { LIGHTNING_INPUT_VARIANTS } from "builder_platform_interaction/screenEditorUtils";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { validateTextWithMergeFields, validateMergeField, isTextWithMergeFields } from "builder_platform_interaction/mergeFieldLib";
import { removeCurlyBraces } from "builder_platform_interaction/commonUtils";
import { GLOBAL_CONSTANTS } from "builder_platform_interaction/systemLib";
import unknownMergeField from '@salesforce/label/FlowBuilderMergeFieldValidation.unknownMergeField';
import {
    normalizeDateTime,
    createMetadataDateTime,
    formatDateTime,
    isValidMetadataDateTime,
    isValidFormattedDateTime,
    getFormat,
} from "builder_platform_interaction/dateTimeUtils";
import { addToParentElementCache } from "builder_platform_interaction/comboboxCache";
import { LABELS } from "../comboboxLabels";

const SELECTORS = {
    COMBOBOX_PATH: 'builder_platform_interaction-combobox',
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
};

jest.mock('builder_platform_interaction/systemLib', () => {
    const emptyString = '$GlobalConstant.EmptyString';
    const booleanTrue = '$GlobalConstant.True';
    const globalConstantPrefix = '$GlobalConstant';
    const systemVariablePrefix = '$SystemVariable';
    return {
        GLOBAL_CONSTANTS: {
            EMPTY_STRING: emptyString,
            BOOLEAN_TRUE: booleanTrue,
        },
        GLOBAL_CONSTANT_PREFIX: globalConstantPrefix,
        getGlobalConstantOrSystemVariable: (id) => {
            return id === emptyString || id === booleanTrue;
        },
        isGlobalConstantOrSystemVariableId: (id) => {
            return id.startsWith(globalConstantPrefix) || id.startsWith(systemVariablePrefix);
        },
    };
});

/**
 * Error message map for validation of literal value.
 */
const VALIDATION_ERROR_MESSAGE = {
    CURRENCY : 'FlowBuilderCombobox.currencyErrorMessage',
    NUMBER : 'FlowBuilderCombobox.numberErrorMessage',
    DATE : 'FlowBuilderCombobox.dateErrorMessage',
    DATE_TIME : 'FlowBuilderCombobox.datetimeErrorMessage',
    GENERIC : 'FlowBuilderCombobox.genericErrorMessage',
    REQUIRED : 'FlowBuilderValidation.cannotBeBlank',
};

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockReturnValue(Promise.resolve([])),
        validateMergeField: jest.fn().mockReturnValue(Promise.resolve([])),
        isTextWithMergeFields: jest.fn().mockReturnValue(Promise.resolve([])),
    };
});

jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        normalizeDateTime: jest.fn().mockName('normalizeDateTime'),
        createMetadataDateTime: jest.fn().mockName('createMetadataDateTime'),
        formatDateTime: jest.fn().mockName('formatDateTime'),
        isValidFormattedDateTime: jest.fn().mockName('isValidFormattedDateTime'),
        isValidMetadataDateTime: jest.fn().mockName('isValidMetadataDateTime'),
        getFormat: jest.fn().mockName('getFormat'),
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
    beforeAll(() => {
        const sObjectVariables = comboboxInitialConfig.menuData[1].items;
        for (let i = 0; i < sObjectVariables.length; i++) {
            addToParentElementCache(sObjectVariables[i].displayText, sObjectVariables[i]);
        }
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

        it('has menuDataMaxLevel', () => {
            expect(combobox.menuDataMaxLevel).toEqual(2);
        });

        it('has blockValidation', () => {
            expect(combobox.blockValidation).toEqual(comboboxInitialConfig.blockValidation);
        });

        it('has type', () => {
            expect(combobox.type).toEqual(comboboxInitialConfig.type);
        });

        it('has a default period separator', () => {
            expect(combobox.separator).toEqual('.');
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

                it('not matching display text should not append a period', () => {
                    createCombobox({
                        value: {
                            value: 'validValue',
                            displayText: 'This should work!',
                            hasNext: true
                        }
                    });

                    return Promise.resolve().then(() => {
                        combobox.value = validItemWithHasNext2;

                        return Promise.resolve().then(() => {
                            expect(groupedCombobox.inputText).toEqual(validItemWithHasNext2.displayText);
                        });
                    });
                });

                it('matching display text with period after select should retain period', () => {
                    const textInputValue = comboboxInitialConfig.menuData[1].items[0].displayText;
                    const textInputValueWithPeriod = textInputValue.substring(0, textInputValue.length - 1) + '.}';

                    createCombobox({
                        menuData: comboboxInitialConfig.menuData
                    });

                    return Promise.resolve().then(() => {
                        groupedCombobox.dispatchEvent(getTextInputEvent(textInputValue));
                        groupedCombobox.dispatchEvent(getTextInputEvent(textInputValueWithPeriod));

                        return Promise.resolve().then(() => {
                            combobox.value = {
                                value: textInputValue,
                                displayText: textInputValue,
                                hasNext: true
                            };

                            return Promise.resolve().then(() => {
                                expect(groupedCombobox.inputText).toEqual(textInputValueWithPeriod);
                            });
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

            describe('setting dateTime literals', () => {
                beforeEach(() => {
                    createCombobox();
                });

                it('calls normalizeDateTime when changing the type to dateTime with literalsAllowed', () => {
                    const literal = 'some literal';
                    combobox.value = literal;
                    combobox.literalsAllowed = true;

                    const normalizedLiteral = 'some normalized output';
                    normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                    isValidMetadataDateTime.mockReturnValueOnce(true);
                    combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;

                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, true);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });
                });

                it('calls normalizeDateTime when given a literal and type is dateTime with literalsAllowed', () => {
                    const literal = 'some literal';
                    combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                    combobox.literalsAllowed = true;


                    const normalizedLiteral = 'some normalized output';
                    normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                    isValidMetadataDateTime.mockReturnValueOnce(true);

                    combobox.value = literal;

                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, true);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });
                });

                it('calls normalizeDateTime when given a literal and type is date with literalsAllowed', () => {
                    const literal = 'some literal';
                    combobox.type = FLOW_DATA_TYPE.DATE.value;
                    combobox.literalsAllowed = true;

                    const normalizedLiteral = 'some normalized output';
                    normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                    isValidMetadataDateTime.mockReturnValueOnce(true);

                    combobox.value = literal;

                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, false);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });
                });

                it('calls normalizeDateTime when given a literal and type changed to date with literalsAllowed', () => {
                    const normalizedLiteral = 'some normalized output';
                    normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                    isValidMetadataDateTime.mockReturnValueOnce(true);

                    const literal = 'some literal';
                    combobox.literalsAllowed = true;
                    // set value before setting the type
                    combobox.value = literal;

                    // now set the type after setting the value
                    normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                    isValidMetadataDateTime.mockReturnValueOnce(true);
                    combobox.type = FLOW_DATA_TYPE.DATE.value;

                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, false);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });
                });

                it('does not normalize date literal when literalsAllowed is false', () => {
                    const literal = 'some literal';
                    combobox.literalsAllowed = false;
                    combobox.type = FLOW_DATA_TYPE.DATE.value;
                    combobox.value = literal;

                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime).not.toHaveBeenCalled();
                    });
                });

                it('does not normalize date literal when in error state', () => {
                    const literal = 'some literal';
                    combobox.literalsAllowed = true;
                    combobox.errorMessage = 'some error';
                    combobox.type = FLOW_DATA_TYPE.DATE.value;
                    combobox.value = literal;

                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime).not.toHaveBeenCalled();
                    });
                });

                it('does not normalize date literal when type is neither date or date time', () => {
                    const literal = 'some literal';
                    combobox.literalsAllowed = true;
                    combobox.type = FLOW_DATA_TYPE.NUMBER.value;
                    combobox.value = literal;

                    return Promise.resolve().then(() => {
                        expect(normalizeDateTime).not.toHaveBeenCalled();
                    });
                });
            });

            describe('getting date time literals', () => {
                const normalizedOutput = 'some normalized output';
                beforeAll(() => {
                    isValidFormattedDateTime.mockReturnValue(true);
                    isValidMetadataDateTime.mockReturnValue(true);
                });

                afterAll(() => {
                    isValidFormattedDateTime.mockReset();
                    isValidMetadataDateTime.mockReset();
                });

                beforeEach(() => {
                    createCombobox();
                    combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                    combobox.literalsAllowed = true;
                    normalizeDateTime.mockReturnValueOnce(normalizedOutput);
                    combobox.value = 'some literal';
                });

                it('calls createMetadataDateTime when type is dateTime and literalsAllowed and no error', () => {
                    combobox.errorMessage = null;
                    const mockMetadataValue = 'some metadata value';
                    createMetadataDateTime.mockReturnValueOnce(mockMetadataValue);
                    const literal = combobox.value;
                    expect(literal).toEqual(mockMetadataValue);
                    expect(createMetadataDateTime).toHaveBeenCalledWith(normalizedOutput, true);
                });

                it('calls createMetadataDateTime when type is date and literalsAllowed and no error', () => {
                    combobox.type = FLOW_DATA_TYPE.DATE.value;
                    combobox.errorMessage = null;
                    const mockMetadataValue = 'some metadata value';
                    createMetadataDateTime.mockReturnValueOnce(mockMetadataValue);

                    return Promise.resolve().then(() => {
                        const literal = combobox.value;
                        expect(literal).toEqual(mockMetadataValue);
                        expect(createMetadataDateTime).toHaveBeenCalledWith(normalizedOutput, false);
                    });
                });

                it('uses the display text when type is date or date time but literalsAllowed is false', () => {
                    combobox.literalsAllowed = false;

                    return Promise.resolve().then(() => {
                        const literal = combobox.value;
                        expect(literal).toEqual(normalizedOutput);
                        expect(createMetadataDateTime).not.toHaveBeenCalled();
                    });
                });

                it('uses the display text when type is date or date time but errorMessage is present', () => {
                    combobox.errorMessage = 'some error';

                    return Promise.resolve().then(() => {
                        const literal = combobox.value;
                        expect(literal).toEqual(normalizedOutput);
                        expect(createMetadataDateTime).not.toHaveBeenCalled();
                    });
                });

                it('uses the display text when type is neither date or date time', () => {
                    combobox.type = FLOW_DATA_TYPE.NUMBER.value;

                    return Promise.resolve().then(() => {
                        const literal = combobox.value;
                        expect(literal).toEqual(normalizedOutput);
                        expect(createMetadataDateTime).not.toHaveBeenCalled();
                    });
                });

                it('uses the display text when createMetadataDateTime returns null', () => {
                    createMetadataDateTime.mockReturnValueOnce(null);
                    const literal = combobox.value;
                    expect(literal).toEqual(normalizedOutput);
                    expect(createMetadataDateTime).toHaveBeenCalledWith(normalizedOutput, true);
                });
            });
        });
    });

    it('Setting an empty string or null error message should replace the existing one', () => {
        createCombobox();
        const error = 'errorMessage';
        combobox.errorMessage = error;
        expect(combobox.errorMessage).toEqual(error);
        combobox.errorMessage = undefined;
        expect(combobox.errorMessage).toEqual(error);
        combobox.errorMessage = '';
        expect(combobox.errorMessage).toEqual('');
        combobox.errorMessage = null;
        expect(combobox.errorMessage).toEqual(null);
        expect(groupedCombobox.showHelpMessageIfInvalid).toHaveBeenCalledTimes(3);
    });

    describe('menuDataMaxLevel setter/getter tests', () => {
        beforeEach(() => {
            createCombobox();

            for (const attribute in comboboxInitialConfig) {
                if (comboboxInitialConfig.hasOwnProperty(attribute)) {
                    combobox[attribute] = comboboxInitialConfig[attribute];
                }
            }
        });

        it('Valid number is allowed', () => {
            const newMax = 4;
            combobox.menuDataMaxLevel = newMax;
            return Promise.resolve().then(() => {
                expect(combobox.menuDataMaxLevel).toEqual(newMax);
            });
        });

        it('Negative numbers are not allowed', () => {
            combobox.menuDataMaxLevel = -4;
            return Promise.resolve().then(() => {
                expect(combobox.menuDataMaxLevel).toEqual(2);
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

        it('FilterMatches is fired when combobox first level value is cleared', () => {
            combobox.value = '{!myVar1}';
            combobox.value = null;
            return Promise.resolve().then(() => {
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toBe('');
            });
        });

        it('FetchMenuData is fired when a . is entered & item hasNext', () => {
            combobox.value = '{!MyAccount}';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');

                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
        });

        it('Menu data is cleared when FetchMenuData is fired', () => {
            combobox.value = '{!MyAccount}';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');

                groupedCombobox.dispatchEvent(textInputEvent);
                expect(combobox.menuData).toHaveLength(0);
            });
        });

        it('FetchMenuData is fired when a . is deleted manually', () => {
            combobox.value = '{!MyAccount}';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');
                groupedCombobox.dispatchEvent(textInputEvent);
                textInputEvent = getTextInputEvent('{!MyAccount}');
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
        });

        it('FetchMenuData is fired when a . is deleted on blur', () => {
            combobox.value = '{!MyAccount.}';

            return Promise.resolve().then(() => {
                blurEvent = new CustomEvent('blur');
                groupedCombobox.dispatchEvent(blurEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                expect(combobox.value).toBe('{!MyAccount}');
            });
        });

        it('FetchMenuData is fired when the base is no longer in the displayText', () => {
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

        it('FetchMenuData is not fired when enableFieldDrilldown is false', () => {
            combobox.enableFieldDrilldown = false;
            combobox.value = '{!MyAccount}';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount.}');

                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).not.toHaveBeenCalled();
            });
        });

        it('Clearing second level merge field value should fire fetchMenuData event', () => {
            combobox.value = secondLevelMenuData[0];
            combobox.value = null;
            return Promise.resolve().then(() => {
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
        });

        it('Clearing first level value should not fire fetchMenuData event', () => {
            combobox.value = '{!var1}';
            combobox.value = null;
            return Promise.resolve().then(() => {
                expect(fetchMenuDataHandler).not.toHaveBeenCalled();
            });
        });

        it('FetchMenuData is fired when separator is entered & item hasNext', () => {
            combobox.value = '{!MyAccount}';
            combobox.separator = '>';

            return Promise.resolve().then(() => {
                textInputEvent = getTextInputEvent('{!MyAccount>}');

                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
        });

        describe('Copy/paste tests for fetchMenuData', () => {
            it('From first level to first level', () => {
                combobox.value = comboboxInitialConfig.menuData[2].items[0];
                return Promise.resolve().then(() => {
                    textInputEvent = getTextInputEvent('{!MyNumbe}');
                    groupedCombobox.dispatchEvent(textInputEvent);
                    expect(fetchMenuDataHandler).not.toHaveBeenCalled();
                });
            });

            it('From first level straight to second level of an sObject', () => {
                combobox.value = comboboxInitialConfig.menuData[2].items[0];
                return Promise.resolve().then(() => {
                    textInputEvent = getTextInputEvent('{!MyAccount.Na}');
                    groupedCombobox.dispatchEvent(textInputEvent);
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(comboboxInitialConfig.menuData[1].items[0]);
                });
            });

            it('From second level of one sObject to second level of same sObject', () => {
                combobox.value = secondLevelMenuData[0];
                return Promise.resolve().then(() => {
                    textInputEvent = getTextInputEvent('{!MyAccount.Na}');
                    groupedCombobox.dispatchEvent(textInputEvent);
                    expect(fetchMenuDataHandler).not.toHaveBeenCalled();
                });
            });

            it('From second level of one sObject to a different sObject', () => {
                combobox.value = secondLevelMenuData[0];
                return Promise.resolve().then(() => {
                    textInputEvent = getTextInputEvent('{!MyContact.Descri}');
                    groupedCombobox.dispatchEvent(textInputEvent);
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(comboboxInitialConfig.menuData[1].items[1]);
                });
            });

            it('From second level of sObject back to first level', () => {
                combobox.value = secondLevelMenuData[0];
                return Promise.resolve().then(() => {
                    textInputEvent = getTextInputEvent('{!MyNumb}');
                    groupedCombobox.dispatchEvent(textInputEvent);
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toBeNull();
                });
            });
        });

        it('ItemSelected is fired when a selection is made when the item hasNext=false (tests findItem)', () => {
            combobox.value = '';
            combobox.menuData = secondLevelMenuData;
            selectEvent = getSelectEvent(secondLevelMenuData[0].value);
            groupedCombobox.dispatchEvent(selectEvent);
            expect(itemSelectedHandler).toHaveBeenCalledTimes(1);
            expect(itemSelectedHandler.mock.calls[0][0].detail.item).toEqual(secondLevelMenuData[0]);
        });

        it('FilterMatches is fired when item is selected', () => {
            selectEvent = getSelectEvent(comboboxInitialConfig.menuData[1].items[0].value);
            groupedCombobox.dispatchEvent(selectEvent);
            expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
            expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(removeCurlyBraces(comboboxInitialConfig.menuData[1].items[0].displayText));
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

        it('ComboboxStateChanged is fired after literalsAllowed property has changed', () => {
            const previousValueForLiteralsAllowed = combobox.literalsAllowed;

            combobox.literalsAllowed = previousValueForLiteralsAllowed;
            expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(0);

            combobox.literalsAllowed = !previousValueForLiteralsAllowed;
            expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
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

        it('ComboboxStateChanged is fired even when value has not changed', () => {
            blurEvent = new CustomEvent('blur');

            groupedCombobox.dispatchEvent(blurEvent);
            groupedCombobox.dispatchEvent(blurEvent);

            expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(2);
        });

        it('NewResource event is fired when New Resource is selected.', () => {
            selectEvent = getSelectEvent('%%NewResource%%');

            groupedCombobox.dispatchEvent(selectEvent);

            expect(selectHandler).toHaveBeenCalledTimes(1);
        });

        it('Shows dropdown with fields after item is selected', () => {
            selectEvent = getSelectEvent(comboboxInitialConfig.menuData[1].items[0].value);
            groupedCombobox.dispatchEvent(selectEvent);
            groupedCombobox.focusAndOpenDropdownIfNotEmpty = jest.fn();

            combobox.menuData = secondLevelMenuData;

            return Promise.resolve().then(() => {
                expect(groupedCombobox.focusAndOpenDropdownIfNotEmpty).toHaveBeenCalled();
            });
        });
    });

    describe('Validation Tests', () => {
        const validationTestData = {
            String : [
                { value: '{!MyVar1}', isLiteralsAllowed: false, allowedParamTypes: {}, error: null },
                { value: '{!^textVar}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{! textVar}', error: null },
                { value: '!@#$test', error: null },
                { value: '{!}', error: null },
                { value: '{! }', error: null },
                { value: '{!9var}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{!_test_}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{!_test_}', error: null },
                { value: '{!MyVar1.secondLevel.thirdLevel}', isLiteralsAllowed: false, error: VALIDATION_ERROR_MESSAGE.GENERIC },
                { value: '{!MyVar1.secondLevel.thirdLevel}', isLiteralsAllowed: true, error: null }, // no validation for more than 2 levels if literals allowed
                { value: '{!MyVar1.}', isLiteralsAllowed: false, error: null }, // no error since last dot is removed before validation
                { value: '{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}', error: null },
            ],
            Number : [
                { value: '-.9', error: null},
                { value: '122', error: null },
                { value: '876.87', error: null },
                { value: '.23', error: null },
                { value: '{!123}', error: VALIDATION_ERROR_MESSAGE.NUMBER },
                { value: '{!MyVar1}.{!MyVar1}. test', error: VALIDATION_ERROR_MESSAGE.NUMBER },
                { value: '12.13.45', error: VALIDATION_ERROR_MESSAGE.NUMBER },
                { value: 'a.b.c', error: VALIDATION_ERROR_MESSAGE.NUMBER },
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
            validateTextWithMergeFields.mockReturnValueOnce([{message: unknownMergeField}]);
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

        it('for merge fields and allowed param types populated.', () => {
            const comboboxValue = '{!MyVar1}';
            isTextWithMergeFields.mockReturnValueOnce(false);
            validateMergeField.mockReset();
            validateMergeField.mockReturnValueOnce(Promise.resolve([]));
            combobox.type = FLOW_DATA_TYPE.STRING.value;
            combobox.allowedParamTypes = {};
            combobox.value = comboboxValue;
            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual(comboboxValue);
                expect(validateMergeField).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toBeNull();
            });
        });

        it('custom fields get treated as merge fields', () => {
            const message = 'This merge field does not exist.';
            validateMergeField.mockReset();
            validateMergeField.mockReturnValueOnce([{message}]);
            const comboboxValue = {
                displayText: '{!MyAccount.customField__c}',
                value: '{!MyAccount.customField__c}',
                parent: {
                    displayText: '{!MyAccount}'
                }
            };
            combobox.value = comboboxValue;
            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(combobox.errorMessage).toBe(message);
            });
        });

        it('dev name with multiple underscores get treated as merge field', () => {
            const comboboxValue = {
                displayText: '{!MyAccount__c}',
                value: '{!MyAccount__c}',
            };
            combobox.value = comboboxValue;
            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(combobox.errorMessage).toBeNull();
            });
        });

        it('merge fields with spaces get treated as merge fields when typing', () => {
            const filterMatchesHandler = jest.fn();
            combobox.addEventListener(FilterMatchesEvent.EVENT_NAME, filterMatchesHandler);
            const selectEvent = getSelectEvent(comboboxInitialConfig.menuData[1].items[0].value);
            groupedCombobox.dispatchEvent(selectEvent);
            combobox.menuData = secondLevelMenuData;
            return Promise.resolve().then(() => {
                const textInputEvent = getTextInputEvent('{!MyAccount.First Na}');
                groupedCombobox.dispatchEvent(textInputEvent);
                return Promise.resolve(() => {
                    expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                    expect(filterMatchesHandler[0][1]).toEqual(true);
                });
            });
        });

        it('for blockValidation true', () => {
            combobox.blockValidation = true;
            combobox.type = FLOW_DATA_TYPE.BOOLEAN.value;
            combobox.value = 'not a valid value';
            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(combobox.errorMessage).toBeNull();
            });
        });
    });

    describe('validation on enable', () => {
        let comboboxStateChangedHandler;
        beforeEach(() => {
            createCombobox({
                               value: 'abcd',
                               literalsAllowed: true,
                               type: FLOW_DATA_TYPE.STRING.value,
            });
            comboboxStateChangedHandler = jest.fn();
            combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);
        });
        it('should validate when enabled if literalsAllowed is changed while disabled is true', () => {
            combobox.disabled = true;
            return Promise.resolve().then(() => {
                combobox.literalsAllowed = false;
                return Promise.resolve().then(() => {
                    expect(combobox.errorMessage).toBeNull();
                    combobox.disabled = false;
                    return Promise.resolve().then(() => {
                        expect(combobox.errorMessage).toBeTruthy();

                    // gets fired once when literalsAllowed changes, even if no error has been set, and again when disabled = false
                    expect(comboboxStateChangedHandler).toBeCalledTimes(2);
                    });
                });
            });
        });
        it('should validate when enabled if type is changed while disabled is true', () => {
            combobox.disabled = true;
            return Promise.resolve().then(() => {
                combobox.type = FLOW_DATA_TYPE.NUMBER.value;
                return Promise.resolve().then(() => {
                    expect(combobox.errorMessage).toBeNull();
                    combobox.disabled = false;
                    return Promise.resolve().then(() => {
                        expect(combobox.errorMessage).toBeTruthy();

                        // gets fired once when type changes, even if no error has been set, and again when disabled = false
                        expect(comboboxStateChangedHandler).toBeCalledTimes(2);
                    });
                });
            });
        });
        it('should not fire state changed event when enabled if nothing changes while disabled is false', () => {
            combobox.disabled = true;
            return Promise.resolve().then(() => {
                combobox.disabled = false;
                return Promise.resolve().then(() => {
                    expect(comboboxStateChangedHandler).toBeCalledTimes(0);
                });
            });
        });
    });

    describe('datetime validation', () => {
        let blurEvent;
        const mockDatetime = '12/31/1999 11:59 pm';
        const mockDate = '12/31/1999';

        beforeEach(() => {
            createCombobox();
            blurEvent = new CustomEvent('blur');
        });

        it('calls isValidFormattedDateTime when validating date time', () => {
            normalizeDateTime.mockReturnValueOnce(mockDatetime);
            combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
            combobox.value = mockDatetime;
            groupedCombobox.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(isValidFormattedDateTime).toHaveBeenCalledTimes(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledWith(mockDatetime, true);
            });
        });

        it('calls isValidFormattedDateTime when validating date', () => {
            normalizeDateTime.mockReturnValueOnce(mockDate);
            combobox.type = FLOW_DATA_TYPE.DATE.value;
            combobox.value = mockDate;
            groupedCombobox.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(isValidFormattedDateTime).toHaveBeenCalledTimes(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledWith(mockDate, false);
            });
        });

        it('calls formatDateTime when given a date literal to validate', () => {
            normalizeDateTime.mockReturnValueOnce(mockDate);
            isValidFormattedDateTime.mockReturnValueOnce(true);

            combobox.type = FLOW_DATA_TYPE.DATE.value;
            combobox.value = mockDate;
            groupedCombobox.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(formatDateTime).toHaveBeenCalledTimes(1);
                expect(formatDateTime).toHaveBeenCalledWith(mockDate, false);
            });
        });

        it('calls formatDateTime when given a date time literal to validate', () => {
            normalizeDateTime.mockReturnValueOnce(mockDatetime);
            isValidFormattedDateTime.mockReturnValueOnce(true);

            combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
            combobox.value = mockDatetime;
            groupedCombobox.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(formatDateTime).toHaveBeenCalledTimes(1);
                expect(formatDateTime).toHaveBeenCalledWith(mockDatetime, true);
            });
        });

        it('sets the error message when given an invalid date or date time', () => {
            normalizeDateTime.mockReturnValueOnce(mockDatetime);
            isValidFormattedDateTime.mockReturnValueOnce(false);

            combobox.type = FLOW_DATA_TYPE.DATE.value;
            combobox.value = 'bad date time';

            groupedCombobox.dispatchEvent(blurEvent);
            return Promise.resolve().then(() => {
                expect(formatDateTime).not.toHaveBeenCalled();
                expect(combobox.errorMessage).toEqual(LABELS.dateErrorMessage);
            });
        });
    });

    describe('placeholder logic', () => {
        const mockDateFormat = 'mm/dd/yyy';
        const mockDatetimeFormat = 'mm/dd/yyyy, hh:mm:ss';

        beforeEach(() => {
            createCombobox();
        });

        it('uses the default placeholder when no placeholder is given', () => {
            expect(combobox.placeholder).toEqual(LABELS.defaultPlaceholder);
        });

        it('uses localized date format when type is date and literals are allowed', () => {
            getFormat.mockReturnValueOnce(mockDateFormat);
            combobox.type = FLOW_DATA_TYPE.DATE.value;
            combobox.literalsAllowed = true;

            return Promise.resolve().then(() => {
                expect(combobox.placeholder).toEqual(mockDateFormat);
                expect(getFormat).toHaveBeenCalledWith(false);
            });
        });

        it('uses localized date time format when type is dateTime and literals are allowed', () => {
            getFormat.mockReturnValueOnce(mockDatetimeFormat);
            combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
            combobox.literalsAllowed = true;

            return Promise.resolve().then(() => {
                expect(combobox.placeholder).toEqual(mockDatetimeFormat);
                expect(getFormat).toHaveBeenCalledWith(true);
            });
        });

        it('does not get the localized date format when literalsAllowed is false', () => {
            combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
            combobox.literalsAllowed = false;

            return Promise.resolve().then(() => {
                expect(getFormat).not.toHaveBeenCalled();
            });
        });

        it('does not get the localized date format when type is neither date or dateTime', () => {
            combobox.type = FLOW_DATA_TYPE.NUMBER.value;
            combobox.literalsAllowed = true;

            return Promise.resolve().then(() => {
                expect(getFormat).not.toHaveBeenCalled();
            });
        });
    });
});
