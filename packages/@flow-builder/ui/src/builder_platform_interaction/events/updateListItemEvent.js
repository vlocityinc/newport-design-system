const eventName = 'updatelistitem';

export class UpdateListItemEvent extends Event {
    constructor(index, propertyName, value, error) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            index,
            propertyName,
            value,
            error
        };
    }

    static EVENT_NAME = eventName;
}