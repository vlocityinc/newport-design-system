const eventName = 'dummypreviewmode';

export class DummyPreviewModeEvent {
    constructor(dummyModeDueToError, dummyModeDueToRenderError) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                dummyModeDueToError,
                dummyModeDueToRenderError
            }
        });
    }

    static EVENT_NAME = eventName;
}
