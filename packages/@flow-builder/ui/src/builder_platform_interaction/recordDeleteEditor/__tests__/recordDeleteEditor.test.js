import {createElement} from 'lwc';
import RecordDeleteEditor from '../recordDeleteEditor';
import {getShadowRoot} from 'lwc-test-utils';
import * as storeMockedData from 'mock/storeData';
import {SObjectReferenceChangedEvent} from 'builder_platform_interaction/events';

const createComponentForTest = node => {
    const el = createElement('builder_platform_interaction-recordDeleteEditor', { is: RecordDeleteEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    sObjectOrSObjectCollectionVariablePicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    fieldAssignmentNotSupportedDiv: '.fieldAssignmentNotSupported'
};

const recordDeleteElementWithSObjectVariable = {
    elementType : 'RECORD_DELETE',
    guid : 'RECORDDELETE_1',
    label : {value: 'testRecordSObjectMode', error: null},
    name : {value: 'testRecordSObjectMode', error: null},
    description : {value: '', error: null},
    inputReference : {value: storeMockedData.accountSObjectVariableGuid, error: null}
};

const recordDeleteElementWithFields = {
    elementType : 'RECORD_DELETE',
    guid : 'RECORDDELETE_2',
    label : {value: 'testRecordFieldsMode', error: null},
    name : {value: 'testRecordFieldsMode', error: null},
    description : {value: '', error: null},
};

const getSObjectOrSObjectCollectionVariablePicker = recordDeleteEditor => getShadowRoot(recordDeleteEditor).querySelector(selectors.sObjectOrSObjectCollectionVariablePicker);
const getFieldAssignmentNotSupportedDiv = recordDeleteEditor => getShadowRoot(recordDeleteEditor).querySelector(selectors.fieldAssignmentNotSupportedDiv);

describe('record-delete-editor', () => {
    describe('Delete record element using sObject variable', () => {
        test('Initialy selected sObject variable', () => {
            const recordDeleteEditor = createComponentForTest(recordDeleteElementWithSObjectVariable);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionVariablePicker(recordDeleteEditor);
            expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariableGuid);
        });

        describe('Handle Events', () => {
            test('handle "Input Reference" value changed', () => {
                const recordDeleteEditor = createComponentForTest(recordDeleteElementWithSObjectVariable);
                let sObjectOrSObjectCollectionVariablePicker = getSObjectOrSObjectCollectionVariablePicker(recordDeleteEditor);
                sObjectOrSObjectCollectionVariablePicker.dispatchEvent(new SObjectReferenceChangedEvent(storeMockedData.accountSObjectCollectionVariableGuid));
                return Promise.resolve().then(() => {
                    sObjectOrSObjectCollectionVariablePicker = getSObjectOrSObjectCollectionVariablePicker(recordDeleteEditor);
                    expect(sObjectOrSObjectCollectionVariablePicker.value).toBe(storeMockedData.accountSObjectCollectionVariableGuid);
                });
            });
        });
    });
    describe('Delete record element using fields assignment (not supported yet)', () => {
        let recordDeleteEditor;
        beforeEach(() => {
            recordDeleteEditor = createComponentForTest(recordDeleteElementWithFields);
        });
        test('SObject variable picker should not be displayed', () => {
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionVariablePicker(recordDeleteEditor);
            expect(sObjectOrSObjectCollectionPicker).toBeNull();
        });
        test('Field assignment is not supported error message should be displayed', () => {
            const fieldAssignmentNotSupportedDiv = getFieldAssignmentNotSupportedDiv(recordDeleteEditor);
            expect(fieldAssignmentNotSupportedDiv).not.toBeNull();
            expect(fieldAssignmentNotSupportedDiv.textContent).toBe('FlowBuilderRecordEditor.fieldAssignmentNotSupportedForDelete');
        });
    });
});