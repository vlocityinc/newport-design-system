/**
 * Event used to focus out from the toolbar either backwards or forwards.
 */

const eventName = 'toolbarfocusout';

interface ToolbarFocusOutEventDetail {
    shiftBackward: boolean;
}

export class ToolbarFocusOutEvent extends CustomEvent<ToolbarFocusOutEventDetail> {
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
