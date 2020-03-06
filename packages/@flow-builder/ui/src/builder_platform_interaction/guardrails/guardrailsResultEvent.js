const eventName = 'guardrailresult';

/**
 * Fired to update guardrails result.
 *
 * TODO: W-7261153
 */
export class GuardrailsResultEvent {
    constructor(result) {
        return new CustomEvent(eventName, {
            detail: { guardrailsResult: result }
        });
    }

    static EVENT_NAME = eventName;
}
