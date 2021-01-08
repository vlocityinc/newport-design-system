const eventName = 'sobjectreferencechanged';
type SObjectReferenceChangedEventDetail = {
    value;
    error: string | null;
};
export class SObjectReferenceChangedEvent extends CustomEvent<SObjectReferenceChangedEventDetail> {
    constructor(value, error?) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                error
            }
        });
    }

    static EVENT_NAME: string = eventName;
}
