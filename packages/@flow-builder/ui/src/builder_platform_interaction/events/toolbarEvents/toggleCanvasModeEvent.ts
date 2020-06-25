const eventName = 'togglecanvasmode';

export class ToggleCanvasModeEvent extends CustomEvent<{}> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {}
        });
    }

    static EVENT_NAME = eventName;
}
