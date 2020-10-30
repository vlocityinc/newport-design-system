const eventName = 'updaterecordfieldassignment';

type UpdateRecordFieldAssignmentEventDetail = {
    index: number;
    value: string | null;
    error: string | null;
};
export class UpdateRecordFieldAssignmentEvent extends CustomEvent<UpdateRecordFieldAssignmentEventDetail> {
    constructor(index: number, value: string | null, error: string | null = null) {
        super(eventName, {
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
