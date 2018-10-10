import { createRecordCreate, createRecordCreateMetadataObject } from '../recordCreate';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS  } from 'builder_platform_interaction/recordEditorLib';
import globalConstantFalseLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantFalse';
import globalConstantPrefixLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantPrefix';

const mockGuid = 'mockGuid';

const defaultFlowRecordCreate = {};
const defaultStoreRecordCreate = {};

const recordCreateUsingSobject = {
    name: 'RecordCreate1',
    description: '',
    inputReference: 'myObject',
};

const recordCreateUsingFieldsTemplate = () => {
    return {
        name: 'RecordCreate1',
        description: '',
        object: 'myObject',
        assignRecordIdToReference: undefined,
        inputAssignments: []};
};

const uiModelRecordCreateUsingSobject = {
    name: 'RecordCreate1',
    description: '',
    elementType: 'RECORD_CREATE',
    inputReference: 'myObject',
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
    wayToStoreFields: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
};

const uiModelRecordCreateWithFieldsTemplate = () => {
    return { name: 'RecordCreate1',
    description: '',
    object: 'myObject',
    elementType: 'RECORD_CREATE',
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
    wayToStoreFields: WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
    };
};

const inputAssignmentFieldValue = {
    field: 'description',
    value:{ stringValue: 'myDescription' }
};

const inputAssignmentField = {
    field: 'title',
};

const inputAssignmentFieldBooleanValue = {
    field: 'isEditable',
    value:{ booleanValue: false }
};

const uiModelInputAssignmentFieldValue = {
    leftHandSide: 'myObject.description',
    rightHandSide: 'myDescription',
    rightHandSideDataType: 'String',
};

const uiModelInputAssignmentField = {
    leftHandSide: 'myObject.title',
    rightHandSide: '',
    rightHandSideDataType: 'string',
};

const uiModelInputAssignmentFieldBooleanValue = {
    leftHandSide: 'myObject.isEditable',
    rightHandSide: globalConstantPrefixLabel + '.' + globalConstantFalseLabel,
    rightHandSideDataType: 'Boolean',
};

describe('recordCreate', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createRecordCreate function', () => {
        let recordCreate;
        describe('when empty recordCreate is created', () => {
            beforeAll(() => {
                recordCreate = createRecordCreate();
            });

            it('has dataType of boolean', () => {
                expect(recordCreate.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow recordCreate is passed', () => {
            beforeAll(() => {
                recordCreate = createRecordCreate(defaultFlowRecordCreate);
            });
            it('has dataType of boolean', () => {
                expect(recordCreate.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when store recordCreate is passed', () => {
            beforeAll(() => {
                recordCreate = createRecordCreate(defaultStoreRecordCreate);
            });
            it('has dataType of boolean', () => {
                expect(recordCreate.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
});
describe('recordCreate flow metadata => UI model', () => {
    describe('recordCreate function using sObject', () => {
        it('returns a new record update object when no argument is passed; numberRecordsToStore should be set to FIRSt_RECORD by default', () => {
            const uiModelResult = {
                name: '',
                description: '',
                elementType: 'RECORD_CREATE',
                numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            };
            const actualResult = createRecordCreate();
            expect(actualResult).toMatchObject(uiModelResult);
        });
        it('returns a new record update object with same value and the numberRecordsToStore calculated from the inputReference', () => {
            const actualResult = createRecordCreate(recordCreateUsingSobject);
            expect(actualResult).toMatchObject(uiModelRecordCreateUsingSobject);
        });
    });
    describe('recordCreate function using Fields', () => {
        let recordCreateUsingFields;
        let uiModelRecordCreateWithFields;
        beforeEach(() => {
            recordCreateUsingFields = recordCreateUsingFieldsTemplate();
            uiModelRecordCreateWithFields = uiModelRecordCreateWithFieldsTemplate();
        });
        it('inputAssignments with value should return the expression (RHS/LHS)', () => {
            recordCreateUsingFields.inputAssignments = [inputAssignmentFieldValue];
            const actualResult = createRecordCreate(recordCreateUsingFields);
            uiModelRecordCreateWithFields.inputAssignments = [uiModelInputAssignmentFieldValue];
            expect(actualResult).toMatchObject(uiModelRecordCreateWithFields);
        });
        it('inputAssignments with multiple values should return the expression (RHS/LHS)', () => {
            recordCreateUsingFields.inputAssignments = [inputAssignmentFieldValue, inputAssignmentField, inputAssignmentFieldBooleanValue];
            const actualResult = createRecordCreate(recordCreateUsingFields);
            uiModelRecordCreateWithFields.inputAssignments = [uiModelInputAssignmentFieldValue, uiModelInputAssignmentField, uiModelInputAssignmentFieldBooleanValue];
            expect(actualResult).toMatchObject(uiModelRecordCreateWithFields);
        });
    });
});
describe('recordCreate UI model => flow metadata', () => {
    describe('recordCreate function using sObject', () => {
        it('record update using sObject', () => {
            const actualResult = createRecordCreateMetadataObject(uiModelRecordCreateUsingSobject);
            expect(actualResult).toMatchObject(recordCreateUsingSobject);
        });
    });
    describe('recordCreate function using Fields', () => {
        let recordCreateUsingFields;
        let uiModelRecordCreateWithFields;
        beforeEach(() => {
            recordCreateUsingFields = recordCreateUsingFieldsTemplate();
            uiModelRecordCreateWithFields = uiModelRecordCreateWithFieldsTemplate();
        });
        it('inputAssignments with value', () => {
            uiModelRecordCreateWithFields.inputAssignments = [uiModelInputAssignmentFieldValue];
            recordCreateUsingFields.inputAssignments = [inputAssignmentFieldValue];
            const actualResult = createRecordCreateMetadataObject(uiModelRecordCreateWithFields);
            expect(actualResult).toMatchObject(recordCreateUsingFields);
        });
        it('inputAssignments with multiple values', () => {
            uiModelRecordCreateWithFields.inputAssignments = [uiModelInputAssignmentFieldValue, uiModelInputAssignmentField, uiModelInputAssignmentFieldBooleanValue];
            recordCreateUsingFields.inputAssignments = [inputAssignmentFieldValue, inputAssignmentField, inputAssignmentFieldBooleanValue];
            const actualResult = createRecordCreateMetadataObject(uiModelRecordCreateWithFields);
            expect(actualResult).toMatchObject(recordCreateUsingFields);
        });
    });
});