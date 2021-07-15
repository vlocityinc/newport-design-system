/**
 * Event to register a child component with its parent.
 */
const eventName = 'privateitemregister';

interface PrivateItemRegisterEventDetail {
    component: HTMLElement;
}

export class PrivateItemRegisterEvent extends CustomEvent<PrivateItemRegisterEventDetail> {
    constructor(component: HTMLElement) {
        super(eventName, {
            bubbles: true,
            detail: { component }
        });
    }
    static EVENT_NAME = eventName;
}
