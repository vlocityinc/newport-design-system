import { LightningElement, api } from 'lwc';
import {
    ToggleMarqueeOnEvent,
    ClickToZoomEvent,
    ZOOM_ACTION
} from 'builder_platform_interaction/events';
import { logInteraction } from 'builder_platform_interaction/loggingUtils';
import { LABELS } from './zoomPanelLabels';
import { ZoomInCommand, ZoomOutCommand, ZoomToFitCommand, ZoomToViewCommand } from 'builder_platform_interaction/commands';

/**
 * Zoom Panel component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */
export default class ZoomPanel extends LightningElement {
    @api
    showMarqueeButton;

    @api
    isMarqueeModeOn;

    @api
    isZoomOutDisabled;

    @api
    isZoomToView;

    @api
    isZoomInDisabled;

    @api
    keyboardInteractions;

    connectedCallback() {
        this.setupCommandsAndShortcuts();
    }

    get labels() {
        return LABELS;
    }

    /**
     * Handles click on the drag button and fires toggle marquee mode event.
     */
    handleToggleMarqueeOn = () => {
        const toggleMarqueeOnEvent = new ToggleMarqueeOnEvent();
        this.dispatchEvent(toggleMarqueeOnEvent);
        logInteraction(`marquee-select-button`, 'zoom-panel', null, 'click');
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

    setupCommandsAndShortcuts = () => {
        // Zoom In Command
        const zoomInCommand = new ZoomInCommand((event) => this.handleZoomInClick(event));
        this.keyboardInteractions.setupCommandAndShortcut(zoomInCommand, { ctrlOrCmd: true, key: '=' });

        // Zoom Out Command
        const zoomOutCommand = new ZoomOutCommand((event) => this.handleZoomOutClick(event));
        this.keyboardInteractions.setupCommandAndShortcut(zoomOutCommand, { ctrlOrCmd: true, key: '-' });

        // Zoom To Fit Command
        const zoomToFitCommand = new ZoomToFitCommand((event) => this.handleZoomToFitClick(event));
        this.keyboardInteractions.setupCommandAndShortcut(zoomToFitCommand, { ctrlOrCmd: true, key: '0' });

        // Zoom To View Command
        const zoomToViewCommand = new ZoomToViewCommand((event) => this.handleZoomToViewClick(event));
        this.keyboardInteractions.setupCommandAndShortcut(zoomToViewCommand, { ctrlOrCmd: true, key: '1' });
      }
}
