import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import RecordChoiceSetEditor from '../recordChoiceSetEditor';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    PropertyChangedEvent,
    ValueChangedEvent,
    RecordFilterTypeChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent } from 'builder_platform_interaction/events';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { recordChoiceSetReducer } from '../recordChoiceSetReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { mockAccountFields } from 'mock/serverEntityData';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder'));

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

const setupComponentUnderTest = (recordChoiceObject) => {
    const element = createElement('builder_platform_interaction-record-choice-set-editor', {
        is: RecordChoiceSetEditor,
    });
    element.node = recordChoiceObject;
    document.body.appendChild(element);
    return element;
};
jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: require.requireActual('../../actions/actions.js').PROPERTY_EDITOR_ACTION,
    };
});
// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../recordChoiceSetReducer', () => {
    return {
        recordChoiceSetReducer: jest.fn().mockImplementation(((obj) => Object.assign({}, obj))),
    };
});

const mockAccountFieldsPromise = Promise.resolve(mockAccountFields);
jest.mock('builder_platform_interaction/sobjectLib', () => {
    const sobjectLib = require.requireActual('../../sobjectLib/sobjectLib.js');
    const mockSobjectLib = Object.assign({}, sobjectLib);
    mockSobjectLib.fetchFieldsForEntity = jest.fn().mockImplementation(() => mockAccountFieldsPromise);
    return mockSobjectLib;
});
const newRecordObjectOrField = {item: {value: 'Contact'}, displayText: 'contact', error: null};

