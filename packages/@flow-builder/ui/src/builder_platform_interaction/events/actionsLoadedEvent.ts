/**
 * Used by actions to indicate that it's action has changed, includes action type and number of actions of that type
 */
const eventName = 'actionsloaded';

export class ActionsLoadedEvent extends CustomEvent<any> {
    constructor(value = null, number = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                number
            }
        });
    }

    static EVENT_NAME = eventName;
}
