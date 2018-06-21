import {createElement} from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
import { mockAccountFields } from 'mock-server-entity-data';
import {
    ComboboxStateChangedEvent,
    UpdateRecordLookupFieldEvent,
} from 'builder_platform_interaction-events';
import RecordFieldPickerRow from 'builder_platform_interaction-record-field-picker-row';

const mockDefaultConfig = {
    fieldIndex: 1,
    recordEntityName: 'Account'
};

const selectors = {
    baseResourcePicker: 'builder_platform_interaction-base-resource-picker',
};

const getBaseResourcePicker = (recordFieldPickerRow) => {
    return getShadowRoot(recordFieldPickerRow).querySelector(selectors.baseResourcePicker);
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-record-field-picker-row', {
        is: RecordFieldPickerRow
    });
    Object.assign(el, mockDefaultConfig);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction-sobject-lib', () => {
    return {
        getFieldsForEntity: (entityName, callback) => {
            const accountFields = {};
            mockAccountFields.forEach((field) => {
                accountFields[field.apiName] = field;
            });
            callback(accountFields);
        }
    };
});

describe('record-field-picker-row', () => {
    describe('Load all fields', () => {
        let recordFieldPickerRow, baseResourcePicker;
        beforeEach(() => {
            recordFieldPickerRow = createComponentUnderTest();
            baseResourcePicker = getBaseResourcePicker(recordFieldPickerRow);
        });

        it('contains a base resource picker', () => {
            expect(baseResourcePicker).toBeDefined();
        });

        it('retrieves fields menu data on initial load', () => {
            const fullMenuData = baseResourcePicker.fullMenuData;
            expect(fullMenuData).toHaveLength(mockAccountFields.length - 1); // exclude 'Id'
            expect(fullMenuData).not.toContainEqual(expect.objectContaining({
                text: 'Id'
            }));
        });
    });

    describe('Set the value', () => {
        it('should not display record-field-picker-row combobox if value is Id', () => {
            mockDefaultConfig.value = 'Id';
            const baseResourcePicker = getBaseResourcePicker(createComponentUnderTest());
            expect(baseResourcePicker).toBeNull();
        });

        it('should have "Description" as value', () => {
            mockDefaultConfig.value = 'Description';
            const baseResourcePicker = getBaseResourcePicker(createComponentUnderTest());
            expect(baseResourcePicker.value).toEqual(mockDefaultConfig.value);
        });
    });

    describe('Exclude some fields', () => {
        let recordFieldPickerRow, baseResourcePicker;
        beforeEach(() => {
            mockDefaultConfig.queriedFields = [{field: {value: 'Description'}}, {field: {value: 'Fax'}}, {field: {value: 'Name'}}];
            recordFieldPickerRow = createComponentUnderTest();
            baseResourcePicker = getBaseResourcePicker(recordFieldPickerRow);
        });

        it('should not contain "Fax", "Name" and "Id"', () => {
            const fullMenuData = baseResourcePicker.fullMenuData;
            expect(fullMenuData).toHaveLength(mockAccountFields.length - mockDefaultConfig.queriedFields.length);
            expect(baseResourcePicker.value).toEqual("Description");
            expect(fullMenuData.some(item => ["Fax", "Name", "Id"].indexOf(item.text) >= 0)).toBe(false);
        });
    });
    describe('handling value change event from combobox', () => {
        it("should fire 'UpdateRecordLookupFieldEvent'", () => {
            const recordFieldPickerRow = createComponentUnderTest();
            const baseResourcePicker = getBaseResourcePicker(recordFieldPickerRow);
            const newParamValue = 'Fax';
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordFieldPickerRow.addEventListener(UpdateRecordLookupFieldEvent.EVENT_NAME, eventCallback);
                baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(null, newParamValue));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {index: 1, value: newParamValue}});
            });
        });
    });
});