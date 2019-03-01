const eventName = 'templatechanged';

export class TemplateChangedEvent {
    constructor(id, isProcessType) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                id,
                isProcessType,
            }
        });
    }

    static EVENT_NAME = eventName;
}