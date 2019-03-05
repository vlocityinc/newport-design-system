import { createRecordDelete, createDuplicateRecordDelete, createRecordDeleteMetadataObject } from '../recordDelete';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

expect.extend(deepFindMatchers);

const MOCK_GUID = '93f65bd6-d0ab-4e75-91b1-a8599dee54ed';

const expectedRecordDeleteWhenNoArgumentsPassed = () => ({
     availableConnections: [
            {
                "type": "REGULAR"
            }, {
                "type": "FAULT"
            }],
     config: {isSelected: false},
     connectorCount: 0,
     dataType: "Boolean",
     description: "",
     elementType: "RECORD_DELETE",
     filters: [],
     guid: MOCK_GUID,
     inputReference: "",
     isCanvasElement: true,
     label: "",
     locationX: 0,
     locationY: 0,
     maxConnections: 2,
     name: "",
     object: ""
});

/**
 * mock record delete object as extracted from the store (with SObject)
 */
const recordDeleteSObjectStore = () => ({
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
    elementType: "RECORD_DELETE",
    filters: [{
        leftHandSide: "",
        operator: "",
        rightHandSide: "",
        rightHandSideDataType: "",
        rowIndex: MOCK_GUID}],
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: "record delete in SObject mode",
    locationX: 304,
    locationY: 629,
    maxConnections: 2,
    name: "record_delete_in_SObject_mode",
    object: "",
    inputReference: MOCK_GUID
});

/**
 * mock record delete object as extracted from the store (with fields)
 */
const recordDeleteFieldsStore = () => ({
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
    elementType: "RECORD_DELETE",
    filters: [{
        leftHandSide: "Account.BillingCity",
        operator: "EqualTo",
        rightHandSide: "CA",
        rightHandSideDataType: "String",
        rowIndex: MOCK_GUID}],
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: "record delete in fields mode",
    locationX: 431,
    locationY: 345,
    maxConnections: 2,
    name: "record_delete_in_fields_mode",
    object: "Account"
});

/**
 * mock record delete object as extracted from flow Metadata (with sobject)
 */
const recordDeleteSObjectMetadata = () => ({
    description: "",
    filters: [],
    label: "record delete in SObject mode",
    locationX: 304,
    locationY: 629,
    name: "record_delete_in_SObject_mode",
    inputReference: "vSobjectAccount"
});

/**
 * mock record delete object as extracted from flow Metadata (with fields)
 */
const recordDeleteFieldsMetadata = () => ({
    description: "",
    filters: [{
        field: "BillingCity",
        operator: "EqualTo",
        value: {stringValue: "CA"}}],
    label: "record delete in fields mode",
    locationX: 431,
    locationY: 345,
    name: "record_delete_in_fields_mode",
    object: "Account",
});

describe('recordDelete', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(MOCK_GUID);
    describe('createRecordDelete "factory" function', () => {
        let recordDelete;
        describe('when no arguments is passed to "createRecordDelete" factory function', () => {
            it('expected object returned', () => {
                recordDelete = createRecordDelete();
                expect(recordDelete).toMatchObject(expectedRecordDeleteWhenNoArgumentsPassed());
            });
        });

        describe('when flow metadata is passed to "createRecordDelete" factory function', () => {
            beforeAll(() => {
                recordDelete = createRecordDelete(recordDeleteSObjectMetadata());
            });
            it('has dataType of boolean', () => {
                expect(recordDelete.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with record lookup metadata passed as parameter', () => {
                expect(recordDelete).toHaveNoCommonMutableObjectWith(recordDeleteSObjectMetadata());
            });
        });

        describe('when store is passed to "createRecordDelete" factory" function', () => {
            beforeAll(() => {
                recordDelete = createRecordDelete(recordDeleteSObjectStore());
            });
            it('has dataType of boolean', () => {
                expect(recordDelete.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with ecord lookup from store passed as parameter', () => {
                expect(recordDelete).toHaveNoCommonMutableObjectWith(recordDeleteSObjectStore());
            });
        });
    });
});

describe('createDuplicateRecordDelete function', () => {
    const originalRecordDelete = {
        guid: 'originalGuid',
        name: 'originalName',
        label: 'label',
        elementType: ELEMENT_TYPE.RECORD_DELETE,
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
    const { duplicatedElement } = createDuplicateRecordDelete(originalRecordDelete, 'duplicatedGuid', 'duplicatedName');

    it('has the new guid', () => {
        expect(duplicatedElement.guid).toEqual('duplicatedGuid');
    });
    it('has the new name', () => {
        expect(duplicatedElement.name).toEqual('duplicatedName');
    });
    it('has the updated locationX', () => {
        expect(duplicatedElement.locationX).toEqual(originalRecordDelete.locationX + 50);
    });
    it('has the updated locationY', () => {
        expect(duplicatedElement.locationY).toEqual(originalRecordDelete.locationY + 50);
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
        expect(duplicatedElement.elementType).toEqual(ELEMENT_TYPE.RECORD_DELETE);
    });
    it('has default availableConnections', () => {
        expect(duplicatedElement.availableConnections).toEqual([{
            type: CONNECTOR_TYPE.REGULAR
        }, {
            type: CONNECTOR_TYPE.FAULT
        }]);
    });
});

describe('recordDelete flow metadata => UI model', () => {
    describe('in sObject mode', () => {
        let recDeleteSObjectMetadata;
        beforeAll(() => {
            recDeleteSObjectMetadata = recordDeleteFieldsMetadata();
        });
        it('returns expected record delete object values', () => {
            const actualResult = createRecordDelete(recDeleteSObjectMetadata);
            expect(actualResult).toMatchObject(recordDeleteFieldsStore());
        });
        it('has no common mutable objects with record delete metadata passed as parameter', () => {
            const actualResult = createRecordDelete(recDeleteSObjectMetadata);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recDeleteSObjectMetadata);
        });
    });
});

describe('recordDelete UI model => flow metadata (with GUID)', () => {
    describe('with record delete using sObject', () => {
        it('returns expected metadata object', () => {
            const actualResult = createRecordDeleteMetadataObject(recordDeleteSObjectStore());
            const recDeleteSobjectMetadataWithGuid = recordDeleteSObjectMetadata();
            recDeleteSobjectMetadataWithGuid.inputReference = MOCK_GUID;
            expect(actualResult).toMatchObject(recDeleteSobjectMetadataWithGuid);
        });
        it('has no common mutable objects with record delete store passed as parameter', () => {
            const recDeleteSObjectStore = recordDeleteSObjectStore();
            const actualResult = createRecordDeleteMetadataObject(recDeleteSObjectStore);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recDeleteSObjectStore);
        });
    });
    describe('with record delete using fields', () => {
        it('returns expected metadata object', () => {
            const actualResult = createRecordDeleteMetadataObject(recordDeleteFieldsStore());
            expect(actualResult).toMatchObject(recordDeleteFieldsMetadata());
        });
        it('has no common mutable objects with record delete store passed as parameter', () => {
            const recDeleteFieldsStore = recordDeleteFieldsStore();
            const actualResult = createRecordDeleteMetadataObject(recDeleteFieldsStore);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recDeleteFieldsStore);
        });
    });
});
