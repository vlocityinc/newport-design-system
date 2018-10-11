import { createRecordLookup } from '../recordLookup';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { matchers } from './elementFactoryMatchers';

expect.extend(matchers);

const mockGuid = 'mockGuid';

const defaultStoreRecordLookup = {
    assignNullValuesIfNoRecordsFound: false,
    availableConnections: [
        {
            "type": "REGULAR"
        }, {
            "type": "FAULT"
        }],
    config: { isSelected: true },
    connectorCount: 0,
    dataType: "Boolean",
    description: "",
    elementType: "RECORD_LOOKUP",
    filterType: "all",
    filters: [{
        leftHandSide: "Account.BillingCity",
        operator: "EqualTo",
        rightHandSide: "51e58894-fc23-48de-b6c5-5992a6134d92",
        rightHandSideDataType: "reference",
        rowIndex: "690c14d4-3085-4919-8455-4eab61a78c4d"}],
    guid: "802005a3-cb93-4b76-9db9-d9f623afdb5a",
    isCanvasElement: true,
    label: "lookupSObject",
    locationX: 254,
    locationY: 456,
    maxConnections: 2,
    name: "lookupSObject",
    object: "Account",
    outputReference: "56414561-f9e3-49bd-be38-dadaaac8c371",
    queriedFields: [{field: "BillingCountry",
        rowIndex: "f38be3c9-3fce-4718-9ecb-16cde3b6c54e"}],
    sortField: "",
    sortOrder: "NotSorted"
};

const flowRecordLoookupFields = {
    assignNullValuesIfNoRecordsFound: false,
    filters: [{
        field: "BillingCity",
        operator: "EqualTo",
        value: {elementReference: "myCity"}}],
    label: "lookupSObject",
    locationX: 304,
    locationY: 629,
    name: "lookupSObject",
    object: "Account",
    outputAssignments: [],
    outputReference: "test",
    queriedFields: ["BillingCountry"]
};

describe('recordLookup', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createRecordLookup function', () => {
        let recordLookup;
        describe('when empty recordLookup is created', () => {
            beforeAll(() => {
                recordLookup = createRecordLookup();
            });
            it('has dataType of boolean', () => {
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow recordLookup is passed', () => {
            beforeAll(() => {
                recordLookup = createRecordLookup(flowRecordLoookupFields);
            });
            it('has dataType of boolean', () => {
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with record lookup metadata passed as parameter', () => {
                expect(recordLookup).toHaveNoCommonMutableObjectWith(flowRecordLoookupFields);
            });
        });

        describe('when store recordLookup is passed', () => {
            beforeAll(() => {
                recordLookup = createRecordLookup(defaultStoreRecordLookup);
            });
            it('has dataType of boolean', () => {
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with ecord lookup from store passed as parameter', () => {
                expect(recordLookup).toHaveNoCommonMutableObjectWith(defaultStoreRecordLookup);
            });
        });
    });
});
