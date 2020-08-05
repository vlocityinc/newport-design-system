// @ts-nocheck
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
import { Store } from 'builder_platform_interaction/storeLib';
import { ticks, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    recordEntityName: 'Account',
    outputReference: '',
    queriedFields: [{ field: { value: '', error: null }, rowIndex: 'RECORD_LOOKUP_FIELD_1' }]
};

const queried2Fields = [
    {
        field: { value: 'Description', error: null },
        rowIndex: 'RECORD_LOOKUP_FIELD_1'
    },
    { field: { value: 'Fax', error: null }, rowIndex: 'RECORD_LOOKUP_FIELD_2' }
];

const getFieldList = (recordStoreFieldsComponent) =>
    recordStoreFieldsComponent.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LIST);
const getRecordFieldPickers = (recordStoreFieldsComponent) =>
    recordStoreFieldsComponent.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.RECORD_FIELD_PICKER_ROW);
const getCombobox = (recordStoreFieldsComponent) =>
    recordStoreFieldsComponent.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX);
const getFieldPicker = (recordFieldPicker) =>
    recordFieldPicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FIELD_PICKER);
const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-record-query-fields', {
        is: RecordQueryFields
    });
    Object.assign(el, mockDefaultConfig, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn().mockResolvedValue(() => {
            const accountFields = {};
            const fields = Object.keys(mockAccountFields);
            fields.forEach((field) => {
                accountFields[field] = field;
            });
            return accountFields;
        })
    };
});

describe('record-store-fields', () => {
    beforeAll(() => {
        Store.setMockState(store.flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('fields', () => {
        let recordQueryFields;
        it('show disable ID combobox', () => {
            recordQueryFields = createComponentUnderTest({
                outputReference: store.accountSObjectVariable.guid
            });
            const combobox = getCombobox(recordQueryFields);
            expect(combobox.value.value).toEqual('Id');
            expect(combobox.disabled).toBeTruthy();
        });

        it('show one empty row in fields', () => {
            recordQueryFields = createComponentUnderTest({
                outputReference: store.accountSObjectVariable.guid
            });
            expect(recordQueryFields.outputReference).toBe(store.accountSObjectVariable.guid);

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
            expect(getFieldPicker(fieldPickers[0]).value).toEqual(queried2Fields[0].field.value);
            expect(getFieldPicker(fieldPickers[1]).value).toEqual(queried2Fields[1].field.value);
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

        it('fires addRecordLookupFieldEvent', async () => {
            await ticks(1);
            const eventCallback = jest.fn();
            recordQueryFields.addEventListener(AddRecordLookupFieldEvent.EVENT_NAME, eventCallback);
            fieldList.dispatchEvent(new AddListItemEvent());
            expect(eventCallback).toHaveBeenCalled();
        });

        it('fires updateRecordLookupFieldEvent', async () => {
            const updateData = {
                index: 0,
                value: 'Name'
            };
            await ticks(1);
            const eventCallback = jest.fn();
            recordQueryFields.addEventListener(UpdateRecordLookupFieldEvent.EVENT_NAME, eventCallback);
            fieldList.dispatchEvent(new UpdateListItemEvent(updateData.index, updateData.value));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: updateData.index,
                    value: updateData.value
                }
            });
        });

        it('fires deleteRecordLookupFieldEvent', async () => {
            const deleteIndex = 1;
            await ticks(1);
            const eventCallback = jest.fn();
            recordQueryFields.addEventListener(DeleteRecordLookupFieldEvent.EVENT_NAME, eventCallback);
            fieldList.dispatchEvent(new DeleteListItemEvent(deleteIndex));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: deleteIndex
                }
            });
        });
    });
    it('oes not support pill', () => {
        const recordQueryFields = createComponentUnderTest();
        const combobox = getCombobox(recordQueryFields);
        expect(combobox.isPillSupported).toBe(false);
    });
});
