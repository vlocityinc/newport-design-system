const eventName = 'useadvancedoptionsselectionchanged';

export class UseAdvancedOptionsSelectionChangedEvent extends Event {
    constructor(useAdvancedOptions) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
        this.detail = {
            useAdvancedOptions
        };
    }

    static EVENT_NAME = eventName;
}
