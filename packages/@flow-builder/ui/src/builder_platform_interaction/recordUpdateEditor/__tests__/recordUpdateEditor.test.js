import { createElement } from 'lwc';
import RecordUpdateEditor from "../recordUpdateEditor";
import { getShadowRoot } from 'lwc-test-utils';
import * as storeMockedData from "mock/storeData";
import {  SObjectReferenceChangedEvent } from "builder_platform_interaction/events";
import { NUMBER_RECORDS_TO_STORE, RECORD_FILTER_CRITERIA } from "builder_platform_interaction/recordEditorLib";
import { mockAccountFields } from "mock/serverEntityData";
import { RecordStoreOptionChangedEvent,
    AddRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    RecordLookupFilterTypeChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent, } from "builder_platform_interaction/events";

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    recordFilter: 'builder_platform_interaction-record-filter',
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    inputOutputAssignments: 'builder_platform_interaction-record-input-output-assignments',
};

const defaultRecordUpdateElement = () => {
    return {
        description : { value: '', error: null },
        elementType : 'RECORD_UPDATE',
        guid : 'RECORDUPDATE_1',
        isCanvasElement : true,
        label : { value: '', error: null },
        name : { value: '', error: null },
        numberRecordsToStore : {value: NUMBER_RECORDS_TO_STORE.FIRST_RECORD, error: null},
        inputReference : { value: '', error: null},
        object: { value: '', error: null},
        filters: [],
        inputAssignments: []

    };
};

const recordUpdateElementWithSObject = () => {
    return {
        description : {value: '', error: null},
        elementType : 'RECORD_UPDATE',
        guid : 'RECORDUPDATE_1',
        isCanvasElement : true,
        label : {value: 'testRecord', error: null},
        locationX : 358,
        locationY : 227,
        name : {value: 'testRecord', error: null},
        numberRecordsToStore : {value: NUMBER_RECORDS_TO_STORE.FIRST_RECORD, error: null},
        inputReference : {value: storeMockedData.accountSObjectVariableGuid, error: null},
        object : {value: null, error: null},
    };
};

const recordUpdateElementWithFields = () => {
    return {
        description : {value: '', error: null},
        elementType : 'RECORD_UPDATE',
        guid : 'RECORDUPDATE_2',
        isCanvasElement : true,
        label : {value: 'testRecordFields', error: null},
        locationX : 358,
        locationY : 227,
        name : {value: 'testRecordFields', error: null},
        numberRecordsToStore : {value: NUMBER_RECORDS_TO_STORE.ALL_RECORDS, error: null},
        inputAssignments : [{
            leftHandSide: {value: "Account.BillingCountry", error: null},
            rightHandSide: {value: "myCountry", error: null},
            rightHandSideDataType: {value: "String", error: null},
            rightHandSideGuid: {value: "myCountry", error: null},
            rowIndex: "724cafc2-7744-4e46-8eaa-f2df29539d1d"}],
        filters: [],
        filterType: {value: "all", error: null},
        object : {value: 'account', error: null},
    };
};

const filterElement = {
    leftHandSide: {value: "Account.Id", error: null},
    operator: {value: "EqualTo", error: null},
    rightHandSide: {value: "{!myFormula1}", error: null},
    rightHandSideDataType: {value: "reference", error: null},
    rightHandSideGuid: {value: "FORMULA_8", error: null}
};

const inputAssignmentElement = {
    leftHandSide: {value: "Account.Address", error: null},
    rightHandSide: {value: "myAddress", error: null},
    rightHandSideDataType: {value: "String", error: null},
    rightHandSideGuid: {value: "myAddress", error: null},
    rowIndex: "724cafc2-7744-4e46-8eaa-f2df29539d2e"
};

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetch: (actionType, callback) => {
            callback({
                data: JSON.stringify(mockAccountFields),
            });
        },
        SERVER_ACTION_TYPE: require.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE,
    };
});

const getSObjectOrSObjectCollectionPicker = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.sObjectOrSObjectCollectionPicker);
};

const getEntityResourcePicker = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.entityResourcePicker);
};

const getRecordStoreOption = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.recordStoreOption);
};

const getRecordFilter = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.recordFilter);
};

const getInputOutputAssignments = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.inputOutputAssignments);
};

