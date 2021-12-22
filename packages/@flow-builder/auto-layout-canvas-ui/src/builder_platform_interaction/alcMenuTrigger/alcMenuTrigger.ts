import { api, LightningElement } from 'lwc';
import { classSet } from 'lightning/utils';

import {
    ToggleMenuEvent,
    MenuPositionUpdateEvent,
    CloseMenuEvent,
    TabOnMenuTriggerEvent
} from 'builder_platform_interaction/alcEvents';
import { ICON_SHAPE, AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import { ConnectionSource, MenuType, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { CanvasMouseUpEvent } from 'builder_platform_interaction/events';

/**
 * Fixed Layout Canvas Menu Button Component.
 * Used by Node and Connector components to render their buttons
 */
export default class AlcMenuTrigger extends LightningElement {
    target;

    @api
    connectorAriaInfo;

    @api
    guid;

    @api
    elementMetadata;

    @api
    variant;

    @api
    isNodeGettingDeleted;

    @api
    hasError;

    @api
    canvasMode!: AutoLayoutCanvasMode;

    @api
    source!: ConnectionSource;

    @api
    conditionOptionsForNode;

    @api
    disableEditElements;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

    @api
    get menuOpened() {
        return this._menuOpened;
    }

    set menuOpened(menuOpened) {
        this._menuOpened = menuOpened;

        if (menuOpened) {
            this.classList.add('slds-is-open');
        } else {
            this.classList.remove('slds-is-open');
        }
    }

    _menuOpened = false;

    /**
     * The size of the icon.
     * Options include xx-small, x-small, medium, or large.
     * This value defaults to medium.
     *
     * @default medium
     */
    @api iconSize = 'medium';

    get triggerContainerClass() {
        if (this.variant === 'connector') {
            return '';
        }

        return classSet('slds-p-around_xx-small').add({
            'default-container': !this.elementMetadata.dynamicNodeComponent,
            'dynamic-container': this.elementMetadata.dynamicNodeComponent,
            'rotate-icon-container': this.elementMetadata.iconShape === ICON_SHAPE.DIAMOND,
            'round-container': this.elementMetadata.iconShape === ICON_SHAPE.CIRCLE
        });
    }

    get computedButtonClass() {
        return classSet({
            'slds-button': true,
            'slds-button_icon': true,
            'border-none': this.variant !== 'connector',
            'is-end-element': this.variant !== 'connector' && this.elementMetadata.type === NodeType.END,
            'node-in-selection-mode': this.canvasMode !== AutoLayoutCanvasMode.DEFAULT,
            connector: this.variant === 'connector',
            'node-to-be-deleted': this.isNodeGettingDeleted,
            'has-error': this.hasError,
            'circular-icon': this.variant !== 'connector' && this.elementMetadata.iconShape === ICON_SHAPE.CIRCLE,
            'slds-button_icon-xx-small': this.iconSize === 'xx-small',
            'slds-button_icon-x-small': this.iconSize === 'x-small',
            'slds-button_icon-small': this.iconSize === 'small'
        }).toString();
    }

    get computedTabIndex() {
        return this.canvasMode !== AutoLayoutCanvasMode.DEFAULT ||
            (this.elementMetadata && this.elementMetadata.type === NodeType.END)
            ? -1
            : 0;
    }

    /** ***************************** Helper Functions */

    focusOnButton() {
        this.template.querySelector('button').focus({ preventScroll: true });
    }

    toggleMenuVisibility(isPositionUpdate = false, moveFocusToMenu = false) {
        if (this.disableEditElements && this.elementMetadata.type !== NodeType.START) {
            return;
        }

        const { top, left, width, height } = this.target.getBoundingClientRect();
        const { clientWidth } = this.target;

        // account for border and stuff
        const offsetX = (width - clientWidth) / 2;

        const { conditionOptionsForNode, elementMetadata } = this;
        const type = this.source ? MenuType.CONNECTOR : MenuType.NODE;

        const source = this.source || { guid: this.guid };

        const detail = {
            top,
            left,
            height: height - 4, // TODO: clean up positioning
            offsetX,
            type,
            elementMetadata,
            conditionOptionsForNode,
            isPositionUpdate,
            moveFocusToMenu,
            source
        };

        const event = isPositionUpdate ? new MenuPositionUpdateEvent(detail) : new ToggleMenuEvent(detail);

        this.dispatchEvent(event);
    }

    /** ***************************** Public Functions */

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.focusOnButton();
    }

    /** ***************************** Event Handlers */

    handleButtonClick(event) {
        event.stopPropagation();
        event.preventDefault();

        if (this.canvasMode === AutoLayoutCanvasMode.DEFAULT) {
            this.toggleMenuVisibility();

            // Focus on the button even if the browser doesn't do it by default
            // (the behavior differs between Chrome, Safari, Firefox). Focus should not be moved to
            // End Element
            if (this.variant === 'connector' || this.elementMetadata.type !== NodeType.END) {
                this.focusOnButton();
            }
        }
    }

    handleButtonKeyDown(event) {
        event.stopPropagation();
    }

    handleButtonMouseDown(event) {
        // Preventing Default so that element is put in focus only after a click
        event.preventDefault();
    }

    handleSpaceOrEnter() {
        if (this.canvasMode === AutoLayoutCanvasMode.DEFAULT) {
            // Opening and closing the current selected element
            this.toggleMenuVisibility(false, true);
        } else {
            // Checking and unchecking the element when in selection mode
            // The checkbox is in a slot being filled by alcnode
            this.querySelector<HTMLElement>('.selection-checkbox').click();
        }
    }

    handleEscape() {
        if (this._menuOpened) {
            this.dispatchEvent(new CloseMenuEvent());
        }
    }

    handleKeyDown = (event) => {
        const { key, shiftKey } = event;
        if (key === 'Enter' || key === 'Space') {
            event.stopPropagation();
            event.preventDefault();
            this.handleSpaceOrEnter();
        } else if (key === 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            this.handleEscape();
        } else if (this._menuOpened && key === 'Tab') {
            event.preventDefault();
            this.dispatchEvent(new TabOnMenuTriggerEvent(shiftKey));
        } else if (key === 'Tab') {
            // The CanvasMouseUpEvent is used to un-highlight
            const canvasMouseUpEvent = new CanvasMouseUpEvent();
            this.dispatchEvent(canvasMouseUpEvent);
        }
    };

    /** ***************************** Callbacks */

    connectedCallback() {
        this.classList.add('slds-dropdown-trigger', 'slds-dropdown-trigger_click');
    }

    renderedCallback() {
        if (!this.target) {
            this.target = this.template.querySelector('button');
        }

        if (this._menuOpened) {
            // fire a MenuPositionUpdateEvent if the menuOpened so that the alcCanvas knows where to position it
            this.toggleMenuVisibility(true);
        }
    }
}
