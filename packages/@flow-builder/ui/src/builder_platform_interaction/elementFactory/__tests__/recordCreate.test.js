import { createRecordCreate } from '../recordCreate';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const mockGuid = 'mockGuid';

const defaultFlowRecordCreate = {};
const defaultStoreRecordCreate = {};

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