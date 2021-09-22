// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { ReorderListEvent, ListItemInteractionEvent } from 'builder_platform_interaction/events';
import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './reorderableVerticalNavigationLabels';
const { ArrowDown, ArrowUp, SpaceCommand, EnterCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    listSection: '.navigation-content',
    listItem: 'builder_platform_interaction-reorderable-vertical-navigation-item'
};

/**
 * Component that provides a vertical list of elements, styled as vertical tabs,
 * that can be selected and reordered.
 *
 * The the menu items must include the following properties:
 * {
 *      guid: "GUIDString",
 *      label: "LabelString"
 * }
 */
export default class ReorderableVerticalNavigation extends LightningElement {
    @api defaultLabel = '';
    @api hideFooter = false;
    @api keyboardInteractions;

    /**
     * @typedef MenuItem
     * @type {Object}
     * @property {Object} element
     * @property {boolean} isDraggable
     * @property {boolean} hasErrors
     */

    /**
     * @type {MenuItem[]}
     */
    @api menuItems = [];

    labels = LABELS;

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    set activeItemId(selectedItem) {
        this._activeItemId = selectedItem;
    }

    @api get activeItemId() {
        return this._activeItemId;
    }

    _hasRenderedOnce = false;
    _activeItemId;
    _focusedItemId;
    _grabbedItemId;
    _indexToFocusPostReorder = null;

    get decoratedMenuItems() {
        return this.menuItems.map((menuItem) => {
            const { element, label, isDraggable, hasErrors } = menuItem;
            return {
                guid: element.guid,
                label: label !== '' ? label : this.defaultLabel,
                isDraggable,
                hasErrors
            };
        });
    }

    /**
     * Helper function to select the item via click or pressing Enter
     *
     * @param selectedItemId - The guid associated with a given row item
     */
    selectItem(selectedItemId: Guid) {
        this._focusedItemId = selectedItemId;
        if (this._activeItemId !== selectedItemId) {
            // Dispatching the selection event only if the currently active element
            // is different from the element being selected
            this._activeItemId = selectedItemId;
            const itemSelectedEvent = new ListItemInteractionEvent(
                this._activeItemId,
                ListItemInteractionEvent.Type.Select
            );
            this.dispatchEvent(itemSelectedEvent);
        }
    }

    handleListItemInteraction(event: ListItemInteractionEvent) {
        event.stopPropagation();
        if (event.detail.interactionType === ListItemInteractionEvent.Type.Click) {
            this.selectItem(event.detail.itemId);
        } else if (event.detail.interactionType === ListItemInteractionEvent.Type.Blur) {
            // Resetting the _focusedItemId and _grabbedItemId when the user tabs/clicks out of the list section area
            // Need the _indexToFocusPostReorder check to make sure we don't reset variables when blur is called upon reordering
            if (this._focusedItemId === event.detail.itemId && this._indexToFocusPostReorder == null) {
                this._focusedItemId = null;
                this._grabbedItemId = null;
            }
        }
    }

    /**
     * Helper function to reorder the items using keyboard
     *
     * @param items - The row items
     * @param currentItemInFocus - Item that is currently in focus and being reordered
     * @param key - Arrow Down or Arrow Up key pressed
     */
    reorderItems(items: HTMLElement[], currentItemInFocus: HTMLElement, key: ArrowDown.COMMAND_NAME) {
        const currentFocusIndex = items.indexOf(currentItemInFocus);
        const nextFocusIndex = key === ArrowDown.COMMAND_NAME ? currentFocusIndex + 1 : currentFocusIndex - 1;
        // Ensuring that we don't reorder the default outcome/pause event option
        if (nextFocusIndex < items.length - 1 && nextFocusIndex >= 0) {
            const sourceId = currentItemInFocus.navItemId;
            const targetId = items[nextFocusIndex].navItemId;
            const reorderListEvent = new ReorderListEvent(sourceId, targetId);
            this.dispatchEvent(reorderListEvent);
            this._indexToFocusPostReorder = nextFocusIndex;
        }
    }

