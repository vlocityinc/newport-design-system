const eventName = 'configuration_editor_input_value_deleted';

/**
 * This event can be used by partner teams to
 * notify invocable action editor regarding to
 * remove ("toggle off") a specific input parameter
 *
 * @export
 * @class ConfigurationEditorPropertyDeleteEvent
 */
export class ConfigurationEditorPropertyDeleteEvent extends CustomEvent<any> {
    constructor(name) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                name, // In case of actions, it is parameter name
                newValue: null,
                newValueDataType: null
            }
        });
    }
    static EVENT_NAME = eventName;
}
