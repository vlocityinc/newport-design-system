const eventName = 'valuechanged';

/**
 * This event can be used by partner teams to notify invocable action editor regarding a new value of an input parameter
 *
 * @export
 * @class ConfigurationEditorChangeEvent
 */
export class ConfigurationEditorChangeEvent {
    constructor(parameterName, newValue, newValueDataType) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parameterName,
                newValue,
                newValueDataType
            }
        });
    }

    static EVENT_NAME = eventName;
}
