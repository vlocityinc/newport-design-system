/**
 * Event used to toggle the menu popover component.
 */
const eventName = 'popovertoggled';

interface PopoverToggledEventDetail {
    opened: boolean;
}

export class PopoverToggledEvent extends CustomEvent<PopoverToggledEventDetail> {
    constructor(opened: boolean) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: { opened }
        });
    }

    static EVENT_NAME = eventName;
}
