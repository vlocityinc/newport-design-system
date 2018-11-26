import {createElement} from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { mockAccountFields } from "mock/serverEntityData";
import {
    ComboboxStateChangedEvent,
    UpdateRecordLookupFieldEvent,
} from "builder_platform_interaction/events";
import RecordFieldPickerRow from "builder_platform_interaction/recordFieldPickerRow";

const ID_FIELD = 'Id';

const selectors = {
    fieldPicker: 'builder_platform_interaction-field-picker',
};

const getFieldPicker = (recordFieldPickerRow) => {
    return getShadowRoot(recordFieldPickerRow).querySelector(selectors.fieldPicker);
};

const createComponentUnderTest = ({ fieldIndex = 1, recordEntityName = 'Account', value = undefined, queriedFields = [] } = {}) => {
    const el = createElement('builder_platform_interaction-record-field-picker-row', {
        is: RecordFieldPickerRow
    });
    Object.assign(el, { fieldIndex, recordEntityName, value, queriedFields });
    document.body.appendChild(el);
    return el;
};

let mockAccountFieldsPromise = Promise.resolve(mockAccountFields);

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => mockAccountFieldsPromise),
}));

describe('record-field-picker-row', () => {
    beforeEach(() => {
        mockAccountFieldsPromise = Promise.resolve(mockAccountFields);
    });
    describe('Load all fields', () => {
        let recordFieldPickerRow, fieldPicker;
        beforeEach(() => {
            recordFieldPickerRow = createComponentUnderTest();
            fieldPicker = getFieldPicker(recordFieldPickerRow);
        });

        it('contains a field picker', () => {
            expect(fieldPicker).toBeDefined();
        });

        it('retrieves fields menu data on initial load', () => {
            const fields = Object.keys(fieldPicker.fields);
            expect(fields).toHaveLength(Object.keys(mockAccountFields).length - 1); // exclude 'Id'
            expect(fields).toEqual(expect.not.arrayContaining([ID_FIELD]));
        });
    });

    describe('When it cannot fetch entity fields', () => {
        it('set fields menu data to an empty menu data if it cannot retrieve fields', () => {
            mockAccountFieldsPromise = Promise.reject(Error('Cannot find entity'));
            const recordFieldPickerRow = createComponentUnderTest();
            const fieldPicker = getFieldPicker(recordFieldPickerRow);
            const fields = Object.keys(fieldPicker.fields);
            expect(fields).toHaveLength(0);
        });
    });

    describe('Set the value', () => {
        it('should not display record-field-picker-row combobox if value is Id', () => {
            const fieldPicker = getFieldPicker(createComponentUnderTest({ value : ID_FIELD }));
            expect(fieldPicker).toBeNull();
        });

        it('should set field picker value', () => {
            const fieldPicker = getFieldPicker(createComponentUnderTest({ value : 'Description' }));
            expect(fieldPicker.value).toEqual('Description');
        });
    });

    describe('Exclude some fields', () => {
        let recordFieldPickerRow, fieldPicker;
        let queriedFields;
        beforeEach(() => {
            const value = 'Description';
            queriedFields = [{field: {value: 'Description'}}, {field: {value: 'Fax'}}, {field: {value: 'Name'}}];
            recordFieldPickerRow = createComponentUnderTest({ value, queriedFields });
            fieldPicker = getFieldPicker(recordFieldPickerRow);
        });

        it('should not contain "Fax", "Name" and "Id"', () => {
            const fields = Object.keys(fieldPicker.fields);
            expect(fieldPicker.value).toEqual("Description");
            expect(fields).toHaveLength(Object.keys(mockAccountFields).length - queriedFields.length);
            expect(fields.some(item => ["Fax", "Name", "Id"].indexOf(item.text) >= 0)).toBe(false);
        });
    });
    describe('handling value change event from combobox', () => {
        it("should fire 'UpdateRecordLookupFieldEvent'", () => {
            const recordFieldPickerRow = createComponentUnderTest();
            const fieldPicker = getFieldPicker(recordFieldPickerRow);
            const newParamValue = 'Fax';
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordFieldPickerRow.addEventListener(UpdateRecordLookupFieldEvent.EVENT_NAME, eventCallback);
                fieldPicker.dispatchEvent(new ComboboxStateChangedEvent(null, newParamValue));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {index: 1, value: newParamValue}});
            });
        });
    });
});