import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { setFlowTests } from 'builder_platform_interaction/systemLib';

export const loadFlowTests = (flowDefinitionId, flowVersionId, offset, limit) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_FLOW_TESTS_AND_RESULTS, { flowDefinitionId, flowVersionId, offset, limit }).then(
        (data) => setFlowTests(data)
    );
