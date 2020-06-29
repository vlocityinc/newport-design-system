// @ts-nocheck
import { createElement } from 'lwc';
import RecordDeleteEditor from '../recordDeleteEditor';
import * as storeMockedData from 'mock/storeData';
import { AddElementEvent, EditElementEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import {
    RecordStoreOptionChangedEvent,
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateRecordFilterEvent
} from 'builder_platform_interaction/events';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const createComponentForTest = (node, mode) => {
    const el = createElement('builder_platform_interaction-record-delete-editor', { is: RecordDeleteEditor });
    Object.assign(el, { node, mode });
    document.body.appendChild(el);
    return el;
};
const MOCK_GUID = '724cafc2-7744-4e46-8eaa-f2df29539d1d',
    SELECTORS = {
        sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
        entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
        recordFilter: 'builder_platform_interaction-record-filter',
        recordStoreOption: 'builder_platform_interaction-record-store-options'
    };

const defaultRecordDeleteElement = () => ({
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_DELETE,
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: { value: '', error: null },
    name: { value: '', error: null },
    inputReference: { value: '', error: null },
    inputReferenceIndex: { value: 'guid', error: null },
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null },
    filters: [],
    useSobject: true
});

const recordDeleteElementWithSObject = () => ({
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_DELETE,
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: { value: 'record delete editor with sobject', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'record_delete_editor_with_sobject', error: null },
    inputReference: {
        value: storeMockedData.accountSObjectVariable.guid,
        error: null
    },
    inputReferenceIndex: { value: 'guid', error: null },
    filters: [],
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null },
    useSobject: true
});

const recordDeleteElementWithFields = () => ({
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_DELETE,
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: { value: 'record delete editor with fields', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'record_delete_editor_with_fields', error: null },
    filterLogic: { value: CONDITION_LOGIC.AND, error: null },
    filters: [],
    inputReference: { value: '', error: null },
    inputReferenceIndex: { value: 'guid', error: null },
    object: { value: 'account', error: null },
    objectIndex: { value: 'guid', error: null },
    useSobject: false
});

const filterElement = {
    leftHandSide: { value: 'Account.Id', error: null },
    operator: { value: 'EqualTo', error: null },
    rightHandSide: { value: '{!myFormula1}', error: null },
    rightHandSideDataType: { value: 'reference', error: null },
    rightHandSideGuid: { value: 'FORMULA_8', error: null },
    rowIndex: '123'
};

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetchOnce: () => {
            return Promise.resolve(mockAccountFields);
        },
        SERVER_ACTION_TYPE: jest.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE
    };
});

const getSObjectOrSObjectCollectionPicker = recordDeleteEditor =>
    recordDeleteEditor.shadowRoot.querySelector(SELECTORS.sObjectOrSObjectCollectionPicker);
const getEntityResourcePicker = recordDeleteEditor =>
    recordDeleteEditor.shadowRoot.querySelector(SELECTORS.entityResourcePicker);
const getRecordStoreOption = recordDeleteEditor =>
    recordDeleteEditor.shadowRoot.querySelector(SELECTORS.recordStoreOption);
const getRecordFilter = recordDeleteEditor => recordDeleteEditor.shadowRoot.querySelector(SELECTORS.recordFilter);

describe('Record delete editor', () => {
    let recordDeleteEditor;
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('record delete editor with default values (added from palette)', () => {
        beforeEach(() => {
            recordDeleteEditor = createComponentForTest(defaultRecordDeleteElement(), AddElementEvent.EVENT_NAME);
        });
        test('contains an entity resource picker for sobject', () => {
            expect(getSObjectOrSObjectCollectionPicker(recordDeleteEditor)).not.toBeNull();
        });
        test('contains an record store option component', () => {
            expect(getRecordStoreOption(recordDeleteEditor)).not.toBeNull();
        });
        test('entity resource picker ("object") should not be visible', () => {
            expect(getEntityResourcePicker(recordDeleteEditor)).toBeNull();
        });
        test('record filter (filters) should not be visible', () => {
            expect(getRecordFilter(recordDeleteEditor)).toBeNull();
        });
    });

    describe('record delete editor using sObject', () => {
        beforeEach(() => {
            recordDeleteEditor = createComponentForTest(recordDeleteElementWithSObject(), EditElementEvent.EVENT_NAME);
        });
        describe('Edit existing record element', () => {
            test('Selected sObject should be the same', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariable.guid);
            });
        });
        describe('Handle Events', () => {
            test('handle "inputReference" changes', async () => {
                const event = new SObjectReferenceChangedEvent(storeMockedData.accountSObjectVariable.guid, null);
                let sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteEditor);
                sObjectOrSObjectCollectionPicker.dispatchEvent(event);
                await ticks(1);
                sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariable.guid);
            });
        });
    });

    describe('record delete editor using fields', () => {
        beforeEach(() => {
            recordDeleteEditor = createComponentForTest(recordDeleteElementWithFields(), EditElementEvent.EVENT_NAME);
        });
        test('entity resource picker should be visible & sObject picker should not be visible', () => {
            expect(getEntityResourcePicker(recordDeleteEditor)).not.toBeNull();
        });

        describe('Handle Events', () => {
            test('change number record to store to All records, sObject picker should changed', async () => {
                const event = new RecordStoreOptionChangedEvent(true, '', false);
                getRecordStoreOption(recordDeleteEditor).dispatchEvent(event);
                await ticks(1);
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toHaveLength(0);
            });
            test('handle "UpdateRecordFilterEvent" should update the filter element', async () => {
                const updateRecordFilterEvent = new UpdateRecordFilterEvent(0, filterElement, null);
                getRecordFilter(recordDeleteEditor).dispatchEvent(updateRecordFilterEvent);
                await ticks(1);
                expect(recordDeleteEditor.node.filters[0]).toMatchObject(filterElement);
            });
            test('handle "AddRecordFilterEvent" should add a filter element', async () => {
                const addRecordFilterEvent = new AddRecordFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
                getRecordFilter(recordDeleteEditor).dispatchEvent(addRecordFilterEvent);
                await ticks(1);
                expect(recordDeleteEditor.node.filters).toHaveLength(1);
            });
            test('record filter fires "DeleteRecordFilterEvent"', async () => {
                const deleteRecordFilterEvent = new DeleteRecordFilterEvent(0); // This is using the numerical rowIndex not the property rowIndex
                getRecordFilter(recordDeleteEditor).dispatchEvent(deleteRecordFilterEvent);
                await ticks(1);
                expect(recordDeleteEditor.node.filters).toHaveLength(0);
            });
        });
    });
});