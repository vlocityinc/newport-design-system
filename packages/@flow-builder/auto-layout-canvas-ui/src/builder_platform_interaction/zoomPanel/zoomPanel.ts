import { ClickToZoomEvent, ToggleMarqueeOnEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { loggingUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './zoomPanelLabels';

const { logInteraction } = loggingUtils;

const selectors = {
    fitExpandButton: '.fitExpandButton',
    zoomOutButton: '.zoomOutButton',
    zoomInButton: '.zoomInButton'
};

/**
 * Zoom Panel component for flow builder.
 */
export default class ZoomPanel extends LightningElement {
    private dom = lwcUtils.createDomProxy(this, selectors);
    private lastAction: string | undefined;

    @api
    showMarqueeButton!: boolean;

    @api
    isMarqueeModeOn!: boolean;

    @api
    isZoomOutDisabled!: boolean;

    @api
    isZoomInDisabled!: boolean;

    @api
    focus() {
        (this.isZoomOutDisabled ? this.dom.fitExpandButton : this.dom.zoomOutButton).focus();
    }

    get labels() {
        return LABELS;
    }

    /**
     * @returns the properties of the fitExpandButton
     */
    get fitExpandButton() {
        if (this.isZoomToFit()) {
            return { title: this.labels.zoomToFitTitle, iconName: 'utility:contract_alt' };
        }

        return { title: this.labels.zoomToViewTitle, iconName: 'utility:expand_alt' };
    }

    /**
     * Checks if zoom to fit is enabled
     *
     * @returns true if fit is enabled
     */
    isZoomToFit() {
        return this.isZoomInDisabled;
    }

    /**
     * Returns the zoom action from a zoom button click event
     *
     * @param event - The click event
     * @returns The associated zoom action
     */
    zoomActionFromEvent(event: Event): string {
        const classNames = (<HTMLElement>event.target).className.split(' ');

        if (classNames.includes('zoomOutButton')) {
            return ZOOM_ACTION.ZOOM_OUT;
        } else if (classNames.includes('zoomInButton')) {
            return ZOOM_ACTION.ZOOM_IN;
        }
        return this.isZoomToFit() ? ZOOM_ACTION.ZOOM_TO_FIT : ZOOM_ACTION.ZOOM_TO_VIEW;
    }

    /**
     * Handles click on the drag button and fires toggle marquee mode event.
     *
     * @param event - click event on the marquee button
     */
    handleToggleMarqueeOn(event: Event) {
        event.stopPropagation();
        const toggleMarqueeOnEvent = new ToggleMarqueeOnEvent();
        this.dispatchEvent(toggleMarqueeOnEvent);
        logInteraction(`marquee-select-button`, 'zoom-panel', null, 'click');
    }

    /**
     * Handles a zoom action
     *
     * @param event - The click event for the zoom button pressed
     */
    handleZoomAction(event: Event) {
        event.stopPropagation();

        const action = this.zoomActionFromEvent(event);
        this.lastAction = action;
        this.dispatchEvent(new ClickToZoomEvent(action));
        logInteraction(action, 'zoom-panel', null, 'click');
    }

    /**
     * Returns the next element to programatically move the focus to, if any.
     *
     * @returns The element to move the focus to, or null if none.
     */
    getNextFocusElement(): HTMLElement | null {
        if (this.lastAction === ZOOM_ACTION.ZOOM_IN && this.isZoomInDisabled) {
            return this.dom.zoomOutButton;
        } else if (this.lastAction === ZOOM_ACTION.ZOOM_OUT && this.isZoomOutDisabled) {
            return this.dom.fitExpandButton;
        }

        return null;
    }

    renderedCallback() {
        if (this.lastAction) {
            const elementToFocus = this.getNextFocusElement();

            this.lastAction = undefined;
            if (elementToFocus != null) {
                elementToFocus.focus();
            }
        }
    }
}
