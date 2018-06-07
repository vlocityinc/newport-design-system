/**
 * Used by zoom/pan panel to pan the canvas
 */
const eventName = 'togglepanmode';

export class TogglePanModeEvent {
    constructor(action = null) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                action
            }
        });
    }

    static EVENT_NAME = eventName;
}