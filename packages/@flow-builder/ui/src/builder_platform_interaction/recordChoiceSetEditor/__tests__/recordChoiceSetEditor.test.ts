// @ts-nocheck
import { createElement } from 'lwc';
import RecordChoiceSetEditor from '../recordChoiceSetEditor';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    PropertyChangedEvent,
    ValueChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { recordChoiceSetReducer } from '../recordChoiceSetReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    FIELD_PICKER: 'builder_platform_interaction-field-picker',
    RECORD_FILTER: 'builder_platform_interaction-record-filter',
    RECORD_SORT: 'builder_platform_interaction-record-sort',
    CHOICE_LIMIT_INPUT: '.choice-limit',
    DISPLAY_FIELD: '.test-display-field',
    DATA_TYPE: 'builder_platform_interaction-data-type-picker',
    VALUE_FIELD: '.test-value-field',
    OUTPUT_ASSIGNMENTS: 'builder_platform_interaction-record-input-output-assignments'
};

const setupComponentUnderTest = recordChoiceObject => {
    const element = createElement('builder_platform_interaction-record-choice-set-editor', {
        is: RecordChoiceSetEditor
    });
    element.node = recordChoiceObject;
    document.body.appendChild(element);
    return element;
};
jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: jest.requireActual('builder_platform_interaction/actions').PROPERTY_EDITOR_ACTION
    };
});
// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../recordChoiceSetReducer', () => {
    return {
        recordChoiceSetReducer: jest.fn().mockImplementation(obj => Object.assign({}, obj))
    };
});

const mockAccountFieldsPromise = Promise.resolve(accountFields);
jest.mock('builder_platform_interaction/sobjectLib', () => {
    const sobjectLib = jest.requireActual('builder_platform_interaction/sobjectLib');
    const mockSobjectLib = Object.assign({}, sobjectLib);
    mockSobjectLib.fetchFieldsForEntity = jest.fn().mockImplementation(() => mockAccountFieldsPromise);
    return mockSobjectLib;
});
const newRecordObjectOrField = {
    item: { value: 'Contact' },
    displayText: 'contact',
    error: null
};

function getComboboxStateChangedEvent() {
    return new CustomEvent('comboboxstatechanged', {
        detail: newRecordObjectOrField
    });
}

