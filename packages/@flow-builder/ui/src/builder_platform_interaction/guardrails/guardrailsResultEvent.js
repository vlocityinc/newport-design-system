const eventName = 'guardrailresult';

/**
 * Fired to update guardrails result.
 *
 * kolsson: move to guardails/analyzer lib
 */
export class GuardrailsResultEvent {
    constructor(result) {
        return new CustomEvent(eventName, {
            detail: { guardrailsResult: result }
        });
    }

    static EVENT_NAME = eventName;
}
