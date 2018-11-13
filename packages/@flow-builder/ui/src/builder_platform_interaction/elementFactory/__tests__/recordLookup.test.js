import { createRecordLookup, createRecordLookupMetadataObject } from '../recordLookup';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction/recordEditorLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';

expect.extend(deepFindMatchers);

const mockGuid = 'mockGuid';

const recordLookupSObjectStore = () => ({
    assignNullValuesIfNoRecordsFound: false,
    availableConnections: [
        {
            "type": "REGULAR"
        }, {
            "type": "FAULT"
        }],
    config: { isSelected: false },
    connectorCount: 0,
    dataType: "Boolean",
    description: "",
    elementType: "RECORD_LOOKUP",
    filterType: "all",
    filters: [{
        leftHandSide: "Account.BillingCity",
        operator: "EqualTo",
        rightHandSide: "vCity",
        rightHandSideDataType: "reference",
        rowIndex: "mockGuid"}],
    guid: "mockGuid",
    isCanvasElement: true,
    label: "lookupSObject",
    locationX: 304,
    locationY: 629,
    maxConnections: 2,
    name: "lookupSObject",
    object: "Account",
    outputReference: "vSobjectAccount",
    queriedFields: [{field: "BillingCountry",
        rowIndex: "mockGuid"}],
    sortField: "",
    sortOrder: "NotSorted"
});

const recordLookupSObjectCollectionStore = () => ({
    assignNullValuesIfNoRecordsFound: false,
    availableConnections: [
        {
            "type": "REGULAR"
        }, {
            "type": "FAULT"
        }],
    config: { isSelected: false },
    connectorCount: 0,
    dataType: "Boolean",
    description: "",
    elementType: "RECORD_LOOKUP",
    filterType: "all",
    filters: [],
    guid: "mockGuid",
    isCanvasElement: true,
    label: "lookupSObject",
    locationX: 304,
    locationY: 629,
    maxConnections: 2,
    name: "lookupSObject",
    numberRecordsToStore: "allRecords",
    object: "Account",
    outputReference: "vSobjectAccountCollection",
    queriedFields: [{field: "BillingCountry",
        rowIndex: "mockGuid"}],
    sortField: "",
    sortOrder: "NotSorted"
});

const recordLoookupSObjectMetadata = () => ({
    assignNullValuesIfNoRecordsFound: false,
    filters: [{
        field: "BillingCity",
        operator: "EqualTo",
        value: {elementReference: "vCity"}}],
    label: "lookupSObject",
    locationX: 304,
    locationY: 629,
    name: "lookupSObject",
    object: "Account",
    outputReference: "vSobjectAccount",
    queriedFields: ["BillingCountry"]
});

const recordLoookupFieldsMetadata = () => ({
    assignNullValuesIfNoRecordsFound: false,
    filters: [{
        field: "BillingCity",
        operator: "EqualTo",
        value: {elementReference: "vCity"}}],
    label: "lookup with Fields",
    locationX: 431,
    locationY: 345,
    name: "lookup_with_fields",
    object: "Account",
    outputAssignments: [{
        field: "BillingCountry",
        assignToReference: "myCountry"}],
    queriedFields: []
});

const recordLoookupFieldsStore = () => ({
    assignNullValuesIfNoRecordsFound: false,
    availableConnections: [
        {
            "type": "REGULAR"
        }, {
            "type": "FAULT"
        }],
    config: { isSelected: false },
    connectorCount: 0,
    dataType: "Boolean",
    description: "",
    elementType: "RECORD_LOOKUP",
    filterType: "all",
    filters: [{
        leftHandSide: "Account.BillingCity",
        operator: "EqualTo",
        rightHandSide: "vCity",
        rightHandSideDataType: "reference",
        rowIndex: "mockGuid"}],
    guid: "mockGuid",
    isCanvasElement: true,
    label: "lookup with Fields",
    locationX: 431,
    locationY: 345,
    maxConnections: 2,
    name: "lookup_with_fields",
    numberRecordsToStore: "firstRecord",
    object: "Account",
    outputAssignments: [{
        leftHandSide: "Account.BillingCountry",
        rightHandSide: "myCountry"}],
    sortField: "",
    sortOrder: "NotSorted"
});

const outputAssignmentField = {
    field: 'title',
    assignToReference: 'vTitle'
};

const outputAssignmentFieldValue = {
    field: 'description',
    assignToReference: 'vDescription'
};

const uiModelOutputAssignmentFieldValue = {
    leftHandSide: 'Account.description',
    rightHandSide: 'vDescription',
};

const uiModelOutputAssignmentField = {
    leftHandSide: 'Account.title',
    rightHandSide: 'vTitle',
};

