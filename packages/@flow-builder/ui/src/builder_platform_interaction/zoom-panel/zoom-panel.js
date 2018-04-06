import { Element, api } from 'engine';
import { ZOOM_ACTION } from 'builder_platform_interaction-constant';
import { ClickToZoomEvent } from 'builder_platform_interaction-events';

/**
 * Zoom Panel component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */
export default class ZoomPanel extends Element {
    @api isZoomOutDisabled;
    @api isZoomToView;
    @api isZoomInDisabled;

    /**
     * Handles click on the zoom out button and fires click to zoom event.
     */
    handleZoomOutClick = () => {
        const action = ZOOM_ACTION.ZOOM_OUT;
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