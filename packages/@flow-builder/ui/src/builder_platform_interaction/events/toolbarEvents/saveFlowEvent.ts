/**
 * Used to save a flow.
 */
const eventName = 'save';

export class SaveFlowEvent extends CustomEvent<any> {
    constructor(type = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                type
            }
        });
    }

    static EVENT_NAME = eventName;

    /**
     * When adding a new Type, checkout editorUtil's getSaveType and builderUtils's getLabelForOkButton.
     * In addition to other places these values are referenced.
     */
    static Type = {
        SAVE: 'save',
        SAVE_AS: 'saveas',
        SAVE_AS_OVERRIDDEN: 'saveasoverridden',
        SAVE_AS_TEMPLATE: 'saveastemplate'
    };
}
