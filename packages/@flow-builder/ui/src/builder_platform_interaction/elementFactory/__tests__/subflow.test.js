import { createSubflow } from '../subflow';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const mockGuid = 'mockGuid';

const defaultFlowSubflow = {};
const defaultStoreSubflow = {};

describe('subflow', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createSubflow function', () => {
        let subflow;
        describe('when empty subflow is created', () => {
            beforeAll(() => {
                subflow = createSubflow();
            });

            it('has dataType of boolean', () => {
                expect(subflow.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow subflow is passed', () => {
            beforeAll(() => {
                subflow = createSubflow(defaultFlowSubflow);
            });
            it('has dataType of boolean', () => {
                expect(subflow.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when store subflow is passed', () => {
            beforeAll(() => {
                subflow = createSubflow(defaultStoreSubflow);
            });
            it('has dataType of boolean', () => {
                expect(subflow.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
});
