/**
 * Event fired when tabbing on menu trigger
 */
const eventName = 'tabonmenutrigger';

interface TabOnMenuTriggerEventDetail {
    shift: boolean;
}

export class TabOnMenuTriggerEvent extends CustomEvent<TabOnMenuTriggerEventDetail> {
    /**
     * @param shift - If shift key is pressed
     */
    constructor(shift: boolean) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                shift
            }
        });
    }

    static EVENT_NAME = eventName;
}
