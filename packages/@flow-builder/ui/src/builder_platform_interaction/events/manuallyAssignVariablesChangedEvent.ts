const eventName = 'manuallyassignvariableschanged';

export class ManuallyAssignVariablesChangedEvent extends Event {
    readonly detail;

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
