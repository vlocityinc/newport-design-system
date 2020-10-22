const eventName = 'addsortoptionitem';

export class AddSortOptionItemEvent {
    constructor(index) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                index
            }
        });
    }

    static EVENT_NAME = eventName;
}
