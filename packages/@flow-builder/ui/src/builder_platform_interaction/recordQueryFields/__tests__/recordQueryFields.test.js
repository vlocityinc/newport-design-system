import { createElement } from 'lwc';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
    AddListItemEvent,
    UpdateListItemEvent,
    DeleteListItemEvent
} from 'builder_platform_interaction/events';
import RecordQueryFields from 'builder_platform_interaction/recordQueryFields';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import * as store from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    recordEntityName: 'Account',
    outputReference: '',
    queriedFields: [
        { field: { value: '', error: null }, rowIndex: 'RECORD_LOOKUP_FIELD_1' }
    ]
};

const queried2Fields = [
    {
        field: { value: 'Description', error: null },
        rowIndex: 'RECORD_LOOKUP_FIELD_1'
    },
    { field: { value: 'Fax', error: null }, rowIndex: 'RECORD_LOOKUP_FIELD_2' }
];

const selectors = {
    fieldsList: 'builder_platform_interaction-list',
    recordFieldPicker: 'builder_platform_interaction-record-field-picker-row',
    idCombobox: 'builder_platform_interaction-combobox',
    fieldPicker: 'builder_platform_interaction-field-picker'
};

const getFieldList = recordStoreFieldsComponent => {
    return recordStoreFieldsComponent.shadowRoot.querySelector(
        selectors.fieldsList
    );
};

const getRecordFieldPickers = recordStoreFieldsComponent => {
    return recordStoreFieldsComponent.shadowRoot.querySelectorAll(
        selectors.recordFieldPicker
    );
};

const getIdCombobox = recordStoreFieldsComponent => {
    return recordStoreFieldsComponent.shadowRoot.querySelector(
        selectors.idCombobox
    );
};

const getFieldPicker = recordFieldPicker => {
    return recordFieldPicker.shadowRoot.querySelector(selectors.fieldPicker);
};

const createComponentUnderTest = props => {
    const el = createElement(
        'builder_platform_interaction-record-query-fields',
        {
            is: RecordQueryFields
        }
    );
    Object.assign(el, mockDefaultConfig, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn().mockResolvedValue(() => {
            const accountFields = {};
            const fields = Object.keys(mockAccountFields);
            fields.forEach(field => {
                accountFields[field] = field;
            });
            return accountFields;
        })
    };
});

describe('record-store-fields', () => {
    describe('fields', () => {
        let recordQueryFields;
        it('show disable ID combobox', () => {
            recordQueryFields = createComponentUnderTest({
                outputReference: store.accountSObjectVariable.guid
            });
            const idCombobox = getIdCombobox(recordQueryFields);
            expect(idCombobox.value.value).toEqual('Id');
            expect(idCombobox.disabled).toBeTruthy();
        });

        it('show one empty row in fields', () => {
            recordQueryFields = createComponentUnderTest({
                outputReference: store.accountSObjectVariable.guid
            });
            expect(recordQueryFields.outputReference).toBe(
                store.accountSObjectVariable.guid
            );

            expect(getFieldList(recordQueryFields)).not.toBeNull();
            const fieldPickers = getRecordFieldPickers(recordQueryFields);
            expect(fieldPickers).toHaveLength(1);
            expect(getFieldPicker(fieldPickers[0]).value).toEqual('');
        });

        it('show 2 rows in fields', () => {
            recordQueryFields = createComponentUnderTest({
                outputReference: store.accountSObjectVariable.guid,
                queriedFields: queried2Fields
            });
            const fieldPickers = getRecordFieldPickers(recordQueryFields);
            expect(fieldPickers).toHaveLength(2);
            expect(getFieldPicker(fieldPickers[0]).value).toEqual(
                queried2Fields[0].field.value
            );
            expect(getFieldPicker(fieldPickers[1]).value).toEqual(
                queried2Fields[1].field.value
            );
        });
    });

    describe('handle events', () => {
        let recordQueryFields, fieldList;
        beforeEach(() => {
            recordQueryFields = createComponentUnderTest({
                outputReference: store.accountSObjectVariable.guid,
                queriedFields: queried2Fields
            });
            fieldList = getFieldList(recordQueryFields);
        });

        it('fires addRecordLookupFieldEvent', () => {
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordQueryFields.addEventListener(
                    AddRecordLookupFieldEvent.EVENT_NAME,
                    eventCallback
                );
                fieldList.dispatchEvent(new AddListItemEvent());
                expect(eventCallback).toHaveBeenCalled();
            });
        });

        it('fires updateRecordLookupFieldEvent', () => {
            const updateData = {
                index: 0,
                value: 'Name'
            };
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordQueryFields.addEventListener(
                    UpdateRecordLookupFieldEvent.EVENT_NAME,
                    eventCallback
                );
                fieldList.dispatchEvent(
                    new UpdateListItemEvent(updateData.index, updateData.value)
                );
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: updateData.index,
                        value: updateData.value
                    }
                });
            });
        });

        it('fires deleteRecordLookupFieldEvent', () => {
            const deleteIndex = 1;
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                recordQueryFields.addEventListener(
                    DeleteRecordLookupFieldEvent.EVENT_NAME,
                    eventCallback
                );
                fieldList.dispatchEvent(new DeleteListItemEvent(deleteIndex));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: deleteIndex
                    }
                });
            });
        });
    });
});
