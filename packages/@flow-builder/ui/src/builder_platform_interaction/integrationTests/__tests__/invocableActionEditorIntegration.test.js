import {createElement} from 'lwc';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import { getShadowRoot } from 'lwc-test-utils';
import {
    stringCollectionVariable1DevName,
    stringVariableDevName,
    stringVariableGuid,
    dateVariableGuid,
    accountSObjectCollectionVariableDevName,
    accountSObjectCollectionVariableGuid,
    accountSObjectVariableDevName,
    accountSObjectVariableGuid,
    numberVariableGuid,
    numberVariableDevName,
} from 'mock/storeData';
import { mockAllTypesActionParameters, mockActions } from 'mock/calloutData';
import { resolveRenderCycles} from '../resolveRenderCycles';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { mockRulesFromServiceForAssigment } from "mock/ruleService";
import { GLOBAL_CONSTANTS } from "builder_platform_interaction/systemLib";
import { setRules, getOutputRules } from 'builder_platform_interaction/ruleLib';
import OutputResourcePicker from 'builder_platform_interaction/outputResourcePicker';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { createActionCall } from 'builder_platform_interaction/elementFactory';

jest.mock('builder_platform_interaction/storeLib', () => {
    const mockStoreLib = require('builder_platform_interaction_mocks/storeLib');
    const originalCreateSelector = require.requireActual('builder_platform_interaction/storeLib').createSelector;
    const partialStoreLibMock = Object.assign({}, mockStoreLib);
    partialStoreLibMock.createSelector = originalCreateSelector;
    return partialStoreLibMock;
});

jest.mock('@salesforce/label/FlowBuilderGlobalConstants.globalConstantPrefix', () => ({ default: "$GlobalConstant" }), { virtual: true });
jest.mock('@salesforce/label/FlowBuilderGlobalConstants.globalConstantFalse', () => ({ default: "False" }), { virtual: true });
jest.mock('@salesforce/label/FlowBuilderGlobalConstants.globalConstantEmptyString', () => ({ default: "EmptyString" }), { virtual: true });

const mockActionParametersPromise = Promise.resolve(mockAllTypesActionParameters);
const mockActionsPromise = Promise.resolve(mockActions);

// TODO: it's better to pass mock stub to setAuraFetch
jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
            switch (serverActionType) {
            case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                return mockActionsPromise;
            case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS:
                return mockActionParametersPromise;
            default:
                return Promise.reject();
            }
        }
    };
});

const SELECTORS = {
        BASE_CALLOUT_EDITOR: 'builder_platform_interaction-base-callout-editor',
        BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker',
        COMBOBOX: 'builder_platform_interaction-combobox',
        LIGHTNING_COMBOBOX: 'lightning-grouped-combobox',
        LABEL_DESCRIPTION_COMPONENT: 'builder_platform_interaction-label-description',
        PARAMETER_LIST: 'builder_platform_interaction-parameter-list',
        LIGHTNING_TAB: 'lightning-tab',
        INPUT_TAB: '.tabitem-inputs',
        OUTPUT_TAB: '.tabitem-outputs',
        PARAMETER_ITEM: 'builder_platform_interaction-parameter-item',
        FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker',
        OUTPUT_RESOURCE_PICKER: 'builder_platform_interaction-output-resource-picker',
        HIDDENT_FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker.slds-hide',
        LIGHTNING_TOGGLE: 'lightning-input',
        LIGHTNING_ICON: 'lightning-icon',
        PARAMETER_LABEL: 'label',
        WARNING_ICON: 'builder_platform_interaction-status-icon',
        WARNING_BADGE: 'lightning-badge',
        DELETE_BUTTON: 'lightning-button-icon',
        LABEL: '.label',
        DEV_NAME: '.devName'
};

const getBaseCalloutElement = (actionEditor) => {
    return getShadowRoot(actionEditor).querySelector(SELECTORS.BASE_CALLOUT_EDITOR);
};

const getParameterList = (actionEditor) => {
    return getShadowRoot(getBaseCalloutElement(actionEditor)).querySelector(SELECTORS.PARAMETER_LIST);
};

const getInputParameterItems = (actionEditor) => {
    return getShadowRoot(getParameterList(actionEditor)).querySelector(SELECTORS.INPUT_TAB).querySelectorAll(SELECTORS.PARAMETER_ITEM);
};

