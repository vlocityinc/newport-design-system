const eventName = 'inputsonnextnavtoassocscrnchanged';

export class InputsOnNextNavToAssocScrnChangeEvent extends CustomEvent<any> {
    constructor(option: 'UseStoredValues' | 'ResetValues') {
        super(eventName, {
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
