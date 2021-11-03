import { api, track } from 'lwc';
import {
    CopySingleElementEvent,
    DeleteElementEvent,
    EditElementEvent,
    OpenSubflowEvent
} from 'builder_platform_interaction/events';
import {
    HighlightPathsToDeleteEvent,
    DeleteElementFaultEvent,
    AddElementFaultEvent,
    CloseMenuEvent,
    ClearHighlightedPathEvent,
    MoveFocusToNodeEvent,
    DeleteBranchElementEvent
} from 'builder_platform_interaction/alcEvents';
import Menu from 'builder_platform_interaction/menu';
import { NodeMenuMode, ELEMENT_ACTION_CONFIG, getMenuConfiguration } from './alcNodeMenuConfig';
import { ICON_SHAPE } from 'builder_platform_interaction/alcComponentsUtils';
import { FOR_EACH_INDEX, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './alcNodeMenuLabels';

const selectors = {
    menuItem: 'a[role="menuitem"]',
    backButton: '.back-button',
    alcMenu: 'builder_platform_interaction-alc-menu',
    backButtonFocus: 'back-button',
    comboBoxFocus: 'slds-form-element',
    footerFocus: 'footer'
};

enum TabFocusRingItems {
    Icon = 0,
    ListItems = 1,
    Footer = 2
}

enum TabFocusRingItemsInDeleteMode {
    Icon = 0,
    BackButton = 1,
    Combobox = 2,
    Footer = 3
}

// TODO: W-9581892 make alcNodeMenu use the popover component

/**
 * The node menu overlay, displayed when clicking on a node.
 */
export default class AlcNodeMenu extends Menu {
    @api
    conditionOptions;

    @api
    elementMetadata;

    @api
    guid;

    @api
    canHaveFaultConnector;

    @api
    disableDeleteElements;

    @api
    elementHasFault;

    @api
    disableEditElements;

    @track
    contextualMenuMode = NodeMenuMode.Default;

    @api
    moveFocus = (shift: boolean) => {
        if (this.isDeleteBranchElementMode) {
            if (shift) {
                this.moveFocusToFooterButton();
            } else {
                this.moveFocusToBackButton();
            }
        } else {
            this.tabFocusRingIndex = TabFocusRingItems.Icon;
            this.handleTabCommand(shift);
        }
    };

    _selectedConditionValue;
    _childIndexToKeep: number | undefined = 0;

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
        return getMenuConfiguration(
            this.elementMetadata,
            this.contextualMenuMode,
            this.canHaveFaultConnector,
            this.elementHasFault,
            this.disableDeleteElements
        );
    }

    get menuWrapper() {
        return this.elementMetadata.iconShape === ICON_SHAPE.DIAMOND ? 'diamond-element-menu' : '';
    }

    get isBaseActionMode() {
        return this.contextualMenuMode === NodeMenuMode.Default;
    }

    get isDeleteBranchElementMode() {
        return this.contextualMenuMode === NodeMenuMode.Delete;
    }

    get selectedConditionValue() {
        return this._selectedConditionValue;
    }

    get descriptionHeader() {
        return this.menuConfiguration.header.description;
    }

    constructor() {
        super();
        this.tabFocusRingIndex = TabFocusRingItems.Icon;
    }

    override getListKeyboardInteractionSelector() {
        return selectors.menuItem;
    }

    /**
     * Handles the onclick event on the back button, and updates the contextualMenuMode to base mode.
     * Also, dispatches the ClearHighlightedPathEvent to remove the highlight from nodes and connectors
     * on the deletion path.
     *
     * @param event
     */
    handleBackButtonClick = (event: Event | undefined = undefined) => {
        if (event != null) {
            event.stopPropagation();
        }
        this.contextualMenuMode = NodeMenuMode.Default;
        this._hasDeleteBranchModeRendered = false;
        this._moveFocusToDeleteBranchRow = true;
        this.dispatchEvent(new ClearHighlightedPathEvent());
    };

    /**
     * Handles the click on the action row item and dispatches the appropriate event
     *
     * @param event
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
                if (this.elementMetadata.type === NodeType.BRANCH) {
                    this.contextualMenuMode = NodeMenuMode.Delete;
                    this._hasBaseModeRendered = false;
                    this._selectedConditionValue = this.conditionOptions[0].value;
                    this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
                    closeMenu = false;
                } else if (this.elementMetadata.type === NodeType.LOOP) {
                    this.dispatchEvent(
                        new DeleteElementEvent([this.guid], this.elementMetadata.elementType, FOR_EACH_INDEX)
                    );
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
            case ELEMENT_ACTION_CONFIG.OPEN_SUBFLOW_ACTION.value:
                this.dispatchEvent(new OpenSubflowEvent(this.guid));
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
     *
     * @param event
     */
    handleComboboxChange = (event: CustomEvent) => {
        event.stopPropagation();
        this._selectedConditionValue = event.detail.value;
        this._childIndexToKeep = this.conditionOptions.findIndex(
            (option) => option.value === this._selectedConditionValue
        );
        if (this._childIndexToKeep === this.conditionOptions.length - 1) {
            this._childIndexToKeep = undefined;
        }
        this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
        this.tabFocusRingIndex = TabFocusRingItemsInDeleteMode.Combobox;
    };

    /**
     * Handles the click on the Footer button and dispatches the relevant event
     *
     * @param event
     */
    handleFooterButtonClick = (event: Event | undefined = undefined) => {
        if (event != null) {
            event.stopPropagation();
        }
        this.dispatchEvent(new CloseMenuEvent());
        if (this.contextualMenuMode === NodeMenuMode.Default) {
            this.dispatchEvent(new EditElementEvent(this.guid, undefined, undefined, true));
        } else if (this.contextualMenuMode === NodeMenuMode.Delete) {
            this.dispatchEvent(
                new DeleteBranchElementEvent([this.guid], this.elementMetadata.elementType, this._childIndexToKeep)
            );
        }
    };

    /**
     * Closes the menu and moves the focus back to the element icon
     */
    override handleEscape() {
        super.handleEscape();
        this.dispatchEvent(new MoveFocusToNodeEvent(this.guid));
    }

    /**
     * Helper function used during keyboard commands
     */
    override handleSpaceOrEnter() {
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

    moveFocusToFooterButton() {
        const footerButton = this.template.querySelector('.footer lightning-button');
        footerButton.focus();
    }

    moveFocusToFirstRowItem() {
        const listItems = Array.from(this.template.querySelectorAll(selectors.menuItem)) as HTMLElement[];
        const firstRowItem = listItems && listItems[0];
        firstRowItem.focus();
    }

    moveFocusToBackButton() {
        const backButton = this.template.querySelector(selectors.backButton);
        backButton.focus();
    }

    moveFocusToCombobox() {
        const combobox = this.template.querySelector('lightning-combobox');
        combobox.focus();
    }

    tabFocusRingCmds = [
        // focus on the icon
        () => this.dispatchEvent(new MoveFocusToNodeEvent(this.guid)),
        // focus on the first row
        () => this.moveFocusToFirstRowItem(),
        // focus on the footer
        () => this.moveFocusToFooterButton()
    ];

    tabFocusRingCmdsInDeleteMode = [
        // focus on the icon
        () => this.dispatchEvent(new MoveFocusToNodeEvent(this.guid)),
        // focus on the back button
        () => this.moveFocusToBackButton(),
        // focus on the combobox
        () => this.moveFocusToCombobox(),
        // focus on the footer
        () => this.moveFocusToFooterButton()
    ];

    override getTabFocusRingCmds() {
        return this.isDeleteBranchElementMode ? this.tabFocusRingCmdsInDeleteMode : this.tabFocusRingCmds;
    }

    override getTabFocusRingIndex() {
        if (this.isDeleteBranchElementMode) {
            if (this.template.activeElement) {
                if (this.template.activeElement.classList.value.includes(selectors.backButtonFocus)) {
                    return TabFocusRingItemsInDeleteMode.BackButton;
                } else if (this.template.activeElement.classList.value.includes(selectors.comboBoxFocus)) {
                    return TabFocusRingItemsInDeleteMode.Combobox;
                } else if (this.template.activeElement.parentElement.classList.value.includes(selectors.footerFocus)) {
                    return TabFocusRingItemsInDeleteMode.Footer;
                }
            }
        }
        return super.getTabFocusRingIndex();
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
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as HTMLElement[];
            items.forEach((item) => {
                if (
                    this._moveFocusToDeleteBranchRow &&
                    item.parentElement?.getAttribute('data-value') === ELEMENT_ACTION_CONFIG.DELETE_ACTION.value
                ) {
                    item.focus();
                    this.tabFocusRingIndex = TabFocusRingItems.ListItems;
                }
            });
            // Moving it to the first row only when the menu has been opened through a keyboard command
            // and isn't coming via the back button
            if (this.moveFocusToMenu && !this._moveFocusToDeleteBranchRow) {
                items[0].focus();
                this.tabFocusRingIndex = TabFocusRingItems.ListItems;
            }
            this._moveFocusToDeleteBranchRow = false;
            this._hasBaseModeRendered = true;
        }
        if (this.isDeleteBranchElementMode && !this._hasDeleteBranchModeRendered) {
            // Moving focus to the back button only when entering the contextual menu in deleteBranchElementMode
            this.moveFocusToBackButton();
            this._hasDeleteBranchModeRendered = true;
            this.tabFocusRingIndex = TabFocusRingItemsInDeleteMode.BackButton;
        }
    }
}
