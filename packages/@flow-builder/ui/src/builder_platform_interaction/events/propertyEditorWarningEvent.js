/**
 * Used by components to indicate that a property of the business element they represent
 * has warning. These warnings would appear in the property editor footer warning pop over.
 */
const eventName = 'propeditorwarning';


export class PropertyEditorWarningEvent {
    constructor(propertyName, warning = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                propertyName,
                warning
            }
        });
    }

    static EVENT_NAME = eventName;
}