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

    return { ...interactionState, menuInfo, deletionPathInfo: null };
}

/**
 * Close the Flow Menu
 *
 * @param interactionState - The flow interaction state
 * @returns - The flow interaction state with Flow Menu closed
 */
function closeFlowMenu(interactionState: FlowInteractionState): FlowInteractionState {
    return { ...interactionState, menuInfo: null, deletionPathInfo: null };
}

/**
 * Update deletion path info
 *
 * @param elementGuidToDelete - The Guid of the element to be deleted
 * @param childIndexToKeep - The child index to keep
 * @param interactionState - The flow interaction state
 * @param shouldDeleteBeyondMergingPoint - true if the element beyoud the merge point should be deleted
 * @param operationType - The operation type
 * @returns - The updated path info
 */
function updateDeletionPathInfo(
    elementGuidToDelete: Guid,
    childIndexToKeep: number,
    interactionState: FlowInteractionState,
    shouldDeleteBeyondMergingPoint: boolean,
    operationType: NodeOperationType
): FlowInteractionState {
    const deletionPathInfo = {
        elementGuidToDelete,
        childIndexToKeep,
        shouldDeleteBeyondMergingPoint,
        operationType
    };
    return { ...interactionState, deletionPathInfo };
}

/**
 * Clears the deletionPathInfo in interactionState
 *
 * @param interactionState - The flow interaction state
 * @returns - Clear the path info
 */
function clearDeletionPathInfo(interactionState: FlowInteractionState): FlowInteractionState {
    return { ...interactionState, deletionPathInfo: null };
}

export { isMenuOpened, toggleFlowMenu, closeFlowMenu, updateDeletionPathInfo, clearDeletionPathInfo };
