const eventName = 'removemergefieldpill';

type RemoveMergeFieldPillEventDetail = {
    item?: {};
};

/**
 * Class representing a pill removal event.
 */
export class RemoveMergeFieldPillEvent extends CustomEvent<RemoveMergeFieldPillEventDetail> {
    /**
     * Create a RemoveMergeFieldPillEvent.
     *
     * @param {Object} item - pill item property
     */
    constructor(item) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                item
            }
        });
    }

    static EVENT_NAME: string = eventName;
}