function getComboboxStateChangedEvent() {
    return new CustomEvent('comboboxstatechanged', {
        detail: newRecordObjectOrField,
    });
}
describe('record-choice-set-editor', () => {
    const recordChoiceObject = {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
        guid: 'guid_1',
        name: {
            value: 'recordChoice1',
            error: null
        },
        description: {
            value: 'This is record choice',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        objectIndex: {
            value: 'guid',
            error: null
        },
        dataType: {
            value: 'Text',
            error: null
        },
        filterType: {
            value: 'none',
            error: null
        },
        sortField: {
            value: 'AccountSource',
            error: null
        },
        sortOrder: {
            value: 'Asc',
            error: null
        },
        limit: {
            value: '',
            error: null
        },
        displayField: {
            value: 'AccountSource',
            error: null
        },
        valueField: {
            value: 'AccountSource',
            error: null
        },
        outputAssignments: []
    };

    const recordChoiceObjectWithoutObjectField = {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
        guid: 'guid_1',
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
        },
    };
    describe('Label description component', () => {
        let recordChoiceEditor;
        let labelDescription;
        beforeEach(() => {
            recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
            labelDescription = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.LABEL_DESCRIPTION);
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
            getShadowRoot(recordChoiceEditor).querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                propertyName: 'description',
                value: 'new desc',
                error: null,
                doValidateProperty: true
            });
        });
    });

    describe('Entity-Resource-Picker for Record Choice Object', () => {
        let recordChoiceEditor;
        let entityResourcePicker;
        beforeEach(() => {
            recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
            entityResourcePicker = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
        });

        it('entity-resource-picker should be defined', () => {
            expect(entityResourcePicker).not.toBeNull();
        });

        it('Changing value in entity-resource-picker should update object', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[1][1]).toEqual({
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

        it('Changing value in entity-resource-picker should add an empty output assignment', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'outputAssignments'
            });
        });

        it('Changing value in entity-resource-picker should update filterType', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[2][1]).toEqual({
                propertyName: 'filterType',
                value: 'none',
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update sortOrder', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[3][1]).toEqual({
                propertyName: 'sortOrder',
                value: 'NotSorted',
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update sortField', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[4][1]).toEqual({
                propertyName: 'sortField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update displayField', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[5][1]).toEqual({
                propertyName: 'displayField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in entity-resource-picker should update valueField', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[6][1]).toEqual({
                propertyName: 'valueField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });
    });

    describe('Choice Value Field Picker', () => {
        let recordChoiceEditor;
        let fieldPicker;
        beforeEach(() => {
            recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
            fieldPicker = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.FIELD_PICKER);
        });

        it('field-picker should be defined', () => {
            expect(fieldPicker).not.toBeNull();
        });

        it('field-picker fields should be defined', () => {
            expect(Object.keys(fieldPicker.fields)).toHaveLength(Object.keys(mockAccountFields).length);
        });
    });

    describe('second-section', () => {
        let recordChoiceEditor;
        let recordFilter, recordSort, displayField, dataTypePicker, valueField, outputAssignment;

        describe('record-filter', () => {
            describe('without object field filled', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                recordFilter = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.RECORD_FILTER);
                it('record-filter is undefined', () => {
                    expect(recordFilter).toBeNull();
                });
            });
            describe('with object field filled', () => {
                beforeEach(() => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                    recordFilter = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.RECORD_FILTER);
                });

                it('Filter section should be defined', () => {
                    expect(recordFilter).not.toBeNull();
                });

                it('Handles the RecordFilterTypeChangedEvent Changed event', () => {
                    const filterTypeChangedEvent = new RecordFilterTypeChangedEvent('all');
                    recordFilter.dispatchEvent(filterTypeChangedEvent);
                    expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                        propertyName : 'filterType',
                        value: 'all',
                        error: null,
                        doValidateProperty: true
                    });
                });
            });
        });

        describe('record-sort', () => {
            describe('without object field filled', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                recordSort = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.RECORD_SORT);
                it('record-filter is undefined', () => {
                    expect(recordSort).toBeNull();
                });
            });
            describe('with object field filled', () => {
                beforeEach(() => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                    recordSort = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.RECORD_SORT);
                });

                it('Sort section should be defined', () => {
                    expect(recordSort).not.toBeNull();
                });

                it('Handles the change event when sort order is changed', () => {
                    const recordSortOrderChangedEvent = new CustomEvent('change', {
                        detail: {
                            sortOrder: 'desc',
                            fieldApiName: 'AccountSource'
                        },
                    });
                    recordSort.dispatchEvent(recordSortOrderChangedEvent);
                    expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                        propertyName : 'sortOrder',
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
                        },
                    });
                    recordSort.dispatchEvent(recordSortOrderChangedEvent);
                    expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                        propertyName : 'sortField',
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
                const choiceLimit = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.CHOICE_LIMIT_INPUT);
                expect(choiceLimit).toBeNull();
            });

            it('is defined when the object is defined', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                const choiceLimit = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.CHOICE_LIMIT_INPUT);
                expect(choiceLimit).not.toBeNull();
            });

            it('default value is empty string', () => {
                recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                const choiceLimit = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.CHOICE_LIMIT_INPUT);
                expect(choiceLimit.value).toBe('');
            });
        });

        describe('choice-template-section', () => {
            describe('displayField', () => {
                describe('without object field filled', () => {
                    recordChoiceEditor = setupComponentUnderTest(recordChoiceObjectWithoutObjectField);
                    displayField = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.DISPLAY_FIELD);
                    it('Display Field is undefined', () => {
                        expect(displayField).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        displayField = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.DISPLAY_FIELD);
                    });

                    it('Display Field should be defined', () => {
                        expect(displayField).not.toBeNull();
                    });

                    it('Changing value in displayField field-picker should update displayField value', () => {
                        displayField.dispatchEvent(getComboboxStateChangedEvent());
                        expect(createAction.mock.calls[1][1]).toEqual({
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
                    dataTypePicker = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.DATA_TYPE);

                    it('Data type Picker is undefined', () => {
                        expect(dataTypePicker).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        dataTypePicker = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.DATA_TYPE);
                    });

                    const dispatchValueChangedEvent = (payload) => {
                        const mockChangeEvent = new ValueChangedEvent(payload);
                        dataTypePicker.dispatchEvent(mockChangeEvent);
                    };

                    it('Datatype Picker should be defined', () => {
                        expect(dataTypePicker).not.toBeNull();
                    });

                    it('Datatype Picker should have five options', () => {
                        const dataTypeCombobox = getShadowRoot(dataTypePicker).querySelector('lightning-combobox');
                        expect(dataTypeCombobox.options).toHaveLength(5);
                    });

                    it('Handles value change event when data type option is selected', () => {
                        dispatchValueChangedEvent({ dataType : 'Number' });
                        expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                            propertyName : 'dataType',
                            value: 'Number',
                            error: null,
                            doValidateProperty: true
                        });
                    });

                    it('Changing value in Datatype Picker should update valueField', () => {
                        dispatchValueChangedEvent({ dataType : 'Number' });
                        expect(createAction.mock.calls[2][1]).toEqual({
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
                    valueField = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.VALUE_FIELD);
                    it('Display Field is undefined', () => {
                        expect(valueField).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        valueField = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.VALUE_FIELD);
                    });

                    it('Value Field should be defined', () => {
                        expect(valueField).not.toBeNull();
                    });

                    it('Changing value in valueField field-picker should update valueField value', () => {
                        valueField.dispatchEvent(getComboboxStateChangedEvent());
                        expect(createAction.mock.calls[1][1]).toEqual({
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
                    outputAssignment = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.OUTPUT_ASSIGNMENTS);
                    it('Output Assignment is undefined', () => {
                        expect(outputAssignment).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        recordChoiceEditor = setupComponentUnderTest(recordChoiceObject);
                        outputAssignment = getShadowRoot(recordChoiceEditor).querySelector(SELECTORS.OUTPUT_ASSIGNMENTS);
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
                        const newOutputAssignment = {rowIndex: 1, leftHandSide: 'lhs', rightHandSide: 'rhs'};
                        const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(0, newOutputAssignment);
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
            const recordChoiceEditor = setupComponentUnderTest(hydratedRecordChoiceObject);
            recordChoiceEditor.validate();
            expect(recordChoiceSetReducer.mock.calls[1][1]).toEqual({showSecondSection: true, type: VALIDATE_ALL});
        });
    });
});