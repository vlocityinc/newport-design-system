const eventName = 'configurationeditorinputvaluechanged';

/**
 * This event can be used by partner teams to notify invocable action editor regarding a new value of an input parameter
 *
 * @export
 * @class ConfigurationEditorChangeEvent
 */
export class ConfigurationEditorChangeEvent {
    constructor(name, newValue, newValueDataType) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                name, // In case of actions, it is parameter name
                newValue,
                newValueDataType
            }
        });
    }

    static EVENT_NAME = eventName;
}
