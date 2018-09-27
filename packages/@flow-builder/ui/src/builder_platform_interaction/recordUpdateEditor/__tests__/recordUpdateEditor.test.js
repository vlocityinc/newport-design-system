import { createElement } from 'lwc';
import RecordUpdateEditor from "../recordUpdateEditor";
import { getShadowRoot } from 'lwc-test-utils';
import * as storeMockedData from "mock/storeData";
import {  SObjectReferenceChangedEvent } from "builder_platform_interaction/events";
import { NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";
import { mockAccountFields } from "mock/serverEntityData";

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker'
};

const recordUpdateElementWithSObject = {
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

const recordUpdateElementWithFields = {
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

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetch: jest.fn().mockImplementation((actionType, callback) => {
            callback({
                data: JSON.stringify(mockAccountFields),
            });
        }),
        SERVER_ACTION_TYPE: require.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE,
    };
});

const getSObjectOrSObjectCollectionPicker = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.sObjectOrSObjectCollectionPicker);
};

const getEntityResourcePicker = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.entityResourcePicker);
};

describe('record-update-editor', () => {
    describe('Edit existing record element using sObject', () => {
        it('Selected sObject should be the same', () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithSObject);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariableGuid);
        });
    });
    describe('Edit existing record element using fields assignment', () => {
        it('entity resource picker should be visible & sObject picker should not be visible', () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithFields);
            const entityResourcePicker = getEntityResourcePicker(recordUpdateEditor);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker).toBeNull();
            expect(entityResourcePicker).not.toBeNull();
        });
    });
    describe('Handle Events', () => {
        it('handle Input Reference Changed', () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithSObject);
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