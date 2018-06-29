import { createElement } from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
import VariableEditor from '../variable-editor';
import * as mockStoreData from 'mock-store-data';
import * as selectorsMock from 'builder_platform_interaction-selectors';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { variableReducer } from '../variable-reducer';
import { PropertyEditorWarningEvent, PropertyChangedEvent, ComboboxStateChangedEvent, ValueChangedEvent } from 'builder_platform_interaction-events';
import { deepCopy } from 'builder_platform_interaction-store-lib';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    EXTERNAL_ACCESS_CHECKBOX_GROUP: 'lightning-checkbox-group',
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker',
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-editor', {
        is: VariableEditor,
    });
    element.node = props;
    document.body.appendChild(element);
    return element;
};

jest.mock('builder_platform_interaction-data-mutation-lib', () => {
    return {
        getErrorsFromHydratedElement: jest.fn(),
        getValueFromHydratedItem: require.requireActual('builder_platform_interaction-data-mutation-lib').getValueFromHydratedItem,
        GUID_SUFFIX: require.requireActual('builder_platform_interaction-data-mutation-lib').GUID_SUFFIX,
        FEROV_DATA_TYPE_PROPERTY: require.requireActual('builder_platform_interaction-data-mutation-lib').FEROV_DATA_TYPE_PROPERTY
    };
});

jest.mock('builder_platform_interaction-actions', () => {
    return {
        createAction: jest.fn().mockReturnValue({}),
        PROPERTY_EDITOR_ACTION: require.requireActual('builder_platform_interaction-actions').PROPERTY_EDITOR_ACTION,
    };
});

// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../variable-reducer', () => {
    return {
        variableReducer: jest.fn().mockImplementation(((obj) => Object.assign({}, obj))),
    };
});

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        getRHSTypes: jest.fn(),
        getRulesForContext: jest.fn().mockReturnValue([]),
        RULE_OPERATOR: require.requireActual('builder_platform_interaction-rule-lib').RULE_OPERATOR,
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction-rule-lib').PARAM_PROPERTY,
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        filterMatches: jest.fn(),
        getElementsForMenuData: jest.fn(),
        getEntitiesMenuData: jest.fn().mockReturnValue(['full menu data']),
        RESOURCE_PICKER_MODE: require.requireActual('builder_platform_interaction-expression-utils').RESOURCE_PICKER_MODE,
    };
});

const defaultValueItem = {item: {value: 'guid1', displayText: 'var 1'}};

function getComboboxStateChangedEvent() {
    return new CustomEvent('comboboxstatechanged', {
        detail: defaultValueItem,
    });
}

