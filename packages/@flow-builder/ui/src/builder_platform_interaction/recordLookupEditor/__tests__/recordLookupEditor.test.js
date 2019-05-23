import { createElement } from 'lwc';
import RecordLookupEditor from "../recordLookupEditor";
import * as expressionUtilsMock from "builder_platform_interaction/expressionUtils";
import * as store from "mock/storeData";
import { SORT_ORDER, NUMBER_RECORDS_TO_STORE, RECORD_FILTER_CRITERIA, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { AddElementEvent,
    EditElementEvent,
    RecordStoreOptionChangedEvent,
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateRecordFilterEvent,
    RecordFilterTypeChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    SObjectReferenceChangedEvent} from "builder_platform_interaction/events";

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

const MOCK_GUID = '515fa22c-c633-48fe-a97e-4fd3c272cc24';
const FLOW_PROCESS_TYPE = 'flow';
const OTHER_PROCESS_TYPE = 'other';

class ToggleOnChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: true, }});
    }
}

class ToggleOffChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: false, }});
    }
}

function createComponentForTest(node, mode = EditElementEvent.EVENT_NAME, processType = OTHER_PROCESS_TYPE) {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    Object.assign(el, {node, processType, mode});
    document.body.appendChild(el);
    return el;
}

const defaultValueItem = {item: {value: 'guid1', displayText: 'var 1'}},
      eventDetailObjectWithError = (displayText, error) => ({item: null, displayText, error});

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

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual('../../processTypeLib/processTypeLib.js');
    const FLOW_AUTOMATIC_OUTPUT_HANDLING = actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn((processType) => {
            return processType === 'flow' ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        }),
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = require.requireActual('../../expressionUtils/expressionUtils.js');
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: actual.getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getSecondLevelItems: actual.getSecondLevelItems,
        filterMatches: actual.filterMatches
    };
});

const selectors = {
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    fieldToFerovExBuilder: 'builder_platform_interaction-field-to-ferov-expression-builder',
    inputOutputAssignments: 'builder_platform_interaction-record-input-output-assignments',
    interactionList: 'builder_platform_interaction-list',
    interactionRow: 'builder_platform_interaction-row',
    lightningInput: 'lightning-input',
    lightningRadioGroup: 'lightning-radio-group',
    recordFilter: 'builder_platform_interaction-record-filter',
    recordQueryFields: 'builder_platform_interaction-record-query-fields',
    recordNumberOfRecordToStore: 'builder_platform_interaction-record-number-record-to-store',
    recordSobjectAndQueryFields: 'builder_platform_interaction-record-sobject-and-query-fields',
    recordSort: 'builder_platform_interaction-record-sort',
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    useAdvancedOptionsCheckboxComponent : 'builder_platform_interaction-record-use-advanced-options-checkbox',
};

const filterElement = {
    leftHandSide: {value: "Account.Id", error: null},
    operator: {value: "EqualTo", error: null},
    rightHandSide: {value: "{!myFormula1}", error: null},
    rightHandSideDataType: {value: "reference", error: null},
    rightHandSideGuid: {value: "FORMULA_8", error: null}
};

const lookupField = {
    leftHandSide: {error: null, value: "Account.BillingCity"},
    rightHandSide: {error: null, value: "vCity"},
    rowIndex: "f972abcb-1df5-41f1-9d31-f5076cbc8"
};

const defaultRecordLookupElement = () => ({
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: '', error: null },
    name : { value: '', error: null },
    outputReference : { value: '', error: null},
    outputReferenceIndex : { value: MOCK_GUID, error: null},
    sortField : { value:'', error: null},
    sortOrder : SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound : false,
    outputAssignments : [],
    queriedFields: [],
    object: { value: '', error: null},
    objectIndex: {value: 'guid', error: null},
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
    storeOutputAutomatically: true
});

const recordLookupElementWithSObject = () => ({
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: 'testRecord', error: null },
    name : { value: 'testRecord', error: null },
    outputReference : { value: store.accountSObjectVariableGuid, error: null},
    outputReferenceIndex : { value: MOCK_GUID, error: null},
    sortField : { value:'', error:null},
    sortOrder : SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound : false,
    outputAssignments : [],
    queriedFields: [
        {
         field:{value: "Id", error: null},
         rowIndex: MOCK_GUID
        }, {
         field:{value: "Name", error: null},
         rowIndex: MOCK_GUID
        }
    ],
    object: { value: 'Account', error: ''},
    objectIndex: {value: 'guid', error: null},
    filterType: RECORD_FILTER_CRITERIA.NONE,
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
    outputReferenceIndex : { value: 'guid', error: null},
    sortField : { value:'', error:null},
    sortOrder : SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound : false,
    outputAssignments : [],
    queriedFields: [],
    object: { value: 'Account', error: null},
    objectIndex: {value: 'guid', error: null},
    filterType: RECORD_FILTER_CRITERIA.ALL,
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
    outputReferenceIndex : { value: 'guid', error: null},
    outputAssignments : [lookupField],
    sortField : { value:'', error:null},
    sortOrder : SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound : false,
    object: { value: 'Account', error: ''},
    objectIndex: {value: 'guid', error: null},
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
});

