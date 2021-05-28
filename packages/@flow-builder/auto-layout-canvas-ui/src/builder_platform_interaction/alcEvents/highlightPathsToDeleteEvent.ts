import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Used by auto-layout canvas to highlight paths to be deleted on the canvas
 */

const eventName = 'highlightpathstodelete';

interface HighlightPathsToDeleteEventDetail {
    elementGuidToDelete: Guid;
    childIndexToKeep: number | undefined;
}
export class HighlightPathsToDeleteEvent extends CustomEvent<HighlightPathsToDeleteEventDetail> {
    constructor(elementGuidToDelete: string, childIndexToKeep?: number) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGuidToDelete,
                childIndexToKeep
            }
        });
    }

    static EVENT_NAME = eventName;
}
