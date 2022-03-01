import { fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { addFlowTests, updateFlowTestResults } from 'builder_platform_interaction/systemLib';

export const loadFlowTests = (flowDefinitionId, flowVersionId, offset, limit) =>
    fetchPromise(SERVER_ACTION_TYPE.GET_FLOW_TESTS_AND_RESULTS, {
        flowDefinitionId,
        flowVersionId,
        offset,
        limit
    }).then((data: any) => {
        addFlowTests(data);
    });

export const runFlowTests = (flowVersionId, testIds, showTrace) =>
    fetchPromise(SERVER_ACTION_TYPE.RUN_FLOW_TESTS, {
        flowVersionId,
        testIds,
        showTrace
    }).then((data: any) => {
        updateFlowTestResults(data);
        return data;
    });

export const deleteFlowTest = (testIds) =>
    fetchPromise(SERVER_ACTION_TYPE.DELETE_FLOW_TEST, {
        testIds
    });
