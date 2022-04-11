/**
 * Used by canvas to marquee select the canvas elements and connectors
 */

const eventName = 'marqueeselect';

export class MarqueeSelectEvent extends CustomEvent<any> {
    constructor(
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect,
        connectorGuidsToSelect,
        connectorGuidsToDeselect
    ) {
        super(eventName, {
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
