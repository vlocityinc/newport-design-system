import { createElement } from 'lwc';
import RecordLookupEditor from "../recordLookupEditor";
import { getShadowRoot } from 'lwc-test-utils';
import * as expressionUtilsMock from "builder_platform_interaction/expressionUtils";
import * as store from "mock/storeData";
import { SORT_ORDER, NUMBER_RECORDS_TO_STORE, RECORD_FILTER_CRITERIA } from "builder_platform_interaction/recordEditorLib";
import { RecordStoreOptionChangedEvent,
    AddRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    RecordLookupFilterTypeChangedEvent } from "builder_platform_interaction/events";

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const defaultValueItem = {item: {value: 'guid1', displayText: 'var 1'}};

function getComboboxStateChangedEvent() {
    return new CustomEvent('comboboxstatechanged', {
        detail: defaultValueItem,
    });
}

function getComboboxItemSelectedEvent() {
    return new CustomEvent('itemselected', {
        detail: defaultValueItem,
    });
}

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: require.requireActual('builder_platform_interaction-expression-utils').getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction-expression-utils').EXPRESSION_PROPERTY_TYPE,
    };
});

const selectors = {
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    recordFilter: 'builder_platform_interaction-record-filter',
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    recordSort: 'builder_platform_interaction-record-sort',
    recordQueryFields: 'builder_platform_interaction-record-query-fields',
};

const filterElement = {
    leftHandSide: {value: "Account.Id", error: null},
    operator: {value: "EqualTo", error: null},
    rightHandSide: {value: "{!myFormula1}", error: null},
    rightHandSideDataType: {value: "reference", error: null},
    rightHandSideGuid: {value: "FORMULA_8", error: null}
};

const defaultRecordLookupElement = {
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: '', error: null },
    name : { value: '', error: null },
    outputReference : { value: '', error: null},
    sortField : { value:'', error: null},
    sortOrder : { value: SORT_ORDER.NOT_SORTED, error: null},
    assignNullValuesIfNoRecordsFound : false,
    outputAssignments : [],
    queriedFields: [],
    object: { value: '', error: null},
    filterType: { error: null, value: RECORD_FILTER_CRITERIA.NONE},
    filters: []
};

const recordLookupElementWithSObject = {
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: 'testRecord', error: null },
    name : { value: 'testRecord', error: null },
    outputReference : { value: store.accountSObjectVariableGuid, error: null},
    sortField : { value:'', error:null},
    sortOrder : { value: SORT_ORDER.NOT_SORTED, error: null},
    assignNullValuesIfNoRecordsFound : false,
    outputAssignments : [],
    queriedFields: [],
    object: { value: 'Account', error: ''},
    filterType: { error: null, value: RECORD_FILTER_CRITERIA.NONE},
    filters: []
};

const recordLookupElementWithSObjectAndFilters = {
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: 'testRecord', error: null },
    name : { value: 'testRecord', error: null },
    outputReference : { value: store.accountSObjectVariableGuid, error: null},
    sortField : { value:'', error:null},
    sortOrder : { value: SORT_ORDER.NOT_SORTED, error: null},
    assignNullValuesIfNoRecordsFound : false,
    outputAssignments : [],
    queriedFields: [],
    object: { value: 'Account', error: null},
    filterType: { error: null, value:'all'},
    filters: [{leftHandSide: {value: "Account.billingAddress", error: null},
        operator: {value: "EqualTo", error: null},
        rightHandSide: {value: "my address", error: null},
        rightHandSideDataType: {value: "String", error: null},
        rowIndex: "RECORDLOOKUPFILTERITEM_122"}]
};

const getRecordStoreOption = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(selectors.recordStoreOption);
};

const getEntityResourcePicker = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(selectors.entityResourcePicker);
};

const getRecordFilter = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(selectors.recordFilter);
};

const getRecordSort = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(selectors.recordSort);
};

const getRecordQueryFields = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(selectors.recordQueryFields);
};

const getsObjectOrSObjectCollectionPicker = (recordQueryFields) => {
    return getShadowRoot(recordQueryFields).querySelector(selectors.sObjectOrSObjectCollectionPicker);
};

