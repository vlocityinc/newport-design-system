/**
 * Used by canvas on drag node stop
 */
const eventName = 'dragnodestop';
export class DragNodeStopEvent {
    constructor(dragSelection) {
        if (!dragSelection || !Array.isArray(dragSelection)) {
            throw new Error('Drag Selection should be a defined array');
        }

        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                dragSelection
            }
        });
    }
    static EVENT_NAME = eventName;
}
