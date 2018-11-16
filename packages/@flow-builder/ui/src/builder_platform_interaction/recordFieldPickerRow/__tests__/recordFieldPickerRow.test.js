import {createElement} from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { mockAccountFields } from "mock/serverEntityData";
import {
    ComboboxStateChangedEvent,
    UpdateRecordLookupFieldEvent,
} from "builder_platform_interaction/events";
import RecordFieldPickerRow from "builder_platform_interaction/recordFieldPickerRow";

const ID_FIELD = 'Id';

const mockDefaultConfig = {
    fieldIndex: 1,
    recordEntityName: 'Account'
};

const selectors = {
    fieldPicker: 'builder_platform_interaction-field-picker',
};

const getFieldPicker = (recordFieldPickerRow) => {
    return getShadowRoot(recordFieldPickerRow).querySelector(selectors.fieldPicker);
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-record-field-picker-row', {
        is: RecordFieldPickerRow
    });
    Object.assign(el, mockDefaultConfig);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn().mockImplementation(() => Promise.resolve(mockAccountFields)),
    };
});

describe('record-field-picker-row', () => {
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

    describe('Set the value', () => {
        it('should not display record-field-picker-row combobox if value is Id', () => {
            mockDefaultConfig.value = ID_FIELD;
            const fieldPicker = getFieldPicker(createComponentUnderTest());
            expect(fieldPicker).toBeNull();
            mockDefaultConfig.value = undefined;
        });

        it('should have "Description" as value', () => {
            mockDefaultConfig.value = 'Description';
            const fieldPicker = getFieldPicker(createComponentUnderTest());
            expect(fieldPicker.value).toEqual(mockDefaultConfig.value);
            mockDefaultConfig.value = undefined;
        });
    });

    describe('Exclude some fields', () => {
        let recordFieldPickerRow, fieldPicker;
        beforeEach(() => {
            mockDefaultConfig.value = 'Description';
            mockDefaultConfig.queriedFields = [{field: {value: 'Description'}}, {field: {value: 'Fax'}}, {field: {value: 'Name'}}];
            recordFieldPickerRow = createComponentUnderTest();
            fieldPicker = getFieldPicker(recordFieldPickerRow);
        });

        it('should not contain "Fax", "Name" and "Id"', () => {
            const fields = Object.keys(fieldPicker.fields);
            expect(fieldPicker.value).toEqual("Description");
            expect(fields).toHaveLength(Object.keys(mockAccountFields).length - mockDefaultConfig.queriedFields.length);
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