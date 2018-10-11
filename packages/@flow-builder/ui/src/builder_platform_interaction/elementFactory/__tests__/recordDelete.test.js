import { createRecordDelete } from '../recordDelete';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { matchers } from './elementFactoryMatchers';

expect.extend(matchers);

const mockGuid = 'mockGuid';

const defaultStoreRecordDelete = {
    availableConnections: [
    {
        "type": "REGULAR"
    }],
    config: { isSelected: true },
    connectorCount: 0,
    dataType: "Boolean",
    description: "",
    elementType: "RECORD_DELETE",
    guid: "bd66dd3f-820e-4846-affb-cdde8e4857ee",
    inputReference: "ced19874-2139-4fc7-a47a-6b46439ca876",
    isCanvasElement: true,
    label: "deleteSObject",
    locationX: 526,
    locationY: 217,
    maxConnections: 2,
    name: "deleteSObject"
};

const flowRecordDeleteSObject = {
    inputReference: "mySObjectVar",
    label: "deleteSObject",
    locationX: 527,
    locationY: 216,
    name: "deleteSObject",
};

describe('recordDelete', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createRecordDelete function', () => {
        let recordDelete;
        describe('when empty recordDelete is created', () => {
            beforeAll(() => {
                recordDelete = createRecordDelete();
            });

            it('has dataType of boolean', () => {
                expect(recordDelete.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow recordDelete is passed', () => {
            beforeAll(() => {
                recordDelete = createRecordDelete(flowRecordDeleteSObject);
            });
            it('has dataType of boolean', () => {
                expect(recordDelete.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with record Delete metadata passed as parameter', () => {
                expect(recordDelete).toHaveNoCommonMutableObjectWith(flowRecordDeleteSObject);
            });
        });

        describe('when store recordDelete is passed', () => {
            beforeAll(() => {
                recordDelete = createRecordDelete(defaultStoreRecordDelete);
            });
            it('has dataType of boolean', () => {
                expect(recordDelete.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with record Delete from store passed as parameter', () => {
                expect(recordDelete).toHaveNoCommonMutableObjectWith(defaultStoreRecordDelete);
            });
        });
    });
});
