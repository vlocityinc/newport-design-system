import { LightningElement, api } from 'lwc';
import { getStyleFromGeometry, dispatchPrivateItemRegister } from 'builder_platform_interaction/alcComponentsUtils';

import { SelectMenuItemEvent, CloseMenuEvent } from 'builder_platform_interaction/alcEvents';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';

const { EnterCommand, SpaceCommand, EscapeCommand, TabCommand } = commands;
const {
    ListKeyboardInteraction,
    BaseKeyboardInteraction,
    createShortcut,
    createShortcutKey,
    Keys,
    withKeyboardInteractions
} = keyboardInteractionUtils;

const selectors = { menuItem: 'div[role="option"]' };

enum TabFocusRingItems {
    Icon = 0,
    ListItems = 1
}
export default class Menu extends withKeyboardInteractions(LightningElement) {
    @api top;
    @api left;
    @api items;

    @api
    moveFocusToMenu;

    @api
    moveFocus = (shift: boolean) => {
        this.moveFocusToFirstListItem();
    };

    tabFocusRingIndex = 0;
    tabFocusRingCmds: Function[] = [];

    getKeyboardInteractions() {
        return [
            new BaseKeyboardInteraction([
                createShortcut(Keys.Enter, new EnterCommand(() => this.handleSpaceOrEnter())),
                createShortcut(Keys.Space, new SpaceCommand(() => this.handleSpaceOrEnter())),
                createShortcut(Keys.Escape, new EscapeCommand(() => this.handleEscape()))
            ]),
            new ListKeyboardInteraction(this.template, this.getListKeyboardInteractionSelector())
        ];
    }

    /**
     * Returns the selector used to determine which elements should be part of the list keyboard interaction
     *
     * @returns the selector for the list keyboard interaction
     */
    getListKeyboardInteractionSelector() {
        return selectors.menuItem;
    }

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

    setupCommandsAndShortcuts() {
        this.keyboardInteractions.registerShortcuts([
            createShortcut(Keys.Tab, new TabCommand(() => this.handleTabCommand(false), false)),
            createShortcut(createShortcutKey(Keys.Tab, true), new TabCommand(() => this.handleTabCommand(true), true))
        ]);
    }

    connectedCallback() {
        super.connectedCallback();
        this.setupCommandsAndShortcuts();

        // registers this instance with its popover parent
        dispatchPrivateItemRegister(this);
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
     * @param element - The HTML element selected in the menu
     */
    doSelectMenuItem(element?: HTMLElement) {
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
        const listItems = Array.from<HTMLElement>(this.template.querySelectorAll(selectors.menuItem));
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
        this.moveFocusToFirstListItem();
    }
}
