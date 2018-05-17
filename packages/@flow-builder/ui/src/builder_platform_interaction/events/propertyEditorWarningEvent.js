/**
 * Used by components to indicate that a property of the business element they represent
 * has warning. These warnings would appear in the property editor footer warning pop over.
 */
const eventName = 'propeditorwarning';

export class PropertyEditorWarningEvent extends Event {
    constructor(propertyName, warning = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            propertyName,
            warning
        };
    }

    static EVENT_NAME = eventName;
}