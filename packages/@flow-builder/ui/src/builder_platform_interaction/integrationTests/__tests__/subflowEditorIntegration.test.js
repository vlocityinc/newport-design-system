import {createElement} from 'lwc';
import SubflowEditor from 'builder_platform_interaction/subflowEditor';
import { resolveRenderCycles} from '../resolveRenderCycles';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { GLOBAL_CONSTANTS } from "builder_platform_interaction/systemLib";
import { setRules, getOutputRules } from 'builder_platform_interaction/ruleLib';
import OutputResourcePicker from 'builder_platform_interaction/outputResourcePicker';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setAuraFetch, resetFetchOnceCache } from 'builder_platform_interaction/serverDataLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from "builder_platform_interaction/storeLib";
import { getElementByDevName } from "builder_platform_interaction/storeUtils";
import { translateFlowToUIModel } from "builder_platform_interaction/translatorLib";
import { reducer } from 'builder_platform_interaction/reducers';
import { flowWithSubflows } from 'mock/flows/flowWithSubflows';
import {
    getLabelDescriptionNameElement, getLabelDescriptionLabelElement,
    focusoutEvent, textInputEvent, blurEvent
    } from '../integrationTestUtils';
import {
    VALIDATION_ERROR_MESSAGES,
    getBaseCalloutElement, getInputParameterItems, getOutputParameterItems, getInputParameterComboboxElement, getOutputParameterComboboxElement,
    getLightningInputToggle, getDeleteButton, getParameterIcon, getWarningIcon, getWarningBadge, toggleChangeEvent,
    verifyOptionalInputParameterWithValue, verifyOptionalInputParameterNoValue, verifyOutputParameter,
    getParameter, findParameterElement, filterParameterElements, getElementGuid,
    } from '../baseCalloutEditorTestUtils';
import { mockSubflowAllTypesVariables, mockSubflows } from 'mock/calloutData';
import { mockAllRules } from "mock/ruleService";

jest.mock('@salesforce/label/FlowBuilderGlobalConstants.globalConstantPrefix', () => ({ default: "$GlobalConstant" }), { virtual: true });
jest.mock('@salesforce/label/FlowBuilderGlobalConstants.globalConstantFalse', () => ({ default: "False" }), { virtual: true });
jest.mock('@salesforce/label/FlowBuilderGlobalConstants.globalConstantEmptyString', () => ({ default: "EmptyString" }), { virtual: true });


const auraFetch = (actionName, shouldExecuteCallback, callback) => {
    if (!shouldExecuteCallback()) {
        return undefined;
    }
    let result;
    switch (actionName) {
    case 'c.getSubflows':
        result = { data : mockSubflows };
        break;
    case 'c.getFlowInputOutputVariables':
        result = { data : mockSubflowAllTypesVariables };
        break;
    default:
        result = { error : 'Unknown actionName'};
    break;
    }
    return callback(result);
};

const createComponentForTest = (node, { isNewMode = false} = {}) => {
    const el = createElement('builder_platform_interaction-subflow-editor', { is: SubflowEditor });
    Object.assign(el, {node, isNewMode});
    document.body.appendChild(el);
    return el;
};

const itSkip = it.skip;

