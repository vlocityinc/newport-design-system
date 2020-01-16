const eventName = 'valuedeleted';
/**
 * This event can be used by partner teams to
 * notify invocable action editor regarding to
 * remove ("toggle off") a specific input parameter
 *
 * @export
 * @class ConfigurationEditorPropertyDeleteEvent
 */
export class ConfigurationEditorPropertyDeleteEvent {
    constructor(id) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                id, // In case of actions, it is parameter name
                newValue: null,
                newValueDataType: null
            }
        });
    }
    static EVENT_NAME = eventName;
}