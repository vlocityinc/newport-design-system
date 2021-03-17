import { LightningElement, api, track } from 'lwc';
import { ToggleMarqueeOnEvent, ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { LABELS } from './zoomPanelLabels';

const { logInteraction } = loggingUtils;
let action;

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
    isZoomToView!: boolean;

    @api
    get isZoomOutDisabled(): boolean {
        return this.zoomOutDisabled;
    }

    set isZoomOutDisabled(newValue: boolean) {
        if (action === ZOOM_ACTION.ZOOM_OUT && newValue) {
            this.template.querySelector('.expandButton').focus();
            action = null;
        }
        this.zoomOutDisabled = newValue;
    }

    @api
    get isZoomInDisabled(): boolean {
        return this.zoomInDisabled;
    }

    set isZoomInDisabled(newValue: boolean) {
        if (action === ZOOM_ACTION.ZOOM_IN && newValue) {
            this.template.querySelector('.zoomOutButton').focus();
            action = null;
        }
        this.zoomInDisabled = newValue;
    }

    @track
    zoomOutDisabled!: boolean;

    @track
    zoomInDisabled!: boolean;

    get labels() {
        return LABELS;
    }

    /**
     * Handles click on the drag button and fires toggle marquee mode event.
     */
    handleToggleMarqueeOn = (event: Event) => {
        event.stopPropagation();

        action = null;
        const toggleMarqueeOnEvent = new ToggleMarqueeOnEvent();
        this.dispatchEvent(toggleMarqueeOnEvent);
        logInteraction(`marquee-select-button`, 'zoom-panel', null, 'click');
    };

    /**
     * Handles click on the zoom out button and fires click to zoom event.
     */
    handleZoomOutClick = (event: Event) => {
        event.stopPropagation();

        action = ZOOM_ACTION.ZOOM_OUT;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-out-button`, 'zoom-panel', null, 'click');
    };

    /**
     * Handles click on the zoom to fit button and fires click to zoom event.
     */
    handleZoomToFitClick = (event: Event) => {
        event.stopPropagation();

        action = ZOOM_ACTION.ZOOM_TO_FIT;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-to-fit-button`, 'zoom-panel', null, 'click');
        this.template.querySelector('.fitButton').focus();
    };

    /**
     * Handles click on the zoom to view button and fires click to zoom event.
     */
    handleZoomToViewClick = (event: Event) => {
        event.stopPropagation();

        action = ZOOM_ACTION.ZOOM_TO_VIEW;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-to-view-button`, 'zoom-panel', null, 'click');
    };

    /**
     * Handles click on the zoom in button and fires click to zoom event.
     */
    handleZoomInClick = (event: Event) => {
        event.stopPropagation();

        action = ZOOM_ACTION.ZOOM_IN;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-in-button`, 'zoom-panel', null, 'click');
    };

    renderedCallback() {
        if (action === ZOOM_ACTION.ZOOM_TO_VIEW) {
            this.template.querySelector('.fitButton').focus();
            action = null;
        } else if (action === ZOOM_ACTION.ZOOM_TO_FIT) {
            this.template.querySelector('.expandButton').focus();
            action = null;
        }
    }
}
