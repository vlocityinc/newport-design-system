import { FlowInteractionState, getBranchLayoutKey, NodeOperationType } from './flowRendererUtils';
import MenuType from './MenuType';
import { ConnectionSource, Guid } from './model';

/**
 * Util functions for flow interactions
 */
interface MenuEventDetail {
    source: ConnectionSource;
    type: MenuType;
}

/**
 * Checks if a menu is opened for a node.
 *
 * @param nodeGuid - The guid for the node
 * @param menuType - The type of the menu to check for
 * @param interactionState - The flow's interaction state
 * @returns True if the menu is opened, false otherwise
 */
function isMenuOpened(nodeGuid: Guid, menuType: MenuType, interactionState: FlowInteractionState): boolean {
    if (!interactionState.menuInfo) {
        return false;
    } else {
        const menuInfo = interactionState.menuInfo;
        return menuInfo.key === nodeGuid && menuInfo.type === menuType;
    }
}

/**
 * Updates a flow's FlowInteractionState so that the menu is toggled
 *
 * @param menuEventDetail - The menu event detail
 * @param interactionState - The flow interaction state
 * @returns A new, updated FlowInteractionState
 */
function toggleFlowMenu(
    menuEventDetail: MenuEventDetail,
    interactionState: FlowInteractionState
): FlowInteractionState {
    let menuInfo = interactionState.menuInfo;
    const { source, type } = menuEventDetail;
    if (!source) {
        return closeFlowMenu(interactionState);
    }
    const { guid, childIndex } = source;
    const key = childIndex != null ? getBranchLayoutKey(guid, childIndex) : guid;

    const isDifferentTarget = menuInfo != null && (menuInfo.key !== key || menuInfo.type !== type);

    if (!menuInfo || isDifferentTarget) {
        menuInfo = {
            key,
            type
        };
    } else {
        return closeFlowMenu(interactionState);
    }

    return { ...interactionState, menuInfo, cutAndDeletePathInfo: null };
}

/**
 * Close the Flow Menu
 *
 * @param interactionState - The flow interaction state
 * @returns - The flow interaction state with Flow Menu closed
 */
function closeFlowMenu(interactionState: FlowInteractionState): FlowInteractionState {
    return { ...interactionState, menuInfo: null, cutAndDeletePathInfo: null };
}

/**
 * Update deletion path info
 *
 * @param elementGuidToCutOrDelete - The Guid of the element to be cut/ deleted
 * @param childIndexToKeep - The child index to keep
 * @param interactionState - The flow interaction state
 * @param shouldCutOrDeleteBeyondMergingPoint - true if the element beyoud the merge point should be cut/ deleted
 * @param operationType - The operation type
 * @returns - The updated path info
 */
function updateCutOrDeletePathInfo(
    elementGuidToCutOrDelete: Guid,
    childIndexToKeep: number,
    interactionState: FlowInteractionState,
    shouldCutOrDeleteBeyondMergingPoint: boolean,
    operationType: NodeOperationType
): FlowInteractionState {
    const cutAndDeletePathInfo = {
        elementGuidToCutOrDelete,
        childIndexToKeep,
        shouldCutOrDeleteBeyondMergingPoint,
        operationType
    };
    return { ...interactionState, cutAndDeletePathInfo };
}

/**
 * Clears the cutAndDeletePathInfo in interactionState
 *
 * @param interactionState - The flow interaction state
 * @returns - Clear the path info
 */
function clearCutOrDeletePathInfo(interactionState: FlowInteractionState): FlowInteractionState {
    return { ...interactionState, cutAndDeletePathInfo: null };
}

export { isMenuOpened, toggleFlowMenu, closeFlowMenu, updateCutOrDeletePathInfo, clearCutOrDeletePathInfo };
