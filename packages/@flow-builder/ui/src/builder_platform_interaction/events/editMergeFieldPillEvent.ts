const eventName = 'editmergefieldpill';

type EditMergeFieldPillEventDetail = {
    item?: {};
};

/**
 * Class representing a pill edit event. (Basically when clicking into the pill)
 */
export class EditMergeFieldPillEvent extends CustomEvent<EditMergeFieldPillEventDetail> {
    /**
     * Create a EditMergeFieldPillEvent.
     * @param {Object} item - pill item property
     */
    constructor(item: {}) {
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
