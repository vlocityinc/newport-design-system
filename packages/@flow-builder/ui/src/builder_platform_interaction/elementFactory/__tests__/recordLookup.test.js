import { createRecordLookup, createDuplicateRecordLookup, createRecordLookupMetadataObject, createQueriedField} from '../recordLookup';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction/recordEditorLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { DUPLICATE_ELEMENT_XY_OFFSET } from '../base/baseElement';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

expect.extend(deepFindMatchers);

const MOCK_GUID = 'mockGuid';

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
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    filterType: "all",
    filters: [{
        leftHandSide: "Account.BillingCity",
        operator: "EqualTo",
        rightHandSide: "vCity",
        rightHandSideDataType: "reference",
        rowIndex: MOCK_GUID}],
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: "lookupSObject",
    locationX: 304,
    locationY: 629,
    maxConnections: 2,
    name: "lookupSObject",
    object: "Account",
    outputReference: "vSobjectAccount",
    queriedFields: [{field: "BillingCountry",
        rowIndex: MOCK_GUID}, {field: "",
            rowIndex: MOCK_GUID}],
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
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    filterType: "all",
    filters: [],
    guid: MOCK_GUID,
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
        rowIndex: MOCK_GUID}, {field: "",
            rowIndex: MOCK_GUID}],
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
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    filterType: "all",
    filters: [{
        leftHandSide: "Account.BillingCity",
        operator: "EqualTo",
        rightHandSide: "vCity",
        rightHandSideDataType: "reference",
        rowIndex: MOCK_GUID}],
    guid: MOCK_GUID,
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
    queriedFields: [],
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

const uiModelOutputAssignmentFieldEmptyValue = {
    leftHandSide: '',
    rightHandSide: '',
};

const uiModelOutputAssignmentField = {
    leftHandSide: 'Account.title',
    rightHandSide: 'vTitle',
};

describe('recordLookup', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(MOCK_GUID);
    describe('createRecordLookup function', () => {
        let recordLookup;
        describe('when empty recordLookup is created', () => {
            it('has dataType of boolean', () => {
                recordLookup = createRecordLookup();
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow recordLookup is passed', () => {
            beforeEach(() => {
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
            beforeEach(() => {
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
    describe('recordLookup new element from left panel', () => {
     it('returns a new record lookup object when no argument is passed; numberRecordsToStore should be set to FIRSt_RECORD by default', () => {
        const uiModelResult = {
            name: '',
            description: '',
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
        };
        const actualResult = createRecordLookup();
        expect(actualResult).toMatchObject(uiModelResult);
    });
   });

    describe('createDuplicateRecordLookup function', () => {
        const originalRecordLookup = {
            guid: 'originalGuid',
            name: 'originalName',
            label: 'label',
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            locationX: 100,
            locationY: 100,
            config: {
                isSelectd: true,
                isHighlighted: false
            },
            connectorCount: 1,
            maxConnections: 2,
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.FAULT
                }
            ]
        };
        const { duplicatedElement } = createDuplicateRecordLookup(originalRecordLookup, 'duplicatedGuid', 'duplicatedName');

        it('has the new guid', () => {
            expect(duplicatedElement.guid).toEqual('duplicatedGuid');
        });
        it('has the new name', () => {
            expect(duplicatedElement.name).toEqual('duplicatedName');
        });
        it('has the updated locationX', () => {
            expect(duplicatedElement.locationX).toEqual(originalRecordLookup.locationX + DUPLICATE_ELEMENT_XY_OFFSET);
        });
        it('has the updated locationY', () => {
            expect(duplicatedElement.locationY).toEqual(originalRecordLookup.locationY + DUPLICATE_ELEMENT_XY_OFFSET);
        });
        it('has isSelected set to true', () => {
            expect(duplicatedElement.config.isSelected).toBeTruthy();
        });
        it('has isHighlighted set to false', () => {
            expect(duplicatedElement.config.isHighlighted).toBeFalsy();
        });
        it('has connectorCount set to 0', () => {
            expect(duplicatedElement.connectorCount).toEqual(0);
        });
        it('has maxConnections set to 2', () => {
            expect(duplicatedElement.maxConnections).toEqual(2);
        });
        it('has the right elementType', () => {
            expect(duplicatedElement.elementType).toEqual(ELEMENT_TYPE.RECORD_LOOKUP);
        });
        it('has default availableConnections', () => {
            expect(duplicatedElement.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR
            }, {
                type: CONNECTOR_TYPE.FAULT
            }]);
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
        it('should have an "outputReference" undefined', () => {
            const actualResult = createRecordLookup(recordLookupUsingFields);
            expect(actualResult).toHaveProperty('outputReference', undefined);
        });
        it('"queriedFields" should be an empty array', () => {
            const actualResult = createRecordLookup(recordLookupUsingFields);
            expect(actualResult).toHaveProperty('queriedFields', []);
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
        it('outputAssignments with empty values', () => {
            uiModelRecordLookupWithFields.outputAssignments = [uiModelOutputAssignmentFieldEmptyValue];
            recordLookupUsingFields.outputAssignments = [];
            const actualResult = createRecordLookupMetadataObject(uiModelRecordLookupWithFields);
            expect(actualResult).toMatchObject(recordLookupUsingFields);
        });
    });
  });
  describe('createQueriedField', () => {
     test('when passing a string parameter not empty', () => {
      const actualResult = createQueriedField("id");
      expect(actualResult).toMatchObject({field: "id", rowIndex: MOCK_GUID});
     });
     test('when passing a string parameter (empty string)', () => {
         const actualResult = createQueriedField("");
         expect(actualResult).toMatchObject({field: "", rowIndex: MOCK_GUID});
        });
     test('when passing an object parameter with a field property that has an empty string value', () => {
         const actualResult = createQueriedField({field:"", rowIndex: MOCK_GUID});
         expect(actualResult).toMatchObject({field: "", rowIndex: MOCK_GUID});
     });
     test('when passing an object parameter with a field property that has not an empty string value', () => {
         const actualResult = createQueriedField({field:"id", rowIndex: MOCK_GUID});
         expect(actualResult).toMatchObject({field: "id", rowIndex: MOCK_GUID});
     });
  });
});