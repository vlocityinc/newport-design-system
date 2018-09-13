import { createElement } from 'lwc';
import RecordCreateEditor from "../recordCreateEditor";
import { getShadowRoot } from 'lwc-test-utils';
import * as expressionUtilsMock from "builder_platform_interaction/expressionUtils";
import * as store from "mock/storeData";
import { RecordStoreOptionChangedEvent, SObjectReferenceChangedEvent } from "builder_platform_interaction/events";
import { NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-create-editor', { is: RecordCreateEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
}

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getResourceByUniqueIdentifier: jest.fn(),
    };
});

const selectors = {
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    lightningRadioGroup: 'lightning-radio-group',
    fieldAssignmentNotSupported: '.fieldAssignmentNotSupported'
};

const recordCreateElementWithSObject = {
    description : {value: '', error: null},
    elementType : 'RECORD_CREATE',
    guid : 'RECORDCREATE_1',
    isCanvasElement : true,
    label : {value: 'testRecord', error: null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testRecord', error: null},
    inputReference : {value: store.accountSObjectVariableGuid, error: null}
};

const recordCreateElementWithFields = {
    description : {value: '', error: null},
    elementType : 'RECORD_CREATE',
    guid : 'RECORDCREATE_2',
    isCanvasElement : true,
    label : {value: 'testRecordFields', error: null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testRecordFields', error: null},
    inputAssignment : [{
        field: {value: "Industry", error: null},
        value: {stringValue: {value: "theIndustry", error: null}}
    }]
};

const getRecordStoreOption = (recordCreateEditor) => {
    return getShadowRoot(recordCreateEditor).querySelector(selectors.recordStoreOption);
};

const getSObjectOrSObjectCollectionPicker = (recordCreateEditor) => {
    return getShadowRoot(recordCreateEditor).querySelector(selectors.sObjectOrSObjectCollectionPicker);
};

const getFieldAssignmentNotSupportedDiv = (recordCreateEditor) => {
    return getShadowRoot(recordCreateEditor).querySelector(selectors.fieldAssignmentNotSupported);
};

describe('record-create-editor', () => {
    describe('Edit existing record element using sObject', () => {
        let recordCreateEditor;
        it('Number of record to store should be firstRecord', () => {
            const sobjectVariableElement = store.elements[store.accountSObjectVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(sobjectVariableElement);
            recordCreateEditor = createComponentForTest(recordCreateElementWithSObject);
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
        });
        it('Number of record to store should be allRecord', () => {
            const sobjectCollectionVariableElement = store.elements[store.accountSObjectCollectionVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(sobjectCollectionVariableElement);
            recordCreateEditor = createComponentForTest(recordCreateElementWithSObject);
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
        });
        it('Selected sObject should be the same', () => {
            recordCreateEditor = createComponentForTest(recordCreateElementWithSObject);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
            expect(sObjectOrSObjectCollectionPicker.value).toBe(store.accountSObjectVariableGuid);
        });
    });
    describe('Edit existing record element using fields assignment', () => {
        it('Message should be displayed : Field assignment is not supported', () => {
            const recordCreateEditor = createComponentForTest(recordCreateElementWithFields);
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
            const fieldAssignmentNotSupportedDiv = getFieldAssignmentNotSupportedDiv(recordCreateEditor);
            expect(recordStoreOption).toBeNull();
            expect(sObjectOrSObjectCollectionPicker).toBeNull();
            expect(fieldAssignmentNotSupportedDiv).not.toBeNull();
        });
    });
    describe('Handle Events', () => {
        let recordCreateEditor;
        beforeEach(() => {
            const sObjectVariableElement = store.elements[store.accountSObjectVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(sObjectVariableElement);
            recordCreateEditor = createComponentForTest(recordCreateElementWithSObject);
        });
        it('Number of record change should empty the sObject picker', () => {
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.ALL_RECORDS, '', false);
            getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });
        });
        it('Number of record change should change the sObject or sObject Collection picker placeHolder', () => {
            let sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
            expect(sObjectOrSObjectCollectionPicker.placeholder).toBe('FlowBuilderRecordEditor.sObjectVariablePlaceholder');
            const event = new RecordStoreOptionChangedEvent(NUMBER_RECORDS_TO_STORE.ALL_RECORDS, '', false);
            getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                expect(sObjectOrSObjectCollectionPicker.placeholder).toBe('FlowBuilderRecordEditor.sObjectCollectionVariablePlaceholder');
            });
        });
        it('handle Input Reference Changed', () => {
            const event = new SObjectReferenceChangedEvent('sObj2', null);
            getSObjectOrSObjectCollectionPicker(recordCreateEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe('sObj2');
            });
        });
    });
});