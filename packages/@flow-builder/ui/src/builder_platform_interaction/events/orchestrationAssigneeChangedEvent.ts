/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'orchestrationassigneechanged';

type OrchestrationAssigneeChangedEventDetail<T> = {
    value?: T | null;
    error?: string | null;
};

export class OrchestrationAssigneeChangedEvent<T> extends CustomEvent<OrchestrationAssigneeChangedEventDetail<T>> {
    constructor(value = null, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
