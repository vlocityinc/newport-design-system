const eventName = 'dummypreviewmode';

export class DummyPreviewModeEvent {
    constructor(enableDummyMode) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                enableDummyMode
            }
        });
    }

    static EVENT_NAME = eventName;
}
