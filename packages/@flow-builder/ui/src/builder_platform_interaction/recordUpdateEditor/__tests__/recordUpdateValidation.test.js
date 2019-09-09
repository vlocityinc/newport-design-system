import { createElement } from 'lwc';
import { recordUpdateValidation, getRules } from '../recordUpdateValidation';
import RecordUpdateEditor from '../recordUpdateEditor';
import * as storeMockedData from 'mock/storeData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/expressionValidator', () =>
    require('builder_platform_interaction_mocks/expressionValidator')
);

function createComponentForTest(node) {
    const el = createElement(
        'builder_platform_interaction-record-update-editor',
        { is: RecordUpdateEditor }
    );
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const recordUpdateElementWithValidSObject = {
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_UPDATE,
    guid: 'RECORDUPDATE_1',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecord', error: null },
    useSobject: true,
    inputReference: {
        value: storeMockedData.accountSObjectVariable.guid,
        error: null
    },
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null }
};

const recordUpdateUsingFieldsTemplate = () => {
    return {
        description: { value: '', error: null },
        elementType: ELEMENT_TYPE.RECORD_UPDATE,
        guid: 'RECORDUPDATE_2',
        isCanvasElement: true,
        label: { value: 'testRecordFields', error: null },
        locationX: 358,
        locationY: 227,
        name: { value: 'testRecordFields', error: null },
        useSobject: false,
        inputAssignments: [
            {
                leftHandSide: { value: 'Account.BillingCountry', error: null },
                rightHandSide: { value: 'myCountry', error: null },
                rightHandSideDataType: { value: 'String', error: null },
                rightHandSideGuid: { value: 'myCountry', error: null },
                rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d1d'
            }
        ],
        filters: [
            {
                leftHandSide: { value: 'Account.BillingAddress', error: null },
                operator: { value: 'EqualTo', error: null },
                rightHandSide: { value: 'my address', error: null },
                rightHandSideDataType: { value: 'String', error: null },
                rowIndex: 'RECORDUPDATEFILTERITEM_1'
            }
        ],
        filterType: { value: 'all', error: null },
        object: { value: 'account', error: null },
        objectIndex: { value: 'guid', error: null }
    };
};

const validate = node => {
    const rules = getRules(node);
    return getErrorsFromHydratedElement(
        recordUpdateValidation.validateAll(node, rules)
    );
};

describe('Check validations update using sObject', () => {
    describe('when props set to inputReference', () => {
        it('should return same object if valid', () => {
            expect(
                recordUpdateValidation.validateAll(
                    recordUpdateElementWithValidSObject
                )
            ).toEqual(recordUpdateElementWithValidSObject);
        });
        it('should return an error if blank', () => {
            recordUpdateElementWithValidSObject.inputReference.value = '';
            const validatedRecordUpdate = recordUpdateValidation.validateAll(
                recordUpdateElementWithValidSObject,
                getRules(recordUpdateElementWithValidSObject)
            );
            expect(validatedRecordUpdate.inputReference.error).toBe(
                LABELS.cannotBeBlank
            );
        });
        it('should return an error if null', () => {
            recordUpdateElementWithValidSObject.inputReference.value = null;
            const validatedRecordUpdate = recordUpdateValidation.validateAll(
                recordUpdateElementWithValidSObject,
                getRules(recordUpdateElementWithValidSObject)
            );
            expect(validatedRecordUpdate.inputReference.error).toBe(
                LABELS.cannotBeBlank
            );
        });
    });
});
describe('Check validations update using fields', () => {
    let recordUpdateUsingFields;
    beforeEach(() => {
        recordUpdateUsingFields = recordUpdateUsingFieldsTemplate();
    });
    describe('object is empty', () => {
        it('should return an error when no object has been selected', () => {
            recordUpdateUsingFields.object.value = '';
            const recordupdateEditor = createComponentForTest(
                recordUpdateUsingFields
            );
            const errors = validate(recordupdateEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('object is not valid and assignment is empty', () => {
        it('should return 1 error', () => {
            recordUpdateUsingFields.inputAssignments[0].leftHandSide.value = '';
            recordUpdateUsingFields.object.value = 'myNotValidValue';
            recordUpdateUsingFields.object.error = 'Enter a valid value.';
            const recordupdateEditor = createComponentForTest(
                recordUpdateUsingFields
            );
            const errors = validate(recordupdateEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe('Enter a valid value.');
        });
    });
    describe('inputAssignments item is empty', () => {
        it('should return an error when an inputAssignment is set without a value', () => {
            recordUpdateUsingFields.inputAssignments[0].leftHandSide.value = '';
            const recordupdateEditor = createComponentForTest(
                recordUpdateUsingFields
            );
            const errors = validate(recordupdateEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('filter item is empty', () => {
        it('should return an error if leftHandSide is empty', () => {
            recordUpdateUsingFields.filters[0].leftHandSide.value = '';
            const recordupdateEditor = createComponentForTest(
                recordUpdateUsingFields
            );
            const errors = validate(recordupdateEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if operator is empty', () => {
            recordUpdateUsingFields.filters[0].leftHandSide.value =
                'Account.BillingAddress';
            recordUpdateUsingFields.filters[0].operator.value = '';
            const recordupdateEditor = createComponentForTest(
                recordUpdateUsingFields
            );
            const errors = validate(recordupdateEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('operator');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if rightHandSide is empty', () => {
            recordUpdateUsingFields.filters[0].operator.value = 'EqualTo';
            recordUpdateUsingFields.filters[0].rightHandSide.value = '';
            const recordupdateEditor = createComponentForTest(
                recordUpdateUsingFields
            );
            const errors = validate(recordupdateEditor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('rightHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
});
