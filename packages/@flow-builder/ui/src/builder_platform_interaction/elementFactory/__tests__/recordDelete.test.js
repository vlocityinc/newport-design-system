import { createRecordDelete } from '../recordDelete';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const mockGuid = 'mockGuid';

const defaultFlowRecordDelete = {};
const defaultStoreRecordDelete = {};

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
                recordDelete = createRecordDelete(defaultFlowRecordDelete);
            });
            it('has dataType of boolean', () => {
                expect(recordDelete.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when store recordDelete is passed', () => {
            beforeAll(() => {
                recordDelete = createRecordDelete(defaultStoreRecordDelete);
            });
            it('has dataType of boolean', () => {
                expect(recordDelete.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
});
