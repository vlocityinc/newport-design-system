/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'validationrulechanged';

export class ValidationRuleChangedEvent extends CustomEvent<any> {
    constructor(rule) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                rule
            }
        });
    }

    static EVENT_NAME = eventName;
}
