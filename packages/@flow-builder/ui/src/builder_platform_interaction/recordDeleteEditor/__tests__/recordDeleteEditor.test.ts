import { createElement } from 'lwc';
import RecordDeleteEditor from '../recordDeleteEditor';
import {
    AddElementEvent,
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    EditElementEvent,
    PropertyChangedEvent,
    RecordStoreOptionChangedEvent,
    SObjectReferenceChangedEvent,
    UpdateRecordFilterEvent
} from 'builder_platform_interaction/events';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { Store } from 'builder_platform_interaction/storeLib';
import { accountSObjectVariable, elementsForPropertyEditors, flowWithAllElementsUIModel } from 'mock/storeData';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const createComponentForTest = (props) => {
    const el = createElement('builder_platform_interaction-record-delete-editor', { is: RecordDeleteEditor });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

const newRecordDeleteElement = {
    guid: '560d2014-6a3b-4547-a025-7a4b4fb57233',
    name: {
        value: '',
        error: null
    },
    description: {
        value: '',
        error: null
    },
    label: {
        value: '',
        error: null
    },
    locationX: 531,
    locationY: 36,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: false,
        isHighlighted: false,
        isSelectable: true,
        hasError: false
    },
    elementSubtype: {
        value: null,
        error: null
    },
    inputReference: {
        value: '',
        error: null
    },
    inputReferenceIndex: {
        value: '7095ef66-8f20-4628-978e-f336c23af792',
        error: null
    },
    object: {
        value: '',
        error: null
    },
    objectIndex: {
        value: 'c5a72d22-a4a6-4867-b98f-3089de6098af',
        error: null
    },
    filterLogic: {
        value: 'and',
        error: null
    },
    filters: [],
    maxConnections: 2,
    availableConnections: [
        {
            type: 'REGULAR'
        },
        {
            type: 'FAULT'
        }
    ],
    elementType: 'RecordDelete',
    dataType: {
        value: 'Boolean',
        error: null
    },
    useSobject: true
};

const { deleteAccount: recordDeleteElementWithSObject, deleteAccountWithFilters: recordDeleteElementWithFields } =
    elementsForPropertyEditors;

const filterElement = {
    leftHandSide: { value: 'Account.Id', error: null },
    operator: { value: 'EqualTo', error: null },
    rightHandSide: { value: '{!myFormula1}', error: null },
    rightHandSideDataType: { value: 'reference', error: null },
    rightHandSideGuid: { value: 'FORMULA_8', error: null },
    rowIndex: '123'
};

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => ({
    fetchOnce: () => Promise.resolve(mockAccountFields),
    SERVER_ACTION_TYPE: jest.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE
}));

const getSObjectOrSObjectCollectionPicker = (recordDeleteEditor) =>
    recordDeleteEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);
const getEntityResourcePicker = (recordDeleteEditor) =>
    recordDeleteEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);
const getRecordStoreOption = (recordDeleteEditor) =>
    recordDeleteEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION);
const getRecordFilter = (recordDeleteEditor) =>
    recordDeleteEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);

