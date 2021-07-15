import { LightningElement, api } from 'lwc';
import { getStyleFromGeometry, dispatchPrivateItemRegister } from 'builder_platform_interaction/alcComponentsUtils';

import { SelectMenuItemEvent, CloseMenuEvent } from 'builder_platform_interaction/alcEvents';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import {
    setupKeyboardShortcutUtil,
    setupKeyboardShortcutWithShiftKey,
    moveFocusInMenuOnArrowKeyDown
} from 'builder_platform_interaction/contextualMenuUtils';
const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand, EscapeCommand, TabCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = { menuItem: 'div[role="option"]' };

enum TabFocusRingItems {
    Icon = 0,
    ListItems = 1
}

export default class Menu extends LightningElement {
    @api top;
    @api left;
    @api items;

    @api
    moveFocusToMenu;

    @api
    moveFocus = (shift: boolean) => {
        this.moveFocusToFirstListItem();
    };

    keyboardInteractions = new KeyboardInteractions();

    tabFocusRingIndex = 0;

    tabFocusRingCmds: Function[] = [];

    get style() {
        return getStyleFromGeometry({ y: this.top + 10, x: this.left });
    }

    getTabFocusRingCmds() {
        return this.tabFocusRingCmds;
    }

    getTabFocusRingIndex() {
        return this.tabFocusRingIndex;
    }

    /**
     * Item selected via mouse click.  Does not propagate
     *
     * @param event - the event that triggered the selection of the menu item
     */
    handleSelectMenuItem(event) {
        event.stopPropagation();
        this.doSelectMenuItem(event.currentTarget);
    }

    /**
     * Handle selecting an item in the menu.
     *
     * @param event - the event that triggered the menu selection
     */
    handleSelectItem(event) {
        this.dispatchEvent(new SelectMenuItemEvent({ value: event.detail.value }));
    }

    /**
     * Helper function to calculate the index of the element in the tab focus ring.
     *
     * @param shift whether the shift key is pressed
     * @param tabFocusRingIndex the given initial ring index
     * @param tabFocusRingCmds the list of commands corresponding to the tab focus ring
     * @returns the new tab focus ring index
     */
    calculateTabFocusRingIdx(shift: boolean, tabFocusRingIndex: number, tabFocusRingCmds: Function[]) {
        let newTabFocusRingIdx = shift ? tabFocusRingIndex - 1 : (tabFocusRingIndex + 1) % tabFocusRingCmds.length;
        if (newTabFocusRingIdx === -1) {
            newTabFocusRingIdx = tabFocusRingCmds.length - 1;
        }
        return newTabFocusRingIdx;
    }

    /**
     * Handle the click of the tab key on the menu.
     *
     * @param shift whether the shift key is pressed
     */
    handleTabCommand(shift: boolean) {
        const tabFocusRingIndex = this.getTabFocusRingIndex();
        const tabFocusRingCmds = this.getTabFocusRingCmds();
        this.tabFocusRingIndex = this.calculateTabFocusRingIdx(shift, tabFocusRingIndex, tabFocusRingCmds);
        tabFocusRingCmds[this.tabFocusRingIndex]();
    }

    /**
     * Closes the menu
     */
    handleEscape() {
        this.closeMenu();
    }

    // TODO: W-9582172 Fix addKeyboardShortcuts so it returns a cleanup method
    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Enter: new EnterCommand(() => this.handleSpaceOrEnter()),
            ' ': new SpaceCommand(() => this.handleSpaceOrEnter()),
            ArrowDown: new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME)),
            Escape: new EscapeCommand(() => this.handleEscape()),
            Tab: new TabCommand(() => this.handleTabCommand(false), false)
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
        const shiftTabCommand = new TabCommand(() => this.handleTabCommand(true), true);
        setupKeyboardShortcutWithShiftKey(this.keyboardInteractions, shiftTabCommand, 'Tab');
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();

        // registers this instance with its popover parent
        dispatchPrivateItemRegister(this);
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
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
            this.doSelectMenuItem(currentItemInFocus.parentElement);
        }
    }

    /**
     * Default implementation just closes the menu
     *
     * @param element - The element selected
     */
    doSelectMenuItem(element: HTMLElement) {
        this.closeMenu();
    }

    /**
     * Moves the focus to the first list item when moveFocusToMenu is true
     */
    renderedCallback() {
        if (this.moveFocusToMenu) {
            this.moveFocusToFirstListItem();
        }
    }

    /**
     * Helper function for moving focus for accessibility
     *
     * @param index - The index of the desired menu item
     * @returns the menu item at the specified index
     */
    getItemFromItemList(index) {
        const listItems = Array.from(this.template.querySelectorAll(selectors.menuItem)) as HTMLElement[];
        return listItems && listItems[index];
    }

    /**
     * Getter for the items in the tab focus ring.
     *
     * @returns the items in the tab focus ring
     */
    getTabRingIndexForListItems() {
        return TabFocusRingItems.ListItems;
    }

    /**
     * Helper function to move focus to the fist item in the menu.
     */
    moveFocusToFirstListItem() {
        this.tabFocusRingIndex = this.getTabRingIndexForListItems();
        const firstRowItem = this.getItemFromItemList(0);
        firstRowItem.focus();
    }

    /**
     * Helper function to fire a CloseMenuEvent.
     */
    closeMenu() {
        this.dispatchEvent(new CloseMenuEvent());
    }

    /**
     * Moves focus to the menu.
     */
    focus() {
        this.moveFocusToMenu = true;
    }
}