describe('variable-editor', () => {
    selectorsMock.readableElementsSelector.mockReturnValue([mockStoreData.elements[mockStoreData.numberVariableGuid], mockStoreData.elements[mockStoreData.accountSObjectVariableGuid],
        mockStoreData.elements[mockStoreData.stringCollectionVariable1Guid], mockStoreData.elements[mockStoreData.dateVariableGuid]]);

    let stringVariable;
    let numberVariable;
    let dateVariable;

    beforeEach(() => {
        stringVariable = deepCopy(mockStoreData.mutatedVariables[mockStoreData.stringVariableGuid]);
        numberVariable = deepCopy(mockStoreData.mutatedVariables[mockStoreData.numberVariableGuid]);
        dateVariable = deepCopy(mockStoreData.mutatedVariables[mockStoreData.dateVariableGuid]);
    });

    it('contains a variable element', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            expect(variableEditor.node.elementType.value).toEqual(mockStoreData.variable);
            expect(variableEditor.getNode()).toEqual(stringVariable);
        });
    });

    it('has label description component', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        const labelDescription = getShadowRoot(variableEditor).querySelector(SELECTORS.LABEL_DESCRIPTION);
        expect(labelDescription).toBeDefined();
        expect(labelDescription.description).toEqual(stringVariable.description);
        expect(labelDescription.devName).toEqual(stringVariable.name);
    });

    it('handles the property changed event and updates the property', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            getShadowRoot(variableEditor).querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
            expect(variableReducer.mock.calls[0][0]).toEqual(variableEditor.node);
        });
    });

    describe('data type picker', () => {
        it('has a data type picker', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = getShadowRoot(variableEditor).querySelector('lightning-combobox');
                expect(dataTypePicker).toBeDefined();
            });
        });

        it('gives flow data type menu items to the data type combobox', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = getShadowRoot(
                    getShadowRoot(variableEditor).querySelector('builder_platform_interaction-data-type-picker')
                ).querySelector('lightning-combobox');
                expect(dataTypePicker.options).toHaveLength(9);
            });
        });

        it('handles change event when data type option is selected', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = getShadowRoot(variableEditor).querySelector('builder_platform_interaction-data-type-picker');
                const eventPayload = { dataType : 'Currency', isCollection:false, scale:3 };
                const mockChangeEvent = new ValueChangedEvent(eventPayload);
                dataTypePicker.dispatchEvent(mockChangeEvent);
                expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value: eventPayload});
                expect(variableReducer.mock.calls[0][0]).toEqual(variableEditor.node);
            });
        });
    });

    describe('external access input output', () => {
        const expectedWarningClearEventsData = [{propertyName: 'name', warning: null},
            {propertyName: 'isInput', warning: null},
            {propertyName: 'isOutput', warning: null}];

        it('has external access checkboxes', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const externalAccessCheckboxGroup = getShadowRoot(variableEditor).querySelector(SELECTORS.EXTERNAL_ACCESS_CHECKBOX_GROUP);
                expect(externalAccessCheckboxGroup).toBeDefined();
            });
        });

        it('fires warning event on blur when previously selected input output is unselected', () => {
            // TODO: use labels W-4954505
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
            // TODO: use labels W-4954505
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
                const labelDescription = getShadowRoot(variableEditor).querySelector('builder_platform_interaction-label-description');
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
                const externalAccessCheckboxGroup = getShadowRoot(variableEditor).querySelector(SELECTORS.EXTERNAL_ACCESS_CHECKBOX_GROUP);
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
                const defaultValueCombobox = getShadowRoot(variableEditor).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
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

        it('should not exist for sobject data type', () => {
            const variableEditor = setupComponentUnderTest(mockStoreData.elements[mockStoreData.accountSObjectVariableGuid]);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = getShadowRoot(variableEditor).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                expect(defaultValueCombobox).toBeNull();
            });
        });

        it('should not exists for collection variables', () => {
            const variableEditor = setupComponentUnderTest(mockStoreData.elements[mockStoreData.stringCollectionVariable1Guid]);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = getShadowRoot(variableEditor).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                expect(defaultValueCombobox).toBeNull();
            });
        });

        it('has variable reducer called for defaultValue and defaultValueGuid', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = getShadowRoot(variableEditor).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                defaultValueCombobox.dispatchEvent(getComboboxStateChangedEvent());
                expect(variableReducer).toHaveBeenCalledTimes(3);
                expect(variableReducer.mock.calls[0][0]).toEqual(variableEditor.node);
                expect(variableReducer.mock.calls[1][0]).toEqual(variableEditor.node);
                expect(variableReducer.mock.calls[2][0]).toEqual(variableEditor.node);
            });
        });

        it('has ferovDataType set to reference when default value changed from literal to reference', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            const selectedMenuItem = {
                text: '{!var1}',
                value: 'GUID1',
                displayText: '{!var1}'
            };
            const expectedUpdatePropPayload = {
                propertyName: 'ferovDataType',
                value: 'reference',
                error: null
            };
            const valueChangedEvent = new ComboboxStateChangedEvent(selectedMenuItem, null, null);
            return Promise.resolve().then(() => {
                const flowCombobox = getShadowRoot(variableEditor).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
                flowCombobox.dispatchEvent(valueChangedEvent);
                expect(createAction.mock.calls[1][1]).toEqual(expectedUpdatePropPayload);
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
                const entityResourcePicker = getShadowRoot(variableEditor).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
                expect(entityResourcePicker).not.toBeNull();
            });
        });

        it('does not exist for non sobject data type', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const entityResourcePicker = getShadowRoot(variableEditor).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
                expect(entityResourcePicker).toBeNull();
            });
        });

        it('handles flow combobox value changed event', () => {
            const variableEditor = setupComponentUnderTest(accountVariable);
            const entityResourcePicker = getShadowRoot(variableEditor).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            return Promise.resolve().then(() => {
                expect(createAction.mock.calls[0][1].propertyName).toEqual('objectType');
                expect(variableReducer).toHaveBeenCalledWith(variableEditor.node, {});
            });
        });
    });

    describe('validation', () => {
        it('calls reducer with validate all event', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            const node = variableEditor.node;
            variableEditor.validate();
            expect(variableReducer.mock.calls[0][0]).toEqual(node);
            expect(variableReducer.mock.calls[0][1]).toEqual({type: VALIDATE_ALL});
        });

        it('gets the errors after validating', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            const mockHydratedElementWithErrors = {key: 'mockKey', errorString: 'mockErrorString'};
            getErrorsFromHydratedElement.mockReturnValueOnce(mockHydratedElementWithErrors);
            const result = variableEditor.validate();
            expect(getErrorsFromHydratedElement).toHaveBeenCalledWith(variableEditor.node);
            expect(result).toEqual(mockHydratedElementWithErrors);
        });
    });
});