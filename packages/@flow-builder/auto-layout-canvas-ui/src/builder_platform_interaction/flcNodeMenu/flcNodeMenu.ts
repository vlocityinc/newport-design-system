// @ts-nocheck
import { api, track } from 'lwc';
import { CopySingleElementEvent, DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import {
    HighlightPathsToDeleteEvent,
    DeleteElementFaultEvent,
    AddElementFaultEvent,
    CloseMenuEvent,
    ClearHighlightedPathEvent,
    MoveFocusToNodeEvent
} from 'builder_platform_interaction/flcEvents';
import Menu from 'builder_platform_interaction/menu';
import { CONTEXTUAL_MENU_MODE, ELEMENT_ACTION_CONFIG, getMenuConfiguration } from './flcNodeMenuConfig';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { ElementType, DELETE_ALL } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './flcNodeMenuLabels';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import {
    moveFocusInMenuOnArrowKeyDown,
    setupKeyboardShortcutUtil
} from 'builder_platform_interaction/contextualMenuUtils';
const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand, EscapeCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    menuItem: 'a[role="menuitem"]',
    backButton: '.back-button'
};
/**
 * The node menu overlay, displayed when clicking on a node.
 */
export default class FlcNodeMenu extends Menu {
    @api
    conditionOptions;
    @api
    elementMetadata;
    @api
    guid;
    @api
    elementHasFault;
    @api
    openedWithKeyboard;
    // Used for testing purposes
    @api
    keyboardInteractions;
    @track
    contextualMenuMode = CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE;
    _selectedConditionValue;
    _childIndexToKeep = 0;
    // Tracks if the component has been rendered once
    _isRendered = false;
    // Tracks if the Base Mode is rendered or not. Is set to false whenever user moves away from the Base Mode
    _hasBaseModeRendered = false;
    // Tracks if the Delete Branch Mode is rendered or not. Is set to false whenever user moves away from the Base Mode
    _hasDeleteBranchModeRendered = false;
    // Tracks if the focus needs to be moved to the Delete Row of a branching element.
    // Is set tp true when the user clicks on the back button
    _moveFocusToDeleteBranchRow = false;
    get labels() {
        return LABELS;
    }
    get menuConfiguration() {
        return getMenuConfiguration(this.elementMetadata, this.contextualMenuMode, this.elementHasFault);
    }
    set menuConfiguration(config) {
        return config;
    }
    get menuWrapper() {
        return this.elementMetadata.iconShape === ICON_SHAPE.DIAMOND ? 'diamond-element-menu' : '';
    }
    get isBaseActionMode() {
        return this.contextualMenuMode === CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE;
    }
    get isDeleteBranchElementMode() {
        return this.contextualMenuMode === CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE;
    }
    get selectedConditionValue() {
        return this._selectedConditionValue;
    }
    get descriptionHeader() {
        return this.menuConfiguration.header.description;
    }
    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }
    /**
     * Handles the onclick event on the back button, and updates the contextualMenuMode to base mode.
     * Also, dispatches the ClearHighlightedPathEvent to remove the highlight from nodes and connectors
     * on the deletion path.
     */
    handleBackButtonClick = (event) => {
        if (event) {
            event.stopPropagation();
        }
        this.contextualMenuMode = CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE;
        this._hasDeleteBranchModeRendered = false;
        this._moveFocusToDeleteBranchRow = true;
        this.dispatchEvent(new ClearHighlightedPathEvent());
    };
    /**
     * Handles the click on the action row item and dispatches the appropriate event
     */
    handleSelectNodeAction = (event) => {
        if (!event.fromKeyboard) {
            event.stopPropagation();
        }
        const actionType = event.currentTarget.getAttribute('data-value');
        let closeMenu = true;
        let moveFocusToNode = true;
        switch (actionType) {
            case ELEMENT_ACTION_CONFIG.COPY_ACTION.value:
                this.dispatchEvent(new CopySingleElementEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_ACTION.value:
                if (this.elementMetadata.type === ElementType.BRANCH) {
                    this.contextualMenuMode = CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE;
                    this._hasBaseModeRendered = false;
                    this._selectedConditionValue = this.conditionOptions[0].value;
                    this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
                    closeMenu = false;
                } else if (this.elementMetadata.type === ElementType.LOOP) {
                    this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType, 0));
                } else {
                    this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType));
                }
                moveFocusToNode = false;
                break;
            case ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION.value:
                this.dispatchEvent(new AddElementFaultEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION.value:
                this.dispatchEvent(new DeleteElementFaultEvent(this.guid));
                break;
            default:
        }

        // Closing the menu as needed
        if (closeMenu) {
            this.dispatchEvent(new CloseMenuEvent());
        }

        // Moving focus to the node as needed
        if (moveFocusToNode) {
            this.dispatchEvent(new MoveFocusToNodeEvent(this.guid));
        }
    };
    /**
     * Handles onchange event coming from the combobox and updates the _selectedConditionValue accordingly
     */
    handleComboboxChange = (event) => {
        event.stopPropagation();
        this._selectedConditionValue = event.detail.value;
        this._childIndexToKeep = this.conditionOptions.findIndex(
            (option) => option.value === this._selectedConditionValue
        );
        if (this._childIndexToKeep === this.conditionOptions.length - 1) {
            this._childIndexToKeep = DELETE_ALL;
        }
        this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
    };
    /**
     * Handles the click on the Footer button and dispatches the relevant event
     */
    handleFooterButtonClick = (event) => {
        if (event) {
            event.stopPropagation();
        }
        this.dispatchEvent(new CloseMenuEvent());
        if (this.contextualMenuMode === CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE) {
            this.dispatchEvent(new EditElementEvent(this.guid));
        } else if (this.contextualMenuMode === CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE) {
            this.dispatchEvent(
                new DeleteElementEvent([this.guid], this.elementMetadata.elementType, this._childIndexToKeep)
            );
        }
    };
    /**
     * Helper function to move the focus correctly when using arrow keys in the contextual menu
     * @param key - the key pressed (arrowDown or arrowUp)
     */
    handleArrowKeyDown(key) {
        const currentItemInFocus = this.template.activeElement;
        // Need this check in case the current item in focus is something other than the list item
        // (eg. back button or footer button)
        if (currentItemInFocus && currentItemInFocus.role === 'menuitem') {
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as any;
            moveFocusInMenuOnArrowKeyDown(items, currentItemInFocus, key);
        }
    }
    /**
     * Helper function used during keyboard commands
     */
    handleSpaceOrEnter() {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            if (currentItemInFocus.role === 'menuitem') {
                this.handleSelectNodeAction({ currentTarget: currentItemInFocus.parentElement, fromKeyboard: true });
            } else if (currentItemInFocus.parentElement.classList.value.includes('footer')) {
                this.handleFooterButtonClick();
            } else if (currentItemInFocus.classList.value.includes('back-button')) {
                this.handleBackButtonClick();
            }
        }
    }

    handleEscape() {
        this.dispatchEvent(new CloseMenuEvent());
        // Moving the focus back to the source node
        this.dispatchEvent(new MoveFocusToNodeEvent(this.guid));
    }

    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Enter: new EnterCommand(() => this.handleSpaceOrEnter()),
            ' ': new SpaceCommand(() => this.handleSpaceOrEnter()),
            ArrowDown: new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME)),
            Escape: new EscapeCommand(() => this.handleEscape())
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    renderedCallback() {
        if (!this._isRendered) {
            if (this.menuConfiguration.footer) {
                // Setting the slds-button_stretch class on the footer button the make it extend
                const footerButton = this.template.querySelector('.footer lightning-button');
                const baseButton = footerButton && footerButton.shadowRoot.querySelector('button');
                if (baseButton) {
                    baseButton.classList.add('slds-button_stretch');
                }
            }
            this._isRendered = true;
        }
        if (this.isBaseActionMode && !this._hasBaseModeRendered) {
            // Setting focus on the delete branch row if entering base mode via the back button.
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as any;
            items.forEach((item) => {
                if (
                    this._moveFocusToDeleteBranchRow &&
                    item.parentElement.getAttribute('data-value') === ELEMENT_ACTION_CONFIG.DELETE_ACTION.value
                ) {
                    item.focus();
                }
            });
            // Moving it to the first row only when the menu has been opened through a keyboard command
            // and isn't coming via the back button
            if (this.openedWithKeyboard && !this._moveFocusToDeleteBranchRow) {
                items[0].focus();
            }
            this._moveFocusToDeleteBranchRow = false;
            this._hasBaseModeRendered = true;
        }
        if (this.isDeleteBranchElementMode && !this._hasDeleteBranchModeRendered) {
            // Moving focus to the back button only when entering the contextual menu in deleteBranchElementMode
            const backButton = this.template.querySelector(selectors.backButton);
            backButton.focus();
            this._hasDeleteBranchModeRendered = true;
        }
    }
    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }
}
