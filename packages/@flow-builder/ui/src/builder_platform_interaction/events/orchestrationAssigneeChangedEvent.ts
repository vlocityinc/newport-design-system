/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'orchestrationassigneechanged';

type OrchestrationAssigneeChangedEventDetail<T> = {
    value?: T | null;
    isReference?: boolean;
    error?: string | null;
};

export class OrchestrationAssigneeChangedEvent<T> extends CustomEvent<OrchestrationAssigneeChangedEventDetail<T>> {
    constructor(value = null, isReference = false, error: string | null = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                error,
                isReference
            }
        });
    }

    static EVENT_NAME = eventName;
}
