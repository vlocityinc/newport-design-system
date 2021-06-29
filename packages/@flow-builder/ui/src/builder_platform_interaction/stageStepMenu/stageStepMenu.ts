import { api } from 'lwc';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    CloseMenuEvent,
    PasteOnCanvasEvent,
    MoveFocusToConnectorEvent,
    MoveFocusToNodeEvent,
    GoToPathEvent,
    DeleteGoToConnectionEvent
} from 'builder_platform_interaction/alcEvents';
import Menu from 'builder_platform_interaction/menu';
import { LABELS } from './stageStepMenuLabels';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { moveFocusInMenuOnArrowKeyDown } from 'builder_platform_interaction/contextualMenuUtils';

const { KeyboardInteractions } = keyboardInteractionUtils;

// Selectors used for accessibility navigation
const selectors = {
    menuItem: 'div[role="option"]',
    cancelButton: '.cancel',
    alcMenu: 'builder_platform_interaction-alc-menu'
};

enum TabFocusRingItems {
    Icon = 0,
    ListItems = 1
}

enum StepType {
    Work,
    Autolaunched
}

/**
 * The add step menu overlay. It is displayed when clicking on the Add Step button.
 */
export default class StageStepMenu extends Menu {
    labels = LABELS;

    @api
    node;

    // Used for testing purposes
    @api
    keyboardInteractions;

    @api
    moveFocus = () => {
        this.tabFocusRingIndex = TabFocusRingItems.Icon;
        this.handleTabCommand(false);
    };

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
        this.tabFocusRingIndex = TabFocusRingItems.Icon;
    }

    /**
     * StageStep selected via mouse click.
     *
     * @param event
     * @param designateFocus
     */
    handleAddStageStep(event) {
        event.stopPropagation();
        this.doAddStageStep(event.currentTarget);
    }

    /**
     * Adds StageStep of the type specified by the attributes of the selected element.
     *
     * @param currentTarget
     * @param designateFocus
     */
    doAddStageStep(currentTarget: HTMLElement, designateFocus = false) {
        this.dispatchEvent(new CloseMenuEvent());

        const addItemEvent = new AddElementEvent({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            actionType: currentTarget.getAttribute('action')!,
            parent: this.node && this.node.guid,
            designateFocus
        });
        this.dispatchEvent(addItemEvent);
    }

    /**
     * Hide the step menu when the Cancel button is clicked
     *
     * @param event - the mouse event upon the Step Menu's 'Cancel' button
     */
    handleCloseStepMenu(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.dispatchEvent(new CloseMenuEvent());
    }

    /**
     * Helper function for moving focus for accessibility
     *
     * @param index
     */
    getItemFromItemList(index) {
        const listItems = Array.from(this.template.querySelectorAll(selectors.menuItem)) as HTMLElement[];
        return listItems && listItems[index];
    }

    moveFocusToFirstListItem() {
        const firstRowItem = this.getItemFromItemList(0);
        firstRowItem.focus();
    }

    /**
     * Helper function to move the focus correctly when using arrow keys in the contextual menu
     *
     * @param key - the key pressed (arrowDown or arrowUp)
     */
    handleArrowKeyDown(key) {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as HTMLElement[];
            moveFocusInMenuOnArrowKeyDown(items, currentItemInFocus, key);
        }
    }

    /**
     * Helper function used during keyboard commands
     */
    handleSpaceOrEnter() {
        const currentItemInFocus = this.template.activeElement;

        if (currentItemInFocus) {
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as HTMLElement[];
            // If the selected element is the cancel button, close the menu
            // TODO @W-9127952: change method of finding cancel button away from class-checking
            if (currentItemInFocus.parentElement.classList.value.includes(selectors.cancelButton)) {
                this.handleCloseStepMenu();
            } else if (items.includes(currentItemInFocus)) {
                // If the selected element is one of the step buttons, add the appropriate step
                this.doAddStageStep(currentItemInFocus, true);
            }
        }
    }

    handleEscape() {
        this.dispatchEvent(new CloseMenuEvent());
        this.dispatchEvent(new MoveFocusToConnectorEvent(this.prev || this.parent, this.childIndex)); // TODO @W-9127952: needs to focus on add step button
    }

    tabFocusRingCmds = [
        // focus on the connector icon
        () => this.dispatchEvent(new MoveFocusToConnectorEvent(this.prev || this.parent, this.childIndex)), // TODO @W-9127952: needs to focus on add step button
        // focus on the first item
        () => this.moveFocusToFirstListItem()
    ];

    renderedCallback() {
        if (this.moveFocusToMenu) {
            // TODO @W-9127952: needs to focus on the first element in the list
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as HTMLElement[];
            if (items.length > 0) {
                this.tabFocusRingIndex = TabFocusRingItems.ListItems;
                this.tabFocusRingCmds[this.tabFocusRingIndex]();
            }
        }
    }
}
