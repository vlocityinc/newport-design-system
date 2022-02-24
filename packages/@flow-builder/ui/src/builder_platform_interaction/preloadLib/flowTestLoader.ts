import { fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { addFlowTests } from 'builder_platform_interaction/systemLib';

export const loadFlowTests = (flowDefinitionId, flowVersionId, offset, limit) =>
    fetchPromise(SERVER_ACTION_TYPE.GET_FLOW_TESTS_AND_RESULTS, {
        flowDefinitionId,
        flowVersionId,
        offset,
        limit
    }).then((data: any) => {
        addFlowTests(data);
    });

export const deleteFlowTest = (testIds) =>
    fetchPromise(SERVER_ACTION_TYPE.DELETE_FLOW_TEST, {
        testIds
    });
