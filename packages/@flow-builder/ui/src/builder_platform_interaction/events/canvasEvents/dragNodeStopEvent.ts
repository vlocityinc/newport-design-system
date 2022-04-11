/**
 * Used by canvas on drag node stop
 */
const eventName = 'dragnodestop';
export class DragNodeStopEvent extends CustomEvent<any> {
    constructor(dragSelection) {
        if (!dragSelection || !Array.isArray(dragSelection)) {
            throw new Error('Drag Selection should be a defined array');
        }

        super(eventName, {
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
