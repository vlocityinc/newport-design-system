// @ts-nocheck
import { createElement } from 'lwc';
import Combobox, { MENU_DATA_PAGE_SIZE } from 'builder_platform_interaction/combobox';
import { comboboxInitialConfig, secondLevelMenuData, thirdLevelMenuData } from 'mock/comboboxData';
import {
    FilterMatchesEvent,
    FetchMenuDataEvent,
    ComboboxStateChangedEvent,
    NewResourceEvent,
    ItemSelectedEvent
} from 'builder_platform_interaction/events';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction/screenEditorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    validateTextWithMergeFields,
    validateMergeField,
    isTextWithMergeFields
} from 'builder_platform_interaction/mergeFieldLib';
import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import unknownMergeField from '@salesforce/label/FlowBuilderMergeFieldValidation.unknownMergeField';
import {
    normalizeDateTime,
    createMetadataDateTime,
    formatDateTime,
    isValidMetadataDateTime,
    isValidFormattedDateTime,
    getFormat
} from 'builder_platform_interaction/dateTimeUtils';
import {
    ticks,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    textInputEvent,
    selectEvent,
    blurEvent,
    clickEvent,
    getComboboxPill,
    removeEvent
} from 'builder_platform_interaction/builderTestUtils';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { LABELS } from '../comboboxLabels';

/**
 * Error message map for validation of literal value.
 */
const VALIDATION_ERROR_MESSAGE = {
    CURRENCY: 'FlowBuilderCombobox.currencyErrorMessage',
    NUMBER: 'FlowBuilderCombobox.numberErrorMessage',
    DATE: 'FlowBuilderCombobox.dateErrorMessage',
    DATE_TIME: 'FlowBuilderCombobox.datetimeErrorMessage',
    GENERIC: 'FlowBuilderCombobox.genericErrorMessage',
    REQUIRED: 'FlowBuilderValidation.cannotBeBlank'
};

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/selectors', () => {
    return {
        apexScalarVariablesSelector: jest.fn(() => [])
    };
});
jest.mock('builder_platform_interaction/systemLib', () => {
    const emptyString = '$GlobalConstant.EmptyString';
    const booleanTrue = '$GlobalConstant.True';
    const globalConstantPrefix = '$GlobalConstant';
    const systemVariablePrefix = '$SystemVariable';
    return {
        GLOBAL_CONSTANTS: {
            EMPTY_STRING: emptyString,
            BOOLEAN_TRUE: booleanTrue
        },
        GLOBAL_CONSTANT_PREFIX: globalConstantPrefix,
        getGlobalConstantOrSystemVariable: id => {
            return id === emptyString || id === booleanTrue;
        },
        isGlobalConstantOrSystemVariableId: id => {
            return id.startsWith(globalConstantPrefix) || id.startsWith(systemVariablePrefix);
        },
        isRecordSystemVariableIdentifier: id => id.startsWith('$Record')
    };
});
jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/mergeFieldLib');
    return {
        validateTextWithMergeFields: jest.fn().mockReturnValue(Promise.resolve([])),
        validateMergeField: jest.fn().mockReturnValue(Promise.resolve([])),
        isTextWithMergeFields: jest.fn().mockReturnValue(Promise.resolve([])),
        getPillLabel: actual.getPillLabel,
        getPillTooltip: actual.getPillTooltip
    };
});
jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        normalizeDateTime: jest.fn().mockName('normalizeDateTime'),
        createMetadataDateTime: jest.fn().mockName('createMetadataDateTime'),
        formatDateTime: jest.fn().mockName('formatDateTime'),
        isValidFormattedDateTime: jest.fn().mockName('isValidFormattedDateTime'),
        isValidMetadataDateTime: jest.fn().mockName('isValidMetadataDateTime'),
        getFormat: jest.fn().mockName('getFormat')
    };
});

let combobox, groupedCombobox;

const createCombobox = props => {
    combobox = createElement(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX, {
        is: Combobox
    });
    Object.assign(combobox, props);
    document.body.appendChild(combobox);
    groupedCombobox = combobox.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
};
const fillComboboxPropertiesFromConfig = (comboBox = combobox) => {
    for (const attribute of Object.keys(comboboxInitialConfig)) {
        comboBox[attribute] = comboboxInitialConfig[attribute];
    }
};

