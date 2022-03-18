// @ts-nocheck
import { fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { addFlowTests, updateFlowTestResults } from 'builder_platform_interaction/systemLib';
import { loadFlowTests, runFlowTests } from '../flowTestLoader';
const { logInteraction } = loggingUtils;

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        fetchPromise: jest.fn(),
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE
    };
});

jest.mock('builder_platform_interaction/systemLib');
jest.mock('builder_platform_interaction/sharedUtils');

describe('load flow tests', () => {
    const params = {
        flowDefinitionId: '123456',
        flowVersionId: 'abcdef',
        offset: 0,
        limit: 0
    };
    it('invokes call out and call back', async () => {
        const testData = [{ foo: 'bar ' }];
        fetchPromise.mockResolvedValue(testData);

        await loadFlowTests(params.flowDefinitionId, params.flowVersionId, params.offset, params.limit);
        expect(fetchPromise).toBeCalledWith(SERVER_ACTION_TYPE.GET_FLOW_TESTS_AND_RESULTS, params);
        expect(addFlowTests).toBeCalledTimes(1);
        expect(addFlowTests).toHaveBeenCalledWith(testData);
        expect(logInteraction).toHaveBeenCalled();
        expect(logInteraction.mock.calls[0][0]).toBe('load-tests');
    });

    it('does not invoke call back on error', async () => {
        const errorResponse = 'error';
        fetchPromise.mockRejectedValue(errorResponse);
        await expect(
            loadFlowTests(params.flowDefinitionId, params.flowVersionId, params.offset, params.limit)
        ).rejects.toEqual(errorResponse);
        expect(addFlowTests).not.toHaveBeenCalled();
    });
});

describe('run flow tests', () => {
    const params = {
        flowVersionId: 'abcdef',
        testIds: ['12345', '13579'],
        showTrace: false
    };
    it('invokes call out and call back', async () => {
        const testData = [{ foo: 'bar ' }];
        fetchPromise.mockResolvedValue(testData);

        await runFlowTests(params.flowVersionId, params.testIds, params.showTrace);
        expect(fetchPromise).toBeCalledWith(SERVER_ACTION_TYPE.RUN_FLOW_TESTS, params);
        expect(updateFlowTestResults).toBeCalledTimes(1);
        expect(updateFlowTestResults).toHaveBeenCalledWith(testData);
        expect(logInteraction).toHaveBeenCalled();
        expect(logInteraction.mock.calls[0][0]).toBe('run-test-action-button');
    });

    it('does not invoke call back on error', async () => {
        const errorResponse = 'error';
        fetchPromise.mockRejectedValue(errorResponse);
        await expect(
            runFlowTests(params.flowDefinitionId, params.flowVersionId, params.offset, params.limit)
        ).rejects.toEqual(errorResponse);
        expect(updateFlowTestResults).not.toHaveBeenCalled();
    });
});
