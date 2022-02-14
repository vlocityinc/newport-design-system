// @ts-nocheck
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { setFlowTests } from 'builder_platform_interaction/systemLib';
import { loadFlowTests } from '../flowTestLoader';

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        fetchOnce: jest.fn(),
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE
    };
});

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        setFlowTests: jest.fn()
    };
});

describe('load flow tests', () => {
    const params = {
        flowDefinitionId: '123456',
        flowVersionId: 'abcdef',
        offset: 0,
        limit: 0
    };
    it('invokes call out and call back', async () => {
        const testData = [{ foo: 'bar ' }];
        fetchOnce.mockResolvedValue(testData);

        await loadFlowTests(params.flowDefinitionId, params.flowVersionId, params.offset, params.limit);
        expect(fetchOnce).toBeCalledWith(SERVER_ACTION_TYPE.GET_FLOW_TESTS_AND_RESULTS, params);
        expect(setFlowTests).toBeCalledTimes(1);
        expect(setFlowTests).toHaveBeenCalledWith(testData);
    });

    it('does not invoke call back on error', async () => {
        const errorResponse = 'error';
        fetchOnce.mockRejectedValue(errorResponse);
        await expect(
            loadFlowTests(params.flowDefinitionId, params.flowVersionId, params.offset, params.limit)
        ).rejects.toEqual(errorResponse);
        expect(setFlowTests).not.toHaveBeenCalled();
    });
});
