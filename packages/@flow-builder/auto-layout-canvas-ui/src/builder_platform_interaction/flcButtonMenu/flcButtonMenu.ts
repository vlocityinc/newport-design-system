// @ts-nocheck
import { api, LightningElement } from 'lwc';
import { classSet } from 'lightning/utils';

// TODO: need to fix this
// import { handleKeyDownOnMenuItem, handleKeyDownOnMenuTrigger } from './keyboard';

import { ToggleMenuEvent, MenuPositionUpdateEvent, CloseMenuEvent } from 'builder_platform_interaction/flcEvents';
import { ICON_SHAPE, AutoLayoutCanvasMode } from 'builder_platform_interaction/flcComponentsUtils';
import { MenuType, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { setupKeyboardShortcutUtil } from 'builder_platform_interaction/contextualMenuUtils';

const { EnterCommand, SpaceCommand, EscapeCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

/**
 * Fixed Layout Canvas Menu Button Component.
 * Used by Node and Connector components to render their buttons
 */
export default class FlcButtonMenu extends LightningElement {
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
    connectionInfo;

    @api
    conditionOptionsForNode;

    @api
    isCanvasReady;

    // Used for testing purposes
    @api
    keyboardInteractions;

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

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    /**
     * The size of the icon.
     * Options include xx-small, x-small, medium, or large.
     * This value defaults to medium.
     *
     * @type {string}
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
            'rotate-icon-container': this.elementMetadata.iconShape === ICON_SHAPE.DIAMOND
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

    /** ***************************** Helper Functions *******************************/

    focusOnButton() {
        this.template.querySelector('button').focus();
    }

    toggleMenuVisibility(isPositionUpdate = false, isOpenedWithKeyboard = false) {
        const { top, left, width, height } = this.target.getBoundingClientRect();
        const { clientWidth } = this.target;

        // account for border and stuff
        const offsetX = (width - clientWidth) / 2;

        const { conditionOptionsForNode, guid, connectionInfo, elementMetadata } = this;
        const type = connectionInfo ? MenuType.CONNECTOR : MenuType.NODE;

        const detail = {
            top,
            left,
            height: height - 4, // TODO: clean up positioning
            offsetX,
            type,
            guid: guid || connectionInfo.prev,
            elementMetadata,
            conditionOptionsForNode,
            isPositionUpdate,
            isOpenedWithKeyboard,
            ...connectionInfo
        };

        const event = isPositionUpdate ? new MenuPositionUpdateEvent(detail) : new ToggleMenuEvent(detail);

        this.dispatchEvent(event);
    }

    /** ***************************** Public Functions *******************************/

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.focusOnButton();
    }

    /** ***************************** Event Handlers *******************************/

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
            // The checkbox is in a slot being filled by flcnode
            this.querySelector('.selection-checkbox').click();
        }
    }

    handleEscape() {
        if (this._menuOpened) {
            this.dispatchEvent(new CloseMenuEvent());
        }
    }

    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Enter: new EnterCommand(() => this.handleSpaceOrEnter()),
            ' ': new SpaceCommand(() => this.handleSpaceOrEnter()),
            Escape: new EscapeCommand(() => this.handleEscape())
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
    }

    /** ***************************** Callbacks *******************************/

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
        this.classList.add('slds-dropdown-trigger', 'slds-dropdown-trigger_click');
    }

    renderedCallback() {
        if (!this.target) {
            this.target = this.template.querySelector('button');
        }

        if (this._menuOpened) {
            // fire a MenuPositionUpdateEvent if the menuOpened so that the flcBuilder knows where to position it
            this.toggleMenuVisibility(true);
        }
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }
}
