import { recordDeleteValidation, getRules } from "../recordDeleteValidation";
import * as storeMockedData from "mock/storeData";
import { LABELS } from "builder_platform_interaction/validationRules";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";

const INPUT_REFERENCE_PROPERTY_NAME = 'inputReference', OBJECT_PROPERTY_NAME = 'object', FILTERS_PROPERTY_NAME = 'filters',
    MOCK_GUID = '724cafc2-7744-4e46-8eaa-f2df29539d1d';

const recordDeleteElementWithValidSObject = {
        description : {value: '', error: null},
        elementType : 'RECORD_DELETE',
        guid : MOCK_GUID,
        isCanvasElement : true,
        label : {value: 'record delete validation with sobject', error: null},
        locationX : 358,
        locationY : 227,
        name : {value: 'record_delete_validation_with_sobject', error: null},
        [INPUT_REFERENCE_PROPERTY_NAME] : {value: storeMockedData.accountSObjectVariableGuid, error: null},
        [OBJECT_PROPERTY_NAME] : {value: '', error: null}
}, recordDeleteElementWithValidFields = () => ({
        description : {value: '', error: null},
        elementType : 'RECORD_DELETE',
        guid : MOCK_GUID,
        isCanvasElement : true,
        label : {value: 'record delete validation with fields', error: null},
        locationX : 358,
        locationY : 227,
        name : {value: 'record_delete_validation_with_fields', error: null},
        [FILTERS_PROPERTY_NAME]: [{
            leftHandSide: {value: "Account.BillingAddress", error: null},
            operator: {value: "EqualTo", error: null},
            rightHandSide: {value: "my address", error: null},
            rightHandSideDataType: {value: "String", error: null},
            rowIndex: MOCK_GUID
        }],
        [OBJECT_PROPERTY_NAME] : {value: 'account', error: null}
});

const validate = (node, event = {}) => {
    const rules = getRules(node, event);
    return getErrorsFromHydratedElement(recordDeleteValidation.validateAll(node, rules));
};

describe('Record delete validations using sObject', () => {
    describe('"inputReference" validation', () => {
        let recordDeleteElementWithSObjectValid, validatedRecordDelete, event;
        beforeEach(() => {
            recordDeleteElementWithSObjectValid = recordDeleteElementWithValidSObject;
            event = {isSObjectMode : true};
        });
        test('should return same object if valid', () => {
            validatedRecordDelete =  recordDeleteValidation.validateAll(recordDeleteElementWithSObjectValid,
                    getRules(recordDeleteElementWithSObjectValid, event));
            expect(validatedRecordDelete).toEqual(recordDeleteElementWithValidSObject);
        });
        test('should return an error if blank', () => {
            recordDeleteElementWithSObjectValid[INPUT_REFERENCE_PROPERTY_NAME].value = '';
            validatedRecordDelete =  recordDeleteValidation.validateAll(recordDeleteElementWithSObjectValid,
                    getRules(recordDeleteElementWithSObjectValid, event));
            expect(validatedRecordDelete.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
        test('should return an error if null', () => {
            recordDeleteElementWithValidSObject[INPUT_REFERENCE_PROPERTY_NAME].value = null;
            validatedRecordDelete =  recordDeleteValidation.validateAll(recordDeleteElementWithValidSObject,
                    getRules(recordDeleteElementWithValidSObject, event));
            expect(validatedRecordDelete[INPUT_REFERENCE_PROPERTY_NAME].error).toBe(LABELS.cannotBeBlank);
        });
    });
});

describe('Record delete validations using fields', () => {
    let recordDeleteUsingFields, event;
    beforeEach(() => {
        recordDeleteUsingFields = recordDeleteElementWithValidFields();
        event = {isSObjectMode : false};
    });
    describe('"object"', () => {
        test('should return same "record delete element object" if valid', () => {
            const validatedRecordDelete =  recordDeleteValidation.validateAll(recordDeleteUsingFields,
                    getRules(recordDeleteUsingFields, event));
            expect(validatedRecordDelete).toEqual(recordDeleteUsingFields);
        });
        test('should return an error when no object has been selected', () => {
            recordDeleteUsingFields.object.value = '';
            const errors = validate(recordDeleteUsingFields, event);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('object');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('"filters"', () => {
        describe('filter type "ALL"', () => {
            describe('filter item', () => {
                test('should return an error if leftHandSide is empty', () => {
                    recordDeleteUsingFields.filters[0].leftHandSide.value = '';
                    const errors = validate(recordDeleteUsingFields, event);
                    expect(errors).toHaveLength(1);
                    expect(errors[0].key).toBe('leftHandSide');
                    expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
                });
                test('should return an error if operator is empty', () => {
                    recordDeleteUsingFields.filters[0].leftHandSide.value = 'Account.BillingAddress';
                    recordDeleteUsingFields.filters[0].operator.value = '';
                    const errors = validate(recordDeleteUsingFields, event);
                    expect(errors).toHaveLength(1);
                    expect(errors[0].key).toBe('operator');
                    expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
                });
                test('should return an error if rightHandSide is empty', () => {
                    recordDeleteUsingFields.filters[0].operator.value = 'EqualTo';
                    recordDeleteUsingFields.filters[0].rightHandSide.value = '';
                    const errors = validate(recordDeleteUsingFields, event);
                    expect(errors).toHaveLength(1);
                    expect(errors[0].key).toBe('rightHandSide');
                    expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
                });
            });
        });
        describe('"error"', () => {
            describe('When object is an incorrect value', () => {
                test('should return an error for the object but not for the filters', () => {
                    recordDeleteUsingFields.filters[0].leftHandSide.value = '';
                    recordDeleteUsingFields.object.value = 'myNotValidValue';
                    recordDeleteUsingFields.object.error = 'Enter a valid value.';
                    const errors = validate(recordDeleteUsingFields, event);
                    expect(errors).toHaveLength(1);
                    expect(errors[0].key).toBe('object');
                    expect(errors[0].errorString).toBe('Enter a valid value.');
                });
            });
        });
    });
});