import { FlowModel, Guid, findFirstElement, isRoot } from 'builder_platform_interaction/autoLayoutCanvas';

export interface PathToNode {
    guid: Guid;
    index?: number;
}

/**
 * Helper function to build a path to the node that needs to be focused. The path will consist of the
 * guid and branch index to follow for all the branching nodes leading up to the focus node.
 */
export const getFocusPath = (flowModel: FlowModel, focusPath: PathToNode[]) => {
    const focusGuid = focusPath[0].guid;
    const branchHead = findFirstElement(flowModel[focusGuid], flowModel);
    const { childIndex, parent } = branchHead;

    if (!isRoot(parent)) {
        // Adding childIndex along with the parent guid so that we know which
        // branch to follow when going down the flow to move focus
        return getFocusPath(flowModel, [{ guid: parent, index: childIndex }, ...focusPath]);
    }
    // The focus path is complete once we hit the Root element
    return focusPath;
};