describe('record-choice-set-editor', () => {
    let recordChoiceObject, recordChoiceEditor;

    const recordChoiceObjectWithoutObjectField = {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
        guid: 'guid1',
        name: {
            value: 'recordChoice1',
            error: null
        },
        description: {
            value: 'This is record choice',
            error: null
        },
        object: {
            value: null,
            error: null
        },
        objectIndex: {
            value: 'guid',
            error: null
        }
    };
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    beforeEach(() => {
        const recordChoiceSetElement = getElementByDevName('recordChoiceSet');
        recordChoiceObject = getElementForPropertyEditor(recordChoiceSetElement);
        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
    });
    describe('Label description component', () => {
        let labelDescription;
        beforeEach(() => {
            labelDescription = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.LABEL_DESCRIPTION);
        });

        it('Label-Description should be defined', () => {
            expect(labelDescription).not.toBeNull();
        });

        it('Devname should be same as the name of the recordChoiceObject', () => {
            expect(labelDescription.devName).toEqual(recordChoiceObject.name);
        });

        it('Description should be same as the description of the recordChoiceObject', () => {
            expect(labelDescription.description).toEqual(recordChoiceObject.description);
        });

        it('Handles the property changed event and updates the property', () => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            recordChoiceEditor.shadowRoot
                .querySelector('builder_platform_interaction-label-description')
                .dispatchEvent(event);
            expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                propertyName: 'description',
                value: 'new desc',
                error: null,
                doValidateProperty: true
            });
        });
    });

    describe('Entity-Resource-Picker for Record Choice Object', () => {
        let entityResourcePicker;
        beforeEach(() => {
            entityResourcePicker = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
        });

        it('entity-resource-picker should be defined', () => {
            expect(entityResourcePicker).not.toBeNull();
        });

        it('Changing value in entity-resource-picker should update object', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'object',
                value: 'Contact',
                error: null,
                doValidateProperty: true
            });
        });

        it('Changing value in entity-resource-picker should call getFieldsForEntity', async () => {
            fetchFieldsForEntity.mockClear();
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(fetchFieldsForEntity).toHaveBeenCalledTimes(1);
        });

        it('Changing value in entity-resource-picker should update filterLogic', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[1][1]).toEqual({
                propertyName: 'filterLogic',
                value: CONDITION_LOGIC.AND,
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update sortOrder', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[2][1]).toEqual({
                propertyName: 'sortOrder',
                value: 'NotSorted',
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update sortField', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[3][1]).toEqual({
                propertyName: 'sortField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update displayField', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[4][1]).toEqual({
                propertyName: 'displayField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update valueField', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[5][1]).toEqual({
                propertyName: 'valueField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });
    });

    describe('Choice Value Field Picker', () => {
        let fieldPicker;
        beforeEach(() => {
            fieldPicker = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.FIELD_PICKER);
        });

        it('field-picker should be defined', () => {
            expect(fieldPicker).not.toBeNull();
        });

        it('field-picker fields should be defined', () => {
            expect(Object.keys(fieldPicker.fields)).toHaveLength(Object.keys(accountFields).length);
        });
    });

    describe('second-section', () => {
        let recordFilter, recordSort, displayField, dataTypePicker, valueField, outputAssignment;

        describe('record-filter', () => {
            describe('without object field filled', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                recordFilter = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.RECORD_FILTER);
                it('record-filter is undefined', () => {
                    expect(recordFilter).toBeNull();
                });
            });
            describe('with object field filled', () => {
                beforeEach(() => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                    recordFilter = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.RECORD_FILTER);
                });

                it('Filter section should be defined', () => {
                    expect(recordFilter).not.toBeNull();
                });

                it('Handles the Property Changed event for filter logic', async () => {
                    const propertyChangeEvent = new PropertyChangedEvent('filterLogic', CONDITION_LOGIC.AND);
                    recordFilter.dispatchEvent(propertyChangeEvent);
                    await ticks(1);
                    expect(recordChoiceEditor.node.filterLogic.value).toBe(CONDITION_LOGIC.OR);
                });
            });
        });

        describe('record-sort', () => {
            describe('without object field filled', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                recordSort = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.RECORD_SORT);
                it('record-filter is undefined', () => {
                    expect(recordSort).toBeNull();
                });
            });
            describe('with object field filled', () => {
                beforeEach(() => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                    recordSort = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.RECORD_SORT);
                });

                it('Sort section should be defined', () => {
                    expect(recordSort).not.toBeNull();
                });

                it('Handles the change event when sort order is changed', () => {
                    const recordSortOrderChangedEvent = new CustomEvent('change', {
                        detail: {
                            sortOrder: 'desc',
                            fieldApiName: 'AccountSource'
                        }
                    });
                    recordSort.dispatchEvent(recordSortOrderChangedEvent);
                    expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                        propertyName: 'sortOrder',
                        value: 'desc',
                        error: undefined,
                        doValidateProperty: false
                    });
                });

                it('Handles the change event when sort fieldAPiName is changed', () => {
                    const recordSortOrderChangedEvent = new CustomEvent('change', {
                        detail: {
                            sortOrder: 'asc',
                            fieldApiName: 'testField'
                        }
                    });
                    recordSort.dispatchEvent(recordSortOrderChangedEvent);
                    expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                        propertyName: 'sortField',
                        value: 'testField',
                        error: undefined,
                        doValidateProperty: false
                    });
                });
            });
        });

        describe('choice-limit-input', () => {
            it('is null when the object is not defined', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                const choiceLimit = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.CHOICE_LIMIT_INPUT);
                expect(choiceLimit).toBeNull();
            });

            it('is defined when the object is defined', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                const choiceLimit = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.CHOICE_LIMIT_INPUT);
                expect(choiceLimit).not.toBeNull();
            });

            it('Should be 5', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                const choiceLimit = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.CHOICE_LIMIT_INPUT);
                expect(choiceLimit.value).toBe('5');
            });
        });

        describe('choice-template-section', () => {
            describe('displayField', () => {
                describe('without object field filled', () => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                    displayField = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
                    it('Display Field is undefined', () => {
                        expect(displayField).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        displayField = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
                    });

                    it('Display Field should be defined', () => {
                        expect(displayField).not.toBeNull();
                    });

                    it('Changing value in displayField field-picker should update displayField value', () => {
                        displayField.dispatchEvent(getComboboxStateChangedEvent());
                        expect(createAction.mock.calls[0][1]).toEqual({
                            propertyName: 'displayField',
                            value: 'Contact',
                            error: null,
                            doValidateProperty: true
                        });
                    });
                });
            });

            describe('dataType', () => {
                describe('without object field filled', () => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                    dataTypePicker = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);

                    it('Data type Picker is undefined', () => {
                        expect(dataTypePicker).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        dataTypePicker = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
                    });

                    const dispatchValueChangedEvent = payload => {
                        const mockChangeEvent = new ValueChangedEvent(payload);
                        dataTypePicker.dispatchEvent(mockChangeEvent);
                    };

                    it('Datatype Picker should be defined', () => {
                        expect(dataTypePicker).not.toBeNull();
                    });

                    it('Datatype Picker should have five options', () => {
                        const dataTypeCombobox = dataTypePicker.shadowRoot.querySelector('lightning-combobox');
                        expect(dataTypeCombobox.options).toHaveLength(5);
                    });

                    it('Handles value change event when data type option is selected', () => {
                        dispatchValueChangedEvent({ dataType: 'Number' });
                        expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                            propertyName: 'dataType',
                            value: 'Number',
                            error: null,
                            doValidateProperty: true
                        });
                    });

                    it('Changing value in Datatype Picker should update valueField', () => {
                        dispatchValueChangedEvent({ dataType: 'Number' });
                        expect(createAction.mock.calls[1][1]).toEqual({
                            propertyName: 'valueField',
                            value: null,
                            error: null,
                            doValidateProperty: false
                        });
                    });
                });
            });

            describe('valueField', () => {
                describe('whithout object field filled', () => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                    valueField = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.VALUE_FIELD);
                    it('Display Field is undefined', () => {
                        expect(valueField).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        valueField = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.VALUE_FIELD);
                    });

                    it('Value Field should be defined', () => {
                        expect(valueField).not.toBeNull();
                    });

                    it('Changing value in valueField field-picker should update valueField value', () => {
                        valueField.dispatchEvent(getComboboxStateChangedEvent());
                        expect(createAction.mock.calls[0][1]).toEqual({
                            propertyName: 'valueField',
                            value: 'Contact',
                            error: null,
                            doValidateProperty: true
                        });
                    });
                });
            });

            describe('outputAssignments', () => {
                describe('whithout object field filled', () => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                    outputAssignment = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.OUTPUT_ASSIGNMENTS);
                    it('Output Assignment is undefined', () => {
                        expect(outputAssignment).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        outputAssignment = recordChoiceEditor.shadowRoot.querySelector(SELECTORS.OUTPUT_ASSIGNMENTS);
                    });

                    it('Output Assignment should be defined', () => {
                        expect(outputAssignment).not.toBeNull();
                    });

                    it('handle AddRecordFieldAssignmentEvent should add an output Assignments element', () => {
                        const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
                        outputAssignment.dispatchEvent(addRecordFieldAssignmentEvent);
                        expect(createAction).toHaveBeenCalledWith('addrecordfieldassignment', {
                            index: null,
                            value: null
                        });
                    });

                    it('handle UpdateRecordFieldAssignmentEvent should update an output Assignments element', () => {
                        const newOutputAssignment = {
                            rowIndex: 1,
                            leftHandSide: 'lhs',
                            rightHandSide: 'rhs'
                        };
                        const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(
                            0,
                            newOutputAssignment
                        );
                        outputAssignment.dispatchEvent(updateRecordFieldAssignmentEvent);
                        expect(createAction).toHaveBeenCalledWith('updaterecordfieldassignment', {
                            index: 0,
                            value: newOutputAssignment
                        });
                    });

                    it('handle DeleteRecordFieldAssignmentEvent should delete the output assignment', () => {
                        const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(0); // This is using the numerical rowIndex not the property rowIndex
                        outputAssignment.dispatchEvent(deleteRecordFieldAssignmentEvent);
                        expect(createAction).toHaveBeenCalledWith('deleterecordfieldassignment', {
                            index: 0
                        });
                    });
                });
            });
        });
    });

    describe('Validation', () => {
        it('Calls reducer with validate all event', () => {
            const hydratedRecordChoiceObject = hydrateWithErrors(recordChoiceObject, ['guid', 'elementType']);
            recordChoiceEditor = setupComponentUnderTest(hydratedRecordChoiceObject);
            recordChoiceEditor.validate();
            expect(recordChoiceSetReducer.mock.calls[0][1]).toEqual({
                showSecondSection: true,
                type: VALIDATE_ALL
            });
        });
    });
});
