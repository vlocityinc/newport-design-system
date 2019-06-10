import { LightningElement, api } from 'lwc';
import {
    ToggleMarqueeOnEvent,
    ClickToZoomEvent,
    ZOOM_ACTION
} from 'builder_platform_interaction/events';
import { LABELS } from './zoomPanelLabels';

/**
 * Zoom Panel component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */
export default class ZoomPanel extends LightningElement {
    @api isMarqueeModeOn;
    @api isZoomOutDisabled;
    @api isZoomToView;
    @api isZoomInDisabled;

    get labels() {
        return LABELS;
    }

    /**
     * Handles click on the drag button and fires toggle marquee mode event.
     */
    handleToggleMarqueeOn = () => {
        const toggleMarqueeOnEvent = new ToggleMarqueeOnEvent();
        this.dispatchEvent(toggleMarqueeOnEvent);
    };

    /**
     * Handles click on the zoom out button and fires click to zoom event.
     */
    handleZoomOutClick = () => {
        const action = ZOOM_ACTION.ZOOM_OUT;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
    };

    /**
     * Handles click on the zoom to fit button and fires click to zoom event.
     */
    handleZoomToFitClick = () => {
        const action = ZOOM_ACTION.ZOOM_TO_FIT;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
    };

    /**
     * Handles click on the zoom to view button and fires click to zoom event.
     */
    handleZoomToViewClick = () => {
        const action = ZOOM_ACTION.ZOOM_TO_VIEW;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
    };

    /**
     * Handles click on the zoom in button and fires click to zoom event.
     */
    handleZoomInClick = () => {
        const action = ZOOM_ACTION.ZOOM_IN;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
    };
}
