import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';

/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'orchestrationactionvaluechanged';

type OrchestrationActionValueChangedEventDetail<T> = {
    actionCategory: ORCHESTRATED_ACTION_CATEGORY;
    value?: T | null;
    error?: string | null;
};

export class OrchestrationActionValueChangedEvent<T> extends CustomEvent<
    OrchestrationActionValueChangedEventDetail<T>
> {
    constructor(actionCategory: ORCHESTRATED_ACTION_CATEGORY, value = null, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                actionCategory,
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
