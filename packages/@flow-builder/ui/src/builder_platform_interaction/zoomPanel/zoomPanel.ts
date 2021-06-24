import { LightningElement, api } from 'lwc';
import { ToggleMarqueeOnEvent, ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { LABELS } from './zoomPanelLabels';

const { logInteraction } = loggingUtils;
let action;

/**
 * Zoom Panel component for flow builder.
 */
export default class ZoomPanel extends LightningElement {
    _zoomOutDisabled!: boolean;
    _zoomInDisabled!: boolean;

    @api
    showMarqueeButton!: boolean;

    @api
    isMarqueeModeOn!: boolean;

    @api
    isZoomToView!: boolean;

    @api
    get isZoomOutDisabled(): boolean {
        return this._zoomOutDisabled;
    }

    set isZoomOutDisabled(newValue: boolean) {
        if (action === ZOOM_ACTION.ZOOM_OUT && newValue) {
            this.template.querySelector('.expandButton').focus();
            action = null;
        }
        this._zoomOutDisabled = newValue;
    }

    @api
    get isZoomInDisabled(): boolean {
        return this._zoomInDisabled;
    }

    set isZoomInDisabled(newValue: boolean) {
        if (action === ZOOM_ACTION.ZOOM_IN && newValue) {
            this.template.querySelector('.zoomOutButton').focus();
            action = null;
        }
        this._zoomInDisabled = newValue;
    }

    get labels() {
        return LABELS;
    }

    /**
     * Handles click on the drag button and fires toggle marquee mode event.
     *
     * @param event - click event on the marquee button
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
     *
     * @param event - click event on the zoom out button
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
     *
     * @param event - click event on the zoom to fit button
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
     *
     * @param event - click event on the zoom to view button
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
     *
     * @param event - click event on the zoom in button
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

    @api
    focus() {
        const selector = this.isZoomOutDisabled ? '.expandButton' : '.zoomOutButton';
        this.template.querySelector(selector).focus();
    }
}
