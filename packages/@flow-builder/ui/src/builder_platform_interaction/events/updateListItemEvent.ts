const eventName = 'updatelistitem';

export class UpdateListItemEvent extends CustomEvent<any> {
    constructor(index, value) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                index,
                value
            }
        });
    }

    static EVENT_NAME = eventName;
}
