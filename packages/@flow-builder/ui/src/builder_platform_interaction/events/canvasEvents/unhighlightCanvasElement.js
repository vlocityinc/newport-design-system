/**
 * Used by canvas to unhighlight the canvas element
 */
const eventName = 'unhighlightcanvaselement';

export class UnhighlightCanvasElementEvent {
    constructor(elementGuid) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}