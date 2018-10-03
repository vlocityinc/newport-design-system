import { createRecordLookup } from '../recordLookup';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const mockGuid = 'mockGuid';

const defaultFlowRecordLookup = {};
const defaultStoreRecordLookup = {};

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
                recordLookup = createRecordLookup(defaultFlowRecordLookup);
            });
            it('has dataType of boolean', () => {
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when store recordLookup is passed', () => {
            beforeAll(() => {
                recordLookup = createRecordLookup(defaultStoreRecordLookup);
            });
            it('has dataType of boolean', () => {
                expect(recordLookup.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
});
