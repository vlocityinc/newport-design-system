import { LightningElement, api, track } from 'lwc';
import { ToggleMarqueeOnEvent, ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { LABELS } from './zoomPanelLabels';

const { logInteraction } = loggingUtils;

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
        if (this.zoomOutClicked && newValue) {
            this.template.querySelector('.expandButton').focus();
            this.zoomOutClicked = false;
        }
        this.zoomOutDisabled = newValue;
    }

    @api
    get isZoomInDisabled(): boolean {
        return this.zoomInDisabled;
    }

    set isZoomInDisabled(newValue: boolean) {
        if (this.zoomInClicked && newValue) {
            this.template.querySelector('.zoomOutButton').focus();
            this.zoomInClicked = false;
        }
        this.zoomInDisabled = newValue;
    }

    @track
    zoomOutDisabled!: boolean;

    @track
    zoomInDisabled!: boolean;

    zoomtoViewClicked = false;
    zoomToFitClicked = false;
    zoomInClicked = false;
    zoomOutClicked = false;

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

        this.zoomOutClicked = true;
        // It's possible that the user clicked the fitButton multiple times in a row that doesn't trigger a renderCallback
        this.zoomToFitClicked = false;
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

        this.zoomToFitClicked = true;
        const action = ZOOM_ACTION.ZOOM_TO_FIT;
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

        this.zoomToViewClicked = true;
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

        this.zoomInClicked = true;
        const action = ZOOM_ACTION.ZOOM_IN;
        const clickToZoomEvent = new ClickToZoomEvent(action);
        this.dispatchEvent(clickToZoomEvent);
        logInteraction(`zoom-in-button`, 'zoom-panel', null, 'click');
    };

    renderedCallback() {
        if (this.zoomToViewClicked) {
            this.template.querySelector('.fitButton').focus();
        } else if (this.zoomToFitClicked) {
            this.template.querySelector('.expandButton').focus();
        }
        this.zoomToFitClicked = false;
        this.zoomToViewClicked = false;
    }
}