describe('Subflow Editor', () => {
    let store;
    beforeAll(() => {
        setRules(JSON.stringify(mockAllRules));
        setAuraFetch(auraFetch);
        OutputResourcePicker.RULES = getOutputRules();
        store = Store.getStore(reducer);
        const uiFlow = translateFlowToUIModel(flowWithSubflows);
        store.dispatch(updateFlow(uiFlow));
    });
    afterAll(() => {
        store.dispatch({type: 'INIT'});
        setRules();
        setAuraFetch();
        resetFetchOnceCache();
        OutputResourcePicker.RULES = [];
    });
    let subflowNode;
    beforeEach(() => {
        const element = getElementByDevName('Flow_With_All_Types_Variables');
        subflowNode = getElementForPropertyEditor(element);
    });
    describe('name and dev name', () => {
        it('do not change devName if it already exists after the user modifies the name', () => {
            const newLabel = 'new label';
            const subflowElement = createComponentForTest(subflowNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(getBaseCalloutElement(subflowElement));
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(subflowElement.node.label.value).toBe(newLabel);
                    expect(subflowElement.node.name.value).toBe('Flow_With_All_Types_Variables');
                });
            });
        });
        it('modify the dev name', () => {
            const newDevName = 'newName';
            const subflowElement = createComponentForTest(subflowNode);
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(getBaseCalloutElement(subflowElement));
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(subflowElement.node.name.value).toBe(newDevName);
                });
            });
        });
        it('display error if name is cleared', () => {
            const newLabel = '';
            const subflowElement = createComponentForTest(subflowNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(getBaseCalloutElement(subflowElement));
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(subflowElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
            });
        });
        it('display error if devName is cleared', () => {
            const newDevName = '';
            const subflowElement = createComponentForTest(subflowNode);
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(getBaseCalloutElement(subflowElement));
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(subflowElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
            });
        });
    });
    describe('input tab', () => {
        describe('valid cases', () => {
            let subflowElement, inputAssignments;
            beforeEach(() => {
                subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    inputAssignments = getInputParameterItems(subflowElement);
                });
            });
            it('show all input parameters', () => {
                verifyOptionalInputParameterNoValue(inputAssignments[0], 'inputAccountColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[1], 'inputAccountVar');
                verifyOptionalInputParameterNoValue(inputAssignments[2], 'inputBoolColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[3], 'inputBoolVar');
                verifyOptionalInputParameterNoValue(inputAssignments[4], 'inputCurrencyColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[5], 'inputCurrencyVar');
                verifyOptionalInputParameterNoValue(inputAssignments[6], 'inputDateColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[7], 'inputDateTimeColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[8], 'inputDateTimeVar');
                verifyOptionalInputParameterNoValue(inputAssignments[9], 'inputDateVar');
                verifyOptionalInputParameterNoValue(inputAssignments[10], 'inputNumberColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[11], 'inputNumberVar');
                verifyOptionalInputParameterWithValue(inputAssignments[12], 'inputOutputAccountColVar', '{!accountSObjectCollectionVariable}');
                verifyOptionalInputParameterWithValue(inputAssignments[13], 'inputOutputAccountVar', '{!accountSObjectVariable}');
                verifyOptionalInputParameterNoValue(inputAssignments[14], 'inputOutputBoolColVar');
                verifyOptionalInputParameterWithValue(inputAssignments[15], 'inputOutputBoolVar', '{!booleanVariable}');
                verifyOptionalInputParameterNoValue(inputAssignments[16], 'inputOutputCurrencyColVar');
                verifyOptionalInputParameterWithValue(inputAssignments[17], 'inputOutputCurrencyVar', '{!currencyVariable}');
                verifyOptionalInputParameterNoValue(inputAssignments[18], 'inputOutputDateColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[19], 'inputOutputDateTimeColVar');
                verifyOptionalInputParameterWithValue(inputAssignments[20], 'inputOutputDateTimeVar', '{!dateTimeVariable}');
                verifyOptionalInputParameterWithValue(inputAssignments[21], 'inputOutputDateVar', '{!dateVariable}');
                verifyOptionalInputParameterNoValue(inputAssignments[22], 'inputOutputNumberColVar');
                // inputOutputNumberVar is duplicated and will be check in warning cases
                verifyOptionalInputParameterNoValue(inputAssignments[25], 'inputOutputStringColVar');
                verifyOptionalInputParameterWithValue(inputAssignments[26], 'inputOutputStringVar', '{!stringVariable}');
                verifyOptionalInputParameterNoValue(inputAssignments[27], 'inputStringColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[28], 'inputStringVar');
                verifyOptionalInputParameterNoValue(inputAssignments[29], 'latestInputOutputStringColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[30], 'latestInputOutputStringVar');
                verifyOptionalInputParameterNoValue(inputAssignments[31], 'latestInputStringColVar');
                verifyOptionalInputParameterNoValue(inputAssignments[32], 'latestInputStringVar');
                // notAvailableParam is not available item and will be check in warning cases
            });
            it('update value when setting the litteral string to the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('any value'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringVar').value).toEqual({value: 'any value', error: null});
                    });
                });
            });
            it('update value when setting the variable number to the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringVar').value).toEqual({value: getElementGuid('numberVariable'), error: null});
                    });
                });
            });
            it('update value when setting the empty string constant to the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING)));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringVar').value).toEqual({value: GLOBAL_CONSTANTS.EMPTY_STRING, error: null});
                    });
                });
            });
            it('update value when setting the string collection variable to the String Collection Parameter', () => {
                const stringColParameterElement = findParameterElement(inputAssignments, 'inputOutputStringColVar');
                const toggle = getLightningInputToggle(stringColParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    const stringColParameterCombobox = getInputParameterComboboxElement(stringColParameterElement);
                    stringColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable}'));
                    return resolveRenderCycles(() => {
                        stringColParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringColVar').value).toEqual({value: getElementGuid('stringCollectionVariable'), error: null});
                        });
                    });
                });
            });
            it('update value when setting the valid number to the Number Parameter', () => {
                const numberParameterElement = findParameterElement(inputAssignments, 'inputOutputNumberVar');
                const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                numberParameterCombobox.dispatchEvent(textInputEvent('1234'));
                return resolveRenderCycles(() => {
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputNumberVar').value).toEqual({value: '1234', error: null});
                    });
                });
            });
            it('update value when setting the dateTime variabme to the Date Parameter', () => {
                const dateParameterElement = findParameterElement(inputAssignments, 'inputOutputDateVar');
                const dateParameterCombobox = getInputParameterComboboxElement(dateParameterElement);
                dateParameterCombobox.dispatchEvent(textInputEvent('{!dateTimeVariable}'));
                return resolveRenderCycles(() => {
                    dateParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputDateVar').value).toEqual({value: getElementGuid('dateTimeVariable'), error: null});
                    });
                });
            });
            it('update value when setting the global constant to the Boolean Parameter', () => {
                const booleanParameterElement = findParameterElement(inputAssignments, 'inputOutputBoolVar');
                const booleanParameterCombobox = getInputParameterComboboxElement(booleanParameterElement);
                booleanParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE)));
                return resolveRenderCycles(() => {
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputBoolVar').value).toEqual({value: GLOBAL_CONSTANTS.BOOLEAN_FALSE, error: null});
                    });
                });
            });
            it('update value when setting the number to the Currency Parameter', () => {
                const currencyParameterElement = findParameterElement(inputAssignments, 'inputCurrencyVar');
                const currencyParameterCombobox = getInputParameterComboboxElement(currencyParameterElement);
                currencyParameterCombobox.dispatchEvent(textInputEvent('1000'));
                return resolveRenderCycles(() => {
                    currencyParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.inputAssignments, 'inputCurrencyVar').value).toEqual({value: '1000', error: null});
                    });
                });
            });
            it('update value when setting the account variable to the Account Parameter', () => {
                const accountParameterElement = findParameterElement(inputAssignments, 'inputAccountVar');
                const toggle = getLightningInputToggle(accountParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    return resolveRenderCycles(() => {
                        accountParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(getParameter(subflowElement.node.inputAssignments, 'inputAccountVar').value).toEqual({value: getElementGuid('accountSObjectVariable'), error: null});
                        });
                    });
                });
            });
            it('update value when setting the account collection variable to the Account Collection Parameter', () => {
                const accountParameterElement = findParameterElement(inputAssignments, 'inputAccountColVar');
                const toggle = getLightningInputToggle(accountParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectCollectionVariable}'));
                    return resolveRenderCycles(() => {
                        accountParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(getParameter(subflowElement.node.inputAssignments, 'inputAccountColVar').value).toEqual({value: getElementGuid('accountSObjectCollectionVariable'), error: null});
                        });
                    });
                });
            });
            it('show combobox when toggle is active', () => {
                const boolParameterElement = findParameterElement(inputAssignments, 'inputBoolColVar');
                const toggle = getLightningInputToggle(boolParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    verifyOptionalInputParameterWithValue(boolParameterElement, 'inputBoolColVar', '');
                });
            });
            it('hide combobox when toggle is deactive', () => {
                const inputBoolElement = findParameterElement(inputAssignments, 'inputOutputBoolVar');
                const toggle = getLightningInputToggle(inputBoolElement);
                toggle.dispatchEvent(toggleChangeEvent(false));
                return resolveRenderCycles(() => {
                    verifyOptionalInputParameterNoValue(inputBoolElement, 'inputOutputBoolVar');
                });
            });
            it('preserve value when toggle is reactive', () => {
                const accountElement = findParameterElement(inputAssignments, 'inputOutputAccountVar');
                const toggle = getLightningInputToggle(accountElement);
                toggle.dispatchEvent(toggleChangeEvent(false));
                return resolveRenderCycles(() => {
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    return resolveRenderCycles(() => {
                        verifyOptionalInputParameterWithValue(accountElement, 'inputOutputAccountVar', '{!accountSObjectVariable}');
                    });
                });
            });
        });
        describe('error cases', () => {
            let inputAssignments;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    inputAssignments = getInputParameterItems(subflowElement);
                });
            });
            it('show the error if entering the string for the Number Parameter', () => {
                const numberParameterElement = findParameterElement(inputAssignments, 'inputOutputNumberVar');
                const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                numberParameterCombobox.dispatchEvent(textInputEvent('invalidNumber'));
                return resolveRenderCycles(() => {
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(numberParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.NUMBER_ERROR_MESSAGE);
                    });
                });
            });
            it('show the error if entering the string for the Currency Parameter', () => {
                const currencyParameterElement = findParameterElement(inputAssignments, 'inputOutputCurrencyVar');
                const currencyParameterCombobox = getInputParameterComboboxElement(currencyParameterElement);
                currencyParameterCombobox.dispatchEvent(textInputEvent('invalidNumber'));
                return resolveRenderCycles(() => {
                    currencyParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(currencyParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.CURRENCY_ERROR_MESSAGE);
                    });
                });
            });
            it('show the error if entering the string for the Account Parameter', () => {
                const accountParameterElement = findParameterElement(inputAssignments, 'inputOutputAccountVar');
                const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                accountParameterCombobox.dispatchEvent(textInputEvent('any string'));
                return resolveRenderCycles(() => {
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the account variable for the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the collection variable for the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable}'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the account variable for the Account Collection Parameter', () => {
                const accountColParameterElement = findParameterElement(inputAssignments, 'inputOutputAccountColVar');
                const sObjectColParameterCombobox = getInputParameterComboboxElement(accountColParameterElement);
                sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                return resolveRenderCycles(() => {
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the string collection variable for the Account Collection Parameter', () => {
                const accountColParameterElement = findParameterElement(inputAssignments, 'inputOutputAccountColVar');
                const sObjectColParameterCombobox = getInputParameterComboboxElement(accountColParameterElement);
                sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable}'));
                return resolveRenderCycles(() => {
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the empty string constant for the Boolean Parameter', () => {
                const booleanParameterElement = findParameterElement(inputAssignments, 'inputOutputBoolVar');
                const toggle = getLightningInputToggle(booleanParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    const booleanParameterCombobox = getInputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING)));
                    return resolveRenderCycles(() => {
                        booleanParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(booleanParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                        });
                    });
                });
            });
        });
        describe('warning cases', () => {
            describe('duplicated parameters', () => {
                let subflowElement, inputAssignments, numberParameterItems;
                beforeEach(() => {
                    subflowElement = createComponentForTest(subflowNode);
                    return resolveRenderCycles(() => {
                        inputAssignments = getInputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(inputAssignments, 'inputOutputNumberVar');
                    });
                });
                it('show duplicated Number Parameter parameters', () => {
                    expect(numberParameterItems).toHaveLength(2);
                    expect(numberParameterItems[0].item.value.value).toEqual(getElementGuid('numberVariable'));
                    expect(numberParameterItems[1].item.value.value).toEqual(getElementGuid('numberVariable'));
                });
                it('show delete button', () => {
                    numberParameterItems.forEach(item => {
                        const deleteBtn = getDeleteButton(item);
                        expect(deleteBtn.iconName).toEqual('utility:delete');
                    });
                });
                it('delete duplicated parameter and update the row after deleting when clicking the delete button', () => {
                    // delete the second Number Parameter
                    const deleteBtn = getDeleteButton(numberParameterItems[1]);
                    deleteBtn.click();
                    return resolveRenderCycles(() => {
                        inputAssignments = getInputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(inputAssignments, 'inputOutputNumberVar');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOptionalInputParameterWithValue(numberParameterItems[0], 'inputOutputNumberVar', '{!numberVariable}');
                    });
                });
            });
            describe('not available parameters', () => {
                let notAvailableItem;
                beforeEach(() => {
                    const subflowElement = createComponentForTest(subflowNode);
                    return resolveRenderCycles(() => {
                        const inputAssignments = getInputParameterItems(subflowElement);
                        notAvailableItem = findParameterElement(inputAssignments, 'notAvailableParam');
                    });
                });
                it('show delete button', () => {
                    const deleteBtn = getDeleteButton(notAvailableItem);
                    expect(deleteBtn.iconName).toEqual('utility:delete');
                });
                it('do not show data type icon', () => {
                    const icon = getParameterIcon(notAvailableItem);
                    expect(icon).toBeNull();
                });
                it('show warning icon', () => {
                    const statusIcon = getWarningIcon(notAvailableItem);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningNotAvailable"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
                });
                it('show warning badge', () => {
                    const badgeCmp = getWarningBadge(notAvailableItem);
                    expect(badgeCmp).not.toBeNull();
                    expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeWillCauseErrors');
                    expect(badgeCmp.classList).toContain('slds-theme_warning');
                });
            });
        });
        describe('variables in active version but not in latest version', () => {
            // inputOutputStringColVar is in active version but isn't in latest version
            let inputAssignments, stringColElement;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    inputAssignments = getInputParameterItems(subflowElement);
                    stringColElement = findParameterElement(inputAssignments, 'inputOutputStringColVar');
                });
            });
            it('show warning icon', () => {
                const statusIcon = getWarningIcon(stringColElement);
                expect(statusIcon).not.toBeNull();
                expect(statusIcon.type).toBe('warning');
                expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningActiveOnly"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
            });
        });
        describe('variables in latest version but not in active version', () => {
            // latestInputOutputStringColVar is in latest version but isn't in active version
            let inputAssignments, stringColElement;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    inputAssignments = getInputParameterItems(subflowElement);
                    stringColElement = findParameterElement(inputAssignments, 'latestInputOutputStringColVar');
                });
            });
            it('show warning icon', () => {
                const statusIcon = getWarningIcon(stringColElement);
                expect(statusIcon).not.toBeNull();
                expect(statusIcon.type).toBe('warning');
                expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningLatestOnly"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
            });
            it('show warning badge', () => {
                const badgeCmp = getWarningBadge(stringColElement);
                expect(badgeCmp).not.toBeNull();
                expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeDebugOnly');
                expect(badgeCmp.classList).toContain('slds-theme_warning');
            });
        });
        describe('data type changed', () => {
            // inputCurrencyColVar's data type is currency type in active version but is text type in latest version
            let inputAssignments, currencyColElement;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    inputAssignments = getInputParameterItems(subflowElement);
                    currencyColElement = findParameterElement(inputAssignments, 'inputCurrencyColVar');
                });
            });
            it('show warning icon', () => {
                const statusIcon = getWarningIcon(currencyColElement);
                expect(statusIcon).not.toBeNull();
                expect(statusIcon.type).toBe('warning');
                expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningDataTypeChanged"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
            });
        });
    });
    describe('output tab', () => {
        describe('valid cases', () => {
            let subflowElement, outputAssignments;
            beforeEach(() => {
                subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    outputAssignments = getOutputParameterItems(subflowElement);
                });
            });
            it('show all output parameters', () => {
                verifyOutputParameter(outputAssignments[0], 'inputOutputAccountColVar', '{!accountSObjectCollectionVariable}');
                verifyOutputParameter(outputAssignments[1], 'inputOutputAccountVar', '{!accountSObjectVariable}');
                verifyOutputParameter(outputAssignments[2], 'inputOutputBoolColVar');
                verifyOutputParameter(outputAssignments[3], 'inputOutputBoolVar', '{!booleanVariable}');
                verifyOutputParameter(outputAssignments[4], 'inputOutputCurrencyColVar');
                verifyOutputParameter(outputAssignments[5], 'inputOutputCurrencyVar', '{!currencyVariable}');
                verifyOutputParameter(outputAssignments[6], 'inputOutputDateColVar');
                verifyOutputParameter(outputAssignments[7], 'inputOutputDateTimeColVar');
                verifyOutputParameter(outputAssignments[8], 'inputOutputDateTimeVar', '{!dateVariable}');
                verifyOutputParameter(outputAssignments[9], 'inputOutputDateVar', '{!dateVariable}');
                verifyOutputParameter(outputAssignments[10], 'inputOutputNumberColVar');
                // inputOutputNumberVar is duplicated and will be check in warning cases
                verifyOutputParameter(outputAssignments[13], 'inputOutputStringColVar', '{!stringCollectionVariable}');
                verifyOutputParameter(outputAssignments[14], 'inputOutputStringVar', '{!stringVariable}');
                verifyOutputParameter(outputAssignments[15], 'outputAccountColVar');
                verifyOutputParameter(outputAssignments[16], 'outputAccountVar');
                verifyOutputParameter(outputAssignments[17], 'outputBoolColVar');
                verifyOutputParameter(outputAssignments[18], 'outputBoolVar');
                verifyOutputParameter(outputAssignments[19], 'outputCurrencyColVar');
                verifyOutputParameter(outputAssignments[20], 'outputCurrencyVar');
                verifyOutputParameter(outputAssignments[21], 'outputDateColVar');
                verifyOutputParameter(outputAssignments[22], 'outputDateTimeColVar');
                verifyOutputParameter(outputAssignments[23], 'outputDateTimeVar');
                verifyOutputParameter(outputAssignments[24], 'outputDateVar');
                verifyOutputParameter(outputAssignments[25], 'outputNumberColVar');
                verifyOutputParameter(outputAssignments[26], 'outputNumberVar');
                verifyOutputParameter(outputAssignments[27], 'outputStringColVar');
                verifyOutputParameter(outputAssignments[28], 'outputStringVar');
                verifyOutputParameter(outputAssignments[29], 'latestInputOutputStringColVar');
                verifyOutputParameter(outputAssignments[30], 'latestInputOutputStringVar');
                verifyOutputParameter(outputAssignments[31], 'latestOutputStringColVar', '{!stringCollectionVariable}');
                verifyOutputParameter(outputAssignments[32], 'latestOutputStringVar', '{!stringVariable}');
                // notAvailableParam is not available item and will be check in warning cases
            });
            it('update value when setting the string variable to the String Parameter', () => {
                const stringParameterElement = findParameterElement(outputAssignments, 'outputStringVar');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('{!stringVariable}'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.outputAssignments, 'outputStringVar').value).toEqual({value: getElementGuid('stringVariable'), error: null});
                    });
                });
            });
            it('update value when setting the string collection variable to the String Collection Parameter', () => {
                const stringColParameterElement = findParameterElement(outputAssignments, 'outputStringColVar');
                const stringColParameterCombobox = getOutputParameterComboboxElement(stringColParameterElement);
                stringColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable}'));
                return resolveRenderCycles(() => {
                    stringColParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.outputAssignments, 'outputStringColVar').value).toEqual({value: getElementGuid('stringCollectionVariable'), error: null});
                    });
                });
            });
            it('update value when setting the number variable to the Number Parameter', () => {
                const numberParameterElement = findParameterElement(outputAssignments, 'outputNumberVar');
                const numberParameterCombobox = getOutputParameterComboboxElement(numberParameterElement);
                numberParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                return resolveRenderCycles(() => {
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.outputAssignments, 'outputNumberVar').value).toEqual({value: getElementGuid('numberVariable'), error: null});
                    });
                });
            });
            it('update value when setting the number collection variable to the Number Collection Parameter', () => {
                const numberColParameterElement = findParameterElement(outputAssignments, 'outputNumberColVar');
                const numberColParameterCombobox = getOutputParameterComboboxElement(numberColParameterElement);
                numberColParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                return resolveRenderCycles(() => {
                    numberColParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.outputAssignments, 'outputNumberColVar').value).toEqual({value: getElementGuid('numberVariable'), error: null});
                    });
                });
            });
            it('update value when setting the dateTime variable to the Date Parameter', () => {
                const dateParameterElement = findParameterElement(outputAssignments, 'inputOutputDateVar');
                const dateParameterCombobox = getOutputParameterComboboxElement(dateParameterElement);
                dateParameterCombobox.dispatchEvent(textInputEvent('{!dateTimeVariable}'));
                return resolveRenderCycles(() => {
                    dateParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.outputAssignments, 'inputOutputDateVar').value).toEqual({value: getElementGuid('dateTimeVariable'), error: null});
                    });
                });
            });
            it('update value when setting the account variable to the Account Parameter', () => {
                const accountParameterElement = findParameterElement(outputAssignments, 'outputAccountVar');
                const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                return resolveRenderCycles(() => {
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.outputAssignments, 'outputAccountVar').value).toEqual({value: getElementGuid('accountSObjectVariable'), error: null});
                    });
                });
            });
            it('update value when setting the account collection variable to the Account Collection Parameter', () => {
                const accountParameterElement = findParameterElement(outputAssignments, 'outputAccountColVar');
                const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectCollectionVariable}'));
                return resolveRenderCycles(() => {
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(subflowElement.node.outputAssignments, 'outputAccountColVar').value).toEqual({value: getElementGuid('accountSObjectCollectionVariable'), error: null});
                    });
                });
            });
        });
        describe('error cases', () => {
            let outputAssignments;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    outputAssignments = getOutputParameterItems(subflowElement);
                });
            });
            it('show error when setting the litteral string to the String Parameter', () => {
                const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('any value'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            // W-5726771
            itSkip('show error if entering the empty string constant to the String Parameter', () => {
                const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING)));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show error if entering the number variable to the String Parameter', () => {
                const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the string for the Number Parameter', () => {
                const numberParameterElement = findParameterElement(outputAssignments, 'inputOutputNumberVar');
                const numberParameterCombobox = getOutputParameterComboboxElement(numberParameterElement);
                numberParameterCombobox.dispatchEvent(textInputEvent('1234'));
                return resolveRenderCycles(() => {
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(numberParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the string for the Currency Parameter', () => {
                const currencyParameterElement = findParameterElement(outputAssignments, 'inputOutputCurrencyVar');
                const currencyParameterCombobox = getOutputParameterComboboxElement(currencyParameterElement);
                currencyParameterCombobox.dispatchEvent(textInputEvent('1000'));
                return resolveRenderCycles(() => {
                    currencyParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(currencyParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            // W-5726771
            itSkip('show error if entering the global constant to the Boolean Parameter', () => {
                const booleanParameterElement = findParameterElement(outputAssignments, 'inputOutputBoolVar');
                const booleanParameterCombobox = getOutputParameterComboboxElement(booleanParameterElement);
                booleanParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE)));
                return resolveRenderCycles(() => {
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(booleanParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            // W-5726771
            itSkip('show the error if entering the empty string constant for the Boolean Parameter', () => {
                const booleanParameterElement = findParameterElement(outputAssignments, 'inputOutputBoolVar');
                const booleanParameterCombobox = getOutputParameterComboboxElement(booleanParameterElement);
                booleanParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING)));
                return resolveRenderCycles(() => {
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(booleanParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the string for the Account Parameter', () => {
                const accountParameterElement = findParameterElement(outputAssignments, 'inputOutputAccountVar');
                const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                accountParameterCombobox.dispatchEvent(textInputEvent('any string'));
                return resolveRenderCycles(() => {
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the account variable for the String Parameter', () => {
                const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the collection variable for the String Parameter', () => {
                const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable}'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the account variable for the Account Collection Parameter', () => {
                const accountColParameterElement = findParameterElement(outputAssignments, 'inputOutputAccountColVar');
                const sObjectColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                return resolveRenderCycles(() => {
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the string collection variable for the Account Collection Parameter', () => {
                const accountColParameterElement = findParameterElement(outputAssignments, 'inputOutputAccountColVar');
                const sObjectColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable}'));
                return resolveRenderCycles(() => {
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
        });
        describe('warning cases', () => {
            describe('duplicated parameters', () => {
                let subflowElement, outputAssignments, numberParameterItems;
                beforeEach(() => {
                    subflowElement = createComponentForTest(subflowNode);
                    return resolveRenderCycles(() => {
                        outputAssignments = getOutputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(outputAssignments, 'inputOutputNumberVar');
                    });
                });
                it('show duplicated Number Parameter parameters', () => {
                    expect(numberParameterItems).toHaveLength(2);
                    expect(numberParameterItems[0].item.value.value).toEqual(getElementGuid('numberVariable'));
                    expect(numberParameterItems[1].item.value.value).toEqual(getElementGuid('numberVariable'));
                });
                it('show delete button', () => {
                    numberParameterItems.forEach(item => {
                        const deleteBtn = getDeleteButton(item);
                        expect(deleteBtn.iconName).toEqual('utility:delete');
                    });
                });
                it('delete duplicated parameter and update the row after deleting when clicking the delete button', () => {
                    // delete the second Number Parameter
                    const deleteBtn = getDeleteButton(numberParameterItems[1]);
                    deleteBtn.click();
                    return resolveRenderCycles(() => {
                        outputAssignments = getOutputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(outputAssignments, 'inputOutputNumberVar');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOutputParameter(numberParameterItems[0], 'inputOutputNumberVar', '{!numberVariable}');
                    });
                });
            });
            describe('not available parameters', () => {
                let notAvailableItem;
                beforeEach(() => {
                    const subflowElement = createComponentForTest(subflowNode);
                    return resolveRenderCycles(() => {
                        const outputAssignments = getOutputParameterItems(subflowElement);
                        notAvailableItem = findParameterElement(outputAssignments, 'notAvailableParam');
                    });
                });
                it('show delete button', () => {
                    const deleteBtn = getDeleteButton(notAvailableItem);
                    expect(deleteBtn.iconName).toEqual('utility:delete');
                });
                // W-5696987: from 220, it should be fixed
                itSkip('do not show data type icon', () => {
                    const icon = getParameterIcon(notAvailableItem);
                    expect(icon).toBeNull();
                });
                it('show warning icon', () => {
                    const statusIcon = getWarningIcon(notAvailableItem);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningNotAvailable"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
                });
                it('show warning badge', () => {
                    const badgeCmp = getWarningBadge(notAvailableItem);
                    expect(badgeCmp).not.toBeNull();
                    expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeWillCauseErrors');
                    expect(badgeCmp.classList).toContain('slds-theme_warning');
                });
            });
        });
        describe('variables in active version but not in latest version', () => {
            // inputOutputStringColVar is in active version but isn't in latest version
            let outputAssignments, stringColElement;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    outputAssignments = getOutputParameterItems(subflowElement);
                    stringColElement = findParameterElement(outputAssignments, 'inputOutputStringColVar');
                });
            });
            it('show warning icon', () => {
                const statusIcon = getWarningIcon(stringColElement);
                expect(statusIcon).not.toBeNull();
                expect(statusIcon.type).toBe('warning');
                expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningActiveOnly"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
            });
        });
        describe('variables in latest version but not in active version', () => {
            // latestInputOutputStringColVar is in latest version but isn't in active version
            let outputAssignments, stringColElement;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    outputAssignments = getOutputParameterItems(subflowElement);
                    stringColElement = findParameterElement(outputAssignments, 'latestInputOutputStringColVar');
                });
            });
            it('show warning icon', () => {
                const statusIcon = getWarningIcon(stringColElement);
                expect(statusIcon).not.toBeNull();
                expect(statusIcon.type).toBe('warning');
                expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningLatestOnly"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
            });
            it('show warning badge', () => {
                const badgeCmp = getWarningBadge(stringColElement);
                expect(badgeCmp).not.toBeNull();
                expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeDebugOnly');
                expect(badgeCmp.classList).toContain('slds-theme_warning');
            });
        });
        describe('data type changed', () => {
            // inputOutputAccountVar's object type is Account in active version but is Case in latest version
            let outputAssignments, accountElement;
            beforeEach(() => {
                const subflowElement = createComponentForTest(subflowNode);
                return resolveRenderCycles(() => {
                    outputAssignments = getOutputParameterItems(subflowElement);
                    accountElement = findParameterElement(outputAssignments, 'inputOutputAccountVar');
                });
            });
            it('show warning icon', () => {
                const statusIcon = getWarningIcon(accountElement);
                expect(statusIcon).not.toBeNull();
                expect(statusIcon.type).toBe('warning');
                expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderSubflowEditor.warningDataTypeChanged"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
            });
        });
    });
});