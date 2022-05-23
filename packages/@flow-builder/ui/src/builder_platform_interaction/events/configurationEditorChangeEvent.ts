const eventName = 'configuration_editor_input_value_changed';

/**
 * This event can be used by partner teams to notify invocable action editor regarding a new value of an input parameter
 *
 * @class ConfigurationEditorChangeEvent
 */
export class ConfigurationEditorChangeEvent extends CustomEvent<any> {
    constructor(name, newValue, newValueDataType) {
        super(eventName, {
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
