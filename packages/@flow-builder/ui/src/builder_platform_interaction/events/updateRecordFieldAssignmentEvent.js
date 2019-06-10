const eventName = 'updaterecordfieldassignment';

export class UpdateRecordFieldAssignmentEvent {
    constructor(index, value, error = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                index,
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
