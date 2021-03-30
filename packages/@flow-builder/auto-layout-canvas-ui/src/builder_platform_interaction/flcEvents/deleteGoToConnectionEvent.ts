import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event used to delete a goTo connection between a source and a target element.
 */

const eventName = 'deletegotoconnection';

interface DeleteGoToConnectionEventDetail {
    sourceGuid: Guid;
    sourceBranchIndex: number;
}

export class DeleteGoToConnectionEvent extends CustomEvent<DeleteGoToConnectionEventDetail> {
    /**
     * @param sourceGuid - Guid of the source element
     * @param sourceBranchIndex - Index of branch on which GoTo is present
     */
    constructor(sourceGuid, sourceBranchIndex) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                sourceGuid,
                sourceBranchIndex
            }
        });
    }

    static EVENT_NAME = eventName;
}
