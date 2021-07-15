/**
 * Event used to trigger open the menu popover component.
 */
const eventName = 'popovertrigger';

export class PopoverTriggerEvent extends CustomEvent<{}> {
    constructor() {
        super(eventName, {
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