describe('record-update-editor', () => {
    describe('with default values', () => {
        let recordUpdateEditor;
        beforeEach(() => {
            recordUpdateEditor = createComponentForTest(defaultRecordUpdateElement());
        });
        it('contains an entity resource picker for sobject', () => {
            const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectPicker).not.toBeNull();
        });
        it('contains an record store option component', () => {
            const recordStoreOption = getRecordStoreOption(recordUpdateEditor);
            expect(recordStoreOption).not.toBeNull();
        });
        it('Other elements should not be visible', () => {
            expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
            expect(getRecordFilter(recordUpdateEditor)).toBeNull();
            expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
        });
    });
});

describe('record-update-editor using sObject', () => {
    describe('Edit existing record element', () => {
        it('Selected sObject should be the same', () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithSObject());
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariableGuid);
        });
    });
    describe('Handle Events', () => {
        it('handle Input Reference Changed', () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithSObject());
            const event = new SObjectReferenceChangedEvent(storeMockedData.accountSObjectVariableGuid, null);
            let sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            sObjectOrSObjectCollectionPicker.dispatchEvent(event);
            return Promise.resolve().then(() => {
                sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariableGuid);
            });
        });
    });
});
describe('record-update-editor usung fields', () => {
    let recordUpdateEditor;
    beforeEach(() => {
        recordUpdateEditor = createComponentForTest(recordUpdateElementWithFields());
    });
    describe('Edit existing record element using fields assignment', () => {
        it('entity resource picker should be visible & sObject picker should not be visible', () => {
            const entityResourcePicker = getEntityResourcePicker(recordUpdateEditor);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker).toBeNull();
            expect(entityResourcePicker).not.toBeNull();
        });
    });
    describe('Handle Events', () => {
        it('change number record to store to All records, sObject picker should changed', () => {
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.FIRST_RECORD, '', false);
            getRecordStoreOption(recordUpdateEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });
        });
        it('handle UpdateRecordLookupFilterEvent should update the filter element', () => {
            const updateRecordLookupFilterEvent = new UpdateRecordLookupFilterEvent(0, filterElement, null);
            getRecordFilter(recordUpdateEditor).dispatchEvent(updateRecordLookupFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordUpdateEditor.node.filters[0]).toMatchObject(filterElement);
            });
        });
        it('handle AddRecordLookupFilterEvent should add a filter element', () => {
            const addRecordLookupFilterEvent = new AddRecordLookupFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordUpdateEditor).dispatchEvent(addRecordLookupFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordUpdateEditor.node.filters).toHaveLength(1);
            });
        });
        it('record filter fire DeleteRecordLookupFilterEvent', () => {
            const deleteRecordLookupFilterEvent = new DeleteRecordLookupFilterEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordUpdateEditor).dispatchEvent(deleteRecordLookupFilterEvent);
            return Promise.resolve().then(() => {
                expect(recordUpdateEditor.node.filters).toHaveLength(0);
            });
        });
        it('handle AddRecordFieldAssignmentEvent should add an input Assignments element', () => {
            const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
            getInputOutputAssignments(recordUpdateEditor).dispatchEvent(addRecordFieldAssignmentEvent);
            return Promise.resolve().then(() => {
                expect(recordUpdateEditor.node.inputAssignments).toHaveLength(2);
            });
        });
        it('handle UpdateRecordFieldAssignmentEvent should update the input Assignments element', () => {
            const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(0, inputAssignmentElement, null);
            getInputOutputAssignments(recordUpdateEditor).dispatchEvent(updateRecordFieldAssignmentEvent);
            return Promise.resolve().then(() => {
                expect(recordUpdateEditor.node.inputAssignments[0]).toMatchObject(inputAssignmentElement);
            });
        });
        it('handle DeleteRecordFieldAssignmentEvent should delete the input assignment', () => {
            const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getInputOutputAssignments(recordUpdateEditor).dispatchEvent(deleteRecordFieldAssignmentEvent);
            return Promise.resolve().then(() => {
                expect(recordUpdateEditor.node.inputAssignments).toHaveLength(0);
            });
        });
        it('handle record filter type Change event', () => {
            const recordUpdateFilterTypeChangedEvent = new RecordLookupFilterTypeChangedEvent(RECORD_FILTER_CRITERIA.ALL);
            getRecordFilter(recordUpdateEditor).dispatchEvent(recordUpdateFilterTypeChangedEvent);
            return Promise.resolve().then(() => {
                expect(recordUpdateEditor.node.filterType.value).toBe(RECORD_FILTER_CRITERIA.ALL);
            });
        });
    });
});