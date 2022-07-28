const eventName = 'closemenu';

interface CloseMenuEventDetail {
    // whether to restore the focus when the menu is closed
    restoreFocus: boolean;
}
export class CloseMenuEvent extends CustomEvent<CloseMenuEventDetail> {
    constructor(restoreFocus = true) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                restoreFocus
            }
        });
    }

    static EVENT_NAME = eventName;
}
