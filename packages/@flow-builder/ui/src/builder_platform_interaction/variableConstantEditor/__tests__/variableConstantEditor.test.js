import { createElement } from 'lwc';
import VariableConstantEditor from "../variableConstantEditor";
import * as mockStoreData from "mock/storeData";
import * as selectorsMock from "builder_platform_interaction/selectors";
import { createAction, PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { variableConstantReducer } from "../variableConstantReducer";
import { PropertyEditorWarningEvent, PropertyChangedEvent, ComboboxStateChangedEvent, ValueChangedEvent } from "builder_platform_interaction/events";
import { deepCopy } from "builder_platform_interaction/storeLib";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { getResourceByUniqueIdentifier, getFerovDataTypeForValidId } from "builder_platform_interaction/expressionUtils";
import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { GLOBAL_CONSTANTS } from "builder_platform_interaction/systemLib";
import { fetchFieldsForEntity } from "builder_platform_interaction/sobjectLib";
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import FerovResourcePicker from 'builder_platform_interaction/ferovResourcePicker';

jest.mock('builder_platform_interaction/selectors', () => ({
    readableElementsSelector: jest.fn(data => Object.values(data.elements)),
}));
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    EXTERNAL_ACCESS_CHECKBOX_GROUP: 'lightning-checkbox-group',
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker',
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-constant-editor', {
        is: VariableConstantEditor,
    });
    element.node = props;
    element.node.defaultValueIndex = {value: 'guid', error: null};
    element.node.subtypeIndex = {value: 'guid', error: null};
    document.body.appendChild(element);
    return element;
};

jest.mock('builder_platform_interaction/comboboxCache', () => {
    return {
        addToParentElementCache: jest.fn(),
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    const sobjectLib = require.requireActual('../../sobjectLib/sobjectLib.js');
    const mockSobjectLib = Object.assign({}, sobjectLib);
    mockSobjectLib.fetchFieldsForEntity = jest.fn().mockImplementation(() => Promise.resolve());
    return mockSobjectLib;
});

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = require.requireActual('../../dataMutationLib/dataMutationLib.js');
    return {
        getErrorsFromHydratedElement: jest.fn(),
        getValueFromHydratedItem: actual.getValueFromHydratedItem,
        GUID_SUFFIX: actual.GUID_SUFFIX,
        FEROV_DATA_TYPE_PROPERTY: require.requireActual('../../elementFactory/elementFactory.js').FEROV_DATA_TYPE_PROPERTY,
        pick: actual.pick,
        dehydrate: actual.dehydrate,
        sanitizeGuid: actual.sanitizeGuid,
    };
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: require.requireActual('../../actions/actions.js').PROPERTY_EDITOR_ACTION,
    };
});

// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../variableConstantReducer', () => {
    return {
        variableConstantReducer: jest.fn().mockImplementation(((obj) => Object.assign({}, obj))),
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        getRHSTypes: jest.fn(),
        getDataType: actual.getDataType,
        RULE_OPERATOR: actual.RULE_OPERATOR,
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
        RULE_TYPES: actual.RULE_TYPES,
        getRulesForElementType: jest.fn().mockReturnValue([]),
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = require.requireActual('../../expressionUtils/expressionUtils.js');
    return {
        filterMatches: jest.fn(),
        getResourceByUniqueIdentifier: jest.fn(),
        getFerovDataTypeForValidId: jest.fn(),
        getElementsForMenuData: jest.fn(),
        getEntitiesMenuData: jest.fn().mockReturnValue(['full menu data']),
        RESOURCE_PICKER_MODE: actual.RESOURCE_PICKER_MODE,
        mutateFlowResourceToComboboxShape: actual.mutateFlowResourceToComboboxShape,
        getItemOrDisplayText: actual.getItemOrDisplayText,
        getSecondLevelItems: actual.getSecondLevelItems,
        getFerovInfoAndErrorFromEvent: actual.getFerovInfoAndErrorFromEvent,
        getApexClassMenuData: actual.getApexClassMenuData,
    };
});

