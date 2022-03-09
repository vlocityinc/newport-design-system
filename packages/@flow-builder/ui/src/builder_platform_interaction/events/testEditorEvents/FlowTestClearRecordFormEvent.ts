const eventName = 'flowtestclearrecordform';

type FlowTestClearRecordFormEventDetail = {
    isUpdatedRecord: boolean;
};

/**
 * Event to clear one of the Flow Test record edit forms.
 */
export class FlowTestClearRecordFormEvent extends CustomEvent<FlowTestClearRecordFormEventDetail> {
    constructor(isUpdatedRecord: boolean) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                isUpdatedRecord
            }
        });
    }

    static EVENT_NAME = eventName;
}
