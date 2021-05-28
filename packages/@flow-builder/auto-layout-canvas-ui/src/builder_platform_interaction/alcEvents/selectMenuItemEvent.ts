const eventName = 'selectmenuitem';

interface SelectMenuItemEventDetail {
    value: string;
}
export class SelectMenuItemEvent extends CustomEvent<SelectMenuItemEventDetail> {
    constructor(detail) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
