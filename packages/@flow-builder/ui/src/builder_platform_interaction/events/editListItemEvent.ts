const eventName = 'editlistitem';

export class EditListItemEvent extends CustomEvent<any> {
    constructor(index: number) {
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
