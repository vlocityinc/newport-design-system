const eventName = 'closemenu';

interface CloseMenuEventDetail {
    // whether to focus on the trigger when the menu is closed
    moveFocusToTrigger?: boolean;
}
export class CloseMenuEvent extends CustomEvent<CloseMenuEventDetail> {
    constructor(moveFocusToTrigger = true) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                moveFocusToTrigger
            }
        });
    }

    static EVENT_NAME = eventName;
}
