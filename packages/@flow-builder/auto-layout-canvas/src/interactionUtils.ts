import { FlowInteractionState, getBranchLayoutKey } from './flowRendererUtils';
import MenuType from './MenuType';
import { Guid } from './model';

/**
 * Util functions for flow interactions
 */
interface MenuEventDetail {
    top: number;
    left: number;
    guid: string;
    parent: string;
    childIndex: number;
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

    if (!menuInfo) {
        const { parent, childIndex, type } = menuEventDetail;
        const key = parent ? getBranchLayoutKey(parent, childIndex) : menuEventDetail.guid;

        menuInfo = {
            key,
            type
        };
    } else {
        menuInfo = null;
    }

    return { ...interactionState, menuInfo, deletionPathInfo: null };
}

function closeFlowMenu(interactionState: FlowInteractionState): FlowInteractionState {
    return { ...interactionState, menuInfo: null, deletionPathInfo: null };
}

function updateDeletionPathInfo(
    elementGuidToDelete: Guid,
    childIndexToKeep: number,
    interactionState: FlowInteractionState
): FlowInteractionState {
    const deletionPathInfo = {
        elementGuidToDelete,
        childIndexToKeep
    };
    return { ...interactionState, deletionPathInfo };
}

export { isMenuOpened, toggleFlowMenu, closeFlowMenu, updateDeletionPathInfo };
