const eventName = 'removemergefieldpill';

/**
 * Class representing a pill removal event.
 */
export class RemoveMergeFieldPillEvent {
    /**
     * Create a RemoveMergeFieldPillEvent.
     * @param {Object} item - pill item property
     * @param {boolean} resetMenuDataAndDisplayText - do we reset the pill display text and menu data?
     */
    constructor(item: {}, resetMenuDataAndDisplayText: boolean) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                item,
                resetMenuDataAndDisplayText
            }
        });
    }

    static EVENT_NAME: string = eventName;
}
