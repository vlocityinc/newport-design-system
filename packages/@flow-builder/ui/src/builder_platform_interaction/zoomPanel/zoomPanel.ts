import { LightningElement, api } from 'lwc';
import { ToggleMarqueeOnEvent, ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { logInteraction } from 'builder_platform_interaction/loggingUtils';
import { LABELS } from './zoomPanelLabels';

/**
 * Zoom Panel component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */
export default class ZoomPanel extends LightningElement {
    @api
    showMarqueeButton!: boolean;

    @api
    isMarqueeModeOn!: boolean;

    @api
    isZoomOutDisabled!: boolean;

    @api
    isZoomToView!: boolean;

    @api
    isZoomInDisabled!: boolean;

    get labels() {
        return LABELS;
    }

    /**
     * Handles click on the drag button and fires toggle marquee mode event.
     */
    handleToggleMarqueeOn = (event: Event) => {
        event.stopPropagation();

        const toggleMarqueeOnEvent = new ToggleMarqueeOnEvent();
        this.dispatchEvent(toggleMarqueeOnEvent);
        logInteraction(`marquee-select-button`, 'zoom-panel', null, 'click');
    };

    /**
     * Handles click on the zoom out button and fires click to zoom event.
     */
    handleZoomOutClick = (event: Event) => {
        event.stopPropagation();

        const action = ZOOM_ACTION.ZOOM_OUT;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-out-button`, 'zoom-panel', null, 'click');
    };

    /**
     * Handles click on the zoom to fit button and fires click to zoom event.
     */
    handleZoomToFitClick = (event: Event) => {
        event.stopPropagation();

        const action = ZOOM_ACTION.ZOOM_TO_FIT;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-to-fit-button`, 'zoom-panel', null, 'click');
    };

    /**
     * Handles click on the zoom to view button and fires click to zoom event.
     */
    handleZoomToViewClick = (event: Event) => {
        event.stopPropagation();

        const action = ZOOM_ACTION.ZOOM_TO_VIEW;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-to-view-button`, 'zoom-panel', null, 'click');
    };

    /**
     * Handles click on the zoom in button and fires click to zoom event.
     */
    handleZoomInClick = (event: Event) => {
        event.stopPropagation();

        const action = ZOOM_ACTION.ZOOM_IN;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-in-button`, 'zoom-panel', null, 'click');
    };
}
