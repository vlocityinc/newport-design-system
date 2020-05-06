const eventName = 'configuration_editor_type_mapping_changed';

/**
 * This event can be used by partner teams to set the concrete values for the dynamic types in their invocable action or screen component
 *
 * @export
 * @class ConfigurationEditorTypeMappingChangeEvent
 */
export class ConfigurationEditorTypeMappingChangeEvent {
    constructor(name, value) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                name,
                value
            }
        });
    }

    static EVENT_NAME = eventName;
}
