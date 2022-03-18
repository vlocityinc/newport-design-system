import { fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { addFlowTests, updateFlowTestResults } from 'builder_platform_interaction/systemLib';
const { logInteraction } = loggingUtils;

export const loadFlowTests = (flowDefinitionId, flowVersionId, offset, limit) =>
    fetchPromise(SERVER_ACTION_TYPE.GET_FLOW_TESTS_AND_RESULTS, {
        flowDefinitionId,
        flowVersionId,
        offset,
        limit
    })
        .then((data: any) => {
            addFlowTests(data);
        })
        .finally(() => {
            logInteraction(
                'load-tests',
                'test-list-view',
                {
                    flowDefinitionId,
                    flowVersionId,
                    offset,
                    limit
                },
                'click'
            );
        });

export const runFlowTests = (flowVersionId, testIds, showTrace) =>
    fetchPromise(SERVER_ACTION_TYPE.RUN_FLOW_TESTS, {
        flowVersionId,
        testIds,
        showTrace
    })
        .then((data: any) => {
            updateFlowTestResults(data);
            return data;
        })
        .finally(() => {
            logInteraction(
                'run-test-action-button',
                'test-list-view',
                {
                    flowVersionId,
                    testIds
                },
                'click'
            );
        });

export const deleteFlowTest = (testIds) =>
    fetchPromise(SERVER_ACTION_TYPE.DELETE_FLOW_TEST, {
        testIds
    }).finally(() => {
        logInteraction(
            'delete-test-action',
            'test-list-view',
            {
                testIds
            },
            'click'
        );
    });
