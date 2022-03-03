const eventName = 'flowtestrecordselected';

type FlowTestRecordSelectedEventDetail = {
    id: string | null;
};

/**
 * Event to push sample record id selected from Record Picker.
 */
export class FlowTestRecordSelectedEvent extends CustomEvent<FlowTestRecordSelectedEventDetail> {
    constructor(recordId: string | null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                id: recordId
            }
        });
    }

    static EVENT_NAME = eventName;
}
