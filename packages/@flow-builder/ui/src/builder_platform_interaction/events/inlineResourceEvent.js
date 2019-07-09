/**
 * Used to notify the resourcedRichTextEditor of a new inline resource created from the FerovResourcePicker
 */
const eventName = 'newinlineresource';

export class InlineResourceEvent {
    constructor(item = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                item
            }
        });
    }

    static EVENT_NAME = eventName;
}
