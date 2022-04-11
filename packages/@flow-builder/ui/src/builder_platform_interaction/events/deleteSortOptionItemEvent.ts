const eventName = 'deletesortoptionitem';

export class DeleteSortOptionItemEvent extends CustomEvent<any> {
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
