import { createElement } from 'engine';
import RecordLookupEditor from '../record-lookup-editor';
import { recordLookupValidation, getRules } from '../record-lookup-validation.js';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { SORT_ORDER, RECORD_FILTER_CRITERIA } from 'builder_platform_interaction-record-editor-lib';
import { LABELS } from 'builder_platform_interaction-validation-rules';

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const validate = (node) => {
    const rules = getRules(node);
    return getErrorsFromHydratedElement(recordLookupValidation.validateAll(node, rules));
};

describe('Record Lookup Validation', () => {
    let recordLookupEditorNode;
    beforeEach(() => {
        recordLookupEditorNode = {
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
            outputAssignments : [],
            queriedFields: [
                {field: {value: 'Id', error: null}, rowIndex: "RECORDLOOKUPFIELD_1"},
                {field: {value: 'BillingAddress', error: null}, rowIndex: "RECORDLOOKUPFIELD_2"}],
            object: { value: 'Account', error: null},
            filterType: { error: null, value: RECORD_FILTER_CRITERIA.ALL},
            filters: [{
                leftHandSide: {value: "Account.BillingAddress", error: null},
                operator: {value: "EqualTo", error: null},
                rightHandSide: {value: "my address", error: null},
                rightHandSideDataType: {value: "String", error: null},
                rowIndex: "RECORDLOOKUPFILTERITEM_1"
            }],
        };
    });
    describe('node is valid', () => {
        it('returns no errors', () => {
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(0);
        });
    });
    describe('outputReference is not valid', () => {
        const createRecordLookupEditor = (invalidOutputReference) => {
            recordLookupEditorNode.outputReference.value = invalidOutputReference;
            return createComponentForTest(recordLookupEditorNode);
        };
        it('should return an error if outputReference is blank', () => {
            const recordLookupEditor = createRecordLookupEditor('');
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('outputReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if outputReference is null', () => {
            const recordLookupEditor = createRecordLookupEditor(null);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('outputReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('object is not valid', () => {
        const createRecordLookupEditor = (invalidObject) => {
            recordLookupEditorNode.object.value = invalidObject;
            return createComponentForTest(recordLookupEditorNode);
        };
        it('should return an error if object is blank', () => {
            const recordLookupEditor = createRecordLookupEditor('');
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('filter item is empty', () => {
        it('should return an error if leftHandSide is empty', () => {
            recordLookupEditorNode.filters[0].leftHandSide.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if operator is empty', () => {
            recordLookupEditorNode.filters[0].leftHandSide.value = 'Account.BillingAddress';
            recordLookupEditorNode.filters[0].operator.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('operator');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if rightHandSide is empty', () => {
            recordLookupEditorNode.filters[0].operator.value = 'EqualTo';
            recordLookupEditorNode.filters[0].rightHandSide.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('rightHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('sortField is not valid', () => {
        it('should return an error if sortField is blank', () => {
            recordLookupEditorNode.sortField.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('sortField');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if sortField is null', () => {
            recordLookupEditorNode.sortField.value = '';
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('sortField');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('queriedFields contains empty field', () => {
        it('should return an error', () => {
            recordLookupEditorNode.queriedFields.push({field: {value: '', error: null}, rowIndex: "RECORDLOOKUPFIELD_3"});
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            const errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('field');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        // W-5199678
        it('should not return an error if there is only one empty field and ID field', () => {
            recordLookupEditorNode.queriedFields = [{field: {value: 'ID', error: null}, rowIndex: "RECORDLOOKUPFIELD_1"}, {field: {value: '', error: null}, rowIndex: "RECORDLOOKUPFIELD_2"}, {field: {value: '', error: null}, rowIndex: "RECORDLOOKUPFIELD_3"}];
            const recordLookupEditor = createComponentForTest(recordLookupEditorNode);
            let errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(2);
            // now delete one empty row -> there are 'Id' and one empty row
            recordLookupEditorNode.queriedFields.splice(2, 1);
            errors = validate(recordLookupEditor.node);
            expect(errors).toHaveLength(0);
        });
    });
});