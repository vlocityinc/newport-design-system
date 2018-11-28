import { createElement } from 'lwc';
import RecordLookupEditor from "../recordLookupEditor";
import { getShadowRoot } from 'lwc-test-utils';
import * as expressionUtilsMock from "builder_platform_interaction/expressionUtils";
import * as store from "mock/storeData";
import { SORT_ORDER, NUMBER_RECORDS_TO_STORE, RECORD_FILTER_CRITERIA, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { RecordStoreOptionChangedEvent,
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateRecordFilterEvent,
    RecordFilterTypeChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent, } from "builder_platform_interaction/events";

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const defaultValueItem = {item: {value: 'guid1', displayText: 'var 1'}},
      eventDetailOnObjectRemoval = {item: null, displayText: '', error : 'A value is required.'};

function getComboboxStateChangedEvent(detail = defaultValueItem) {
    return new CustomEvent('comboboxstatechanged', {
        detail
    });
}

function getComboboxItemSelectedEvent() {
    return new CustomEvent('itemselected', {
        detail: defaultValueItem,
    });
}

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: require.requireActual('builder_platform_interaction/expressionUtils').getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction/expressionUtils').EXPRESSION_PROPERTY_TYPE,
        getSecondLevelItems: require.requireActual('builder_platform_interaction/expressionUtils').getSecondLevelItems,
        filterMatches: require.requireActual('builder_platform_interaction/expressionUtils').filterMatches
    };
});

const selectors = {
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    recordFilter: 'builder_platform_interaction-record-filter',
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    recordSort: 'builder_platform_interaction-record-sort',
    recordQueryFields: 'builder_platform_interaction-record-query-fields',
    inputOutputAssignments: 'builder_platform_interaction-record-input-output-assignments',
};

const filterElement = {
    leftHandSide: {value: "Account.Id", error: null},
    operator: {value: "EqualTo", error: null},
    rightHandSide: {value: "{!myFormula1}", error: null},
    rightHandSideDataType: {value: "reference", error: null},
    rightHandSideGuid: {value: "FORMULA_8", error: null}
};

const defaultRecordLookupElement = () => ({
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
    filters: [],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
});

const recordLookupElementWithSObject = () => ({
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
    filters: [],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
});

const recordLookupElementWithSObjectAndFilters = () => ({
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
    filters: [{leftHandSide: {value: 'Account.billingAddress', error: null},
        operator: {value: 'EqualTo', error: null},
        rightHandSide: {value: 'my address', error: null},
        rightHandSideDataType: {value: 'String', error: null},
        rowIndex: 'RECORDLOOKUPFILTERITEM_122'}],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
});

const recordLookupElementWithFields = () => ({
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: 'testRecordWithFields', error: null },
    name : { value: 'testRecordWithFields', error: null },
    outputAssignments : [{
        leftHandSide: {value: 'Account.BillingCity', error: null},
        rightHandSide: {value: 'vCity', error: null},
        rowIndex: 'f972abcb-1df5-41f1-9d31-f5076cbc8'}],
    sortField : { value:'', error:null},
    sortOrder : { value: SORT_ORDER.NOT_SORTED, error: null},
    assignNullValuesIfNoRecordsFound : false,
    object: { value: 'Account', error: ''},
    filterType: { error: null, value: RECORD_FILTER_CRITERIA.NONE},
    filters: [],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
});

const outputAssignmentElement = {
    leftHandSide: {value: "Account.Address", error: null},
    rightHandSide: {value: "myAddress", error: null},
    rowIndex: "724cafc2-7744-4e46-8eaa-f2df29539d2e"
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

const getInputOutputAssignments = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(selectors.inputOutputAssignments);
};

