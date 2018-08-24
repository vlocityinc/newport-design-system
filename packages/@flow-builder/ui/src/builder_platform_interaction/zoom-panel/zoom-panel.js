import { LightningElement, api } from 'lwc';
import { TogglePanModeEvent, ClickToZoomEvent, ZOOM_ACTION, PAN_ACTION } from 'builder_platform_interaction-events';
import { LABELS } from './zoom-panel-labels';

/**
 * Zoom Panel component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */
export default class ZoomPanel extends LightningElement {
    @api isPanModeOn;
    @api isZoomOutDisabled;
    @api isZoomToView;
    @api isZoomInDisabled;

    get labels() {
        return LABELS;
    }

    /**
     * Handles click on the pan button and fires toggle pan mode event.
     */
    togglePanMode = () => {
        let action;
        if (this.isPanModeOn) {
            action = PAN_ACTION.PAN_OFF;
        } else {
            action = PAN_ACTION.PAN_ON;
        }

        if (action) {
            const togglePanModeEvent = new TogglePanModeEvent(action);
            this.dispatchEvent(togglePanModeEvent);
        }
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