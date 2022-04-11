const eventName = 'dummypreviewmode';

export class DummyPreviewModeEvent extends CustomEvent<any> {
    constructor(dummyModeDueToError, dummyModeDueToRenderError) {
        super(eventName, {
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
