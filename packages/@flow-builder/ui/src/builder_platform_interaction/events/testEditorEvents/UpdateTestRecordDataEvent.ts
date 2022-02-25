/**
 * Used to pass in info passed in from the FlowTestTriggerRecordEditForm.
 */
const eventName = 'updatetestrecorddata';

type UpdateTestRecordDataEventDetail = {
    recordData: object;
    hasError: boolean;
};

export class UpdateTestRecordDataEvent extends CustomEvent<UpdateTestRecordDataEventDetail> {
    /**
     * @param recordData object that contains field names as properties and their values
     * @param hasError aggregated value indicating if any of the fields has a client-side validation error from the lightning-record-edit-form
     */
    constructor(recordData: object, hasError: boolean) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                recordData,
                hasError
            }
        });
    }

    static EVENT_NAME = eventName;
}
