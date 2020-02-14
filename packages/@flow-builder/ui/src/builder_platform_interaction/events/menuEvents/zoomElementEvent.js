const eventName = 'zoomelement';
export class ZoomElementEvent extends CustomEvent {
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
