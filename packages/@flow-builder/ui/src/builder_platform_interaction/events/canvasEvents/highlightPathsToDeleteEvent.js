/**
 * Used by auto-layout canvas to highlight paths to be deleted on the canvas
 */

const eventName = 'highlightpathstodelete';

export class HighlightPathsToDeleteEvent {
    constructor(elementGuidToDelete, childIndexToKeep) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGuidToDelete,
                childIndexToKeep
            }
        });
    }
}