describe('Combobox', () => {
    beforeAll(() => {
        const sObjectVariables = comboboxInitialConfig.menuData[1].items;
        sObjectVariables.forEach(sObjectVar => addToParentElementCache(sObjectVar.displayText, sObjectVar));
    });
    describe('pill NOT supported', () => {
        describe('Property sanity checks', () => {
            beforeAll(() => {
                createCombobox();
                fillComboboxPropertiesFromConfig();
            });

            it('has groupedCombobox', () => {
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
        describe('Value setter', () => {
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
                    value: 'testValue'
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
                    it('during initialization should not append a period', async () => {
                        createCombobox({
                            value: validItemWithHasNext
                        });

                        await ticks(1);
                        expect(groupedCombobox.inputText).toEqual(validItemWithHasNext.displayText);
                    });

                    it('after user blur should not append a period', async () => {
                        createCombobox();

                        combobox.value = validItemWithHasNext;

                        await ticks(3);
                        groupedCombobox.dispatchEvent(blurEvent);

                        await ticks(2);
                        combobox.value = validItemWithHasNext2;

                        await ticks(1);
                        expect(groupedCombobox.inputText).toEqual(validItemWithHasNext2.displayText);
                    });

                    it('not matching display text should not append a period', async () => {
                        createCombobox({
                            value: {
                                value: 'validValue',
                                displayText: 'This should work!',
                                hasNext: true
                            }
                        });

                        await ticks(2);
                        combobox.value = validItemWithHasNext2;

                        await ticks(1);
                        expect(groupedCombobox.inputText).toEqual(validItemWithHasNext2.displayText);
                    });

                    it('matching display text with period after select should retain period', async () => {
                        const textInputValue = comboboxInitialConfig.menuData[1].items[0].displayText;
                        const textInputValueWithPeriod = textInputValue.substring(0, textInputValue.length - 1) + '.}';

                        createCombobox({
                            menuData: comboboxInitialConfig.menuData
                        });

                        await ticks(3);
                        groupedCombobox.dispatchEvent(textInputEvent(textInputValue));
                        groupedCombobox.dispatchEvent(textInputEvent(textInputValueWithPeriod));

                        await ticks(2);
                        combobox.value = {
                            value: textInputValue,
                            displayText: textInputValue,
                            hasNext: true
                        };

                        await ticks(1);
                        expect(groupedCombobox.inputText).toEqual(textInputValueWithPeriod);
                    });
                });

                it('hasNext = false should not append period', async () => {
                    createCombobox();

                    combobox.value = validItemWithHasNextFalse;
                    await ticks(1);
                    expect(groupedCombobox.inputText).toEqual(validItemWithHasNextFalse.displayText);
                });

                describe('setting dateTime literals', () => {
                    beforeEach(() => {
                        createCombobox();
                    });

                    it('calls normalizeDateTime when changing the type to dateTime with literalsAllowed', async () => {
                        const literal = 'some literal';
                        combobox.value = literal;
                        combobox.literalsAllowed = true;

                        const normalizedLiteral = 'some normalized output';
                        normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                        isValidMetadataDateTime.mockReturnValueOnce(true);
                        combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;

                        await ticks(1);
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, true);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });

                    it('calls normalizeDateTime when given a literal and type is dateTime with literalsAllowed', async () => {
                        const literal = 'some literal';
                        combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                        combobox.literalsAllowed = true;

                        const normalizedLiteral = 'some normalized output';
                        normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                        isValidMetadataDateTime.mockReturnValueOnce(true);

                        combobox.value = literal;

                        await ticks(1);
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, true);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });

                    it('calls normalizeDateTime when given a literal and type is date with literalsAllowed', async () => {
                        const literal = 'some literal';
                        combobox.type = FLOW_DATA_TYPE.DATE.value;
                        combobox.literalsAllowed = true;

                        const normalizedLiteral = 'some normalized output';
                        normalizeDateTime.mockReturnValueOnce(normalizedLiteral);
                        isValidMetadataDateTime.mockReturnValueOnce(true);

                        combobox.value = literal;

                        await ticks(1);
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, false);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });

                    it('calls normalizeDateTime when given a literal and type changed to date with literalsAllowed', async () => {
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

                        await ticks(1);
                        expect(normalizeDateTime).toHaveBeenCalledWith(literal, false);
                        expect(combobox.value).toEqual(normalizedLiteral);
                    });

                    it('does not normalize date literal when literalsAllowed is false', async () => {
                        const literal = 'some literal';
                        combobox.literalsAllowed = false;
                        combobox.type = FLOW_DATA_TYPE.DATE.value;
                        combobox.value = literal;

                        await ticks(1);
                        expect(normalizeDateTime).not.toHaveBeenCalled();
                    });

                    it('does not normalize date literal when in error state', async () => {
                        const literal = 'some literal';
                        combobox.literalsAllowed = true;
                        combobox.errorMessage = 'some error';
                        combobox.type = FLOW_DATA_TYPE.DATE.value;
                        combobox.value = literal;

                        await ticks(1);
                        expect(normalizeDateTime).not.toHaveBeenCalled();
                    });

                    it('does not normalize date literal when type is neither date or date time', async () => {
                        const literal = 'some literal';
                        combobox.literalsAllowed = true;
                        combobox.type = FLOW_DATA_TYPE.NUMBER.value;
                        combobox.value = literal;

                        await ticks(1);
                        expect(normalizeDateTime).not.toHaveBeenCalled();
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

                    it('calls createMetadataDateTime when type is date and literalsAllowed and no error', async () => {
                        combobox.type = FLOW_DATA_TYPE.DATE.value;
                        combobox.errorMessage = null;
                        const mockMetadataValue = 'some metadata value';
                        createMetadataDateTime.mockReturnValueOnce(mockMetadataValue);

                        await ticks(1);
                        const literal = combobox.value;
                        expect(literal).toEqual(mockMetadataValue);
                        expect(createMetadataDateTime).toHaveBeenCalledWith(normalizedOutput, false);
                    });

                    it('uses the display text when type is date or date time but literalsAllowed is false', async () => {
                        combobox.literalsAllowed = false;

                        await ticks(1);
                        const literal = combobox.value;
                        expect(literal).toEqual(normalizedOutput);
                        expect(createMetadataDateTime).not.toHaveBeenCalled();
                    });

                    it('uses the display text when type is date or date time but errorMessage is present', async () => {
                        combobox.errorMessage = 'some error';

                        await ticks(1);
                        const literal = combobox.value;
                        expect(literal).toEqual(normalizedOutput);
                        expect(createMetadataDateTime).not.toHaveBeenCalled();
                    });

                    it('uses the display text when type is neither date or date time', async () => {
                        combobox.type = FLOW_DATA_TYPE.NUMBER.value;

                        await ticks(1);
                        const literal = combobox.value;
                        expect(literal).toEqual(normalizedOutput);
                        expect(createMetadataDateTime).not.toHaveBeenCalled();
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
        describe('ErrorMessage setter', () => {
            it('Setting an empty string or null error message should replace the existing one (undefined should not)', () => {
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
        });
        describe('Variant setter/getter', () => {
            it('Setting an invalid variant should result in an error', () => {
                createCombobox();

                expect(() => {
                    combobox.variant = 'standard-hidden';
                }).toThrow("Variant must either be 'standard' or 'label-hidden'!");
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

            it('Typing {! should append }', async () => {
                groupedCombobox.dispatchEvent(textInputEvent('{!'));
                await ticks(1);
                expect(groupedCombobox.inputText).toEqual('{!}');
            });

            it('textinput event with undefined text does nothing}', async () => {
                groupedCombobox.dispatchEvent(textInputEvent());
                await ticks(1);
                expect(groupedCombobox.inputText).toEqual('{');
            });
        });
        describe('Icon', () => {
            it('Search icon when empty', async () => {
                createCombobox();

                combobox.value = '';
                await ticks(1);
                expect(groupedCombobox.inputIconName).toEqual('utility:search');
            });

            it('Activity Indicator when fetching and filtering menu data', async () => {
                createCombobox();

                combobox.value = '{!myAccount}';
                await ticks(3);
                groupedCombobox.dispatchEvent(textInputEvent('{!myAccount.}'));

                await ticks(2);
                expect(groupedCombobox.showActivityIndicator).toEqual(true);
                combobox.menuData = comboboxInitialConfig.menuData;
                await ticks(1);
                expect(groupedCombobox.showActivityIndicator).toEqual(false);
            });
        });
        describe('Events', () => {
            let filterMatchesHandler,
                fetchMenuDataHandler,
                comboboxStateChangedHandler,
                selectHandler,
                itemSelectedHandler;
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

                fillComboboxPropertiesFromConfig(combobox);
            });
            it('FilterMatches is fired with entered text', () => {
                const enteredText = 'foobar';
                groupedCombobox.dispatchEvent(textInputEvent(enteredText));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(enteredText);
            });
            it('FilterMatches is fired without curly braces for a merge field', () => {
                const enteredText = '{!foobar}';
                groupedCombobox.dispatchEvent(textInputEvent(enteredText));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(removeCurlyBraces(enteredText));
            });
            it('FilterMatches is fired with only the field portion of entered text for a merge field on the second level', () => {
                combobox.value = secondLevelMenuData[0];
                const filterText = 'foobar';
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.' + filterText + '}'));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(filterText);
            });
            it('FilterMatches is fired with only the field portion of entered text for a merge field on the third level', () => {
                combobox.value = thirdLevelMenuData[0];
                groupedCombobox.dispatchEvent(textInputEvent('{!myAccount.CreatedBy.Name}'));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual('Name');
            });
            it('FilterMatches is fired when combobox first level value is cleared', async () => {
                combobox.value = '{!myVar1}';
                combobox.value = null;
                await ticks(1);
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toBe('');
            });
            it('FetchMenuData is fired when a . is entered & item hasNext', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
            it('Menu data is cleared when FetchMenuData is fired', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                expect(combobox.menuData).toHaveLength(0);
            });
            it('FetchMenuData is fired when a . is deleted manually', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
            it('FetchMenuData is fired when a . is deleted on blur', async () => {
                combobox.value = '{!MyAccount.}';

                await ticks(1);
                groupedCombobox.dispatchEvent(blurEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                expect(combobox.value).toBe('{!MyAccount}');
            });
            it('FetchMenuData is fired when the base is no longer in the displayText', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAc}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
            it('FetchMenuData is not fired third level data', async () => {
                combobox.value = '{!MyAccount.name}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.name.}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(0);
            });
            it('FetchMenuData is not fired when enableFieldDrilldown is false', async () => {
                combobox.enableFieldDrilldown = false;
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                expect(fetchMenuDataHandler).not.toHaveBeenCalled();
            });
            it('Clearing second level merge field value should fire fetchMenuData event', async () => {
                combobox.value = secondLevelMenuData[0];
                combobox.value = null;
                await ticks(1);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
            it('Clearing first level value should not fire fetchMenuData event', async () => {
                combobox.value = '{!var1}';
                combobox.value = null;
                await ticks(1);
                expect(fetchMenuDataHandler).not.toHaveBeenCalled();
            });
            it('FetchMenuData is fired when separator is entered & item hasNext', async () => {
                combobox.value = '{!MyAccount}';
                combobox.separator = '>';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount>}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
            describe('Copy/paste tests for fetchMenuData', () => {
                it('From first level to first level', async () => {
                    combobox.value = comboboxInitialConfig.menuData[2].items[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyNumbe}'));
                    expect(fetchMenuDataHandler).not.toHaveBeenCalled();
                });

                it('From first level straight to second level of an sObject', async () => {
                    combobox.value = comboboxInitialConfig.menuData[2].items[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.Na}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(
                        comboboxInitialConfig.menuData[1].items[0]
                    );
                });

                it('From first level straight to second level (case insensitive)', async () => {
                    combobox.value = comboboxInitialConfig.menuData[2].items[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!myaccount.Na}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(
                        comboboxInitialConfig.menuData[1].items[0]
                    );
                });

                it('From second level of one sObject to second level of same sObject', async () => {
                    combobox.value = secondLevelMenuData[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.Na}'));
                    expect(fetchMenuDataHandler).not.toHaveBeenCalled();
                });

                it('From second level of one sObject to a different sObject', async () => {
                    combobox.value = secondLevelMenuData[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyContact.Descri}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(
                        comboboxInitialConfig.menuData[1].items[1]
                    );
                });

                it('From second level of sObject back to first level', async () => {
                    combobox.value = secondLevelMenuData[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyNumb}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toBeNull();
                });
            });
            it('ItemSelected is fired when a selection is made when the item hasNext=false (tests findItem)', () => {
                combobox.value = '';
                combobox.menuData = secondLevelMenuData;
                groupedCombobox.dispatchEvent(selectEvent(secondLevelMenuData[1].value));
                expect(itemSelectedHandler).toHaveBeenCalledTimes(1);
                expect(itemSelectedHandler.mock.calls[0][0].detail.item).toEqual(secondLevelMenuData[1]);
            });
            it('FilterMatches is not fired when item with hasNext true is selected', () => {
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[1].items[0].value));
                expect(filterMatchesHandler).not.toHaveBeenCalled();
            });
            it('FilterMatches is fired only when item with hasNext false is selected', () => {
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[2].items[0].value));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(
                    removeCurlyBraces(comboboxInitialConfig.menuData[2].items[0].displayText)
                );
            });
            it('ComboboxStateChanged is fired on blur (tests matchTextWithItem)', async () => {
                const initialValue = '{!foobar}';
                let blurValue = '{!Blah}';

                combobox.value = initialValue;
                groupedCombobox.dispatchEvent(textInputEvent(blurValue));
                await ticks();
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks();
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(null);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual(blurValue);

                // This second part tests matchTextWithItem as well
                blurValue = '{!MyAccount}';
                combobox.value = initialValue;
                combobox.menuData = comboboxInitialConfig.menuData;
                groupedCombobox.dispatchEvent(textInputEvent(blurValue));
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(2);
                expect(comboboxStateChangedHandler.mock.calls[1][0].detail.item).toEqual(
                    comboboxInitialConfig.menuData[1].items[0]
                );
                expect(comboboxStateChangedHandler.mock.calls[1][0].detail.displayText).toEqual(blurValue);
            });
            it('ComboboxStateChanged is fired on blur with the correct item even with incorrect case', () => {
                const initialValue = '{!foobar}';
                const blurValue = '{!myaccount}';
                combobox.value = initialValue;
                combobox.menuData = comboboxInitialConfig.menuData;
                groupedCombobox.dispatchEvent(textInputEvent(blurValue));
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(
                    comboboxInitialConfig.menuData[1].items[0]
                );
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual('{!MyAccount}');
            });
            it('ComboboxStateChanged is fired after literalsAllowed property has changed', () => {
                const previousValueForLiteralsAllowed = combobox.literalsAllowed;

                combobox.literalsAllowed = previousValueForLiteralsAllowed;
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(0);

                combobox.literalsAllowed = !previousValueForLiteralsAllowed;
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
            });
            it('ComboboxStateChanged does not have an item if value is empty string (tests matchTextWithItem)', () => {
                combobox.menuData = [
                    {
                        text: 'Empty Display Text Item',
                        subtext: 'Empty Display Text Item',
                        value: 'VAR1',
                        displayText: '',
                        type: 'option-card'
                    }
                ];
                combobox.value = '';
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(null);
            });
            it('ComboboxStateChanged is fired even when value has not changed', () => {
                groupedCombobox.dispatchEvent(blurEvent);
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(2);
            });
            it('NewResource event is fired when New Resource is selected.', () => {
                groupedCombobox.dispatchEvent(selectEvent('%%NewResource%%'));
                expect(selectHandler).toHaveBeenCalledTimes(1);
            });
            it('Shows dropdown with fields after item is selected', async () => {
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[1].items[0].value));
                groupedCombobox.focusAndOpenDropdownIfNotEmpty = jest.fn();

                combobox.menuData = secondLevelMenuData;

                await ticks(1);
                expect(groupedCombobox.focusAndOpenDropdownIfNotEmpty).toHaveBeenCalled();
            });
            describe('Pill', () => {
                it('does not display pill on blur', async () => {
                    combobox.menuData = secondLevelMenuData;
                    groupedCombobox.dispatchEvent(selectEvent(secondLevelMenuData[1].value));
                    await ticks(1);
                    groupedCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(combobox.pill).toBeNull();
                });
            });
        });
        describe('Validation', () => {
            const validationTestData = {
                String: [
                    {
                        value: '{!MyVar1}',
                        isLiteralsAllowed: false,
                        allowedParamTypes: {},
                        error: null
                    },
                    {
                        value: '{!^textVar}',
                        isLiteralsAllowed: false,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    { value: '{! textVar}', error: null },
                    { value: '!@#$test', error: null },
                    { value: '{!}', error: null },
                    { value: '{! }', error: null },
                    {
                        value: '{!9var}',
                        isLiteralsAllowed: false,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    {
                        value: '{!_test_}',
                        isLiteralsAllowed: false,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    { value: '{!_test_}', error: null },
                    { value: '{!MyVar1.}', isLiteralsAllowed: false, error: null }, // no error since last dot is removed before validation
                    {
                        value: '{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}',
                        error: null
                    }
                ],
                Number: [
                    { value: '-.9', error: null },
                    { value: '122', error: null },
                    { value: '876.87', error: null },
                    { value: '.23', error: null },
                    { value: '{!123}', error: VALIDATION_ERROR_MESSAGE.NUMBER },
                    {
                        value: '{!MyVar1}.{!MyVar1}. test',
                        error: VALIDATION_ERROR_MESSAGE.NUMBER
                    },
                    { value: '12.13.45', error: VALIDATION_ERROR_MESSAGE.NUMBER },
                    { value: 'a.b.c', error: VALIDATION_ERROR_MESSAGE.NUMBER }
                ],
                Currency: [
                    { value: '0.8', error: null },
                    { value: '6.', error: null },
                    { value: '-12.9', error: null },
                    { value: '-93.', error: null },
                    { value: '-.', error: VALIDATION_ERROR_MESSAGE.CURRENCY },
                    { value: '$123.87', error: VALIDATION_ERROR_MESSAGE.CURRENCY }
                ],
                SObject: [
                    { value: '{!StartDateVar}', error: null },
                    { value: '{! test}', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    { value: 'literal', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    {
                        value: 'literal',
                        isLiteralsAllowed: true,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    }
                ],
                Apex: [
                    { value: '{!StartDateVar}', error: null },
                    { value: '{! test}', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    { value: 'literal', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    {
                        value: 'literal',
                        isLiteralsAllowed: true,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    }
                ],
                Boolean: [
                    { value: 'true', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    {
                        value: 'true',
                        isLiteralsAllowed: true,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    {
                        value: '{!' + GLOBAL_CONSTANTS.BOOLEAN_TRUE + '}',
                        error: null
                    },
                    { value: '{!MyBooleanVar}', error: null }
                ],
                Picklist: [{ value: 'test picklist value', error: null }],
                Multipicklist: [{ value: 'test multi picklist value', error: null }]
            };

            let testName;
            let comboboxStateChangedHandler;
            const ignoreTZRegex = new RegExp('^.*?GMT');

            beforeEach(() => {
                createCombobox();
                combobox.menuData = comboboxInitialConfig.menuData;
                comboboxStateChangedHandler = jest.fn();
                combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);

                isTextWithMergeFields.mockReturnValue(false);
            });

            Object.keys(validationTestData).forEach(dataType => {
                validationTestData[dataType].forEach(testData => {
                    testName = !testData.isLiteralsAllowed
                        ? `for data type ${dataType} and value ${testData.value}`
                        : `for data type ${dataType} value ${testData.value} and literalsAllowed ${testData.isLiteralsAllowed}`;
                    testName = testData.error ? (testName += ' shows error.') : testName;

                    it(testName, () => {
                        if (typeof testData.isLiteralsAllowed === 'boolean' && testData.isLiteralsAllowed === false) {
                            combobox.literalsAllowed = 'false';
                        } else {
                            combobox.literalsAllowed = 'true';
                        }
                        combobox.type = dataType;

                        groupedCombobox.dispatchEvent(textInputEvent(testData.value));
                        groupedCombobox.dispatchEvent(blurEvent);

                        expect(comboboxStateChangedHandler.mock.calls[0][0].detail.error).toEqual(testData.error);
                        if (testData.expectedValue) {
                            if (dataType !== 'DateTime') {
                                expect(combobox.value).toEqual(testData.expectedValue);
                            } else {
                                expect(ignoreTZRegex.exec(combobox.value)[0]).toEqual(
                                    ignoreTZRegex.exec(testData.expectedValue)[0]
                                );
                            }
                        }
                    });
                });
            });

            it('for required', () => {
                combobox.required = true;
                combobox.displayText = '';
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.error).toEqual(
                    VALIDATION_ERROR_MESSAGE.REQUIRED
                );
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

            it('validateTextWithMergeFields sets the error message for strings with invalid merge fields', async () => {
                isTextWithMergeFields.mockReturnValueOnce(true);
                validateTextWithMergeFields.mockReturnValueOnce([{ message: unknownMergeField }]);
                combobox.type = FLOW_DATA_TYPE.STRING.value;
                combobox.value = 'Hey, my name is {!blah}';
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toEqual(unknownMergeField);
            });

            it('for merge fields that does not exists.', async () => {
                isTextWithMergeFields.mockReturnValueOnce(false);
                validateMergeField.mockReturnValueOnce(
                    Promise.resolve([
                        {
                            message: LABELS.genericErrorMessage
                        }
                    ])
                );
                combobox.type = FLOW_DATA_TYPE.STRING.value;
                combobox.value = '{!vardoesnotexists}';
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toEqual(LABELS.genericErrorMessage);
            });

            it('for merge fields and allowed param types populated.', async () => {
                const comboboxValue = '{!MyVar1}';
                isTextWithMergeFields.mockReturnValueOnce(false);
                validateMergeField.mockReset();
                validateMergeField.mockReturnValueOnce(Promise.resolve([]));
                combobox.type = FLOW_DATA_TYPE.STRING.value;
                combobox.allowedParamTypes = {};
                combobox.value = comboboxValue;
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual(comboboxValue);
                expect(validateMergeField).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toBeNull();
            });

            it('custom fields get treated as merge fields', async () => {
                const message = 'This merge field does not exist.';
                validateMergeField.mockReset();
                validateMergeField.mockReturnValueOnce([{ message }]);
                combobox.value = {
                    displayText: '{!MyAccount.customField__c}',
                    value: '{!MyAccount.customField__c}',
                    parent: {
                        displayText: '{!MyAccount}'
                    }
                };
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(combobox.errorMessage).toBe(message);
            });

            it('dev name with multiple underscores get treated as merge field', async () => {
                combobox.value = {
                    displayText: '{!MyAccount__c}',
                    value: '{!MyAccount__c}'
                };
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(combobox.errorMessage).toBeNull();
            });

            it('merge fields with spaces get treated as merge fields when typing', async () => {
                const filterMatchesHandler = jest.fn();
                combobox.addEventListener(FilterMatchesEvent.EVENT_NAME, filterMatchesHandler);
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[1].items[0].value));
                combobox.menuData = secondLevelMenuData;
                await ticks(2);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.First Na}'));
                await ticks(1);
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.isMergeField).toEqual(true);
            });

            it('for blockValidation true', async () => {
                combobox.blockValidation = true;
                combobox.type = FLOW_DATA_TYPE.BOOLEAN.value;
                combobox.value = 'not a valid value';
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(combobox.errorMessage).toBeNull();
            });
        });
        describe('validation on enable', () => {
            let comboboxStateChangedHandler;
            beforeEach(() => {
                createCombobox({
                    value: 'abcd',
                    literalsAllowed: true,
                    type: FLOW_DATA_TYPE.STRING.value
                });
                comboboxStateChangedHandler = jest.fn();
                combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);
            });
            it('should validate when enabled if literalsAllowed is changed while disabled is true', async () => {
                combobox.disabled = true;
                await ticks(3);
                combobox.literalsAllowed = false;
                await ticks(2);
                expect(combobox.errorMessage).toBeNull();
                combobox.disabled = false;
                await ticks(1);
                expect(combobox.errorMessage).toBeTruthy();

                // gets fired once when literalsAllowed changes, even if no error has been set, and again when disabled = false
                expect(comboboxStateChangedHandler).toBeCalledTimes(2);
            });
            it('should validate when enabled if type is changed while disabled is true', async () => {
                combobox.disabled = true;
                await ticks(3);
                combobox.type = FLOW_DATA_TYPE.NUMBER.value;
                await ticks(2);
                expect(combobox.errorMessage).toBeNull();
                combobox.disabled = false;
                await ticks(1);
                expect(combobox.errorMessage).toBeTruthy();

                // gets fired once when type changes, even if no error has been set, and again when disabled = false
                expect(comboboxStateChangedHandler).toBeCalledTimes(2);
            });
            it('should not fire state changed event when enabled if nothing changes while disabled is false', async () => {
                combobox.disabled = true;
                await ticks(2);
                combobox.disabled = false;
                await ticks(1);
                expect(comboboxStateChangedHandler).toBeCalledTimes(0);
            });
        });
        describe('datetime validation', () => {
            const mockDatetime = '12/31/1999 11:59 pm';
            const mockDate = '12/31/1999';

            beforeEach(() => {
                createCombobox();
            });

            it('calls isValidFormattedDateTime when validating date time', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDatetime);
                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.value = mockDatetime;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledTimes(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledWith(mockDatetime, true);
            });

            it('calls isValidFormattedDateTime when validating date', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDate);
                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.value = mockDate;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledTimes(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledWith(mockDate, false);
            });

            it('calls formatDateTime when given a date literal to validate', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDate);
                isValidFormattedDateTime.mockReturnValueOnce(true);

                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.value = mockDate;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(formatDateTime).toHaveBeenCalledTimes(1);
                expect(formatDateTime).toHaveBeenCalledWith(mockDate, false);
            });

            it('calls formatDateTime when given a date time literal to validate', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDatetime);
                isValidFormattedDateTime.mockReturnValueOnce(true);

                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.value = mockDatetime;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(formatDateTime).toHaveBeenCalledTimes(1);
                expect(formatDateTime).toHaveBeenCalledWith(mockDatetime, true);
            });

            it('sets the error message when given an invalid date or date time', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDatetime);
                isValidFormattedDateTime.mockReturnValueOnce(false);

                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.value = 'bad date time';

                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(formatDateTime).not.toHaveBeenCalled();
                expect(combobox.errorMessage).toEqual(LABELS.dateErrorMessage);
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

            it('uses localized date format when type is date and literals are allowed', async () => {
                getFormat.mockReturnValue(mockDateFormat);
                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.literalsAllowed = true;

                await ticks(1);
                expect(combobox.placeholder).toEqual(mockDateFormat);
                expect(getFormat).toHaveBeenCalledWith(false);
            });

            it('uses localized date time format when type is dateTime and literals are allowed', async () => {
                getFormat.mockReturnValue(mockDatetimeFormat);
                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.literalsAllowed = true;

                await ticks(1);
                expect(combobox.placeholder).toEqual(mockDatetimeFormat);
                expect(getFormat).toHaveBeenCalledWith(true);
            });

            it('does not get the localized date format when literalsAllowed is false', async () => {
                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.literalsAllowed = false;

                await ticks(1);
                expect(getFormat).not.toHaveBeenCalled();
            });

            it('does not get the localized date format when type is neither date or dateTime', async () => {
                combobox.type = FLOW_DATA_TYPE.NUMBER.value;
                combobox.literalsAllowed = true;

                await ticks(1);
                expect(getFormat).not.toHaveBeenCalled();
            });
        });

        /*
         * Generate a 200x3 + 3 grouped menu, render it and then scroll down several times until the end of the menu is reached
         * and the menu is fully present in the dropdown list.
         */
        describe('incremental rendering', () => {
            function generateMenu(length, itemBase = {}) {
                const result = [];
                for (let i = 0; i < length; i++) {
                    const suffix = '_' + i;
                    const item = Object.assign({}, itemBase, {
                        text: '' + (itemBase.text || '') + suffix,
                        displayText: '' + (itemBase.displayText || '') + suffix,
                        value: '' + (itemBase.value || '') + suffix
                    });
                    result.push(item);
                }
                return result;
            }

            function generateGroupedMenu(groupCount, groupSize, groupBase = {}, groupItemBase = {}) {
                const result = [];
                for (let i = 0; i < groupCount; i++) {
                    const suffix = '_' + i;
                    const item = Object.assign({}, groupBase, {
                        value: '' + (groupBase.value || '') + suffix
                    });
                    item.items = generateMenu(
                        groupSize,
                        Object.assign({}, groupItemBase, {
                            value: 'g_' + i + '_' + (groupItemBase.value || '')
                        })
                    );
                    result.push(item);
                }
                return result;
            }

            let longMenu;

            beforeAll(() => {
                longMenu = generateGroupedMenu(3, MENU_DATA_PAGE_SIZE * 4, { value: 'g_' }, { value: 'i' });

                createCombobox({
                    menuData: longMenu,
                    renderIncrementally: true
                });
            });

            it('should render a subset of items initially', async () => {
                expect(combobox.menuData).toEqual(longMenu);
                expect(combobox.renderIncrementally).toEqual(true);
                const groupItem0 = Object.assign({}, longMenu[0]);
                // One page worth of subitems minus the top item (the group header item)
                groupItem0.items = groupItem0.items.slice(0, MENU_DATA_PAGE_SIZE - 1);
                expect(groupedCombobox.items).toEqual([groupItem0]);
            });

            it('should render the next set of items upon scrolling to the end', async () => {
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                const groupItem0 = Object.assign({}, longMenu[0]);
                // Two pages worth of subitems minus the top item
                const itemCount = 2 * MENU_DATA_PAGE_SIZE;
                groupItem0.items = groupItem0.items.slice(0, itemCount - 1);
                expect(combobox.currentMenuData).toEqual([groupItem0]);
            });

            it('should render yet the next set of items upon scrolling to the bottom', async () => {
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                const groupItem0 = Object.assign({}, longMenu[0]);
                // Three pages worth of subitems minus the top item
                const itemCount = 3 * MENU_DATA_PAGE_SIZE;
                groupItem0.items = groupItem0.items.slice(0, itemCount - 1);
                expect(combobox.currentMenuData).toEqual([groupItem0]);
            });

            it('should render yet more sets of items upon scrolling to the bottom', async () => {
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                const groupItem1 = Object.assign({}, longMenu[1]);
                // One page worth of subitems minus the top header items for the first and the second groups
                groupItem1.items = groupItem1.items.slice(0, MENU_DATA_PAGE_SIZE - 2);
                // The first group + a part of the second group
                expect(combobox.currentMenuData).toEqual([longMenu[0], groupItem1]);
            });

            it('should render almost all menu items, having reached the list bottom a few more times', async () => {
                for (let i = 0; i < 7; i++) {
                    groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                }
                await ticks(1);
                const groupItem2 = Object.assign({}, longMenu[2]);
                // Fours pages worth of subitems from the last group minus the top items for the three groups
                const itemCount = 4 * MENU_DATA_PAGE_SIZE;
                groupItem2.items = groupItem2.items.slice(0, itemCount - 3);
                // The first and the second groups + a part of the last group
                expect(combobox.currentMenuData).toEqual([longMenu[0], longMenu[1], groupItem2]);
            });

            it('should render completely all menu items by now', async () => {
                // This should add the remaining three subitems from the last group
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                expect(combobox.currentMenuData).toEqual(longMenu);
            });
        });
        describe('inline resources ', () => {
            it('should set the inline resource when passed in', async () => {
                const comboboxValue = {
                    displayText: 'display text',
                    guid: 123,
                    value: 'test',
                    parent: {
                        displayText: 'parent display txt'
                    }
                };
                combobox.inlineItem = comboboxValue;
                await ticks(1);
                expect(combobox.value).toEqual(comboboxValue);
            });
            it('should fire the comboboxstatechanged event ', async () => {
                const comboboxStateChangedHandler = jest.fn();
                combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);
                combobox.inlineItem = {
                    displayText: 'display text',
                    guid: 123,
                    value: 'test',
                    parent: {
                        displayText: 'parent display txt'
                    }
                };
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalled();
            });
            it('should set the guid to the value if the inline item doesnt have a value ', async () => {
                combobox.inlineItem = {
                    displayText: 'display text',
                    guid: 123,
                    parent: {
                        displayText: 'parent display txt'
                    }
                };
                await ticks(1);
                expect(combobox.value).toEqual({
                    displayText: 'display text',
                    guid: 123,
                    value: 123,
                    parent: {
                        displayText: 'parent display txt'
                    }
                });
            });
            it('should fire a new resource event with the correct position ', async done => {
                const LEFT = 'LEFT';
                const newResourceCallback = jest.fn(event => {
                    expect(event.detail.position).toEqual(LEFT);
                    done();
                });
                combobox.addEventListener('addnewresource', newResourceCallback);
                combobox.position = LEFT;
                groupedCombobox.dispatchEvent(selectEvent('%%NewResource%%'));
                await ticks(1);
                expect(newResourceCallback).toHaveBeenCalled();
            });
        });
    });
    describe('pill supported', () => {
        describe('Property sanity checks', () => {
            beforeAll(() => {
                createCombobox({ isPillSupported: true });
                fillComboboxPropertiesFromConfig();
            });

            it('has groupedCombobox', () => {
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
        describe('Value setter', () => {
            const resetText = 'reset';
            const testValues = [undefined, null, ''];
            let validItem, validItemWithHasNext, validItemWithHasNext2, validItemWithHasNextFalse;

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
                createCombobox({ isPillSupported: true });

                const item = {
                    displayText: 'Should not work!'
                };
                const setValue = () => (combobox.value = item);

                for (let i = 0; i < 3; i++) {
                    combobox.value = resetText;
                    item.value = testValues[i];
                    expect(() => {
                        setValue();
                    }).toThrow('Setting an item on Flow Combobox without a value property!');
                }
            });

            it('Setting value with undefined/null item displayText should result in empty string value', () => {
                createCombobox({ isPillSupported: true });

                const item = {
                    value: 'testValue'
                };
                const expectedItem = {
                    displayText: '',
                    value: 'testValue'
                };
                for (let i = 0; i < 2; i++) {
                    combobox.value = resetText;
                    item.displayText = testValues[i];
                    combobox.value = item;
                    expect(combobox.value).toEqual(expectedItem);
                }
            });

            it('Setting undefined/null value should result in empty string displayText', () => {
                createCombobox({ isPillSupported: true });

                for (let i = 0; i < 2; i++) {
                    combobox.value = resetText;
                    combobox.value = testValues[i];
                    expect(combobox.value).toEqual('');
                }
            });

            describe('Setting value with an item', () => {
                it('then setting value with a string should result in the string', () => {
                    createCombobox({ isPillSupported: true });

                    combobox.value = validItem;
                    combobox.value = 'Should work!';
                    expect(combobox.value).toEqual('Should work!');
                });

                it('then setting value with an item should result in the item', () => {
                    createCombobox({ isPillSupported: true });

                    combobox.value = 'Should get replaced';
                    combobox.value = validItem;
                    expect(combobox.value).toEqual(validItem);
                });

                describe('hasNext = true', () => {
                    it('during initialization should not append a period', async () => {
                        createCombobox({
                            value: validItemWithHasNext,
                            isPillSupported: true
                        });

                        expect(groupedCombobox.inputText).toEqual(validItemWithHasNext.displayText);
                    });
                    it('after user blur should not append a period', async () => {
                        createCombobox({ isPillSupported: true });

                        combobox.value = validItemWithHasNext;

                        await ticks(3);
                        groupedCombobox.dispatchEvent(blurEvent);

                        await ticks(2);
                        combobox.value = validItemWithHasNext2;

                        await ticks(1);
                        expect(groupedCombobox.inputText).toEqual(validItemWithHasNext2.displayText);
                    });
                    it('not matching display text should not append a period', async () => {
                        createCombobox({
                            value: {
                                value: 'validValue',
                                displayText: 'This should work!',
                                hasNext: true
                            },
                            isPillSupported: true
                        });

                        await ticks(2);
                        combobox.value = validItemWithHasNext2;

                        await ticks(1);
                        expect(groupedCombobox.inputText).toEqual(validItemWithHasNext2.displayText);
                    });
                    it('matching display text with period after select should retain period', async () => {
                        const textInputValue = comboboxInitialConfig.menuData[1].items[0].displayText;
                        const textInputValueWithPeriod = textInputValue.substring(0, textInputValue.length - 1) + '.}';

                        createCombobox({
                            menuData: comboboxInitialConfig.menuData,
                            isPillSupported: true
                        });

                        await ticks(3);
                        groupedCombobox.dispatchEvent(textInputEvent(textInputValue));
                        groupedCombobox.dispatchEvent(textInputEvent(textInputValueWithPeriod));

                        await ticks(2);
                        combobox.value = {
                            value: textInputValue,
                            displayText: textInputValue,
                            hasNext: true
                        };

                        await ticks(1);
                        expect(groupedCombobox.inputText).toEqual(textInputValueWithPeriod);
                    });
                });

                it('hasNext = false should not append period', async () => {
                    createCombobox({ isPillSupported: true });

                    combobox.value = validItemWithHasNextFalse;
                    await ticks(1);
                    expect(groupedCombobox.inputText).toEqual(validItemWithHasNextFalse.displayText);
                });
            });
        });
        describe('ErrorMessage setter', () => {
            it('Setting an empty string or null error message should replace the existing one (undefined should not)', () => {
                createCombobox({ isPillSupported: true });
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
        });
        describe('Variant setter/getter', () => {
            it('Setting an invalid variant should result in an error', () => {
                createCombobox({ isPillSupported: true });

                expect(() => {
                    combobox.variant = 'standard-hidden';
                }).toThrow("Variant must either be 'standard' or 'label-hidden'!");
            });
            it('Setting a valid variant', () => {
                createCombobox({ isPillSupported: true });

                combobox.variant = LIGHTNING_INPUT_VARIANTS.STANDARD;
                expect(combobox.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
            });
        });
        describe('Typing Autocomplete Tests', () => {
            beforeEach(() => {
                createCombobox({ isPillSupported: true });
                combobox.value = '{';
            });

            it('Typing {! should append }', async () => {
                groupedCombobox.dispatchEvent(textInputEvent('{!'));
                await ticks(1);
                expect(groupedCombobox.inputText).toEqual('{!}');
            });
            it('textinput event with undefined text does nothing}', async () => {
                groupedCombobox.dispatchEvent(textInputEvent());
                await ticks(1);
                expect(groupedCombobox.inputText).toEqual('{');
            });
        });
        describe('Icon', () => {
            it('Search icon when empty', async () => {
                createCombobox({ isPillSupported: true });

                combobox.value = '';
                await ticks(1);
                expect(groupedCombobox.inputIconName).toEqual('utility:search');
            });
            it('Activity Indicator when fetching and filtering menu data', async () => {
                createCombobox({ isPillSupported: true });

                combobox.value = '{!myAccount}';
                await ticks(3);
                groupedCombobox.dispatchEvent(textInputEvent('{!myAccount.}'));

                await ticks(2);
                expect(groupedCombobox.showActivityIndicator).toEqual(true);
                combobox.menuData = comboboxInitialConfig.menuData;
                await ticks(1);
                expect(groupedCombobox.showActivityIndicator).toEqual(false);
            });
        });
        describe('Events', () => {
            let filterMatchesHandler,
                fetchMenuDataHandler,
                comboboxStateChangedHandler,
                selectHandler,
                itemSelectedHandler;
            beforeEach(() => {
                createCombobox({ isPillSupported: true });

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

                fillComboboxPropertiesFromConfig(combobox);
            });

            it('FilterMatches is fired with entered text', () => {
                const enteredText = 'foobar';
                groupedCombobox.dispatchEvent(textInputEvent(enteredText));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(enteredText);
            });
            it('FilterMatches is fired without curly braces for a merge field', () => {
                const enteredText = '{!foobar}';
                groupedCombobox.dispatchEvent(textInputEvent(enteredText));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(removeCurlyBraces(enteredText));
            });
            it('FilterMatches is fired with only the field portion of entered text for a merge field on the second level', () => {
                combobox.value = secondLevelMenuData[0];
                const filterText = 'foobar';
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.' + filterText + '}'));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(filterText);
            });
            it('FilterMatches is fired with only the field portion of entered text for a merge field on the third level', () => {
                combobox.value = thirdLevelMenuData[0];
                groupedCombobox.dispatchEvent(textInputEvent('{!myAccount.CreatedBy.Name}'));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual('Name');
            });
            it('FilterMatches is fired when combobox first level value is cleared', async () => {
                combobox.value = '{!myVar1}';
                combobox.value = null;
                await ticks(1);
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toBe('');
            });
            it('FetchMenuData is fired when a . is entered & item hasNext', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
            it('Menu data is cleared when FetchMenuData is fired', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                expect(combobox.menuData).toHaveLength(0);
            });
            it('FetchMenuData is fired when a . is deleted manually', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
            it('FetchMenuData is fired when a . is deleted on blur', async () => {
                combobox.value = '{!MyAccount.}';

                await ticks(1);
                groupedCombobox.dispatchEvent(blurEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                expect(combobox.value).toBe('{!MyAccount}');
            });
            it('FetchMenuData is fired when the base is no longer in the displayText', async () => {
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAc}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(2);
            });
            it('FetchMenuData is not fired third level data', async () => {
                combobox.value = '{!MyAccount.name}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.name.}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(0);
            });
            it('FetchMenuData is not fired when enableFieldDrilldown is false', async () => {
                combobox.enableFieldDrilldown = false;
                combobox.value = '{!MyAccount}';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.}'));
                expect(fetchMenuDataHandler).not.toHaveBeenCalled();
            });
            it('Clearing second level merge field value should fire fetchMenuData event', async () => {
                combobox.value = secondLevelMenuData[0];
                combobox.value = null;
                await ticks(1);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
            it('Clearing first level value should not fire fetchMenuData event', async () => {
                combobox.value = '{!var1}';
                combobox.value = null;
                await ticks(1);
                expect(fetchMenuDataHandler).not.toHaveBeenCalled();
            });
            it('FetchMenuData is fired when separator is entered & item hasNext', async () => {
                combobox.value = '{!MyAccount}';
                combobox.separator = '>';
                await ticks(1);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount>}'));
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });

            describe('Copy/paste tests for fetchMenuData', () => {
                it('From first level to first level', async () => {
                    combobox.value = comboboxInitialConfig.menuData[2].items[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyNumbe}'));
                    expect(fetchMenuDataHandler).not.toHaveBeenCalled();
                });

                it('From first level straight to second level of an sObject', async () => {
                    combobox.value = comboboxInitialConfig.menuData[2].items[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.Na}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(
                        comboboxInitialConfig.menuData[1].items[0]
                    );
                });

                it('From first level straight to second level (case insensitive)', async () => {
                    combobox.value = comboboxInitialConfig.menuData[2].items[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!myaccount.Na}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(
                        comboboxInitialConfig.menuData[1].items[0]
                    );
                });

                it('From second level of one sObject to second level of same sObject', async () => {
                    combobox.value = secondLevelMenuData[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.Na}'));
                    expect(fetchMenuDataHandler).not.toHaveBeenCalled();
                });

                it('From second level of one sObject to a different sObject', async () => {
                    combobox.value = secondLevelMenuData[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyContact.Descri}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toEqual(
                        comboboxInitialConfig.menuData[1].items[1]
                    );
                });

                it('From second level of sObject back to first level', async () => {
                    combobox.value = secondLevelMenuData[0];
                    await ticks(1);
                    groupedCombobox.dispatchEvent(textInputEvent('{!MyNumb}'));
                    expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
                    expect(fetchMenuDataHandler.mock.calls[0][0].detail.item).toBeNull();
                });
            });

            it('ItemSelected is fired when a selection is made when the item hasNext=false (tests findItem)', () => {
                combobox.value = '';
                combobox.menuData = secondLevelMenuData;
                groupedCombobox.dispatchEvent(selectEvent(secondLevelMenuData[1].value));
                expect(itemSelectedHandler).toHaveBeenCalledTimes(1);
                expect(itemSelectedHandler.mock.calls[0][0].detail.item).toEqual(secondLevelMenuData[1]);
            });
            it('FilterMatches is not fired when item with hasNext true is selected', () => {
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[1].items[0].value));
                expect(filterMatchesHandler).not.toHaveBeenCalled();
            });
            it('FilterMatches is fired only when item with hasNext false is selected', () => {
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[2].items[0].value));
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.value).toEqual(
                    removeCurlyBraces(comboboxInitialConfig.menuData[2].items[0].displayText)
                );
            });
            it('ComboboxStateChanged is fired on blur (tests matchTextWithItem)', async () => {
                const initialValue = '{!foobar}';
                let blurValue = '{!Blah}';

                combobox.value = initialValue;
                groupedCombobox.dispatchEvent(textInputEvent(blurValue));
                await ticks();
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks();
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(null);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual(blurValue);

                // This second part tests matchTextWithItem as well
                blurValue = '{!MyAccount}';
                combobox.value = initialValue;
                combobox.menuData = comboboxInitialConfig.menuData;
                groupedCombobox.dispatchEvent(textInputEvent(blurValue));
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(2);
                expect(comboboxStateChangedHandler.mock.calls[1][0].detail.item).toEqual(
                    comboboxInitialConfig.menuData[1].items[0]
                );
                expect(comboboxStateChangedHandler.mock.calls[1][0].detail.displayText).toEqual(blurValue);
            });
            it('ComboboxStateChanged is fired on blur with the correct item even with incorrect case', () => {
                const initialValue = '{!foobar}';
                const blurValue = '{!myaccount}';
                combobox.value = initialValue;
                combobox.menuData = comboboxInitialConfig.menuData;
                groupedCombobox.dispatchEvent(textInputEvent(blurValue));
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(
                    comboboxInitialConfig.menuData[1].items[0]
                );
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual('{!MyAccount}');
            });
            it('ComboboxStateChanged is fired after literalsAllowed property has changed', () => {
                const previousValueForLiteralsAllowed = combobox.literalsAllowed;

                combobox.literalsAllowed = previousValueForLiteralsAllowed;
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(0);

                combobox.literalsAllowed = !previousValueForLiteralsAllowed;
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
            });
            it('ComboboxStateChanged does not have an item if value is empty string (tests matchTextWithItem)', () => {
                combobox.menuData = [
                    {
                        text: 'Empty Display Text Item',
                        subtext: 'Empty Display Text Item',
                        value: 'VAR1',
                        displayText: '',
                        type: 'option-card'
                    }
                ];
                combobox.value = '';
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.item).toEqual(null);
            });
            it('ComboboxStateChanged is fired even when value has not changed', () => {
                groupedCombobox.dispatchEvent(blurEvent);
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(2);
            });
            it('NewResource event is fired when New Resource is selected.', () => {
                groupedCombobox.dispatchEvent(selectEvent('%%NewResource%%'));
                expect(selectHandler).toHaveBeenCalledTimes(1);
            });
            it('Shows dropdown with fields after item is selected', async () => {
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[1].items[0].value));
                groupedCombobox.focusAndOpenDropdownIfNotEmpty = jest.fn();

                combobox.menuData = secondLevelMenuData;

                await ticks(1);
                expect(groupedCombobox.focusAndOpenDropdownIfNotEmpty).toHaveBeenCalled();
            });
            describe('pill', () => {
                beforeEach(() => {
                    combobox.isPillSupported = true;
                });
                it('displays pill on blur', async () => {
                    combobox.menuData = secondLevelMenuData;
                    groupedCombobox.dispatchEvent(selectEvent(secondLevelMenuData[1].value));
                    await ticks(1);
                    groupedCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(combobox.pill).not.toBeNull();
                    expect(combobox.pill).toEqual({
                        iconName: 'standard:account',
                        label: 'MyAccount > First Name'
                    });
                    expect(combobox.pillTooltip).toEqual('MyAccount > First Name');
                    expect(combobox.hasPillError).toBe(false);
                });
                it('removes pill on pill click event and back to merge field mode', async () => {
                    combobox.menuData = secondLevelMenuData;
                    const comboboxItem = secondLevelMenuData[1];
                    groupedCombobox.dispatchEvent(selectEvent(comboboxItem.value));
                    await ticks(1);
                    groupedCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(combobox.pill).not.toBeNull();
                    const pill = getComboboxPill(combobox);
                    pill.dispatchEvent(clickEvent());
                    await ticks(1);
                    expect(combobox.pill).toBeNull();
                    expect(combobox.value).toEqual(comboboxItem);
                });
                it('removes pill on pill remove event', async () => {
                    combobox.menuData = secondLevelMenuData;
                    const comboboxItem = secondLevelMenuData[1];
                    groupedCombobox.dispatchEvent(selectEvent(comboboxItem.value));
                    await ticks(1);
                    groupedCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(combobox.pill).not.toBeNull();
                    const pill = getComboboxPill(combobox);
                    pill.dispatchEvent(removeEvent());
                    await ticks(1);
                    expect(combobox.pill).toBeNull();
                    expect(combobox.value).toEqual('');
                    expect(combobox.menuData).toEqual([]);
                    expect(combobox.displayText).not.toBeDefined();
                    expect(combobox.disabled).toBe(false);
                    expect(combobox.errorMessage).toBeNull();
                });
            });
        });
        describe('Validation', () => {
            const validationTestData = {
                String: [
                    {
                        value: '{!MyVar1}',
                        isLiteralsAllowed: false,
                        allowedParamTypes: {},
                        error: null
                    },
                    {
                        value: '{!^textVar}',
                        isLiteralsAllowed: false,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    { value: '{! textVar}', error: null },
                    { value: '!@#$test', error: null },
                    { value: '{!}', error: null },
                    { value: '{! }', error: null },
                    {
                        value: '{!9var}',
                        isLiteralsAllowed: false,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    {
                        value: '{!_test_}',
                        isLiteralsAllowed: false,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    { value: '{!_test_}', error: null },
                    { value: '{!MyVar1.}', isLiteralsAllowed: false, error: null }, // no error since last dot is removed before validation
                    {
                        value: '{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}',
                        error: null
                    }
                ],
                Number: [
                    { value: '-.9', error: null },
                    { value: '122', error: null },
                    { value: '876.87', error: null },
                    { value: '.23', error: null },
                    { value: '{!123}', error: VALIDATION_ERROR_MESSAGE.NUMBER },
                    {
                        value: '{!MyVar1}.{!MyVar1}. test',
                        error: VALIDATION_ERROR_MESSAGE.NUMBER
                    },
                    { value: '12.13.45', error: VALIDATION_ERROR_MESSAGE.NUMBER },
                    { value: 'a.b.c', error: VALIDATION_ERROR_MESSAGE.NUMBER }
                ],
                Currency: [
                    { value: '0.8', error: null },
                    { value: '6.', error: null },
                    { value: '-12.9', error: null },
                    { value: '-93.', error: null },
                    { value: '-.', error: VALIDATION_ERROR_MESSAGE.CURRENCY },
                    { value: '$123.87', error: VALIDATION_ERROR_MESSAGE.CURRENCY }
                ],
                SObject: [
                    { value: '{!StartDateVar}', error: null },
                    { value: '{! test}', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    { value: 'literal', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    {
                        value: 'literal',
                        isLiteralsAllowed: true,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    }
                ],
                Apex: [
                    { value: '{!StartDateVar}', error: null },
                    { value: '{! test}', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    { value: 'literal', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    {
                        value: 'literal',
                        isLiteralsAllowed: true,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    }
                ],
                Boolean: [
                    { value: 'true', error: VALIDATION_ERROR_MESSAGE.GENERIC },
                    {
                        value: 'true',
                        isLiteralsAllowed: true,
                        error: VALIDATION_ERROR_MESSAGE.GENERIC
                    },
                    {
                        value: '{!' + GLOBAL_CONSTANTS.BOOLEAN_TRUE + '}',
                        error: null
                    },
                    { value: '{!MyBooleanVar}', error: null }
                ],
                Picklist: [{ value: 'test picklist value', error: null }],
                Multipicklist: [{ value: 'test multi picklist value', error: null }]
            };

            let testName, comboboxStateChangedHandler;
            const ignoreTZRegex = new RegExp('^.*?GMT');

            beforeEach(() => {
                createCombobox({ isPillSupported: true });
                combobox.menuData = comboboxInitialConfig.menuData;
                comboboxStateChangedHandler = jest.fn();
                combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);

                isTextWithMergeFields.mockReturnValue(false);
            });

            Object.keys(validationTestData).forEach(dataType => {
                validationTestData[dataType].forEach(testData => {
                    testName = !testData.isLiteralsAllowed
                        ? `for data type ${dataType} and value ${testData.value}`
                        : `for data type ${dataType} value ${testData.value} and literalsAllowed ${testData.isLiteralsAllowed}`;
                    testName = testData.error ? (testName += ' shows error.') : testName;

                    it(testName, () => {
                        if (typeof testData.isLiteralsAllowed === 'boolean' && testData.isLiteralsAllowed === false) {
                            combobox.literalsAllowed = 'false';
                        } else {
                            combobox.literalsAllowed = 'true';
                        }
                        combobox.type = dataType;

                        groupedCombobox.dispatchEvent(textInputEvent(testData.value));
                        groupedCombobox.dispatchEvent(blurEvent);

                        expect(comboboxStateChangedHandler.mock.calls[0][0].detail.error).toEqual(testData.error);
                        if (testData.expectedValue) {
                            if (dataType !== 'DateTime') {
                                expect(combobox.value).toEqual(testData.expectedValue);
                            } else {
                                expect(ignoreTZRegex.exec(combobox.value)[0]).toEqual(
                                    ignoreTZRegex.exec(testData.expectedValue)[0]
                                );
                            }
                        }
                    });
                });
            });

            it('for required', () => {
                combobox.required = true;
                combobox.displayText = '';
                groupedCombobox.dispatchEvent(blurEvent);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.error).toEqual(
                    VALIDATION_ERROR_MESSAGE.REQUIRED
                );
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

            it('validateTextWithMergeFields sets the error message for strings with invalid merge fields', async () => {
                isTextWithMergeFields.mockReturnValueOnce(true);
                validateTextWithMergeFields.mockReturnValueOnce([{ message: unknownMergeField }]);
                combobox.type = FLOW_DATA_TYPE.STRING.value;
                combobox.value = 'Hey, my name is {!blah}';
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toEqual(unknownMergeField);
            });

            it('for merge fields that does not exists.', async () => {
                isTextWithMergeFields.mockReturnValueOnce(false);
                validateMergeField.mockReturnValueOnce(
                    Promise.resolve([
                        {
                            message: LABELS.genericErrorMessage
                        }
                    ])
                );
                combobox.type = FLOW_DATA_TYPE.STRING.value;
                combobox.value = '{!vardoesnotexists}';
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toEqual(LABELS.genericErrorMessage);
            });

            it('for merge fields and allowed param types populated.', async () => {
                const comboboxValue = '{!MyVar1}';
                isTextWithMergeFields.mockReturnValueOnce(false);
                validateMergeField.mockReset();
                validateMergeField.mockReturnValueOnce(Promise.resolve([]));
                combobox.type = FLOW_DATA_TYPE.STRING.value;
                combobox.allowedParamTypes = {};
                combobox.value = comboboxValue;
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalledTimes(1);
                expect(comboboxStateChangedHandler.mock.calls[0][0].detail.displayText).toEqual(comboboxValue);
                expect(validateMergeField).toHaveBeenCalledTimes(1);
                expect(combobox.errorMessage).toBeNull();
            });

            it('custom fields get treated as merge fields', async () => {
                const message = 'This merge field does not exist.';
                validateMergeField.mockReset();
                validateMergeField.mockReturnValueOnce([{ message }]);
                combobox.value = {
                    displayText: '{!MyAccount.customField__c}',
                    value: '{!MyAccount.customField__c}',
                    parent: {
                        displayText: '{!MyAccount}'
                    }
                };
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(combobox.errorMessage).toBe(message);
            });

            it('dev name with multiple underscores get treated as merge field', async () => {
                combobox.value = {
                    displayText: '{!MyAccount__c}',
                    value: '{!MyAccount__c}'
                };
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(combobox.errorMessage).toBeNull();
            });

            it('merge fields with spaces get treated as merge fields when typing', async () => {
                const filterMatchesHandler = jest.fn();
                combobox.addEventListener(FilterMatchesEvent.EVENT_NAME, filterMatchesHandler);
                groupedCombobox.dispatchEvent(selectEvent(comboboxInitialConfig.menuData[1].items[0].value));
                combobox.menuData = secondLevelMenuData;
                await ticks(2);
                groupedCombobox.dispatchEvent(textInputEvent('{!MyAccount.First Na}'));
                await ticks(1);
                expect(filterMatchesHandler).toHaveBeenCalledTimes(1);
                expect(filterMatchesHandler.mock.calls[0][0].detail.isMergeField).toEqual(true);
            });

            it('for blockValidation true', async () => {
                combobox.blockValidation = true;
                combobox.type = FLOW_DATA_TYPE.BOOLEAN.value;
                combobox.value = 'not a valid value';
                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(combobox.errorMessage).toBeNull();
            });
        });
        describe('validation on enable', () => {
            let comboboxStateChangedHandler;
            beforeEach(() => {
                createCombobox({
                    value: 'abcd',
                    literalsAllowed: true,
                    type: FLOW_DATA_TYPE.STRING.value,
                    isPillSupported: true
                });
                comboboxStateChangedHandler = jest.fn();
                combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);
            });
            it('should validate when enabled if literalsAllowed is changed while disabled is true', async () => {
                combobox.disabled = true;
                await ticks(3);
                combobox.literalsAllowed = false;
                await ticks(2);
                expect(combobox.errorMessage).toBeNull();
                combobox.disabled = false;
                await ticks(1);
                expect(combobox.errorMessage).toBeTruthy();

                // gets fired once when literalsAllowed changes, even if no error has been set, and again when disabled = false
                expect(comboboxStateChangedHandler).toBeCalledTimes(2);
            });
            it('should validate when enabled if type is changed while disabled is true', async () => {
                combobox.disabled = true;
                await ticks(3);
                combobox.type = FLOW_DATA_TYPE.NUMBER.value;
                await ticks(2);
                expect(combobox.errorMessage).toBeNull();
                combobox.disabled = false;
                await ticks(1);
                expect(combobox.errorMessage).toBeTruthy();

                // gets fired once when type changes, even if no error has been set, and again when disabled = false
                expect(comboboxStateChangedHandler).toBeCalledTimes(2);
            });
            it('should not fire state changed event when enabled if nothing changes while disabled is false', async () => {
                combobox.disabled = true;
                await ticks(2);
                combobox.disabled = false;
                await ticks(1);
                expect(comboboxStateChangedHandler).toBeCalledTimes(0);
            });
        });
        describe('datetime validation', () => {
            const mockDatetime = '12/31/1999 11:59 pm';
            const mockDate = '12/31/1999';

            beforeEach(() => {
                createCombobox({ isPillSupported: true });
            });

            it('calls isValidFormattedDateTime when validating date time', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDatetime);
                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.value = mockDatetime;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledTimes(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledWith(mockDatetime, true);
            });

            it('calls isValidFormattedDateTime when validating date', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDate);
                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.value = mockDate;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledTimes(1);
                expect(isValidFormattedDateTime).toHaveBeenCalledWith(mockDate, false);
            });

            it('calls formatDateTime when given a date literal to validate', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDate);
                isValidFormattedDateTime.mockReturnValueOnce(true);

                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.value = mockDate;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(formatDateTime).toHaveBeenCalledTimes(1);
                expect(formatDateTime).toHaveBeenCalledWith(mockDate, false);
            });

            it('calls formatDateTime when given a date time literal to validate', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDatetime);
                isValidFormattedDateTime.mockReturnValueOnce(true);

                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.value = mockDatetime;
                groupedCombobox.dispatchEvent(blurEvent);

                await ticks(1);
                expect(formatDateTime).toHaveBeenCalledTimes(1);
                expect(formatDateTime).toHaveBeenCalledWith(mockDatetime, true);
            });

            it('sets the error message when given an invalid date or date time', async () => {
                normalizeDateTime.mockReturnValueOnce(mockDatetime);
                isValidFormattedDateTime.mockReturnValueOnce(false);

                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.value = 'bad date time';

                groupedCombobox.dispatchEvent(blurEvent);
                await ticks(1);
                expect(formatDateTime).not.toHaveBeenCalled();
                expect(combobox.errorMessage).toEqual(LABELS.dateErrorMessage);
            });
        });
        describe('placeholder logic', () => {
            const mockDateFormat = 'mm/dd/yyy';
            const mockDatetimeFormat = 'mm/dd/yyyy, hh:mm:ss';

            beforeEach(() => {
                createCombobox({ isPillSupported: true });
            });

            it('uses the default placeholder when no placeholder is given', () => {
                expect(combobox.placeholder).toEqual(LABELS.defaultPlaceholder);
            });

            it('uses localized date format when type is date and literals are allowed', async () => {
                getFormat.mockReturnValue(mockDateFormat);
                combobox.type = FLOW_DATA_TYPE.DATE.value;
                combobox.literalsAllowed = true;

                await ticks(1);
                expect(combobox.placeholder).toEqual(mockDateFormat);
                expect(getFormat).toHaveBeenCalledWith(false);
            });

            it('uses localized date time format when type is dateTime and literals are allowed', async () => {
                getFormat.mockReturnValue(mockDatetimeFormat);
                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.literalsAllowed = true;

                await ticks(1);
                expect(combobox.placeholder).toEqual(mockDatetimeFormat);
                expect(getFormat).toHaveBeenCalledWith(true);
            });

            it('does not get the localized date format when literalsAllowed is false', async () => {
                combobox.type = FLOW_DATA_TYPE.DATE_TIME.value;
                combobox.literalsAllowed = false;

                await ticks(1);
                expect(getFormat).not.toHaveBeenCalled();
            });

            it('does not get the localized date format when type is neither date or dateTime', async () => {
                combobox.type = FLOW_DATA_TYPE.NUMBER.value;
                combobox.literalsAllowed = true;

                await ticks(1);
                expect(getFormat).not.toHaveBeenCalled();
            });
        });

        /*
         * Generate a 200x3 + 3 grouped menu, render it and then scroll down several times until the end of the menu is reached
         * and the menu is fully present in the dropdown list.
         */
        describe('incremental rendering', () => {
            function generateMenu(length, itemBase = {}) {
                const result = [];
                for (let i = 0; i < length; i++) {
                    const suffix = '_' + i;
                    const item = Object.assign({}, itemBase, {
                        text: '' + (itemBase.text || '') + suffix,
                        displayText: '' + (itemBase.displayText || '') + suffix,
                        value: '' + (itemBase.value || '') + suffix
                    });
                    result.push(item);
                }
                return result;
            }
            function generateGroupedMenu(groupCount, groupSize, groupBase = {}, groupItemBase = {}) {
                const result = [];
                for (let i = 0; i < groupCount; i++) {
                    const suffix = '_' + i;
                    const item = Object.assign({}, groupBase, {
                        value: '' + (groupBase.value || '') + suffix
                    });
                    item.items = generateMenu(
                        groupSize,
                        Object.assign({}, groupItemBase, {
                            value: 'g_' + i + '_' + (groupItemBase.value || '')
                        })
                    );
                    result.push(item);
                }
                return result;
            }

            let longMenu;

            beforeAll(() => {
                longMenu = generateGroupedMenu(3, MENU_DATA_PAGE_SIZE * 4, { value: 'g_' }, { value: 'i' });

                createCombobox({
                    menuData: longMenu,
                    renderIncrementally: true,
                    isPillSupported: true
                });
            });

            it('should render a subset of items initially', async () => {
                expect(combobox.menuData).toEqual(longMenu);
                expect(combobox.renderIncrementally).toEqual(true);
                const groupItem0 = Object.assign({}, longMenu[0]);
                // One page worth of subitems minus the top item (the group header item)
                groupItem0.items = groupItem0.items.slice(0, MENU_DATA_PAGE_SIZE - 1);
                expect(groupedCombobox.items).toEqual([groupItem0]);
            });

            it('should render the next set of items upon scrolling to the end', async () => {
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                const groupItem0 = Object.assign({}, longMenu[0]);
                // Two pages worth of subitems minus the top item
                const itemCount = 2 * MENU_DATA_PAGE_SIZE;
                groupItem0.items = groupItem0.items.slice(0, itemCount - 1);
                expect(combobox.currentMenuData).toEqual([groupItem0]);
            });

            it('should render yet the next set of items upon scrolling to the bottom', async () => {
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                const groupItem0 = Object.assign({}, longMenu[0]);
                // Three pages worth of subitems minus the top item
                const itemCount = 3 * MENU_DATA_PAGE_SIZE;
                groupItem0.items = groupItem0.items.slice(0, itemCount - 1);
                expect(combobox.currentMenuData).toEqual([groupItem0]);
            });

            it('should render yet more sets of items upon scrolling to the bottom', async () => {
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                const groupItem1 = Object.assign({}, longMenu[1]);
                // One page worth of subitems minus the top header items for the first and the second groups
                groupItem1.items = groupItem1.items.slice(0, MENU_DATA_PAGE_SIZE - 2);
                // The first group + a part of the second group
                expect(combobox.currentMenuData).toEqual([longMenu[0], groupItem1]);
            });

            it('should render almost all menu items, having reached the list bottom a few more times', async () => {
                for (let i = 0; i < 7; i++) {
                    groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                }
                await ticks(1);
                const groupItem2 = Object.assign({}, longMenu[2]);
                // Fours pages worth of subitems from the last group minus the top items for the three groups
                const itemCount = 4 * MENU_DATA_PAGE_SIZE;
                groupItem2.items = groupItem2.items.slice(0, itemCount - 3);
                // The first and the second groups + a part of the last group
                expect(combobox.currentMenuData).toEqual([longMenu[0], longMenu[1], groupItem2]);
            });

            it('should render completely all menu items by now', async () => {
                // This should add the remaining three subitems from the last group
                groupedCombobox.dispatchEvent(new CustomEvent('endreached'));
                await ticks(1);
                expect(combobox.currentMenuData).toEqual(longMenu);
            });
        });
        describe('inline resources ', () => {
            it('should set the inline resource when passed in', async () => {
                const comboboxValue = {
                    displayText: 'display text',
                    guid: 123,
                    value: 'test',
                    parent: {
                        displayText: 'parent display txt'
                    }
                };
                combobox.isPillSupported = true;
                combobox.inlineItem = comboboxValue;
                await ticks(1);
                expect(combobox.value).toEqual(comboboxValue);
            });
            it('should fire the comboboxstatechanged event ', async () => {
                const comboboxStateChangedHandler = jest.fn();
                combobox.isPillSupported = true;
                combobox.addEventListener(ComboboxStateChangedEvent.EVENT_NAME, comboboxStateChangedHandler);
                combobox.inlineItem = {
                    displayText: 'display text',
                    guid: 123,
                    value: 'test',
                    parent: {
                        displayText: 'parent display txt'
                    }
                };
                await ticks(1);
                expect(comboboxStateChangedHandler).toHaveBeenCalled();
            });
            it('should set the guid to the value if the inline item doesnt have a value ', async () => {
                combobox.isPillSupported = true;
                combobox.inlineItem = {
                    displayText: 'display text',
                    guid: 123,
                    parent: {
                        displayText: 'parent display txt'
                    }
                };
                await ticks(1);
                expect(combobox.value).toEqual({
                    displayText: 'display text',
                    guid: 123,
                    value: 123,
                    parent: {
                        displayText: 'parent display txt'
                    }
                });
            });
            it('should fire a new resource event with the correct position ', async done => {
                const LEFT = 'LEFT';
                const newResourceCallback = jest.fn(event => {
                    expect(event.detail.position).toEqual(LEFT);
                    done();
                });
                combobox.isPillSupported = true;
                combobox.addEventListener('addnewresource', newResourceCallback);
                combobox.position = LEFT;
                groupedCombobox.dispatchEvent(selectEvent('%%NewResource%%'));
                await ticks(1);
                expect(newResourceCallback).toHaveBeenCalled();
            });
        });
    });
});