describe('recordLookup', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createRecordLookup function', () => {
        let recordLookup;
        describe('when empty recordLookup is created', () => {
            it('has dataType of boolean', () => {
                recordLookup = createRecordLookup();
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow recordLookup is passed', () => {
            beforeAll(() => {
                recordLookup = createRecordLookup(recordLoookupSObjectMetadata());
            });
            it('has dataType of boolean', () => {
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with record lookup metadata passed as parameter', () => {
                expect(recordLookup).toHaveNoCommonMutableObjectWith(recordLoookupSObjectMetadata());
            });
        });

        describe('when store recordLookup is passed', () => {
            beforeAll(() => {
                recordLookup = createRecordLookup(recordLookupSObjectStore());
            });
            it('has dataType of boolean', () => {
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with ecord lookup from store passed as parameter', () => {
                expect(recordLookup).toHaveNoCommonMutableObjectWith(recordLookupSObjectStore());
            });
            it('has the "how many records" property set from the passed object', () => {
                const valueFromObject = recordLookupSObjectCollectionStore().numberRecordsToStore;
                const valueFromCreation = createRecordLookup(recordLookupSObjectCollectionStore()).numberRecordsToStore;
                expect(valueFromCreation).toEqual(valueFromObject);
            });
        });
    });
});
describe('recordLookup new element from left panel', () => {
    it('returns a new record lookup object when no argument is passed; numberRecordsToStore should be set to FIRSt_RECORD by default', () => {
        const uiModelResult = {
            name: '',
            description: '',
            elementType: 'RECORD_LOOKUP',
            numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
        };
        const actualResult = createRecordLookup();
        expect(actualResult).toMatchObject(uiModelResult);
    });
});
describe('recordLookup flow metadata => UI model', () => {
    describe('recordLookup function using sObject', () => {
        it('returns a new record update object with same value and the numberRecordsToStore calculated from the inputReference', () => {
            const recordLookupSObjectMetadata = recordLoookupFieldsMetadata();
            const actualResult = createRecordLookup(recordLookupSObjectMetadata);
            expect(actualResult).toMatchObject(recordLoookupFieldsStore());
        });
        it('has no common mutable object with record lookup metadata passed as parameter', () => {
            const recordLookupSObjectMetadata = recordLoookupFieldsMetadata();
            const actualResult = createRecordLookup(recordLookupSObjectMetadata);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordLookupSObjectMetadata);
        });
    });
    describe('recordLookup function using Fields', () => {
        let recordLookupUsingFields;
        let uiModelRecordLookupWithFields;
        beforeEach(() => {
            recordLookupUsingFields = recordLoookupFieldsMetadata();
            uiModelRecordLookupWithFields = recordLoookupFieldsStore();
        });
        it('outputAssignments with value should return the expression (RHS/LHS)', () => {
            recordLookupUsingFields.outputAssignments = [outputAssignmentFieldValue];
            const actualResult = createRecordLookup(recordLookupUsingFields);
            uiModelRecordLookupWithFields.outputAssignments = [uiModelOutputAssignmentFieldValue];
            expect(actualResult).toMatchObject(uiModelRecordLookupWithFields);
        });
        it('outputAssignments with multiple values should return the expression (RHS/LHS)', () => {
            recordLookupUsingFields.outputAssignments = [outputAssignmentFieldValue, outputAssignmentField];
            const actualResult = createRecordLookup(recordLookupUsingFields);
            uiModelRecordLookupWithFields.outputAssignments = [uiModelOutputAssignmentFieldValue, uiModelOutputAssignmentField];
            expect(actualResult).toMatchObject(uiModelRecordLookupWithFields);
        });
        it('has no common mutable object with record lookup with fields metadata passed as parameter', () => {
            const actualResult = createRecordLookup(recordLookupUsingFields);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordLookupUsingFields);
        });
    });
});
describe('recordLookup UI model => flow metadata', () => {
    describe('recordLookup function using sObject', () => {
        it('record lookup using sObject', () => {
            const actualResult = createRecordLookupMetadataObject(recordLookupSObjectStore());
            expect(actualResult).toMatchObject(recordLoookupSObjectMetadata());
        });
        it('has no common mutable object with record create store passed as parameter', () => {
            const recordCreateSObjectStore = recordLookupSObjectStore();
            const actualResult = createRecordLookupMetadataObject(recordCreateSObjectStore);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordCreateSObjectStore);
        });
    });
    describe('recordLookup function using Fields', () => {
        let recordLookupUsingFields;
        let uiModelRecordLookupWithFields;
        beforeEach(() => {
            recordLookupUsingFields = recordLoookupFieldsMetadata();
            uiModelRecordLookupWithFields = recordLoookupFieldsStore();
        });
        it('outputAssignments with value', () => {
            uiModelRecordLookupWithFields.outputAssignments = [uiModelOutputAssignmentFieldValue];
            recordLookupUsingFields.outputAssignments = [outputAssignmentFieldValue];
            const actualResult = createRecordLookupMetadataObject(uiModelRecordLookupWithFields);
            expect(actualResult).toMatchObject(recordLookupUsingFields);
        });
        it('outputAssignments with multiple values', () => {
            uiModelRecordLookupWithFields.outputAssignments = [uiModelOutputAssignmentFieldValue, uiModelOutputAssignmentField];
            recordLookupUsingFields.outputAssignments = [outputAssignmentFieldValue, outputAssignmentField];
            const actualResult = createRecordLookupMetadataObject(uiModelRecordLookupWithFields);
            expect(actualResult).toMatchObject(recordLookupUsingFields);
        });
        it('has no common mutable object with record lookup store passed as parameter', () => {
            const actualResult = createRecordLookupMetadataObject(uiModelRecordLookupWithFields);
            expect(actualResult).toHaveNoCommonMutableObjectWith(uiModelRecordLookupWithFields);
        });
    });
});
