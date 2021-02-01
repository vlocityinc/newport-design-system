// @ts-nocheck
import { createElement } from 'lwc';
import { recordCreateValidation, getRules } from '../recordCreateValidation';
import RecordCreateEditor from '../recordCreateEditor';
import * as storeMockedData from 'mock/storeData';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/expressionValidator', () =>
    require('builder_platform_interaction_mocks/expressionValidator')
);

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordCreateEditor });
    el.node = node;
    setDocumentBodyChildren(el);
    return el;
}

const recordCreateElementWithValidSObject = {
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: '9eb3fb86-af70-4117-8b77-8aa17e1e3005',
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateElementWithValidSObject', error: null },
    name: { value: 'testRecordCreateElementWithValidSObject', error: null },
    getFirstRecordOnly: true,
    inputReference: {
        value: storeMockedData.accountSObjectVariable.guid,
        error: null
    },
    object: { value: '', error: null },
    objectIndex: { value: '1ab3fb86-af70-4117-8b77-8aa17e1e3005', error: null },
    assignRecordIdToReference: { value: '', error: null }
};
const recordCreateElementWithValidSObjectCollection = {
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: '9eb3fb86-af70-4117-8b77-8aa17e1e3005',
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateElementWithValidSObjectCollection', error: null },
    name: { value: 'testRecordCreateElementWithValidSObjectCollection', error: null },
    getFirstRecordOnly: false,
    inputReference: {
        value: storeMockedData.accountSObjectCollectionVariable.guid,
        error: null
    },
    object: { value: '', error: null },
    objectIndex: { value: '4db3fb86-af70-4117-8b77-8aa17e1e3005', error: null },
    assignRecordIdToReference: { value: '', error: null }
};
const recordCreateUsingFieldsTemplate = () => ({
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: '9eb3fb86-af70-4117-8b77-8aa17e1e3005',
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateUsingFieldsTemplate', error: null },
    name: { value: 'testRecordCreateUsingFieldsTemplate', error: null },
    inputReference: { value: '', error: null },
    inputReferenceIndex: { value: '1cb3fb86-af70-4117-8b77-8aa17e1e3005', error: null },
    getFirstRecordOnly: true,
    assignRecordIdToReferenceIndex: { value: '3eb3fb86-af70-4117-8b77-8aa17e1e3005', error: null },
    inputAssignments: [
        {
            leftHandSide: { value: 'Account.BillingCountry', error: null },
            rightHandSide: { value: 'myCountry', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            rightHandSideGuid: { value: '3eb3fb86-af70-4117-8b77-8aa17e1e3005', error: null },
            rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d1d'
        }
    ],
    object: { value: 'account', error: null },
    objectIndex: { value: '725cafc2-7744-4e46-8eaa-f2df29539d1d', error: null },
    assignRecordIdToReference: { value: '142cafc2-7744-4e46-8eaa-f2df29539d1d', error: null }
});

const validate = (node, wayToStoreFields) => {
    const rules = getRules(node, wayToStoreFields);
    return getErrorsFromHydratedElement(recordCreateValidation.validateAll(node, rules));
};

describe('Check validations update using sObject', () => {
    describe('when props set to inputReference', () => {
        it('should return same object if valid', () => {
            expect(recordCreateValidation.validateAll(recordCreateElementWithValidSObject)).toEqual(
                recordCreateElementWithValidSObject
            );
        });
        it('should return an error if blank', () => {
            recordCreateElementWithValidSObject.inputReference.value = '';
            const validatedRecordUpdate = recordCreateValidation.validateAll(
                recordCreateElementWithValidSObject,
                getRules(recordCreateElementWithValidSObject, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE)
            );
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if null', () => {
            recordCreateElementWithValidSObject.inputReference.value = null;
            const validatedRecordUpdate = recordCreateValidation.validateAll(
                recordCreateElementWithValidSObject,
                getRules(recordCreateElementWithValidSObject, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE)
            );
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
    });
});
describe('Check validations update using sObject Collection', () => {
    describe('when props set to inputReference', () => {
        it('should return same object if valid', () => {
            expect(recordCreateValidation.validateAll(recordCreateElementWithValidSObjectCollection)).toEqual(
                recordCreateElementWithValidSObjectCollection
            );
        });
        it('should return an error if blank', () => {
            recordCreateElementWithValidSObjectCollection.inputReference.value = '';
            const validatedRecordUpdate = recordCreateValidation.validateAll(
                recordCreateElementWithValidSObjectCollection,
                getRules(recordCreateElementWithValidSObjectCollection, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE)
            );
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if null', () => {
            recordCreateElementWithValidSObjectCollection.inputReference.value = null;
            const validatedRecordUpdate = recordCreateValidation.validateAll(
                recordCreateElementWithValidSObjectCollection,
                getRules(recordCreateElementWithValidSObjectCollection)
            );
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
    });
});
describe('Check validations update using fields', () => {
    let recordCreateUsingFields, recordCreateEditor;
    beforeEach(() => {
        recordCreateUsingFields = recordCreateUsingFieldsTemplate();
    });
    describe('object is empty', () => {
        it('should return an error when no object has been selected', () => {
            recordCreateUsingFields.object = { value: '', error: null };
            recordCreateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordCreateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toEqual({ key: 'object', errorString: LABELS.cannotBeBlank });
        });
    });
    describe('id is empty (ie: "assignRecordIdToReference")', () => {
        it('should NOT return an error when no id has been selected', () => {
            recordCreateUsingFields.assignRecordIdToReference = { value: '', error: null };
            recordCreateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordCreateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(0);
        });
    });
    describe('object is not valid and assignment is empty', () => {
        it('should return 1 error', () => {
            recordCreateUsingFields.inputAssignments[0].leftHandSide.value = '';
            recordCreateUsingFields.object = { value: 'myNotValidValue', error: 'Enter a valid value.' };
            recordCreateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordCreateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toEqual({ key: 'object', errorString: 'Enter a valid value.' });
        });
    });
    describe('inputAssignments item is empty', () => {
        it('should not return an error when an inputAssignment is set without a value', () => {
            recordCreateUsingFields.inputAssignments[0].leftHandSide.value = '';
            recordCreateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordCreateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(0);
        });
        it('should return 2 errors when 2 inputAssignments are set without a value', () => {
            recordCreateUsingFields.inputAssignments[0].leftHandSide.value = '';
            recordCreateUsingFields.inputAssignments.push({
                leftHandSide: { value: '', error: null },
                rightHandSide: { value: '', error: null },
                rowIndex: '71cb7e19-9f98-4b59-9fdd-a276f216eede'
            });
            recordCreateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordCreateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(2);
            expect(errors[0]).toEqual({ key: 'leftHandSide', errorString: LABELS.cannotBeBlank });
            expect(errors[1]).toEqual({ key: 'leftHandSide', errorString: LABELS.cannotBeBlank });
        });
        it('should return an error when 1 of 2 inputAssignments is set without a value', () => {
            recordCreateUsingFields.inputAssignments.push({
                leftHandSide: { value: '', error: null },
                rightHandSide: { value: '', error: null },
                rowIndex: '71cb7e19-9f98-4b59-9fdd-a276f216eede'
            });
            recordCreateEditor = createComponentForTest(recordCreateUsingFields);
            const errors = validate(recordCreateEditor.node, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toEqual({ key: 'leftHandSide', errorString: LABELS.cannotBeBlank });
        });
    });
});
