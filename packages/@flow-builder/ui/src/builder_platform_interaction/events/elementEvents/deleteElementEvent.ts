// @ts-nocheck
/**
 * Due to lwc compilation this has to be a class and not an interface
 */
export class DeleteElementEventDetail {
    selectedElementGUID: UI.Guid[];
    selectedElementType: UI.ElementType;
    childIndexToKeep?: number;
    parentGUID?: UI.Guid;
}

/**
 * Used to delete any canvas or non-canvas element.
 * @param childIndexToKeep - Indicates the specified branch index of the deleted element
 * that should be attached to the parent flow in place of the deleted element.
 * IMPORTANT: auto-layout-canvas expects a value of -2 when deleting all branches
 * @param parentGUID - If a parent guid is provided then it is ignored when checking for
 * usage.  this allows a child element to be deleted despite always having a reference from the parent
 */
const eventName = 'deleteelement';

export class DeleteElementEvent {
    constructor(
        selectedElementGUID: UI.Guid[],
        selectedElementType: UI.ElementType,
        childIndexToKeep?: number | null,
        parentGUID?: UI.Guid
    ) {
        const detail: DeleteElementEvent = {
            selectedElementGUID,
            selectedElementType,
            childIndexToKeep,
            parentGUID
        };

        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
