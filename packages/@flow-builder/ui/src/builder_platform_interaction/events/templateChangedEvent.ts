const eventName = 'templatechanged';

export class TemplateChangedEvent extends CustomEvent<any> {
    /**
     *
     * @param {TemplateId|{ processType: string, triggerType: string}} detail
     */
    constructor(detail) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
