const eventName = 'templatechanged';

export class TemplateChangedEvent {
    /**
     *
     * @param {TemplateId|{ processType: string, triggerType: string}} detail
     */
    constructor(detail) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
