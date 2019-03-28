import { createElement } from 'lwc';
import { recordCreateValidation, getRules } from "../recordCreateValidation";
import RecordCreateEditor from "../recordCreateEditor";
import * as storeMockedData from "mock/storeData";
import { LABELS } from "builder_platform_interaction/validationRules";
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder'));
jest.mock('builder_platform_interaction/outputResourcePicker', () => require('builder_platform_interaction_mocks/outputResourcePicker'));
jest.mock('builder_platform_interaction/expressionValidator', () => require('builder_platform_interaction_mocks/expressionValidator'));

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordCreateEditor });
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const recordCreateElementWithValidSObject = {
    description : {value: '', error: null},
    elementType : 'RECORD_CREATE',
    guid : 'RECORDCREATE_1',
    isCanvasElement : true,
    label : {value: 'testRecord', error: null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testRecord', error: null},
    numberRecordsToStore : {value: NUMBER_RECORDS_TO_STORE.FIRST_RECORD, error: null},
    inputReference : {value: storeMockedData.accountSObjectVariableGuid, error: null},
    object : {value: '', error: null},
    objectIndex: {value: 'guid', error: null},
    assignRecordIdToReference: {value: '', error: null},
};

const recordCreateElementWithValidSObjectCollection = {
    description : {value: '', error: null},
    elementType : 'RECORD_CREATE',
    guid : 'RECORDCREATE_1',
    isCanvasElement : true,
    label : {value: 'testRecord', error: null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testRecord', error: null},
    numberRecordsToStore : {value: NUMBER_RECORDS_TO_STORE.ALL_RECORDS, error: null},
    inputReference : {value: storeMockedData.accountSObjectCollectionVariableGuid, error: null},
    object : {value: '', error: null},
    objectIndex: {value: 'guid', error: null},
    assignRecordIdToReference: {value: '', error: null},
};


const recordCreateUsingFieldsTemplate = () => ({
    description : {value: '', error: null},
    elementType : 'RECORD_CREATE',
    guid : 'RECORDUPDATE_2',
    isCanvasElement : true,
    label : {value: 'testRecordFields', error: null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testRecordFields', error: null},
    inputReference : {value: '', error: null},
    numberRecordsToStore : {value: NUMBER_RECORDS_TO_STORE.FIRST_RECORD, error: null},
    inputAssignments : [{
        leftHandSide: {value: "Account.BillingCountry", error: null},
        rightHandSide: {value: "myCountry", error: null},
        rightHandSideDataType: {value: "String", error: null},
        rightHandSideGuid: {value: "myCountry", error: null},
        rowIndex: "724cafc2-7744-4e46-8eaa-f2df29539d1d"}
    ],
    object : {value: 'account', error: null},
    objectIndex: {value: 'guid', error: null},
    assignRecordIdToReference: {value: 'varToStoreId', error: null},
});

const validate = (node, wayToStoreFields) => {
    const rules = getRules(node, wayToStoreFields);
    return getErrorsFromHydratedElement(recordCreateValidation.validateAll(node, rules));
};

describe('Check validations update using sObject', () => {
    describe('when props set to inputReference', () => {
        it('should return same object if valid', () => {
            expect(recordCreateValidation.validateAll(recordCreateElementWithValidSObject)).toEqual(recordCreateElementWithValidSObject);
        });
        it('should return an error if blank', () => {
            recordCreateElementWithValidSObject.inputReference.value = '';
            const validatedRecordUpdate =  recordCreateValidation.validateAll(recordCreateElementWithValidSObject, getRules(recordCreateElementWithValidSObject, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE));
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if null', () => {
            recordCreateElementWithValidSObject.inputReference.value = null;
            const validatedRecordUpdate =  recordCreateValidation.validateAll(recordCreateElementWithValidSObject, getRules(recordCreateElementWithValidSObject, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE));
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
    });
});
describe('Check validations update using sObject Collection', () => {
    describe('when props set to inputReference', () => {
        it('should return same object if valid', () => {
            expect(recordCreateValidation.validateAll(recordCreateElementWithValidSObjectCollection)).toEqual(recordCreateElementWithValidSObjectCollection);
        });
        it('should return an error if blank', () => {
            recordCreateElementWithValidSObjectCollection.inputReference.value = '';
            const validatedRecordUpdate =  recordCreateValidation.validateAll(recordCreateElementWithValidSObjectCollection, getRules(recordCreateElementWithValidSObjectCollection, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE));
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if null', () => {
            recordCreateElementWithValidSObjectCollection.inputReference.value = null;
            const validatedRecordUpdate =  recordCreateValidation.validateAll(recordCreateElementWithValidSObjectCollection, getRules(recordCreateElementWithValidSObjectCollection));
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
    });
});
describe('Check validations update using fields', () => {
    let recordCreateUsingFields;
    beforeEach(() => {
        recordCreateUsingFields = recordCreateUsingFieldsTemplate();
    });
    describe('object is empty', () => {
        it('should return an error when no object has been selected', () => {
            recordCreateUsingFields.object.value = '';
            const recordupdateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordupdateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('object is not valid and assignment is empty', () => {
        it('should return 1 error', () => {
            recordCreateUsingFields.inputAssignments[0].leftHandSide.value = '';
            recordCreateUsingFields.object.value = 'myNotValidValue';
            recordCreateUsingFields.object.error = 'Enter a valid value.';
            const recordupdateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordupdateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe('Enter a valid value.');
        });
    });
    describe('inputAssignments item is empty', () => {
        it('should not return an error when an inputAssignment is set without a value', () => {
            recordCreateUsingFields.inputAssignments[0].leftHandSide.value = '';
            const recordupdateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordupdateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(0);
        });
        it('should return 2 errors when 2 inputAssignments are set without a value', () => {
            recordCreateUsingFields.inputAssignments[0].leftHandSide.value = '';
            recordCreateUsingFields.inputAssignments.push({
                leftHandSide: {value: "", error: null},
                rightHandSide: {value: "", error: null},
                rowIndex: "71cb7e19-9f98-4b59-9fdd-a276f216eede"
            });
            const recordupdateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordupdateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(2);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
            expect(errors[1].key).toBe('leftHandSide');
            expect(errors[1].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error when 1 of 2 inputAssignments is set without a value', () => {
            recordCreateUsingFields.inputAssignments.push({
                leftHandSide: {value: "", error: null},
                rightHandSide: {value: "", error: null},
                rowIndex: "71cb7e19-9f98-4b59-9fdd-a276f216eede"
            });
            const recordupdateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordupdateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
});