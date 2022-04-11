const eventName = 'addlistitem';

export class AddListItemEvent extends CustomEvent<any> {
    constructor(index) {
        super(eventName, {
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