const getOutputParameterItems = (actionEditor) => {
    return getShadowRoot(getParameterList(actionEditor)).querySelector(SELECTORS.OUTPUT_TAB).querySelectorAll(SELECTORS.PARAMETER_ITEM);
};

const getFerovResourcePicker = (parameterItem) => {
    return getShadowRoot(parameterItem).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
};

const getInputParameterComboboxElement = (parameterItem) => {
    const ferovResourcePicker = getShadowRoot(parameterItem).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
    const resourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    const combobox = getShadowRoot(resourcePicker).querySelector(SELECTORS.COMBOBOX);
    const lightningGroupCombobox = getShadowRoot(combobox).querySelector(SELECTORS.LIGHTNING_COMBOBOX);
    return lightningGroupCombobox;
};

const getOutputParameterComboboxElement = (parameterItem) => {
    const outputResourcePicker = getShadowRoot(parameterItem).querySelector(SELECTORS.OUTPUT_RESOURCE_PICKER);
    const resourcePicker = getShadowRoot(outputResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    const combobox = getShadowRoot(resourcePicker).querySelector(SELECTORS.COMBOBOX);
    const lightningGroupCombobox = getShadowRoot(combobox).querySelector(SELECTORS.LIGHTNING_COMBOBOX);
    return lightningGroupCombobox;
};

const getLightningInputToggle = (parameterItem) => {
    return getShadowRoot(parameterItem).querySelector(SELECTORS.LIGHTNING_TOGGLE);
};

const getParameterLabel = (parameterItem) => {
    return getShadowRoot(parameterItem).querySelector(SELECTORS.PARAMETER_LABEL);
};

const getParameterIcon = (parameterItem) => {
    return getShadowRoot(parameterItem).querySelector(SELECTORS.LIGHTNING_ICON);
};

const getWarningIcon = (parameterItem) => {
    return getShadowRoot(parameterItem).querySelector(SELECTORS.WARNING_ICON);
};

const getWarningBadge = (parameterItem) => {
    return getShadowRoot(parameterItem).querySelector(SELECTORS.WARNING_BADGE);
};

const getDeleteButton = (parameterItem) => {
    return getShadowRoot(parameterItem).querySelector(SELECTORS.DELETE_BUTTON);
};

const getLabelDescriptionElement = (actionEditor) => {
    return getShadowRoot(getBaseCalloutElement(actionEditor)).querySelector(SELECTORS.LABEL_DESCRIPTION_COMPONENT);
};

const getLabelElement = (actionEditor) => {
    return getShadowRoot(getLabelDescriptionElement(actionEditor)).querySelector(SELECTORS.LABEL);
};

const getNameElement = (actionEditor) => {
    return getShadowRoot(getLabelDescriptionElement(actionEditor)).querySelector(SELECTORS.DEV_NAME);
};

const VALIDATION_ERROR_MESSAGES = {
        GENERIC : 'FlowBuilderCombobox.genericErrorMessage',
        NUMBER_ERROR_MESSAGE: 'FlowBuilderCombobox.numberErrorMessage',
        INVALID_DATA_TYPE: 'FlowBuilderMergeFieldValidation.invalidDataType',
        CANNOT_BE_BLANK: 'FlowBuilderValidation.cannotBeBlank',
};

const focusoutEvent = new FocusEvent('focusout', {
    'bubbles'   : true,
    'cancelable': true,
});

const blurEvent = new FocusEvent('blur', {
    'bubbles'   : true,
    'cancelable': true,
});

const textInputEvent = (textInput) => {
    return new CustomEvent('textinput', {
        'bubbles'   : true,
        'cancelable': true,
        detail: { text: textInput },
    });
};

const toggleChangeEvent = (checked) => {
    return new CustomEvent('change', {
        'bubbles'   : true,
        'cancelable': true,
        detail: { checked },
    });
};

const actionDevName = 'actionIntegrationTest';
const coreActionName = 'chatterPost';
const coreActionType = 'chatterPost';

const actionCallMetaData = {
    actionName: coreActionName,
    actionType: coreActionType,
    inputParameters: [
        {
            name: 'stringParam',
            value: {
                elementReference: stringVariableGuid
            },
            processMetadataValues: [],
        },
        {
            name: 'accountParam',
            value: {
                elementReference: accountSObjectVariableGuid
            },
            processMetadataValues: [],
        },
        {
            name: 'numberParam',
            value: {
                elementReference: numberVariableGuid
            },
            processMetadataValues: [],
        },
        {
            name: 'idParam',
            value: {
                elementReference: stringVariableGuid
            },
            processMetadataValues: [],
        },
    ],
    label: 'Action Integration Test',
    name: actionDevName,
    outputParameters: [
        {
            name: "outputStringParam",
            assignToReference: stringVariableGuid,
            processMetadataValues: [],
        },
        {
            name: "outputNumberParam",
            assignToReference: numberVariableGuid,
            processMetadataValues: [],
        },
    ],
    processMetadataValues: [],
};

const createComponentForTest = (node, { isNewMode = false} = {}) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
    Object.assign(el, {node, isNewMode});
    document.body.appendChild(el);
    return el;
};