describe('record-lookup-editor', () => {
    describe('with default values', () => {
        let recordLookupEditor;
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(defaultRecordLookupElement);
        });
        it('contains an entity resource picker for sobject', () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            expect(entityResourcePicker).not.toBeNull();
        });
        it('Other elements should not be visible', () => {
            expect(getRecordFilter(recordLookupEditor)).toBeNull();
            expect(getRecordStoreOption(recordLookupEditor)).toBeNull();
            expect(getRecordSort(recordLookupEditor)).toBeNull();
            expect(getRecordQueryFields(recordLookupEditor)).toBeNull();
        });
        it('should show other elements when changing the resource', () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            return Promise.resolve().then(() => {
                expect(getRecordFilter(recordLookupEditor)).not.toBeNull();
                expect(getRecordStoreOption(recordLookupEditor)).not.toBeNull();
                expect(getRecordSort(recordLookupEditor)).not.toBeNull();
                expect(getRecordQueryFields(recordLookupEditor)).not.toBeNull();
            });
        });
        it('should show other elements when selecting the resource', () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxItemSelectedEvent());
            return Promise.resolve().then(() => {
                expect(getRecordFilter(recordLookupEditor)).not.toBeNull();
                expect(getRecordStoreOption(recordLookupEditor)).not.toBeNull();
                expect(getRecordSort(recordLookupEditor)).not.toBeNull();
                expect(getRecordQueryFields(recordLookupEditor)).not.toBeNull();
            });
        });
    });
    describe('Edit existing record element using sObject', () => {
        let recordLookupEditor;
        beforeEach(() => {
            const sobjectVariableElement = store.elements[store.accountSObjectVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(sobjectVariableElement);
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObject);
        });
        it('record filter should be visible', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter).not.toBeNull();
        });
        it('recordStoreOption should be visible', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption).not.toBeNull();
        });
        it('recordSort should be visible', () => {
            const recordSort = getRecordSort(recordLookupEditor);
            expect(recordSort).not.toBeNull();
        });
        it('recordQueryField should be visible', () => {
            const recordQueryField = getRecordQueryFields(recordLookupEditor);
            expect(recordQueryField).not.toBeNull();
        });
        it('Number of record to store should be firstRecord', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
        });
        it('sortOrder should be Not sorted', () => {
            const recordSort = getRecordSort(recordLookupEditor);
            expect(recordSort.sortOrder).toBe(SORT_ORDER.NOT_SORTED);
        });
        it('record filter criteria should be "none" ', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter.filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
        });
    });
    describe('Handle Events', () => {
        let recordLookupEditor;
        beforeEach(() => {
            const sObjectVariableElement = store.elements[store.accountSObjectVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(sObjectVariableElement);
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObject);
        });
        it('handles flow combobox value changed event', () => {
            let entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            return Promise.resolve().then(() => {
                entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
                expect(entityResourcePicker.value).toBe('guid1');
            });
        });
        it('handle sortOrder Changed should changed the record lookup sortOrder value', () => {
            const event = new CustomEvent('change', { detail: { sortOrder: SORT_ORDER.ASC, fieldApiName : '' } });
            getRecordSort(recordLookupEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const recordSort = getRecordSort(recordLookupEditor);
                expect(recordSort.sortOrder).toBe(SORT_ORDER.ASC);
                expect(recordLookupEditor.node.sortOrder.value).toBe(SORT_ORDER.ASC);
            });
        });
        it('change number record to store to All records, sObject picker should changed', () => {
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.ALL_RECORDS, '', false);
            getRecordStoreOption(recordLookupEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const recordQueryFields = getRecordQueryFields(recordLookupEditor);
                const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(recordQueryFields);
                expect(sObjectOrSObjectCollectionPicker.placeholder).toBe('FlowBuilderRecordEditor.sObjectCollectionVariablePlaceholder');
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });
        });
        it('handle RecordStoreOptionChangedEvent should set assignNullValuesIfNoRecordsFound to true', () => {
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.FIRST_RECORD, '', true);
            getRecordStoreOption(recordLookupEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.assignNullValuesIfNoRecordsFound).toBe(true); // We want the exact value true
            });
        });
        it('handle UpdateRecordLookupFilterEvent should update the filter element', () => {
            const updateRecordLookupFilterEvent = new UpdateRecordLookupFilterEvent(0, filterElement, null);
            getRecordFilter(recordLookupEditor).dispatchEvent(updateRecordLookupFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.filters[0]).toMatchObject(filterElement);
            });
        });
        it('handle AddRecordLookupFilterEvent should add a filter element', () => {
            const addRecordLookupFilterEvent = new AddRecordLookupFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordLookupEditor).dispatchEvent(addRecordLookupFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.filters).toHaveLength(1);
            });
        });
        it('handle record filter type Change event', () => {
            const recordLookupFilterTypeChangedEvent = new RecordLookupFilterTypeChangedEvent(RECORD_FILTER_CRITERIA.ALL);
            getRecordFilter(recordLookupEditor).dispatchEvent(recordLookupFilterTypeChangedEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.filterType.value).toBe(RECORD_FILTER_CRITERIA.ALL);
            });
        });
    });
    describe('Handle Events for existing element with filters', () => {
        let recordLookupEditor;
        beforeEach(() => {
            const sObjectVariableElement = store.elements[store.accountSObjectVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(sObjectVariableElement);
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObjectAndFilters);
        });
        it('record filter criteria should be all ', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter.filterType).toBe(RECORD_FILTER_CRITERIA.ALL);
        });
        it('record filter fire DeleteRecordLookupFilterEvent', () => {
            const deleteRecordLookupFilterEvent = new DeleteRecordLookupFilterEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordLookupEditor).dispatchEvent(deleteRecordLookupFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.filters).toHaveLength(0);
            });
        });
    });
});