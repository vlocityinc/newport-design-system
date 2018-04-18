const eventName = 'updatelistitem';

export class UpdateListItemEvent extends Event {
    constructor(index, value) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            index,
            value,
        };
    }

    static EVENT_NAME = eventName;
}