const verifyRequiredInputParameter = (parameter, label, value) => {
    const inputComboboxElement = getInputParameterComboboxElement(parameter);
    const toggleInput = getLightningInputToggle(parameter);
    const icon = getParameterIcon(parameter);
    expect(inputComboboxElement.required).toBe(true);
    expect(inputComboboxElement.label).toEqual(label);
    expect(inputComboboxElement.value).toEqual(value);
    expect(toggleInput).toBeNull();
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

const verifyOptionalInputParameterWithValue = (parameter, label, value) => {
    const inputComboboxElement = getInputParameterComboboxElement(parameter);
    const toggleInput = getLightningInputToggle(parameter);
    const icon = getParameterIcon(parameter);
    expect(inputComboboxElement.required).toBe(false);
    expect(inputComboboxElement.label).toEqual(label);
    expect(inputComboboxElement.value).toEqual(value);
    expect(toggleInput.checked).toBe(true);
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

const verifyOptionalInputParameterNoValue = (parameter, label) => {
    const ferovResourcePicker = getFerovResourcePicker(parameter);
    const toggleInput = getLightningInputToggle(parameter);
    const parameterLabel = getParameterLabel(parameter);
    const icon = getParameterIcon(parameter);
    expect(ferovResourcePicker.classList).toContain('slds-hide');
    expect(parameterLabel.textContent).toEqual(label);
    expect(toggleInput.checked).toBe(false);
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

const verifyOutputParameter = (parameter, label, value) => {
    const outputComboboxElement = getOutputParameterComboboxElement(parameter);
    const icon = getParameterIcon(parameter);
    expect(outputComboboxElement.required).toBe(false);
    expect(outputComboboxElement.label).toEqual(label);
    if (value) {
        expect(outputComboboxElement.value).toEqual(value);
    }
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

const getParameter = (parameters, name) => parameters.find(parameter => parameter.name === name);

const findParameterElement = (parameterElements, name) => {
    return Array.from(parameterElements).find(parameter => parameter.item.name === name);
};

const filterParameterElements = (parameterElements, name) => {
    return Array.from(parameterElements).filter(parameter => parameter.item.name === name);
};

const findIndex = (parameters, rowIndex) => {
    return parameters.findIndex(parameter => parameter.rowIndex === rowIndex);
};

const itSkip = it.skip;

describe('Invocable Action Editor', () => {
    beforeAll(() => {
        setRules(JSON.stringify(mockRulesFromServiceForAssigment));
        OutputResourcePicker.RULES = getOutputRules();
    });
    afterAll(() => {
        // reset rules
        setRules();
        OutputResourcePicker.RULES = [];
    });
    let actionNode;
    beforeEach(() => {
        actionNode = getElementForPropertyEditor(createActionCall(actionCallMetaData));
    });
    describe('name and dev name', () => {
        it('do not change devName if it already exists after the user modifies the name', () => {
            const newLabel = 'new label';
            const coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelElement(coreActionElement);
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.label.value).toBe(newLabel);
                    expect(coreActionElement.node.name.value).toBe(actionDevName);
                });
            });
        });
        it('modify the dev name', () => {
            const newDevName = 'newName';
            const coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const devNameInput = getNameElement(coreActionElement);
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.name.value).toBe(newDevName);
                });
            });
        });
        it('display error if name is cleared', () => {
            const newLabel = '';
            const coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelElement(coreActionElement);
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
            });
        });
        it('display error if devName is cleared', () => {
            const newDevName = '';
            const coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const devNameInput = getNameElement(coreActionElement);
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
            });
        });
    });
    describe('input tab', () => {
        describe('valid cases', () => {
            let coreActionElement, inputParameters;
            beforeEach(() => {
                coreActionElement = createComponentForTest(actionNode);
                return resolveRenderCycles(() => {
                    inputParameters = getInputParameterItems(coreActionElement);
                });
            });
            it('show all input parameters', () => {
                // required parameters: Account Parameter and String Parameter
                verifyRequiredInputParameter(inputParameters[0], 'Account Parameter', addCurlyBraces(accountSObjectVariableDevName));
                verifyRequiredInputParameter(inputParameters[1], 'Id Parameter', addCurlyBraces(stringVariableDevName));
                verifyRequiredInputParameter(inputParameters[2], 'String Parameter', addCurlyBraces(stringVariableDevName));
                // optional parameters: Account Collection Parameter (no value), Date Collection Parameter (no value), Date Parameter (no value), Number Collection Parameter (no value), Number Parameter (with value), String Collection Parameter (no value)
                verifyOptionalInputParameterNoValue(inputParameters[3], 'Account Collection Parameter');
                verifyOptionalInputParameterNoValue(inputParameters[4], 'Boolean Collection Parameter');
                verifyOptionalInputParameterNoValue(inputParameters[5], 'Boolean Parameter');
                verifyOptionalInputParameterNoValue(inputParameters[6], 'Date Collection Parameter');
                verifyOptionalInputParameterNoValue(inputParameters[7], 'Date Parameter');
                verifyOptionalInputParameterNoValue(inputParameters[8], 'Number Collection Parameter');
                verifyOptionalInputParameterWithValue(inputParameters[9], 'Number Parameter', addCurlyBraces(numberVariableDevName));
                verifyOptionalInputParameterNoValue(inputParameters[10], 'String Collection Parameter');
            });
            it('update value when setting the litteral string to the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('any value'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.inputParameters, 'stringParam').value).toEqual({value: 'any value', error: null});
                    });
                });
            });
            it('update value when setting the variable number to the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(numberVariableDevName)));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.inputParameters, 'stringParam').value).toEqual({value: numberVariableGuid, error: null});
                    });
                });
            });
            it('update value when setting the empty string constant to the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING)));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.inputParameters, 'stringParam').value).toEqual({value: GLOBAL_CONSTANTS.EMPTY_STRING, error: null});
                    });
                });
            });
            it('update value when setting the valid number to the Number Parameter', () => {
                const numberParameterElement = findParameterElement(inputParameters, 'numberParam');
                const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                numberParameterCombobox.dispatchEvent(textInputEvent('1234'));
                return resolveRenderCycles(() => {
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.inputParameters, 'numberParam').value).toEqual({value: '1234', error: null});
                    });
                });
            });
            it('update value when setting the date variable to the Date Parameter', () => {
                const dateParameterElement = findParameterElement(inputParameters, 'dateParam');
                const toggle = getLightningInputToggle(dateParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    const dateParameterCombobox = getInputParameterComboboxElement(dateParameterElement);
                    dateParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces('dateVar1')));
                    return resolveRenderCycles(() => {
                        dateParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(getParameter(coreActionElement.node.inputParameters, 'dateParam').value).toEqual({value: dateVariableGuid, error: null});
                        });
                    });
                });
            });
            it('update value when setting the global constant to the Boolean Parameter', () => {
                const booleanParameterElement = findParameterElement(inputParameters, 'booleanParam');
                const toggle = getLightningInputToggle(booleanParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    const booleanParameterCombobox = getInputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE)));
                    return resolveRenderCycles(() => {
                        booleanParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(getParameter(coreActionElement.node.inputParameters, 'booleanParam').value).toEqual({value: GLOBAL_CONSTANTS.BOOLEAN_FALSE, error: null});
                        });
                    });
                });
            });
            it('show combobox when toggle is active', () => {
                const accountColParameterElement = findParameterElement(inputParameters, 'accountColParam');
                const toggle = getLightningInputToggle(accountColParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    verifyOptionalInputParameterWithValue(accountColParameterElement, 'Account Collection Parameter', '');
                });
            });
            it('hide combobox when toggle is deactive', () => {
                const numberParamElement = findParameterElement(inputParameters, 'numberParam');
                const toggle = getLightningInputToggle(numberParamElement);
                toggle.dispatchEvent(toggleChangeEvent(false));
                return resolveRenderCycles(() => {
                    verifyOptionalInputParameterNoValue(numberParamElement, 'Number Parameter');
                });
            });
            it('preserve value when toggle is reactive', () => {
                const numberParamElement = findParameterElement(inputParameters, 'numberParam');
                const toggle = getLightningInputToggle(numberParamElement);
                toggle.dispatchEvent(toggleChangeEvent(false));
                return resolveRenderCycles(() => {
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    return resolveRenderCycles(() => {
                        verifyOptionalInputParameterWithValue(numberParamElement, 'Number Parameter', addCurlyBraces(numberVariableDevName));
                    });
                });
            });
        });
        describe('error cases', () => {
            let inputParameters;
            beforeEach(() => {
                const coreActionElement = createComponentForTest(actionNode);
                return resolveRenderCycles(() => {
                    inputParameters = getInputParameterItems(coreActionElement);
                });
            });
            it('show the error if clearing the value of required input parameter', () => {
                const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(''));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                    });
                });
            });
            it('show the error if entering the string for the Number Parameter', () => {
                const numberParameterElement = findParameterElement(inputParameters, 'numberParam');
                const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                numberParameterCombobox.dispatchEvent(textInputEvent('invalidNumber'));
                return resolveRenderCycles(() => {
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(numberParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.NUMBER_ERROR_MESSAGE);
                    });
                });
            });
            it('show the error if entering the string for the Account Parameter', () => {
                const accountParameterElement = findParameterElement(inputParameters, 'accountParam');
                const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                accountParameterCombobox.dispatchEvent(textInputEvent('any string'));
                return resolveRenderCycles(() => {
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the collection variable for the String Parameter', () => {
                const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(stringCollectionVariable1DevName)));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the string collection variable for the Account Collection Parameter', () => {
                const accountColParameterElement = findParameterElement(inputParameters, 'accountColParam');
                const toggle = getLightningInputToggle(accountColParameterElement);
                toggle.dispatchEvent(toggleChangeEvent(true));
                return resolveRenderCycles(() => {
                    const sObjectColParameterCombobox = getInputParameterComboboxElement(accountColParameterElement);
                    sObjectColParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(stringCollectionVariable1DevName)));
                    return resolveRenderCycles(() => {
                        sObjectColParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                        });
                    });
                });
            });
            it('show the error if entering the empty string constant for the Boolean Parameter', () => {
                const booleanParameterElement = findParameterElement(inputParameters, 'booleanParam');
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
                const duplicatedNumberParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'numberParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number',
                };
                let coreActionElement, inputParameters, numberParameterItems;
                beforeEach(() => {
                    if (findIndex(actionNode.inputParameters, duplicatedNumberParam.rowIndex) === -1) {
                        actionNode.inputParameters.push(duplicatedNumberParam);
                    }
                    coreActionElement = createComponentForTest(actionNode);
                    return resolveRenderCycles(() => {
                        inputParameters = getInputParameterItems(coreActionElement);
                        numberParameterItems = filterParameterElements(inputParameters, 'numberParam');
                    });
                });
                afterEach(() => {
                    const index = findIndex(actionNode.inputParameters, duplicatedNumberParam.rowIndex);
                    if (index !== -1) {
                        actionNode.inputParameters.splice(index, 1);
                    }
                });
                it('show duplicated Number Parameter parameters', () => {
                    expect(numberParameterItems).toHaveLength(2);
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
                        inputParameters = getInputParameterItems(coreActionElement);
                        numberParameterItems = filterParameterElements(inputParameters, 'numberParam');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOptionalInputParameterWithValue(numberParameterItems[0], 'Number Parameter', addCurlyBraces(numberVariableDevName));
                    });
                });
            });
            describe('not available parameters', () => {
                const notAvailableParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'notAvailableParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number',
                };
                let notAvailableItem;
                beforeEach(() => {
                    if (findIndex(actionNode.inputParameters, notAvailableParam.rowIndex) === -1) {
                        actionNode.inputParameters.push(notAvailableParam);
                    }
                    const coreActionElement = createComponentForTest(actionNode);
                    return resolveRenderCycles(() => {
                        const inputParameters = getInputParameterItems(coreActionElement);
                        notAvailableItem = findParameterElement(inputParameters, 'notAvailableParam');
                    });
                });
                afterEach(() => {
                    const index = findIndex(actionNode.inputParameters, notAvailableParam.rowIndex);
                    if (index !== -1) {
                        actionNode.inputParameters.splice(index, 1);
                    }
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
                    expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderInvocableActionEditor.warningNotAvailable"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
                });
                it('show warning badge', () => {
                    const badgeCmp = getWarningBadge(notAvailableItem);
                    expect(badgeCmp).not.toBeNull();
                    expect(badgeCmp.label).toEqual('FlowBuilderInvocableActionEditor.badgeWillCauseErrors');
                    expect(badgeCmp.classList).toContain('slds-theme_warning');
                });
            });
        });
    });
    describe('output tab', () => {
        describe('valid cases', () => {
            let coreActionElement, outputParameters;
            beforeEach(() => {
                coreActionElement = createComponentForTest(actionNode);
                return resolveRenderCycles(() => {
                    outputParameters = getOutputParameterItems(coreActionElement);
                });
            });
            it('show all output parameters', () => {
                // output parameters: Output Account Parameter, Output Account Collection Parameter, Output Date Collection Parameter, Output Date Parameter, Output Number Collection Parameter, Output Number Parameter, Output String Collection Parameter, Output String Parameter
                verifyOutputParameter(outputParameters[0], 'Output Account Collection Parameter', null);
                verifyOutputParameter(outputParameters[1], 'Output Account Parameter', null);
                verifyOutputParameter(outputParameters[2], 'Output Date Collection Parameter', null);
                verifyOutputParameter(outputParameters[3], 'Output Date Parameter', null);
                verifyOutputParameter(outputParameters[4], 'Output Number Collection Parameter', null);
                verifyOutputParameter(outputParameters[5], 'Output Number Parameter', addCurlyBraces(numberVariableDevName));
                verifyOutputParameter(outputParameters[6], 'Output String Collection Parameter', null);
                verifyOutputParameter(outputParameters[7], 'Output String Parameter', addCurlyBraces(stringVariableDevName));
            });
            it('update value when setting the string variable to the Output String Parameter', () => {
                const stringParameterElement = findParameterElement(outputParameters, 'outputStringParam');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(stringVariableDevName)));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.outputParameters, 'outputStringParam').value).toEqual({value: stringVariableGuid, error: null});
                    });
                });
            });
            it('update value when setting the number variable to the Output Number Parameter', () => {
                const numberParameterElement = findParameterElement(outputParameters, 'outputNumberParam');
                const numberParameterCombobox = getOutputParameterComboboxElement(numberParameterElement);
                numberParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(numberVariableDevName)));
                return resolveRenderCycles(() => {
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.outputParameters, 'outputNumberParam').value).toEqual({value: numberVariableGuid, error: null});
                    });
                });
            });
            it('update value when setting the account variable to the Output Account Parameter', () => {
                const accountParameterElement = findParameterElement(outputParameters, 'outputAccountParam');
                const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                accountParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(accountSObjectVariableDevName)));
                return resolveRenderCycles(() => {
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.outputParameters, 'outputAccountParam').value).toEqual({value: accountSObjectVariableGuid, error: null});
                    });
                });
            });
            it('update value when setting the account collection variable to the Output Account Collection Parameter', () => {
                const accountColParameterElement = findParameterElement(outputParameters, 'outputAccountColParam');
                const accountColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                accountColParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(accountSObjectCollectionVariableDevName)));
                return resolveRenderCycles(() => {
                    accountColParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(getParameter(coreActionElement.node.outputParameters, 'outputAccountColParam').value).toEqual({value: accountSObjectCollectionVariableGuid, error: null});
                    });
                });
            });
        });
        describe('error cases', () => {
            let outputParameters;
            beforeEach(() => {
                const coreActionElement = createComponentForTest(actionNode);
                return resolveRenderCycles(() => {
                    outputParameters = getOutputParameterItems(coreActionElement);
                });
            });
            it('show the error if entering the litteral string for the Output String Parameter', () => {
                const stringParameterElement = findParameterElement(outputParameters, 'outputStringParam');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent('any string'));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
            });
            it('show the error if entering the string variable for the Output Account Parameter', () => {
                const accountParameterElement = findParameterElement(outputParameters, 'outputAccountParam');
                const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                accountParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(stringVariableDevName)));
                return resolveRenderCycles(() => {
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the collection variable for the Output String Parameter', () => {
                const stringParameterElement = findParameterElement(outputParameters, 'outputStringParam');
                const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                stringParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(stringCollectionVariable1DevName)));
                return resolveRenderCycles(() => {
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                    });
                });
            });
            it('show the error if entering the string collection variable for the Output Account Collection Parameter', () => {
                const accountColParameterElement = findParameterElement(outputParameters, 'outputAccountColParam');
                const sObjectColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                sObjectColParameterCombobox.dispatchEvent(textInputEvent(addCurlyBraces(stringCollectionVariable1DevName)));
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
                const duplicatedNumberParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'outputNumberParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number',
                };
                let coreActionElement, outputParameters, numberParameterItems;
                beforeEach(() => {
                    if (findIndex(actionNode.outputParameters, duplicatedNumberParam.rowIndex) === -1) {
                        actionNode.outputParameters.push(duplicatedNumberParam);
                    }
                    coreActionElement = createComponentForTest(actionNode);
                    return resolveRenderCycles(() => {
                        outputParameters = getOutputParameterItems(coreActionElement);
                        numberParameterItems = filterParameterElements(outputParameters, 'outputNumberParam');
                    });
                });
                afterEach(() => {
                    const index = findIndex(actionNode.outputParameters, duplicatedNumberParam.rowIndex);
                    if (index !== -1) {
                        actionNode.outputParameters.splice(index, 1);
                    }
                });
                it('show duplicated Number Parameter parameters', () => {
                    expect(numberParameterItems).toHaveLength(2);
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
                        outputParameters = getOutputParameterItems(coreActionElement);
                        numberParameterItems = filterParameterElements(outputParameters, 'outputNumberParam');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOutputParameter(numberParameterItems[0], 'Output Number Parameter', addCurlyBraces(numberVariableDevName));
                    });
                });
            });
            describe('not available parameters', () => {
                const notAvailableParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'notAvailableParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number',
                };
                let notAvailableItem;
                beforeEach(() => {
                    if (findIndex(actionNode.inputParameters, notAvailableParam.rowIndex) === -1) {
                        actionNode.outputParameters.push(notAvailableParam);
                    }
                    const coreActionElement = createComponentForTest(actionNode);
                    return resolveRenderCycles(() => {
                        const outputParameters = getOutputParameterItems(coreActionElement);
                        notAvailableItem = findParameterElement(outputParameters, 'notAvailableParam');
                    });
                });
                afterEach(() => {
                    const index = findIndex(actionNode.outputParameters, notAvailableParam.rowIndex);
                    if (index !== -1) {
                        actionNode.outputParameters.splice(index, 1);
                    }
                });
                it('show delete button', () => {
                    const deleteBtn = getDeleteButton(notAvailableItem);
                    expect(deleteBtn.iconName).toEqual('utility:delete');
                });
                // W-5696987: from 220, it should be fixed
                itSkip('do not show data type icon', () => {
                    const parameterIcon = getParameterIcon(notAvailableItem);
                    expect(parameterIcon).toBeNull();
                });
                it('show warning icon', () => {
                    const statusIcon = getWarningIcon(notAvailableItem);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([{guid : expect.any(String), "messages": [{"guid": expect.any(String), "message": "FlowBuilderInvocableActionEditor.warningNotAvailable"}], "sectionInfo": "FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo", "title": "FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle" }]);
                });
                it('show warning badge', () => {
                    const badgeCmp = getWarningBadge(notAvailableItem);
                    expect(badgeCmp).not.toBeNull();
                    expect(badgeCmp.label).toEqual('FlowBuilderInvocableActionEditor.badgeWillCauseErrors');
                    expect(badgeCmp.classList).toContain('slds-theme_warning');
                });
            });
        });
    });
});