describe('Record delete editor', () => {
    let recordDeleteEditor;
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('Add new element', () => {
        beforeAll(() => {
            recordDeleteEditor = createComponentForTest({
                node: newRecordDeleteElement,
                mode: AddElementEvent.EVENT_NAME
            });
        });
        test('displays the sobject or sobject collection picker', () => {
            expect(getSObjectOrSObjectCollectionPicker(recordDeleteEditor)).not.toBeNull();
        });
        test('displays the record store option', () => {
            expect(getRecordStoreOption(recordDeleteEditor)).not.toBeNull();
        });
        test('does NOT display the entity resource picker', () => {
            expect(getEntityResourcePicker(recordDeleteEditor)).toBeNull();
        });
        test('does NOT display the record filter', () => {
            expect(getRecordFilter(recordDeleteEditor)).toBeNull();
        });
    });
    describe('Existing element', () => {
        describe('using sObject', () => {
            beforeAll(() => {
                recordDeleteEditor = createComponentForTest({
                    node: recordDeleteElementWithSObject,
                    mode: EditElementEvent.EVENT_NAME
                });
            });
            it('does NOT display the "EntityResourcePicker" component', () => {
                expect(getEntityResourcePicker(recordDeleteEditor)).toBeNull();
            });
            it('displays "RecordStoreOption" component', () => {
                expect(getRecordStoreOption(recordDeleteEditor)).not.toBeNull();
            });
            it('displays "SObjectOrSObjectCollectionPicker" component', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordDeleteEditor)).not.toBeNull();
            });
            it('displays selected sObject', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe(accountSObjectVariable.guid);
            });
            describe('Handle Events', () => {
                it('"SObjectReferenceChangedEvent" should change the selected sobject)', async () => {
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteEditor);
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(accountSObjectVariable.guid)
                    );
                    await ticks(1);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(accountSObjectVariable.guid);
                });
                it('"RecordStoreOptionChangedEvent" changing to non sobject mode should set the useSobject to false', async () => {
                    getRecordStoreOption(recordDeleteEditor).dispatchEvent(
                        new RecordStoreOptionChangedEvent(false, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE, false)
                    );
                    await ticks(1);
                    expect(recordDeleteEditor.getNode().useSobject).toBe(false);
                });
            });
        });
        describe('using fields', () => {
            beforeEach(() => {
                recordDeleteEditor = createComponentForTest({
                    node: recordDeleteElementWithFields,
                    mode: EditElementEvent.EVENT_NAME
                });
            });
            it('displays the "EntityResourcePicker" component', () => {
                expect(getEntityResourcePicker(recordDeleteEditor)).not.toBeNull();
            });
            it('does NOT display "SObjectOrSObjectCollectionPicker" component', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordDeleteEditor)).toBeNull();
            });
            it('displays "RecordStoreOption" component', () => {
                expect(getRecordStoreOption(recordDeleteEditor)).not.toBeNull();
            });
            it('sets useSobject to false', () => {
                expect(recordDeleteEditor.getNode().useSobject).toBe(false);
            });
            describe('Handle Events', () => {
                it('"RecordStoreOptionChangedEvent" changing to sobject mode should set the useSobject to true', async () => {
                    getRecordStoreOption(recordDeleteEditor).dispatchEvent(
                        new RecordStoreOptionChangedEvent(true, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE, false)
                    );
                    await ticks(1);
                    expect(recordDeleteEditor.getNode().useSobject).toBe(true);
                });
                it('"UpdateRecordFilterEvent" should update the filter element', async () => {
                    getRecordFilter(recordDeleteEditor).dispatchEvent(new UpdateRecordFilterEvent(0, filterElement));
                    await ticks(1);
                    expect(recordDeleteEditor.getNode().filters[0]).toMatchObject(filterElement);
                });
                it('"AddRecordFilterEvent" should add a filter element', async () => {
                    getRecordFilter(recordDeleteEditor).dispatchEvent(new AddRecordFilterEvent());
                    await ticks(1);
                    expect(recordDeleteEditor.getNode().filters).toHaveLength(
                        recordDeleteElementWithFields.filters.length + 1
                    );
                });
                it('"DeleteRecordFilterEvent" should delete a filter', async () => {
                    getRecordFilter(recordDeleteEditor).dispatchEvent(new DeleteRecordFilterEvent(0));
                    await ticks(1);
                    expect(recordDeleteEditor.getNode().filters).toHaveLength(
                        recordDeleteElementWithFields.filters.length - 1
                    );
                });
                it('"FilterLogic" change update filter logic and left untouched filters', async () => {
                    const newFilterLogic = '1 AND 2 AND 3';
                    const { filters: oldFilters } = recordDeleteEditor.getNode();
                    getRecordFilter(recordDeleteEditor).dispatchEvent(
                        new PropertyChangedEvent('filterLogic', newFilterLogic)
                    );
                    await ticks(1);
                    expect(recordDeleteEditor.getNode().filterLogic).toEqual({
                        value: newFilterLogic,
                        error: null
                    });
                    expect(recordDeleteEditor.getNode().filters).toEqual(oldFilters);
                });
            });
        });
    });
});
