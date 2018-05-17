/**
 * Used by zoom/pan panel to pan the canvas
 */
const eventName = 'togglepanmode';

export class TogglePanModeEvent extends Event {
    constructor(action = null) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.detail = {
            action
        };
    }

    static EVENT_NAME = eventName;
}