    /**
     * Helper function to move the focus up/down the list via arrow keys
     *
     * @param items - The row items
     * @param currentItemInFocus - Item that is currently in focus
     * @param key - Arrow Down or Arrow Up key pressed
     */
    moveFocusInListOnArrowKeyDown(items: HTMLElement[], currentItemInFocus: HTMLElement, key: ArrowDown.COMMAND_NAME) {
        const currentFocusIndex = items.indexOf(currentItemInFocus);
        let nextFocusIndex = key === ArrowDown.COMMAND_NAME ? currentFocusIndex + 1 : currentFocusIndex - 1;
        if (nextFocusIndex >= items.length) {
            // Case when you have reached the bottom of the list and press arrow down key.
            // Focus should move to the top of the list
            nextFocusIndex = 0;
        } else if (nextFocusIndex < 0) {
            // Case when you have reached the top of the list and press arrow up key.
            // Focus should move to the bottom of the list
            nextFocusIndex = items.length - 1;
        }
        this._focusedItemId = items[nextFocusIndex].navItemId;
        items[nextFocusIndex].focus();
    }

    /**
     * Handles the arrow key down event and either reorders the items or moves the focus based on the mode
     *
     * @param key - Arrow Down or Arrow Up key pressed
     */
    handleArrowKeyDown(key: ArrowDown.COMMAND_NAME | ArrowUp.COMMAND_NAME) {
        const currentItemInFocus = this.template.activeElement;
        const items = Array.from(this.template.querySelectorAll(selectors.listItem)) as HTMLElement[];
        // Reordering items if any row has been grabbed else moving focus up/down the list
        if (this._grabbedItemId) {
            this.reorderItems(items, currentItemInFocus, key);
        } else {
            this.moveFocusInListOnArrowKeyDown(items, currentItemInFocus, key);
        }
    }

    /**
     * Helper method to find if there's a draggable item present or not
     *
     * @returns true if there is atleast one draggable item in the listItems
     */
    hasAnyDraggableItem() {
        return this.menuItems.some((menuItem) => menuItem.isDraggable);
    }

    /**
     * Handles the space key down event and toggles the reordering mode
     */
    handleSpace() {
        const currentItemInFocus = this.template.activeElement;
        this._focusedItemId = currentItemInFocus.navItemId;
        currentItemInFocus.focus();

        const items = Array.from(this.template.querySelectorAll(selectors.listItem)) as HTMLElement[];
        const currentFocusIndex = items.indexOf(currentItemInFocus);
        if (this._grabbedItemId) {
            this._grabbedItemId = null;
        } else if (currentFocusIndex !== items.length - 1 && this.hasAnyDraggableItem()) {
            // Only grabbing the item if it can be reordered
            this._grabbedItemId = this._focusedItemId;
        }
    }

    /**
     * Handles the enter key down event and selects the currently focused row
     */
    handleEnter() {
        const currentItemInFocus = this.template.activeElement;
        this.selectItem(currentItemInFocus.navItemId);
    }

    // TODO: W-9582172 Fix addKeyboardShortcuts so it returns a cleanup method
    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            ArrowDown: new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME)),
            ' ': new SpaceCommand(() => this.handleSpace()),
            Enter: new EnterCommand(() => this.handleEnter())
        };
        Object.entries(keyboardCommands).forEach(([shortcutKeys, command]) => {
            this.keyboardInteractions.setupCommandAndShortcut(command, { key: shortcutKeys });
        });
    }

    connectedCallback() {
        this.setupCommandsAndShortcuts();
    }

    renderedCallback() {
        if (!this._hasRenderedOnce) {
            // Attaches the keydown listener to just the list section area
            this.keyboardInteractions.addKeyDownEventListener(this.template.querySelector(selectors.listSection));
            this._hasRenderedOnce = true;
        }

        // Moving focus to the right item (the one being reordered) after reordering is done
        if (this._indexToFocusPostReorder != null) {
            const items = Array.from(this.template.querySelectorAll(selectors.listItem)) as HTMLElement[];
            items[this._indexToFocusPostReorder].focus();
            this._indexToFocusPostReorder = null;
        }
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template.querySelector(selectors.listSection));
    }
}
