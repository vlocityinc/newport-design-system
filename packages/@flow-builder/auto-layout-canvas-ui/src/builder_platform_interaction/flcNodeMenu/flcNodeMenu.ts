// @ts-nocheck
import { api, track } from 'lwc';
import { CopySingleElementEvent, DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import {
    HighlightPathsToDeleteEvent,
    DeleteElementFaultEvent,
    AddElementFaultEvent,
    CloseMenuEvent,
    ClearHighlightedPathEvent
} from 'builder_platform_interaction/flcEvents';
import Menu from 'builder_platform_interaction/menu';
import { CONTEXTUAL_MENU_MODE, ELEMENT_ACTION_CONFIG, getMenuConfiguration } from './flcNodeMenuConfig';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { ElementType, DELETE_ALL } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './flcNodeMenuLabels';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { moveFocusInMenuOnArrowKeyDown } from 'builder_platform_interaction/contextualMenuUtils';

const { ArrowDown, ArrowUp } = commands;
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
    _isRendered = false;

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
        event.stopPropagation();
        this.contextualMenuMode = CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE;
        this.dispatchEvent(new ClearHighlightedPathEvent());
    };

    /**
     * Handles the click on the action row item and dispatches the appropriate event
     */
    handleSelectNodeAction = (event) => {
        event.stopPropagation();
        const actionType = event.currentTarget.getAttribute('data-value');
        let closeMenu = true;

        switch (actionType) {
            case ELEMENT_ACTION_CONFIG.COPY_ACTION.value:
                this.dispatchEvent(new CopySingleElementEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_ACTION.value:
                if (this.elementMetadata.type === ElementType.BRANCH) {
                    this.contextualMenuMode = CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE;
                    this._selectedConditionValue = this.conditionOptions[0].value;
                    this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
                    closeMenu = false;
                } else if (this.elementMetadata.type === ElementType.LOOP) {
                    this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType, 0));
                } else {
                    this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType));
                }
                break;
            case ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION.value:
                this.dispatchEvent(new AddElementFaultEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION.value:
                this.dispatchEvent(new DeleteElementFaultEvent(this.guid));
                break;
            default:
        }

        if (closeMenu) {
            this.dispatchEvent(new CloseMenuEvent());
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
        event.stopPropagation();
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

    setupCommandsAndShortcuts() {
        const arrowDownCommand = new ArrowDown(() => this.handleArrowKeyDown('arrowDown'));
        const arrowUpCommand = new ArrowUp(() => this.handleArrowKeyDown('arrowUp'));
        this.keyboardInteractions.setupCommandAndShortcut(arrowDownCommand, { key: 'ArrowDown' });
        this.keyboardInteractions.setupCommandAndShortcut(arrowUpCommand, { key: 'ArrowUp' });
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    renderedCallback() {
        if (!this._isRendered && this.menuConfiguration.footer) {
            // Setting the slds-button_stretch class on the footer button the make it extend
            const footerButton = this.template.querySelector('.test-footer lightning-button');
            const baseButton = footerButton && footerButton.shadowRoot.querySelector('button');
            if (baseButton) {
                baseButton.classList.add('slds-button_stretch');
                this._isRendered = true;
            }
        }
        if (this.openedWithKeyboard) {
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as any;
            if (items.length > 0) {
                items[0].focus();
            } else {
                const backButton = this.template.querySelector(selectors.backButton);
                if (backButton) {
                    backButton.focus();
                }
            }
        }
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }
}
