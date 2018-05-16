import { createElement } from 'engine';
import VariableEditor from '../variable-editor';
import * as mockStoreData from 'mock-store-data';
import * as selectorsMock from 'builder_platform_interaction-selectors';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { variableReducer } from '../variable-reducer';
import { PropertyEditorWarningEvent, PropertyChangedEvent } from 'builder_platform_interaction-events';
import { getRHSTypes } from 'builder_platform_interaction-rule-lib';
import { filterMatches } from 'builder_platform_interaction-expression-utils';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    EXTERNAL_ACCESS_CHECKBOX_GROUP: 'lightning-checkbox-group',
    DEFAULT_VALUE_COMBOBOX: '.default-value builder_platform_interaction-combobox',
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-editor', {
        is: VariableEditor,
    });
    element.node = props;
    document.body.appendChild(element);
    return element;
};

jest.mock('builder_platform_interaction-actions', () => {
    return {
        createAction: jest.fn().mockReturnValue({}),
        PROPERTY_EDITOR_ACTION: require.requireActual('builder_platform_interaction-actions').PROPERTY_EDITOR_ACTION,
    };
});

// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../variable-reducer', () => {
    return {
        variableReducer: jest.fn().mockImplementation(obj => Object.assign({}, obj)),
    };
});

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        getRHSTypes: jest.fn(),
        getRulesForContext: jest.fn().mockReturnValue([]),
        RULE_OPERATOR: require.requireActual('builder_platform_interaction-rule-lib').RULE_OPERATOR,
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        filterMatches: jest.fn(),
        getElementsForMenuData: jest.fn(),
    };
});

function getComboboxValueChangedEvent() {
    const valueChangedEvent = new CustomEvent('valuechanged', {
        detail: {value: 'var1'},
    });
    return valueChangedEvent;
}

describe('variable-editor', () => {
    selectorsMock.readableElementsSelector.mockReturnValue([mockStoreData.elements[mockStoreData.numberVariableGuid], mockStoreData.elements[mockStoreData.accountSObjectVariableGuid],
        mockStoreData.elements[mockStoreData.stringCollectionVariable1Guid], mockStoreData.elements[mockStoreData.dateVariableGuid]]);

    const stringVariable = mockStoreData.hydratedElements[mockStoreData.stringVariableGuid];
    it('contains a variable element', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            expect(variableEditor.node.elementType.value).toEqual(mockStoreData.variable);
            expect(variableEditor.getNode()).toEqual(stringVariable);
        });
    });

    it('has label description component', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        const labelDescription = variableEditor.querySelector(SELECTORS.LABEL_DESCRIPTION);
        expect(labelDescription).toBeDefined();
        expect(labelDescription.description).toEqual(stringVariable.description);
        expect(labelDescription.devName).toEqual(stringVariable.name);
    });

    it('handles the property changed event and updates the property', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            variableEditor.querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
            expect(variableReducer.mock.calls[0][0]).toEqual(variableEditor.node);
        });
    });

    describe('data type picker', () => {
        it('has a data type picker', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.querySelector('lightning-combobox');
                expect(dataTypePicker).toBeDefined();
            });
        });

        it('gives flow data type menu items to the data type combobox', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.querySelector('lightning-combobox');
                expect(dataTypePicker.options).toHaveLength(9);
            });
        });

        it('handles change event when data type option is selected', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.querySelector('lightning-combobox');
                const mockChangeEvent = new CustomEvent('change', { detail: { value: ''}});
                dataTypePicker.dispatchEvent(mockChangeEvent);
                expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
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
                const externalAccessCheckboxGroup = variableEditor.querySelector(SELECTORS.EXTERNAL_ACCESS_CHECKBOX_GROUP);
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
                const labelDescription = variableEditor.querySelector('builder_platform_interaction-label-description');
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
                const externalAccessCheckboxGroup = variableEditor.querySelector(SELECTORS.EXTERNAL_ACCESS_CHECKBOX_GROUP);
                externalAccessCheckboxGroup.dispatchEvent(changeEvent);
                externalAccessCheckboxGroup.dispatchEvent(blurEvent);
                verifyWarningEvents(testConfig.expectedEventData, propertyWarningHandler);
            });
        }

        function verifyWarningEvents(expectedEventData, propertyWarningHandler) {
            expect(propertyWarningHandler).toHaveBeenCalledTimes(expectedEventData.length);
            const maxLength = expectedEventData.length;
            for (let i = 0; i < maxLength; i++) {
                expect(propertyWarningHandler.mock.calls[i][0].propertyName).toBe(expectedEventData[i].propertyName);
                expect(propertyWarningHandler.mock.calls[i][0].warning).toBe(expectedEventData[i].warning);
            }
        }
    });

    describe('default value combobox', () => {
        it('exists for string data type', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.querySelector(SELECTORS.DEFAULT_VALUE_COMBOBOX);
                expect(defaultValueCombobox).toBeDefined();
            });
        });

        it('should not exists for sobject data type', () => {
            const variableEditor = setupComponentUnderTest(mockStoreData.elements[mockStoreData.accountSObjectVariableGuid]);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.querySelector(SELECTORS.DEFAULT_VALUE_COMBOBOX);
                expect(defaultValueCombobox).toBeNull();
            });
        });

        it('should not exists for collection variables', () => {
            const variableEditor = setupComponentUnderTest(mockStoreData.elements[mockStoreData.stringCollectionVariable1Guid]);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.querySelector(SELECTORS.DEFAULT_VALUE_COMBOBOX);
                expect(defaultValueCombobox).toBeNull();
            });
        });

        it('has menu data populated', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.querySelector(SELECTORS.DEFAULT_VALUE_COMBOBOX);
                expect(getRHSTypes).toHaveBeenCalled();
                expect(defaultValueCombobox.menuData).toBeDefined();
            });
        });

        it('has variable reducer called for defaultValue and defaultValueGuid', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.querySelector(SELECTORS.DEFAULT_VALUE_COMBOBOX);
                defaultValueCombobox.dispatchEvent(getComboboxValueChangedEvent());
                expect(variableReducer).toHaveBeenCalledTimes(2);
                expect(variableReducer.mock.calls[0][0]).toEqual(variableEditor.node);
                expect(variableReducer.mock.calls[1][0]).toEqual(variableEditor.node);
            });
        });

        it('does not fetch menu data for same default value selected', () => {
            const valueChangedEvent = getComboboxValueChangedEvent();
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.querySelector(SELECTORS.DEFAULT_VALUE_COMBOBOX);
                defaultValueCombobox.dispatchEvent(valueChangedEvent);
                defaultValueCombobox.dispatchEvent(valueChangedEvent);
                expect(getRHSTypes).toHaveBeenCalledTimes(1);
            });
        });

        it('handles filter matches event', () => {
            const filterMatchesEvent = new CustomEvent('filtermatches', {
                detail: {value: 'var1'},
            });
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const defaultValueCombobox = variableEditor.querySelector(SELECTORS.DEFAULT_VALUE_COMBOBOX);
                defaultValueCombobox.dispatchEvent(filterMatchesEvent);
                expect(filterMatches).toHaveBeenCalled();
            });
        });
    });
});