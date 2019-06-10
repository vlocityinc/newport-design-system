/**
 * Used by canvas to marquee select the canvas elements and connectors
 */

const eventName = 'marqueeselect';

export class MarqueeSelectEvent {
    constructor(
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect,
        connectorGuidsToSelect,
        connectorGuidsToDeselect
    ) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                connectorGuidsToSelect,
                connectorGuidsToDeselect
            }
        });
    }
}
