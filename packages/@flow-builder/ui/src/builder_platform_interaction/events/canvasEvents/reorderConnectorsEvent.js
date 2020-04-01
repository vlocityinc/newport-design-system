/**
 * Used by fixed canvas to reorder connectors
 */
const eventName = 'reorderconnectors';
export class ReorderConnectorsEvent {
    constructor(parentElementGuid, oldChildReferenceGuid, newChildReferenceGuid) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                parentElementGuid,
                oldChildReferenceGuid,
                newChildReferenceGuid
            }
        });
    }
    static EVENT_NAME = eventName;
}
