/**
 * Event used to focus out from the canvas either backwards or forwards.
 */

const eventName = 'canvasfocusout';

interface FocusOutEventDetail {
    shiftBackward: boolean;
}

export class FocusOutEvent extends CustomEvent<FocusOutEventDetail> {
    /**
     * @param shiftBackward - Whether to shift focus backwards or forwards
     */
    constructor(shiftBackward: boolean) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                shiftBackward
            }
        });
    }

    static EVENT_NAME = eventName;
}