describe('record-lookup-editor', () => {
    describe('with default values', () => {
        let recordLookupEditor;
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(defaultRecordLookupElement());
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
    describe('Existing record element remove "object"', () => {
        let recordLookupEditor;
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObject());
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent(eventDetailOnObjectRemoval));
        });
        it('record filter should NOT be visible', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter).toBeNull();
        });
        it('recordStoreOption should NOT be visible', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption).toBeNull();
        });
        it('recordSort should NOT be visible', () => {
            const recordSort = getRecordSort(recordLookupEditor);
            expect(recordSort).toBeNull();
        });
        it('recordQueryField should NOT be visible', () => {
            const recordQueryField = getRecordQueryFields(recordLookupEditor);
            expect(recordQueryField).toBeNull();
        });
        it('record inputOutPutAssignments should NOT be visible', () => {
            const recordOutputAssignments = getInputOutputAssignments(recordLookupEditor);
            expect(recordOutputAssignments).toBeNull();
        });
    });
    describe('Edit existing record element using sObject', () => {
        let recordLookupEditor;
        beforeEach(() => {
            const sobjectVariableElement = store.elements[store.accountSObjectVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(sobjectVariableElement);
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObject());
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
        it('Way to store fields should be sObjectVariable', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
        });
        it('sortOrder should be Not sorted', () => {
            const recordSort = getRecordSort(recordLookupEditor);
            expect(recordSort.sortOrder).toBe(SORT_ORDER.NOT_SORTED);
        });
        it('record filter criteria should be "none" ', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter.filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
        });
        it('record inputOutPutAssignments should not be visible', () => {
            const recordOutputAssignments = getInputOutputAssignments(recordLookupEditor);
            expect(recordOutputAssignments).toBeNull();
        });
    });
    describe('Edit existing record element using Fields', () => {
        let recordLookupEditor;
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(recordLookupElementWithFields());
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
        it('record inputOutPutAssignments should be visible', () => {
            const recordOutputAssignments = getInputOutputAssignments(recordLookupEditor);
            expect(recordOutputAssignments).not.toBeNull();
        });
        it('Number of record to store should be firstRecord', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
        });
        it('Way to store fields should be separateVariables', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
        });
        it('sortOrder should be Not sorted', () => {
            const recordSort = getRecordSort(recordLookupEditor);
            expect(recordSort.sortOrder).toBe(SORT_ORDER.NOT_SORTED);
        });
        it('recordQueryField should be null', () => {
            const recordQueryField = getRecordQueryFields(recordLookupEditor);
            expect(recordQueryField).toBeNull();
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
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObject());
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
        it('handle UpdateRecordFilterEvent should update the filter element', () => {
            const updateRecordFilterEvent = new UpdateRecordFilterEvent(0, filterElement, null);
            getRecordFilter(recordLookupEditor).dispatchEvent(updateRecordFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.filters[0]).toMatchObject(filterElement);
            });
        });
        it('handle AddRecordFilterEvent should add a filter element', () => {
            const addRecordFilterEvent = new AddRecordFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordLookupEditor).dispatchEvent(addRecordFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.filters).toHaveLength(1);
            });
        });
        it('handle record filter type Change event', () => {
            const recordFilterTypeChangedEvent = new RecordFilterTypeChangedEvent(RECORD_FILTER_CRITERIA.ALL);
            getRecordFilter(recordLookupEditor).dispatchEvent(recordFilterTypeChangedEvent);
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
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObjectAndFilters());
        });
        it('record filter criteria should be all ', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter.filterType).toBe(RECORD_FILTER_CRITERIA.ALL);
        });
        it('record filter fire DeleteRecordFilterEvent', () => {
            const deleteRecordFilterEvent = new DeleteRecordFilterEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordLookupEditor).dispatchEvent(deleteRecordFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.filters).toHaveLength(0);
            });
        });
    });
    describe('Handle Events for element using fields', () => {
        let recordLookupEditor;
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(recordLookupElementWithFields());
        });
        it('change number record to store to All records, sObject picker should changed', () => {
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.FIRST_RECORD, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE, false);
            getRecordStoreOption(recordLookupEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const recordQueryFields = getRecordQueryFields(recordLookupEditor);
                const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(recordQueryFields);
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });
        });
        it('handle AddRecordFieldAssignmentEvent should add an input Assignments element', () => {
            const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
            getInputOutputAssignments(recordLookupEditor).dispatchEvent(addRecordFieldAssignmentEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.outputAssignments).toHaveLength(2);
            });
        });
        it('handle UpdateRecordFieldAssignmentEvent should update the input Assignments element', () => {
            const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(0, outputAssignmentElement, null);
            getInputOutputAssignments(recordLookupEditor).dispatchEvent(updateRecordFieldAssignmentEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.outputAssignments[0]).toMatchObject(outputAssignmentElement);
            });
        });
        it('handle DeleteRecordFieldAssignmentEvent should delete the input assignment', () => {
            const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getInputOutputAssignments(recordLookupEditor).dispatchEvent(deleteRecordFieldAssignmentEvent);
            return Promise.resolve().then(() => {
                expect(recordLookupEditor.node.outputAssignments).toHaveLength(0);
            });
        });
    });
});