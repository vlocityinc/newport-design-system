const eventName = 'updaterelatedrecordfieldschanged';
type UpdateRelatedChangedEventDetail = {
    value: string | null;
    subType: string | undefined;
    error?: string | null;
};
export class UpdateRelatedRecordFieldsChangeEvent extends CustomEvent<UpdateRelatedChangedEventDetail> {
    constructor(value: string | null, subType: string | undefined, error?: string | null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                subType,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
