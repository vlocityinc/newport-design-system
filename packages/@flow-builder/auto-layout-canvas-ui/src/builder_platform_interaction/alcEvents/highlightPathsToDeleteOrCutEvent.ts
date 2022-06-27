import { Guid, NodeOperationType } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Used by auto-layout canvas to highlight paths to be deleted on the canvas
 */

const eventName = 'highlightpathstodeleteorcut';

interface HighlightPathsToDeleteOrCutEventDetail {
    elementGuid: Guid;
    childIndexToKeep: number | undefined;
    operationType: NodeOperationType;
}
export class HighlightPathsToDeleteOrCutEvent extends CustomEvent<HighlightPathsToDeleteOrCutEventDetail> {
    constructor(elementGuid: string, operationType: NodeOperationType, childIndexToKeep?: number) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGuid,
                childIndexToKeep,
                operationType
            }
        });
    }

    static EVENT_NAME = eventName;
}
