const eventName = 'requiresasyncprocessingchanged';

type RequiresAsyncProcessingChangedEventDetail = {
    checked: boolean;
};

export class RequiresAsyncProcessingChangedEvent extends CustomEvent<RequiresAsyncProcessingChangedEventDetail> {
    constructor(checked) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                checked
            }
        });
    }

    static EVENT_NAME = eventName;
}
