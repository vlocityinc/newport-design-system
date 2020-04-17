import ResourceDetailsParametersSubflowConfig from '../resourceDetailsParametersSubflow';
import { flowWithActiveAndLatest as mockFlowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';
import { subflowAutomaticOutput } from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/subflowsLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/subflowsLib');
    return {
        fetchActiveOrLatestFlowOutputVariables: jest.fn(flowName => {
            if (flowName === 'flowWithActiveAndLatest') {
                return Promise.resolve(
                    actual.getActiveOrLatestInputOutputVariables(mockFlowWithActiveAndLatest).outputVariables
                );
            }
            return Promise.reject(`No flow with name ${flowName}`);
        })
    };
});

describe('resource-details-parameters-subflow', () => {
    const callback = jest.fn();
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('fetchSubflowOutputParameters', () => {
        const fetchSubflowOutputFetchFunc = ResourceDetailsParametersSubflowConfig.fetch();
        test.each`
            resourceGuid
            ${null}
            ${undefined}
            ${''}
            ${'GUID_NOT_IN_STORE'}
        `('Invalid resource: "$resourceGuid"', async ({ resourceGuid }) => {
            fetchSubflowOutputFetchFunc(resourceGuid, callback);
            await ticks(1);
            expect(callback).toHaveBeenCalledWith([], `No resource found for GUID: ${resourceGuid}`);
        });
        test('Existing resourceGuid', async () => {
            fetchSubflowOutputFetchFunc(subflowAutomaticOutput.guid, callback);
            await ticks(1);
            expect(callback).not.toHaveBeenCalledWith([], expect.any(String));
        });
    });
    describe('mapperSubflowOutputParameter', () => {
        const mapperSubflowOutputMapFunc = ResourceDetailsParametersSubflowConfig.map();
        let actualResult;
        test.each`
            rawParameter
            ${null}
            ${undefined}
        `('Invalid rawParameter: "$rawParameter"', ({ rawParameter }) => {
            actualResult = mapperSubflowOutputMapFunc(rawParameter);
            expect(actualResult).toEqual({});
        });
    });
});