const defaultValueItem = {item: {value: 'guid1', displayText: 'var 1'}};
const mockHydratedElementWithErrors = [{key: 'mockKey', errorString: 'mockErrorString'}];

function getComboboxStateChangedEvent() {
    return new CustomEvent('comboboxstatechanged', {
        detail: defaultValueItem,
    });
}

describe('variable-constant-editor', () => {
    selectorsMock.readableElementsSelector.mockReturnValue([mockStoreData.elements[mockStoreData.numberVariableGuid], mockStoreData.elements[mockStoreData.accountSObjectVariableGuid],
        mockStoreData.elements[mockStoreData.stringCollectionVariable1Guid], mockStoreData.elements[mockStoreData.dateVariableGuid]]);

    let stringVariable;
    let numberVariable;
    let dateVariable;
    let stringConstant;
    let sobjectVariable;

    beforeEach(() => {
        stringVariable = deepCopy(mockStoreData.mutatedVariablesAndConstants[mockStoreData.stringVariableGuid]);
        numberVariable = deepCopy(mockStoreData.mutatedVariablesAndConstants[mockStoreData.numberVariableGuid]);
        dateVariable = deepCopy(mockStoreData.mutatedVariablesAndConstants[mockStoreData.dateVariableGuid]);
        stringConstant = deepCopy(mockStoreData.mutatedVariablesAndConstants[mockStoreData.stringConstantGuid]);
        sobjectVariable = deepCopy(mockStoreData.mutatedVariablesAndConstants[mockStoreData.accountSObjectVariableGuid]);
    });

    it('contains a variable element', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            expect(variableEditor.node.elementType).toEqual(mockStoreData.variable);
            expect(variableEditor.getNode()).toEqual(stringVariable);
        });
    });

    it('has label description component', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        const labelDescription = variableEditor.shadowRoot.querySelector(SELECTORS.LABEL_DESCRIPTION);
        expect(labelDescription).toBeDefined();
        expect(labelDescription.description).toEqual(stringVariable.description);
        expect(labelDescription.devName).toEqual(stringVariable.name);
    });

    it('handles the property changed event and updates the property', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            variableEditor.shadowRoot.querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
            expect(variableConstantReducer.mock.calls[0][0]).toEqual(variableEditor.node);
        });
    });

    describe('variable data type picker', () => {
        const dispatchValueChangedEvent = (variableEditor, payload) => {
            const dataTypePicker = variableEditor.shadowRoot.querySelector('builder_platform_interaction-data-type-picker');
            const mockChangeEvent = new ValueChangedEvent(payload);
            dataTypePicker.dispatchEvent(mockChangeEvent);
        };

        it('has a data type picker', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.shadowRoot.querySelector('lightning-combobox');
                expect(dataTypePicker).toBeDefined();
            });
        });

        it('gives flow data type menu items to the data type combobox', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.shadowRoot.querySelector('builder_platform_interaction-data-type-picker').shadowRoot.querySelector('lightning-combobox');
                // should not contain an entry for LIGHTNING_COMPONENT_OUTPUT
                const expectedLength = Object.values(FLOW_DATA_TYPE).length - 1;
                expect(dataTypePicker.options).toHaveLength(expectedLength);
            });
        });

        it('handles change event when data type option is selected', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const eventPayload = { dataType : 'Currency', isCollection:false, scale:3 };
                dispatchValueChangedEvent(variableEditor, eventPayload);
                expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value: eventPayload});
                expect(variableConstantReducer.mock.calls[0][0]).toEqual(variableEditor.node);
            });
        });

        it('clears the default value when switching data type', () => {
            stringVariable.defaultValue.value = 'mock default value';
            const variableEditor = setupComponentUnderTest(stringVariable);
            const oldDataType = 'String';
            const eventPayload = { dataType : 'Currency', isCollection: false, scale: null };
            dispatchValueChangedEvent(variableEditor, eventPayload);
            return Promise.resolve().then(() => {
                expect(createAction.mock.calls[0][1].propertyName).toEqual('defaultValueDataType');
                expect(createAction.mock.calls[0][1].value).toEqual(oldDataType);
                expect(createAction.mock.calls[1][1].propertyName).toEqual('defaultValue');
                expect(createAction.mock.calls[1][1].value).toEqual(null);
                expect(variableConstantReducer.mock.calls[0][1]).toEqual(createAction.mock.calls[0][1]);
            });
        });

        it('clears the default value when switching collection status', () => {
            stringVariable.defaultValue.value = 'mock default value';
            const variableEditor = setupComponentUnderTest(stringVariable);
            const oldDataType = 'String';
            const eventPayload = { dataType : 'String', isCollection: true, scale: null };
            dispatchValueChangedEvent(variableEditor, eventPayload);
            return Promise.resolve().then(() => {
                expect(createAction.mock.calls[0][1].propertyName).toEqual('defaultValueDataType');
                expect(createAction.mock.calls[0][1].value).toEqual(oldDataType);
                expect(createAction.mock.calls[1][1].propertyName).toEqual('defaultValue');
                expect(createAction.mock.calls[1][1].value).toEqual(null);
                expect(variableConstantReducer.mock.calls[0][1]).toEqual(createAction.mock.calls[0][1]);
            });
        });

        it('clears the subtype when switching to data type without subtype', () => {
            const variableEditor = setupComponentUnderTest(sobjectVariable);
            const eventPayload = { dataType : 'String', isCollection: false, scale: null };
            dispatchValueChangedEvent(variableEditor, eventPayload);
            return Promise.resolve().then(() => {
                expect(createAction.mock.calls[0][1].propertyName).toEqual('subtype');
                expect(createAction.mock.calls[0][1].value).toEqual(null);
                expect(variableConstantReducer.mock.calls[0][1]).toEqual(createAction.mock.calls[0][1]);
            });
        });
        it('clears the subtype when switching from sobject type to apex type', () => {
            const variableEditor = setupComponentUnderTest(sobjectVariable);
            const eventPayload = { dataType : 'Apex', isCollection: false, scale: null };
            dispatchValueChangedEvent(variableEditor, eventPayload);
            return Promise.resolve().then(() => {
                expect(createAction.mock.calls[0][1].propertyName).toEqual('subtype');
                expect(createAction.mock.calls[0][1].value).toEqual(null);
                expect(variableConstantReducer.mock.calls[0][1]).toEqual(createAction.mock.calls[0][1]);
            });
        });
    });

    describe('constant data type picker', () => {
        let constantEditor;
        beforeEach(() => {
            constantEditor = setupComponentUnderTest(stringConstant);
        });
        it('has a data type picker', () => {
            return Promise.resolve().then(() => {
                const dataTypePicker = constantEditor.shadowRoot.querySelector('lightning-combobox');
                expect(dataTypePicker).toBeDefined();
            });
        });

        it('gives flow data type menu items to the data type combobox', () => {
            return Promise.resolve().then(() => {
                const dataTypePicker = constantEditor.shadowRoot.querySelector('builder_platform_interaction-data-type-picker').shadowRoot.querySelector('lightning-combobox');
                expect(dataTypePicker.options).toHaveLength(5);
            });
        });

        it('does not allow scale', () => {
            return Promise.resolve().then(() => {
                const dataTypePicker = constantEditor.shadowRoot.querySelector('builder_platform_interaction-data-type-picker');
                expect(dataTypePicker.allowScale).toBe(false);
            });
        });

        it('does not allow collection', () => {
            return Promise.resolve().then(() => {
                const dataTypePicker = constantEditor.shadowRoot.querySelector('builder_platform_interaction-data-type-picker');
                expect(dataTypePicker.allowCollection).toBe(false);
            });
        });
    });

    describe('external access input output', () => {
        const expectedWarningClearEventsData = [{propertyName: 'name', warning: null},
            {propertyName: 'isInput', warning: null},
            {propertyName: 'isOutput', warning: null}];

        it('variable editor has external access checkboxes', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const externalAccessCheckboxGroup = variableEditor.shadowRoot.querySelector(SELECTORS.EXTERNAL_ACCESS_CHECKBOX_GROUP);
                expect(externalAccessCheckboxGroup).toBeDefined();
            });
        });

        it('constant editor does not have external access checkboxes', () => {
            const constantEditor = setupComponentUnderTest(stringConstant);
            return Promise.resolve().then(() => {
                const externalAccessCheckboxGroup = constantEditor.shadowRoot.querySelector(SELECTORS.EXTERNAL_ACCESS_CHECKBOX_GROUP);
                expect(externalAccessCheckboxGroup).toBeNull();
            });
        });

        it('fires warning event on blur when previously selected input output is unselected', () => {
            // TODO: see const warningMessage in variable-constant-editor.js
            const expectedEventData = expectedWarningClearEventsData.slice();
            expectedEventData.push({propertyName: 'isOutput', warning: 'Changing this field may result in runtime errors when this flow is called by another flow.'});
            return testBlurEventForInputOutput({
                isInput: false,
                isOutput: true,
                onChangeEventValue: ['isInput'],
                expectedEventData});
        });

        it('does not fire warning event on blur when previously unselected input output is selected', () => {
            return testBlurEventForInputOutput({
                isInput: false,
                isOutput: false,
                onChangeEventValue: ['isInput', 'isOutput'],
                expectedEventData: expectedWarningClearEventsData});
        });

        it('fires warning event for name change with previously selected input or output', () => {
            // TODO: see const warningMessage in variable-constant-editor.js
            const expectedEventData = expectedWarningClearEventsData.slice();
            expectedEventData.push({propertyName: 'name', warning: 'Changing this field may result in runtime errors when this flow is called by another flow.'});
            return testWarningEventForInputOutput({
                isInput: false,
                isOutput: true,
                name: 'test',
                expectedEventData});
        });

        it('does not fire warning event for name change and previously unselected input output', () => {
            return testWarningEventForInputOutput({
                isInput: false,
                isOutput: false,
                name: stringVariable.name,
                expectedEventData: expectedWarningClearEventsData});
        });

        function testWarningEventForInputOutput(testConfig) {
            const propertyWarningHandler = jest.fn();
            const propertyChangedEvent = new PropertyChangedEvent('name', testConfig.name);
            stringVariable.isInput = testConfig.isInput;
            stringVariable.isOutput = testConfig.isOutput;
            const variableEditor = setupComponentUnderTest(stringVariable);
            variableEditor.addEventListener(PropertyEditorWarningEvent.EVENT_NAME, propertyWarningHandler);
            return Promise.resolve().then(() => {
                const labelDescription = variableEditor.shadowRoot.querySelector('builder_platform_interaction-label-description');
                variableEditor.node.name = testConfig.name;
                labelDescription.dispatchEvent(propertyChangedEvent);
                verifyWarningEvents(testConfig.expectedEventData, propertyWarningHandler);
            });
        }

        function testBlurEventForInputOutput(testConfig) {
            const propertyWarningHandler = jest.fn();
            // previous selection
            stringVariable.isInput = testConfig.isInput;
            stringVariable.isOutput = testConfig.isOutput;
            const variableEditor = setupComponentUnderTest(stringVariable);
            const changeEvent = new CustomEvent('change', {
                detail: {value: testConfig.onChangeEventValue},
            });
            const blurEvent = new CustomEvent('blur');
            variableEditor.addEventListener(PropertyEditorWarningEvent.EVENT_NAME, propertyWarningHandler);
            return Promise.resolve().then(() => {
                // output unselected
                const externalAccessCheckboxGroup = variableEditor.shadowRoot.querySelector(SELECTORS.EXTERNAL_ACCESS_CHECKBOX_GROUP);
                externalAccessCheckboxGroup.dispatchEvent(changeEvent);
                externalAccessCheckboxGroup.dispatchEvent(blurEvent);
                verifyWarningEvents(testConfig.expectedEventData, propertyWarningHandler);
            });
        }

        function verifyWarningEvents(expectedEventData, propertyWarningHandler) {
            expect(propertyWarningHandler).toHaveBeenCalledTimes(expectedEventData.length);
            const maxLength = expectedEventData.length;
            for (let i = 0; i < maxLength; i++) {
                expect(propertyWarningHandler.mock.calls[i][0].detail.propertyName).toBe(expectedEventData[i].propertyName);
                expect(propertyWarningHandler.mock.calls[i][0].detail.warning).toBe(expectedEventData[i].warning);
            }
        }
    });

    describe('default value combobox', () => {
        function testDefaultValueExists(variable) {
            const variableEditor = setupComponentUnderTest(variable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                expect(defaultValueCombobox).toBeDefined();
            });
        }

        it('exists for string data type', () => {
            return testDefaultValueExists(stringVariable);
        });

        it('exists for number data type', () => {
            return testDefaultValueExists(numberVariable);
        });

        it('exists for date data type', () => {
            return testDefaultValueExists(dateVariable);
        });

        it('exists for constant editor as Value', () => {
            return testDefaultValueExists(stringConstant);
        });

        it('should not exist for sobject data type', () => {
            const variableEditor = setupComponentUnderTest(mockStoreData.elements[mockStoreData.accountSObjectVariableGuid]);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                expect(defaultValueCombobox).toBeNull();
            });
        });

        it('should not exist for collection variables', () => {
            const variableEditor = setupComponentUnderTest(mockStoreData.elements[mockStoreData.stringCollectionVariable1Guid]);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                expect(defaultValueCombobox).toBeNull();
            });
        });

        it('calls getRulesForElementType to fetch rules for default value', () => {
            setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                expect(getRulesForElementType).toHaveBeenCalledWith(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.VARIABLE);
            });
        });

        it('passes rules to the default value picker', () => {
            const mockRules = ['foo'];
            getRulesForElementType.mockReturnValueOnce(mockRules);
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                expect(defaultValueCombobox.rules).toEqual(mockRules);
            });
        });

        it('has variable reducer called for defaultValue', () => {
            getResourceByUniqueIdentifier.mockReturnValueOnce({});
            getFerovDataTypeForValidId.mockReturnValueOnce(FEROV_DATA_TYPE.STRING.value);
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                defaultValueCombobox.dispatchEvent(getComboboxStateChangedEvent());
                expect(variableConstantReducer).toHaveBeenCalledTimes(2);
                expect(variableConstantReducer.mock.calls[0][0]).toEqual(variableEditor.node);
                expect(variableConstantReducer.mock.calls[1][0]).toEqual(variableEditor.node);
            });
        });

        it('has ferovDataType set to reference when default value changed from literal to reference', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            const selectedMenuItem = {
                text: '{!someSobjectVar}',
                value: mockStoreData.accountSObjectVariableGuid,
                displayText: '{!someSobjectVar}'
            };
            const expectedUpdatePropPayload = {
                propertyName: 'defaultValueDataType',
                value: 'reference',
                error: null
            };
            getResourceByUniqueIdentifier.mockReturnValueOnce({});
            getFerovDataTypeForValidId.mockReturnValueOnce(FEROV_DATA_TYPE.REFERENCE);
            const valueChangedEvent = new ComboboxStateChangedEvent(selectedMenuItem, null, null);
            const flowCombobox = variableEditor.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
            flowCombobox.dispatchEvent(valueChangedEvent);
            return Promise.resolve().then(() => {
                expect(createAction.mock.calls[0][1]).toEqual(expectedUpdatePropPayload);
            });
        });

        it('should allow global constants', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            const selectedMenuItem = {
                value: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
                displayText: '{!' + GLOBAL_CONSTANTS.BOOLEAN_TRUE + '}',
            };
            const expectedUpdatePropPayload = {
                error: null,
                propertyName: "defaultValueDataType",
                value: FEROV_DATA_TYPE.BOOLEAN,
            };
            getResourceByUniqueIdentifier.mockReturnValueOnce({});

            const valueChangedEvent = new ComboboxStateChangedEvent(selectedMenuItem, null, null);
            return Promise.resolve().then(() => {
                const flowCombobox = variableEditor.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                flowCombobox.dispatchEvent(valueChangedEvent);
                expect(createAction.mock.calls[0][1]).toEqual(expectedUpdatePropPayload);
            });
        });

        it('has field drilldown disabled for constants', () => {
            const constantEditor = setupComponentUnderTest(stringConstant);
            return Promise.resolve().then(() => {
                const defaultValuePicker = constantEditor.shadowRoot.querySelector(FerovResourcePicker.SELECTOR);
                expect(defaultValuePicker.comboboxConfig.enableFieldDrilldown).toEqual(false);
            });
        });

        it('has field drilldown enabled for variables', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValuePicker = variableEditor.shadowRoot.querySelector(FerovResourcePicker.SELECTOR);
                expect(defaultValuePicker.comboboxConfig.enableFieldDrilldown).toEqual(true);
            });
        });
    });

    describe('sobject type picker', () => {
        let accountVariable;
        beforeEach(() => {
            accountVariable = deepCopy(mockStoreData.elements[mockStoreData.accountSObjectVariableGuid]);
        });

        it('contains an entity resource picker for sobject variables', () => {
            const variableEditor = setupComponentUnderTest(accountVariable);
            return Promise.resolve().then(() => {
                const entityResourcePicker = variableEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
                expect(entityResourcePicker).not.toBeNull();
            });
        });

        it('does not exist for non sobject data type', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const entityResourcePicker = variableEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
                expect(entityResourcePicker).toBeNull();
            });
        });

        it('handles flow combobox value changed event', () => {
            const variableEditor = setupComponentUnderTest(accountVariable);
            const entityResourcePicker = variableEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            return Promise.resolve().then(() => {
                expect(createAction.mock.calls[0][1].propertyName).toEqual('subtype');
                expect(variableConstantReducer.mock.calls[0][0]).toEqual(variableEditor.node);
            });
        });
    });

    describe('apex class picker', () => {
        it('should show help icon', () => {
            const apexVariable = deepCopy(mockStoreData.elements[mockStoreData.apexSampleVariableGuid]);
            const variableEditor = setupComponentUnderTest(apexVariable);
            return Promise.resolve().then(() => {
                const entityResourcePicker = variableEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
                expect(entityResourcePicker.comboboxConfig.fieldLevelHelp).not.toBeNull();
            });
        });
    });

    describe('validation', () => {
        it('calls reducer with validate all event', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            const node = variableEditor.node;
            getErrorsFromHydratedElement.mockReturnValueOnce([]);
            variableEditor.validate();
            expect(variableConstantReducer.mock.calls[0][0]).toEqual(node);
            expect(variableConstantReducer.mock.calls[0][1]).toEqual({type: VALIDATE_ALL});
        });

        it('gets the errors after validating', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            getErrorsFromHydratedElement.mockReturnValueOnce(mockHydratedElementWithErrors);
            const result = variableEditor.validate();
            expect(getErrorsFromHydratedElement).toHaveBeenCalledWith(variableEditor.node);
            expect(result).toEqual(mockHydratedElementWithErrors);
        });

        it('does not fetch fields for an sobject if there are errors', () => {
            const accountVariable = deepCopy(mockStoreData.elements[mockStoreData.accountSObjectVariableGuid]);
            const variableEditor = setupComponentUnderTest(accountVariable);
            getErrorsFromHydratedElement.mockReturnValueOnce(mockHydratedElementWithErrors);
            variableEditor.validate();
            expect(fetchFieldsForEntity).not.toHaveBeenCalled();
        });

        it('does not fetch fields for an sobject collection variable', () => {
            const accountVariable = deepCopy(mockStoreData.elements[mockStoreData.accountSObjectVariableGuid]);
            accountVariable.isCollection = true;
            const variableEditor = setupComponentUnderTest(accountVariable);
            getErrorsFromHydratedElement.mockReturnValueOnce([]);
            variableEditor.validate();
            expect(fetchFieldsForEntity).not.toHaveBeenCalled();
        });
    });
});