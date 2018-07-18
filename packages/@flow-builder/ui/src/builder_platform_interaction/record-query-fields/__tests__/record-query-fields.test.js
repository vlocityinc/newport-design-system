import {createElement} from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import {
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent
} from 'builder_platform_interaction-events';
import RecordQueryFields from 'builder_platform_interaction-record-query-fields';
import { sObjectOrSObjectCollectionByEntitySelector }  from 'builder_platform_interaction-selectors';
import { mockAccountFields } from 'mock-server-entity-data';
import * as store from 'mock-store-data';

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    recordEntityName: 'Account',
    outputReference: '',
    queriedFields: [{field: {value: '', error: null}, rowIndex: 'RECORD_LOOKUP_FIELD_1'}],
};

const queried2Fields = [
    {field: {value: 'Description', error: null}, rowIndex: 'RECORD_LOOKUP_FIELD_1'},
    {field: {value: 'Fax', error: null}, rowIndex: 'RECORD_LOOKUP_FIELD_2'},
];

const selectors = {
    sobjectPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    fieldsList: 'builder_platform_interaction-list',
    recordFieldPicker: 'builder_platform_interaction-record-field-picker-row',
    idCombobox: 'builder_platform_interaction-combobox',
    baseResourcePicker: 'builder_platform_interaction-base-resource-picker',
};

const getSObjectPicker = (recordStoreFieldsComponent) => {
    return getShadowRoot(recordStoreFieldsComponent).querySelector(selectors.sobjectPicker);
};

const getFieldList = (recordStoreFieldsComponent) => {
    return getShadowRoot(recordStoreFieldsComponent).querySelector(selectors.fieldsList);
};

const getRecordFieldPickers = (recordStoreFieldsComponent) => {
    return getShadowRoot(recordStoreFieldsComponent).querySelectorAll(selectors.recordFieldPicker);
};

const getIdCombobox = (recordStoreFieldsComponent) => {
    return getShadowRoot(recordStoreFieldsComponent).querySelector(selectors.idCombobox);
};

const getBaseResourcePicker = (recordFieldPicker) => {
    return getShadowRoot(recordFieldPicker).querySelector(selectors.baseResourcePicker);
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-record-query-fields', {
        is: RecordQueryFields
    });
    Object.assign(el, mockDefaultConfig, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
    };
});

jest.mock('builder_platform_interaction-sobject-lib', () => {
    return {
        getFieldsForEntity: (entityName, callback) => {
            const accountFields = {};
            const fields = Object.keys(mockAccountFields);
            fields.forEach((field) => {
                accountFields[field] = field;
            });
            callback(accountFields);
        }
    };
});

describe('record-store-fields', () => {
    sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid]]));
    describe('sobject resource picker and fields', () => {
        let recordQueryFields;

        it('contains an sObject resource picker', () => {
            recordQueryFields = createComponentUnderTest();
            expect(getSObjectPicker(recordQueryFields)).not.toBeNull();
        });

        it('do not show fields list if outputReference is not set', () => {
            recordQueryFields = createComponentUnderTest();
            expect(getFieldList(recordQueryFields)).toBeNull();
        });

        it('show disable ID combobox', () => {
            recordQueryFields = createComponentUnderTest({outputReference: store.accountSObjectVariableGuid});
            const idCombobox = getIdCombobox(recordQueryFields);
            expect(idCombobox.value.value).toEqual('Id');
            expect(idCombobox.disabled).toBeTruthy();
        });

        it('show one empty row in fields', () => {
            recordQueryFields = createComponentUnderTest({outputReference: store.accountSObjectVariableGuid});
            expect(getFieldList(recordQueryFields)).not.toBeNull();
            const fieldPickers = getRecordFieldPickers(recordQueryFields);
            expect(fieldPickers).toHaveLength(1);
            expect(getBaseResourcePicker(fieldPickers[0]).value).toEqual("");
        });

        it('show 2 rows in fields', () => {
            recordQueryFields = createComponentUnderTest({outputReference: store.accountSObjectVariableGuid, queriedFields: queried2Fields});
            const fieldPickers = getRecordFieldPickers(recordQueryFields);
            expect(fieldPickers).toHaveLength(2);
            expect(getBaseResourcePicker(fieldPickers[0]).value).toEqual(queried2Fields[0].field.value);
            expect(getBaseResourcePicker(fieldPickers[1]).value).toEqual(queried2Fields[1].field.value);
        });
    });

    describe('handle events', () => {
        let recordQueryFields, fieldList;
        beforeEach(() => {
            recordQueryFields = createComponentUnderTest({outputReference: store.accountSObjectVariableGuid, queriedFields: queried2Fields});
            fieldList = getFieldList(recordQueryFields);
        });

        it('fires addRecordLookupFieldEvent', () => {
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordQueryFields.addEventListener(AddRecordLookupFieldEvent.EVENT_NAME, eventCallback);
                fieldList.dispatchEvent(new AddRecordLookupFieldEvent());
                expect(eventCallback).toHaveBeenCalled();
            });
        });

        it('fires updateRecordLookupFieldEvent', () => {
            const updateData = {
                index: 0,
                value: 'Name',
            };
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordQueryFields.addEventListener(UpdateRecordLookupFieldEvent.EVENT_NAME, eventCallback);
                fieldList.dispatchEvent(new UpdateRecordLookupFieldEvent(updateData.index, updateData.value));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: updateData.index,
                        value: updateData.value,
                    }
                });
            });
        });

        it('fires deleteRecordLookupFieldEvent', () => {
            const deleteIndex = 1;
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordQueryFields.addEventListener(DeleteRecordLookupFieldEvent.EVENT_NAME, eventCallback);
                fieldList.dispatchEvent(new DeleteRecordLookupFieldEvent(deleteIndex));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: deleteIndex,
                    }
                });
            });
        });
    });
});