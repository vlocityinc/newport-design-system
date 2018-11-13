import { createRecordCreate, createRecordCreateMetadataObject } from '../recordCreate';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction/recordEditorLib';
import globalConstantFalseLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantFalse';
import globalConstantPrefixLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantPrefix';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';

expect.extend(deepFindMatchers);
const MOCK_GUID = 'mockGuid', MOCK_ASSIGN_RECORD_ID_TO_REFERENCE = 'myNewId';

const flowRecordCreateFieldsMetadata = () => ({
    assignRecordIdToReference: MOCK_ASSIGN_RECORD_ID_TO_REFERENCE,
    inputAssignments: [{
        field: "BillingCity",
        value: {elementReference: "myCity"}
    }, {
        field: "BillingCountry",
        value: {elementReference: "myCountry"}
    }],
    label: "myCreate with fields",
    locationX: 1074,
    locationY: 527,
    name: "myCreate",
    object: "Account"
});

const flowRecordCreateFieldsStore = () => ({
    assignRecordIdToReference: MOCK_ASSIGN_RECORD_ID_TO_REFERENCE,
    availableConnections: [{
            type: "REGULAR"
        }, {
            type: "FAULT"
        }],
    config: { isSelected: false },
    connectorCount: 0,
    dataType: "Boolean",
    description: "",
    elementType: "RECORD_CREATE",
    guid: MOCK_GUID,
    inputAssignments: [{
        leftHandSide: "Account.BillingCity",
        rightHandSide: "28221fc3-b4a3-45ca-a195-7a849faa1dc6",
        rightHandSideDataType: "reference",
        rowIndex: "ae4ba97b-9f5b-4705-adec-32f7700498c3"
        }, {
        leftHandSide: "Account.BillingCountry",
        rightHandSide: "382aed63-0e85-4e36-8f32-3836eb02acf3",
        rightHandSideDataType: "reference",
        rowIndex: "e7aa85e8-1a18-4211-862f-60bd9e7f8192"}],
    isCanvasElement: true,
    label: "myCreate with fields",
    locationX: 1074,
    locationY: 527,
    maxConnections: 2,
    name: "myCreate",
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
    object: "Account"
});

const flowRecordCreateSObjectMetadata = () => ({
    inputReference: "mySObjectVar",
    label: "myCreateFast",
    locationX: 595,
    locationY: 580,
    name: "myCreateFast"
});

const flowRecordCreateSObjectStore = () => ({
    availableConnections: [{
            "type": "REGULAR"
        }, {
            "type": "FAULT"
        }],
    config: {isSelected: false},
    connectorCount: 0,
    dataType: "Boolean",
    description: "",
    elementType: "RECORD_CREATE",
    guid: MOCK_GUID,
    inputReference: "mySObjectVar",
    isCanvasElement: true,
    label: "myCreateFast",
    locationX: 595,
    locationY: 580,
    maxConnections: 2,
    name: "myCreateFast",
    numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
    object: ""
});


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
    leftHandSide: 'Account.description',
    rightHandSide: 'myDescription',
    rightHandSideDataType: 'String',
};

const uiModelInputAssignmentField = {
    leftHandSide: 'Account.title',
    rightHandSide: '',
    rightHandSideDataType: '',
};

const uiModelInputAssignmentFieldBooleanValue = {
    leftHandSide: 'Account.isEditable',
    rightHandSide: globalConstantPrefixLabel + '.' + globalConstantFalseLabel,
    rightHandSideDataType: 'Boolean',
};

describe('recordCreate', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(MOCK_GUID);
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
                recordCreate = createRecordCreate(flowRecordCreateFieldsMetadata);
            });
            it('has dataType of boolean', () => {
                expect(recordCreate.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when store recordCreate is passed', () => {
            beforeAll(() => {
                recordCreate = createRecordCreate(flowRecordCreateFieldsStore);
            });
            it('has dataType of boolean', () => {
                expect(recordCreate.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
});
describe('recordCreate new element from left panel', () => {
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
});
describe('recordCreate flow metadata => UI model', () => {
    describe('recordCreate function using sObject', () => {
        it('returns a new record update object with same value and the numberRecordsToStore calculated from the inputReference', () => {
            const recordCreateSObjectMetadata = flowRecordCreateSObjectMetadata();
            const actualResult = createRecordCreate(recordCreateSObjectMetadata);
            expect(actualResult).toMatchObject(flowRecordCreateSObjectStore());
        });
        it('has no common mutable object with record create metadata passed as parameter', () => {
            const recordCreateSObjectMetadata = flowRecordCreateSObjectMetadata();
            const actualResult = createRecordCreate(recordCreateSObjectMetadata);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordCreateSObjectMetadata);
        });
    });
    describe('recordCreate function using Fields', () => {
        let recordCreateUsingFields;
        let uiModelRecordCreateWithFields;
        beforeEach(() => {
            recordCreateUsingFields = flowRecordCreateFieldsMetadata();
            uiModelRecordCreateWithFields = flowRecordCreateFieldsStore();
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
        it('has no common mutable object with record create with fields metadata passed as parameter', () => {
            const actualResult = createRecordCreate(recordCreateUsingFields);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordCreateUsingFields);
        });
        it('should have an "inputReference" with empty text value', () => {
            const actualResult = createRecordCreate(recordCreateUsingFields);
            expect(actualResult).toHaveProperty('inputReference', '');
        });
    });
});
describe('recordCreate UI model => flow metadata', () => {
    describe('recordCreate function using sObject', () => {
        it('record update using sObject', () => {
            const actualResult = createRecordCreateMetadataObject(flowRecordCreateSObjectStore());
            expect(actualResult).toMatchObject(flowRecordCreateSObjectMetadata());
        });
        it('has no common mutable object with record create store passed as parameter', () => {
            const recordCreateSObjectStore = flowRecordCreateSObjectStore();
            const actualResult = createRecordCreateMetadataObject(recordCreateSObjectStore);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordCreateSObjectStore);
        });
    });
    describe('recordCreate function using Fields', () => {
        let recordCreateUsingFields;
        let uiModelRecordCreateWithFields;
        beforeEach(() => {
            recordCreateUsingFields = flowRecordCreateFieldsMetadata();
            uiModelRecordCreateWithFields = flowRecordCreateFieldsStore();
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
        it('has no common mutable object with record create store passed as parameter', () => {
            const actualResult = createRecordCreateMetadataObject(uiModelRecordCreateWithFields);
            expect(actualResult).toHaveNoCommonMutableObjectWith(uiModelRecordCreateWithFields);
        });
        it('"assignRecordIdToReference" with value (not empty string)', () => {
            const actualResult = createRecordCreateMetadataObject(uiModelRecordCreateWithFields);
            expect(actualResult).toHaveProperty('assignRecordIdToReference', MOCK_ASSIGN_RECORD_ID_TO_REFERENCE);
        });
        it('no "assignRecordIdToReference" with empty string value', () => {
            uiModelRecordCreateWithFields.assignRecordIdToReference = '';
            const actualResult = createRecordCreateMetadataObject(uiModelRecordCreateWithFields);
            expect(actualResult).not.toHaveProperty('assignRecordIdToReference');
        });
    });
});