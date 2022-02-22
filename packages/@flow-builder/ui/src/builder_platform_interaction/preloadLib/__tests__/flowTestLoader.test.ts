// @ts-nocheck
import { fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { addFlowTests } from 'builder_platform_interaction/systemLib';
import { loadFlowTests } from '../flowTestLoader';

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        fetchPromise: jest.fn(),
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE
    };
});

jest.mock('builder_platform_interaction/systemLib');

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
