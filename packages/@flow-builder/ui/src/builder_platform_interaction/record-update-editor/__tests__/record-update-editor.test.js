import { createElement } from "lwc";
import RecordUpdateEditor from '../record-update-editor';
import { getShadowRoot } from 'lwc-test-utils';
import * as storeMockedData from 'mock-store-data';
import {  SObjectReferenceChangedEvent } from 'builder_platform_interaction-events';

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    fieldAssignmentNotSupported: '.fieldAssignmentNotSupported'
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
    inputReference : {value: storeMockedData.accountSObjectVariableGuid, error: null}
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
    inputAssignment : [{
        field: {value: "Industry", error: null},
        value: {stringValue: {value: "theIndustry", error: null}}
    }]
};

const getSObjectOrSObjectCollectionPicker = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.sObjectOrSObjectCollectionPicker);
};

const getFieldAssignmentNotSupportedDiv = (recordUpdateEditor) => {
    return getShadowRoot(recordUpdateEditor).querySelector(selectors.fieldAssignmentNotSupported);
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
        it('Message should be displayed : Field assignment is not supported', () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithFields);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            const fieldAssignmentNotSupportedDiv = getFieldAssignmentNotSupportedDiv(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker).toBeNull();
            expect(fieldAssignmentNotSupportedDiv).not.toBeNull();
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