const recordLookupElementWithSObjectAutomaticOutputHandling = () => ({
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: 'testRecord', error: null },
    name : { value: 'testRecord', error: null },
    outputReference : undefined,
    outputReferenceIndex : { value: MOCK_GUID, error: null},
    sortField : { value:'', error:null},
    sortOrder : SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound : false,
    queriedFields: [
        {
         field:{value: "Id", error: null},
         rowIndex: MOCK_GUID
        }, {
         field:{value: "Name", error: null},
         rowIndex: MOCK_GUID
        }
    ],
    object: { value: 'Account', error: ''},
    objectIndex: {value: 'guid', error: null},
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
    storeOutputAutomatically : true,
    isCollection: false,
    subType: 'Account'
});

const outputAssignmentElement = {
    leftHandSide: {value: "Account.Address", error: null},
    rightHandSide: {value: "myAddress", error: null},
    rowIndex: "724cafc2-7744-4e46-8eaa-f2df29539d2e"
};

const getRecordStoreOption = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.recordStoreOption);
};

const getEntityResourcePicker = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.entityResourcePicker);
};

const getRecordFilter = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.recordFilter);
};

const getRecordSort = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.recordSort);
};

const getRecordSobjectAndQueryFields = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.recordSobjectAndQueryFields);
};

const getsObjectOrSObjectCollectionPicker = (recordSobjectAndQueryFields) => {
    return recordSobjectAndQueryFields.shadowRoot.querySelector(selectors.sObjectOrSObjectCollectionPicker);
};

const getInputOutputAssignments = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.inputOutputAssignments);
};

const getAdvancedOptionCheckbox = (recordLookupEditor) => {
    const useAdvancedOptionComponent = recordLookupEditor.shadowRoot.querySelector(selectors.useAdvancedOptionsCheckboxComponent);
    return useAdvancedOptionComponent.shadowRoot.querySelector(selectors.lightningInput);
};

const getAutomaticRecordStoreOptionsRadioGroup = (recordLookupEditor) => {
    const numberRecordToStoreComponent = recordLookupEditor.shadowRoot.querySelector(selectors.recordNumberOfRecordToStore);
    return numberRecordToStoreComponent.shadowRoot.querySelector(selectors.lightningRadioGroup);
};

const getAutomaticQueryFields = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.recordQueryFields);
};

const getAutomaticWayToStoreFields = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(selectors.lightningRadioGroup);
};

const getAllInteractionRows = (component) => {
    return component.shadowRoot.querySelectorAll(selectors.interactionRow);
};

const getFieldToFerovExBuilder = (component, index = 0) => {
    return getAllInteractionRows(component)[index].querySelector(selectors.fieldToFerovExBuilder);
};

