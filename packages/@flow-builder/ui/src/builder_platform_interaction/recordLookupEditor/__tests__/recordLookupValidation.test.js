import { createElement } from 'lwc';
import RecordLookupEditor from "../recordLookupEditor";
import { recordLookupValidation, getRules } from "../recordLookupValidation.js";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { SORT_ORDER, RECORD_FILTER_CRITERIA, WAY_TO_STORE_FIELDS, NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";
import { LABELS } from "builder_platform_interaction/validationRules";

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder'));
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const validate = (node, event = {}) => {
    const rules = getRules(node, event);
    return getErrorsFromHydratedElement(recordLookupValidation.validateAll(node, rules));
};

const recordLookupElementWithValidSObject = () => ({
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : 'RECORDLOOKUP_1',
    isCanvasElement : true,
    label : { value: 'testRecord', error: null },
    name : { value: 'testRecord', error: null },
    outputReference : { value: 'AccountSObjectVar', error: null},
    sortField : { value:'Name', error:null},
    sortOrder : { value: SORT_ORDER.ASC, error: null},
    assignNullValuesIfNoRecordsFound : false,
    queriedFields: [
        {field: {value: 'Id', error: null}, rowIndex: '72cb7e19-9f98-4b59-9fdd-a276f216ddcf'},
        {field: {value: 'BillingAddress', error: null}, rowIndex: '73cb7e19-9f98-4b59-9fdd-a276f216ddcf'}],
    object: { value: 'Account', error: null},
    filterType: { error: null, value: RECORD_FILTER_CRITERIA.ALL},
    filters: [{
        leftHandSide: {value: "Account.BillingAddress", error: null},
        operator: {value: "EqualTo", error: null},
        rightHandSide: {value: "my address", error: null},
        rightHandSideDataType: {value: "String", error: null},
        rowIndex: '74cb7e19-9f98-4b59-9fdd-a276f216ddcf'
    }],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
}), recordLookupElementWithValidFields = () => ({
    description : { value: '', error: null },
    elementType : 'RECORD_LOOKUP',
    guid : '724cafc2-7744-4e46-8eaa-f2df29539d1e',
    isCanvasElement : true,
    label : { value: 'testRecord', error: null },
    name : { value: 'testRecord', error: null },
    sortField : { value:'Name', error:null},
    sortOrder : { value: SORT_ORDER.ASC, error: null},
    assignNullValuesIfNoRecordsFound : false,
    queriedFields: [
        {field: {value: 'Id', error: null}, rowIndex: '72cb7e19-9f98-4b59-9fdd-a276f216ddcf'},
        {field: {value: 'BillingAddress', error: null}, rowIndex: '73cb7e19-9f98-4b59-9fdd-a276f216ddcf'}],
    object: { value: 'Account', error: null},
    filterType: { error: null, value: RECORD_FILTER_CRITERIA.ALL},
    filters: [{
        leftHandSide: {value: "Account.BillingAddress", error: null},
        operator: {value: "EqualTo", error: null},
        rightHandSide: {value: "my address", error: null},
        rightHandSideDataType: {value: "String", error: null},
        rowIndex: "72cb7e19-9f98-4b59-9fdd-a276f216ddcf"
    }],
    outputAssignments:[{
        leftHandSide: {value: "Account.BillingCity", error: null},
        rightHandSide: {value: "vCity", error: null},
        rowIndex: "71cb7e19-9f98-4b59-9fdd-a276f216ddcf"
    }],
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
});

describe('Record Lookup Validation', () => {
    let recordLookupEditorNode, event;
    beforeEach(() => {
        recordLookupEditorNode = recordLookupElementWithValidSObject();
        event = {wayToStoreFields : WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE};
    });
    describe('node is valid', () => {
        it('returns no errors', () => {
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(0);
        });
    });
    describe('no label', () => {
        it('should return an error', () => {
            recordLookupEditorNode.label.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('label');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('no apiName', () => {
        it('should return an error', () => {
            recordLookupEditorNode.name.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('name');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('object is not valid', () => {
        const createRecordLookupEditor = (value, error) => {
            recordLookupEditorNode.object = {value, error};
            return createComponentForTest(recordLookupEditorNode);
        };
        it('should return 1 error only if object is blank', () => {
            const recordLookupEditor = createRecordLookupEditor('', LABELS.cannotBeBlank);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return 1 error only if object is invalid (but not blank)', () => {
            const recordLookupEditor = createRecordLookupEditor('AnInvalidObjectIAmBelieveMe', LABELS.enterValidValue);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe(LABELS.enterValidValue);
        });
    });
    describe('filter item is empty', () => {
        it('should return an error if leftHandSide is empty', () => {
            recordLookupEditorNode.filters[0].leftHandSide.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if operator is empty', () => {
            recordLookupEditorNode.filters[0].leftHandSide.value = 'Account.BillingAddress';
            recordLookupEditorNode.filters[0].operator.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('operator');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if rightHandSide is empty', () => {
            recordLookupEditorNode.filters[0].operator.value = 'EqualTo';
            recordLookupEditorNode.filters[0].rightHandSide.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('rightHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('sortField is not valid', () => {
        it('should return an error if sortField is blank', () => {
            recordLookupEditorNode.sortField.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('sortField');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if sortField is null', () => {
            recordLookupEditorNode.sortField.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('sortField');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
});
describe('Record Lookup Validation using sObject', () => {
    let recordLookupEditorNode, event;
    beforeEach(() => {
        recordLookupEditorNode = recordLookupElementWithValidSObject();
        event = {wayToStoreFields : WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE};
    });
    describe('outputReference is not valid', () => {
        const createRecordLookupEditor = (invalidOutputReference) => {
            recordLookupEditorNode.outputReference.value = invalidOutputReference;
            return createComponentForTest(recordLookupEditorNode);
        };
        it('should return an error if outputReference is blank', () => {
            const recordLookupEditor = createRecordLookupEditor('');
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('outputReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if outputReference is null', () => {
            const recordLookupEditor = createRecordLookupEditor(null);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('outputReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should not return 2 errors if outputReference is blank while object is blank', () => {
            const recordLookupEditor = createRecordLookupEditor('');
            recordLookupEditorNode.object.value = '';
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('queriedFields contains empty field', () => {
        it('should return an error', () => {
            recordLookupEditorNode.queriedFields.push({field: {value: '', error: null}, rowIndex: '75cb7e19-9f98-4b59-9fdd-a276f216ddcf'});
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('field');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        // W-5199678
        it('should not return an error if there is only one empty field and ID field', () => {
            recordLookupEditorNode.queriedFields = [{field: {value: 'ID', error: null}, rowIndex: '76cb7e19-9f98-4b59-9fdd-a276f216ddcf'}, {field: {value: '', error: null}, rowIndex: '77cb7e19-9f98-4b59-9fdd-a276f216ddcf'}, {field: {value: '', error: null}, rowIndex: '78cb7e19-9f98-4b59-9fdd-a276f216ddcf'}];
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            let errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(2);
            // now delete one empty row -> there are 'Id' and one empty row
            recordLookupEditorNode.queriedFields.splice(2, 1);
            errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(0);
        });
    });
});
describe('Record Lookup Validation using Fields', () => {
    let recordLookupEditorNode, event;
    beforeEach(() => {
        recordLookupEditorNode = recordLookupElementWithValidFields();
        event = {wayToStoreFields : WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES};
    });
    describe('inputAssignments item is empty', () => {
        it('should return an error when an outputAssignment lhs is set without a value', () => {
            recordLookupEditorNode.outputAssignments[0].leftHandSide.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error when an outputAssignment rhs does not have a value', () => {
            recordLookupEditorNode.outputAssignments[0].rightHandSide.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('rightHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return 2 errors when an outputAssignment does not have any value', () => {
            recordLookupEditorNode.outputAssignments[0].leftHandSide.value = '';
            recordLookupEditorNode.outputAssignments[0].rightHandSide.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node, event);
            expect(errors).toHaveLength(2);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
            expect(errors[1].key).toBe('rightHandSide');
            expect(errors[1].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
});