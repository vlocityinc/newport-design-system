const eventName = 'guardrailresult';

/**
 * Fired to update guardrails result.
 *
 * TODO: W-7261153
 */
export class GuardrailsResultEvent extends CustomEvent<any> {
    constructor(result) {
        super(eventName, {
            detail: { guardrailsResult: result }
        });
    }

    static EVENT_NAME = eventName;
}
