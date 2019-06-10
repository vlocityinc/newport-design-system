/**
 * Used by zoom/pan panel to marquee select on the canvas
 */
const eventName = 'togglemarqueeon';

export class ToggleMarqueeOnEvent {
    constructor() {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
    }

    static EVENT_NAME = eventName;
}
