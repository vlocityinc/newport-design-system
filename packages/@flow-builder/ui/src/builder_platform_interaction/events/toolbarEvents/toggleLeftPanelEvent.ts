const eventName = 'toggleleftpanel';

export class ToggleLeftPanelEvent extends CustomEvent<any> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
