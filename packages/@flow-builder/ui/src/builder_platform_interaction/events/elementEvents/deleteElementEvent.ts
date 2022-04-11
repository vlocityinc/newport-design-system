export interface DeleteElementEventDetail {
    selectedElementGUID: UI.Guid[];
    selectedElementType: UI.ElementType;
    childIndexToKeep?: number | null;
    parentGUID?: UI.Guid;
}

/**
 * Used to delete any canvas or non-canvas element.
 *
 * @param childIndexToKeep - Indicates the specified branch index of the deleted element
 * that should be attached to the parent flow in place of the deleted element.
 * IMPORTANT: auto-layout-canvas expects a value of undefined when deleting all branches
 * @param parentGUID - If a parent guid is provided then it is ignored when checking for
 * usage.  this allows a child element to be deleted despite always having a reference from the parent
 */
const eventName = 'deleteelement';

export class DeleteElementEvent extends CustomEvent<DeleteElementEventDetail> {
    constructor(
        selectedElementGUID: UI.Guid[],
        selectedElementType: UI.ElementType,
        childIndexToKeep?: number | null,
        parentGUID?: UI.Guid
    ) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedElementGUID,
                selectedElementType,
                childIndexToKeep,
                parentGUID
            }
        });
    }

    static EVENT_NAME = eventName;
}