describe('record-lookup-editor', () => {
    let recordLookupEditor;
    describe('with default values', () => {
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(defaultRecordLookupElement(), AddElementEvent.EVENT_NAME);
        });
        it('contains an entity resource picker for sobject', () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            expect(entityResourcePicker).not.toBeNull();
        });
        it('Other elements should not be visible', () => {
            expect(getRecordFilter(recordLookupEditor)).toBeNull();
            expect(getRecordStoreOption(recordLookupEditor)).toBeNull();
            expect(getRecordSort(recordLookupEditor)).toBeNull();
            expect(getRecordSobjectAndQueryFields(recordLookupEditor)).toBeNull();
        });
        it('should show other elements when changing the resource', () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            return Promise.resolve().then(() => {
                expect(getRecordFilter(recordLookupEditor)).not.toBeNull();
                expect(getRecordStoreOption(recordLookupEditor)).not.toBeNull();
                expect(getRecordSort(recordLookupEditor)).not.toBeNull();
                expect(getRecordSobjectAndQueryFields(recordLookupEditor)).not.toBeNull();
            });
        });
        it('should show other elements when selecting the resource', () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxItemSelectedEvent());
            return Promise.resolve().then(() => {
                expect(getRecordFilter(recordLookupEditor)).not.toBeNull();
                expect(getRecordStoreOption(recordLookupEditor)).not.toBeNull();
                expect(getRecordSort(recordLookupEditor)).not.toBeNull();
                expect(getRecordSobjectAndQueryFields(recordLookupEditor)).not.toBeNull();
            });
        });
    });
    describe('Existing record element remove "object"', () => {
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObject());
            const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent(eventDetailObjectWithError('', 'A value is required.')));
        });
        it('"recordFilter" should NOT be visible', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter).toBeNull();
        });
        it('"recordStoreOption" should NOT be visible', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption).toBeNull();
        });
        it('"recordSort" should NOT be visible', () => {
            const recordSort = getRecordSort(recordLookupEditor);
            expect(recordSort).toBeNull();
        });
        it('"recordQueryField" should NOT be visible', () => {
            const recordQueryField = getRecordSobjectAndQueryFields(recordLookupEditor);
            expect(recordQueryField).toBeNull();
        });
        it('"recordInputOutputAssignments" should NOT be visible', () => {
            const recordOutputAssignments = getInputOutputAssignments(recordLookupEditor);
            expect(recordOutputAssignments).toBeNull();
        });
    });
    describe('Existing record element typing invalid "object"', () => {
        let entityResourcePicker;
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(recordLookupElementWithSObject());
            entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent(eventDetailObjectWithError('invalidEntityName', 'Enter a valid value.')));
        });
        it('"recordFilter" should NOT be visible', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter).toBeNull();
        });
        it('"recordStoreOption" should NOT be visible', () => {
            const recordStoreOption = getRecordStoreOption(recordLookupEditor);
            expect(recordStoreOption).toBeNull();
        });
        it('"recordSort" should NOT be visible', () => {
            const recordSort = getRecordSort(recordLookupEditor);
            expect(recordSort).toBeNull();
        });
        it('"recordQueryField" should NOT be visible', () => {
            const recordQueryField = getRecordSobjectAndQueryFields(recordLookupEditor);
            expect(recordQueryField).toBeNull();
        });
        it('"recordInputOutputAssignments" should NOT be visible', () => {
            const recordOutputAssignments = getInputOutputAssignments(recordLookupEditor);
            expect(recordOutputAssignments).toBeNull();
        });
        it('"object" picker value should be set to empty string', () => {
            expect(entityResourcePicker.value).toBe("");
        });
    });
    describe('Edit existing record element using sObject', () => {
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
            const recordQueryField = getRecordSobjectAndQueryFields(recordLookupEditor);
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
        it('record filter type should be "none" ', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter.filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
        });
        it('record inputOutPutAssignments should not be visible', () => {
            const recordOutputAssignments = getInputOutputAssignments(recordLookupEditor);
            expect(recordOutputAssignments).toBeNull();
        });
    });
    describe('Edit existing record element using Fields', () => {
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
            const recordQueryField = getRecordSobjectAndQueryFields(recordLookupEditor);
            expect(recordQueryField).toBeNull();
        });
        it('record filterType should be "none" ', () => {
            const recordFilter = getRecordFilter(recordLookupEditor);
            expect(recordFilter.filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
        });
    });
    describe('Handle Events (using SObject)', () => {
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
                expect(recordLookupEditor.node.sortOrder).toBe(SORT_ORDER.ASC);
            });
        });
        it('change number record to store to All records, sObject picker should changed', () => {
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.ALL_RECORDS, '', false);
            getRecordStoreOption(recordLookupEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields);
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
                expect(recordLookupEditor.node.filterType).toBe(RECORD_FILTER_CRITERIA.ALL);
            });
        });
        it('reselect same "outputReference" should not reset query fields', () => {
            const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
            const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields);
            sObjectOrSObjectCollectionPicker.dispatchEvent(new SObjectReferenceChangedEvent(store.accountSObjectVariableGuid));
            return Promise.resolve().then(() => {
                expect(recordSobjectAndQueryFields.queriedFields[1].field.value).toBe('Name');
            });
        });
    });
    describe('Handle Events for existing element with filters', () => {
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
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(recordLookupElementWithFields());
        });
        it('change number record to store to All records, sObject picker should changed', () => {
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.FIRST_RECORD, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE, false);
            getRecordStoreOption(recordLookupEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields);
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
    describe('With automatic output handling enable', () => {
        describe('Without advanced option', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(recordLookupElementWithSObjectAutomaticOutputHandling(), EditElementEvent.EVENT_NAME, FLOW_PROCESS_TYPE);
            });
            it('record filter should be visible', () => {
                const recordFilter = getRecordFilter(recordLookupEditor);
                expect(recordFilter).not.toBeNull();
            });
            it('Number of record to store should be firstRecord', () => {
                const recordStoreOption = getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor);
                expect(recordStoreOption.value).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
            });
            it('Should display the fields selection', () => {
                const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordLookupEditor);
                expect(advancedOptionCheckbox).toBeDefined();
                expect(advancedOptionCheckbox.type).toBe('checkbox');
                expect(advancedOptionCheckbox.checked).toBe(false);
            });
            describe('Record query fields', () => {
               it('should be displayed', () => {
                   const recordQueryFields = getAutomaticQueryFields(recordLookupEditor);
                   expect(recordQueryFields).toBeDefined();
               });
               it('should have 2 fields', () => {
                   const recordQueryFields = getAutomaticQueryFields(recordLookupEditor);
                   expect(recordQueryFields.queriedFields[0].field.value).toBe('Id');
                   expect(recordQueryFields.queriedFields[1].field.value).toBe('Name');
               });
            });
            describe('Advanced Option checkbox', () => {
                it('Should be displayed', () => {
                    const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordLookupEditor);
                    expect(advancedOptionCheckbox).toBeDefined();
                    expect(advancedOptionCheckbox.type).toBe('checkbox');
                    expect(advancedOptionCheckbox.checked).toBe(false);
                });
                it('Should display the advanced option when checked', async () => {
                    const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordLookupEditor);
                    expect(recordLookupEditor.node.storeOutputAutomatically).toBe(true);
                    advancedOptionCheckbox.dispatchEvent(new ToggleOnChangeEvent());
                    return Promise.resolve().then(() => {
                        expect(recordLookupEditor.node.storeOutputAutomatically).toBe(false);
                        const wayToStoreFields = getAutomaticWayToStoreFields(recordLookupEditor);
                        expect(wayToStoreFields).toBeDefined();
                        expect(wayToStoreFields.value).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                    });
                });
            });
        });
        describe('With advanced option', () => {
            describe('using sObject', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(recordLookupElementWithSObject(), EditElementEvent.EVENT_NAME, FLOW_PROCESS_TYPE);
                });
                describe('Advanced Option checkbox', () => {
                    it('Should be displayed and checked', () => {
                        const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordLookupEditor);
                        expect(advancedOptionCheckbox).toBeDefined();
                        expect(advancedOptionCheckbox.type).toBe('checkbox');
                        expect(advancedOptionCheckbox.checked).toBe(true);
                    });
                    it('Should not display the advanced option when unchecked', async () => {
                        const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordLookupEditor);
                        expect(recordLookupEditor.node.storeOutputAutomatically).toBeFalsy();
                        advancedOptionCheckbox.dispatchEvent(new ToggleOffChangeEvent());
                        return Promise.resolve().then(() => {
                            expect(recordLookupEditor.node.storeOutputAutomatically).toBe(true);
                            const wayToStoreFields = getAutomaticWayToStoreFields(recordLookupEditor);
                            expect(wayToStoreFields).toBeNull();
                        });
                    });
                });
                it('Should display the sobject value', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                    const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields);
                    expect(sObjectOrSObjectCollectionPicker.placeholder).toBe('FlowBuilderRecordEditor.sObjectVariablePlaceholder');
                    expect(sObjectOrSObjectCollectionPicker.value).toBe('guid2');
                });
                it('should display the 2 fields', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                    expect(recordSobjectAndQueryFields.queriedFields[0].field.value).toBe('Id');
                    expect(recordSobjectAndQueryFields.queriedFields[1].field.value).toBe('Name');
                });
            });
            describe('using fields', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(recordLookupElementWithFields(), EditElementEvent.EVENT_NAME, FLOW_PROCESS_TYPE);
                });
                it('Should have Advanced Option checkbox displayed and checked', () => {
                    const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordLookupEditor);
                    expect(advancedOptionCheckbox).toBeDefined();
                    expect(advancedOptionCheckbox.type).toBe('checkbox');
                    expect(advancedOptionCheckbox.checked).toBe(true);
                });
                it('Should have Number of record to store be SeparateValue', () => {
                    const wayToStoreFields = getAutomaticWayToStoreFields(recordLookupEditor);
                    expect(wayToStoreFields.value).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
                });
                it('Should have Way to Store Fields be firstRecord', () => {
                    const recordStoreOption = getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor);
                    expect(recordStoreOption.value).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                });
                it('Should have the fields displayed', () => {
                    const recordOutputAssignments = getInputOutputAssignments(recordLookupEditor);
                    const fieldRows = getAllInteractionRows(recordOutputAssignments);
                    expect(fieldRows).toHaveLength(1);
                    const fieldToFerovExpBuilder = getFieldToFerovExBuilder(recordOutputAssignments);
                    expect(fieldToFerovExpBuilder.expression).toMatchObject(lookupField);
                });
            });
        });
        describe('dragged from canvas', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(defaultRecordLookupElement(), AddElementEvent.EVENT_NAME, FLOW_PROCESS_TYPE);
            });
            it('Should have Advanced Option checkbox displayed and unchecked', () => {
                const entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
                entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
                return Promise.resolve().then(() => {
                    const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordLookupEditor);
                    expect(advancedOptionCheckbox).toBeDefined();
                    expect(advancedOptionCheckbox.type).toBe('checkbox');
                    expect(advancedOptionCheckbox.checked).toBe(false);
                });
            });
        });
    });
});