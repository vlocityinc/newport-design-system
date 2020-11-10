const eventName = 'inputsonnextnavtoassocscrnchanged';

export class InputsOnNextNavToAssocScrnChangeEvent {
    constructor(option: 'UseStoredValues' | 'ResetValues') {
        return new CustomEvent(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: {
                option
            }
        });
    }

    static EVENT_NAME = eventName;
}
