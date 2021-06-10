const eventName = 'toggleselectionmode';
export class ToggleSelectionModeEvent extends CustomEvent<{}> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
