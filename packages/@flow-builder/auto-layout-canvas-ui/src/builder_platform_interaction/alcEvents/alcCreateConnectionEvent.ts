import { ConnectionSource, Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event used to create a connection between a source and a target element.a
 * Used for gotos and merging ended branches.
 */

const eventName = 'alccreateconnection';

interface AlcCreateConnectionEventDetail {
    source: ConnectionSource;
    targetGuid: Guid;
    isMergeableGuid: boolean;
}
export class AlcCreateConnectionEvent extends CustomEvent<AlcCreateConnectionEventDetail> {
    /**
     * @param source - The connection source
     * @param targetGuid - The guid of the target element
     * @param isMergeableGuid - True if the target is part of mergeableGuids
     */
    constructor(source: ConnectionSource, targetGuid: Guid, isMergeableGuid = true) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                source,
                targetGuid,
                isMergeableGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}