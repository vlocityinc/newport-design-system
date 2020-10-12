/**
 * Used to intercept the Arrow key down event on Start Menu buttons in Auto-Layout Canvas
 */
const eventName = 'arrowkeydown';

interface ArrowKeyDownEventDetail {
    key: string;
}

export class ArrowKeyDownEvent extends CustomEvent<ArrowKeyDownEventDetail> {
    constructor(key: string) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                key
            }
        });
    }

    static EVENT_NAME = eventName;
}
