const eventName = 'deletelistitem';

export class DeleteListItemEvent extends Event {
    constructor(index) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            index
        };
    }

    static EVENT_NAME = eventName;
}