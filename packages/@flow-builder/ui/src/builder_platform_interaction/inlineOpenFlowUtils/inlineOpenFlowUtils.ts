import { launchSubflow } from 'builder_platform_interaction/editor';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';

/**
 * retrieve flow version ids using flow names
 *
 * @param actionNameList - a list of flow names
 * @returns map of flow names to ids
 */
export function getFlowIdsForNames(actionNameList) {
    return fetchOnce(SERVER_ACTION_TYPE.GET_FLOW_IDS, {
        flowNameList: actionNameList
    }).then((data) => {
        return data;
    });
}

/**
 * open the flow in a new tab using the flow version id
 *
 * @param  flowId - the selected flow ID
 */
export function openFlow(flowId) {
    // reuse launchSubflow function
    launchSubflow(flowId);
}
