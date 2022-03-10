import {
    dispatchPrivateItemRegister,
    getEnterKeyInteraction,
    getEscapeKeyInteraction
} from 'builder_platform_interaction/alcComponentsUtils';
import { CloseMenuEvent, SelectMenuItemEvent } from 'builder_platform_interaction/alcEvents';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const { ListKeyboardInteraction, withKeyboardInteractions } = keyboardInteractionUtils;

export default abstract class AlcMenu extends withKeyboardInteractions(LightningElement) {
    static className = 'alc-menu';

    protected isFirstRender = true;
    protected listKeyboardInteraction;

    getKeyboardInteractions() {
        const listKeyboardInteraction = new ListKeyboardInteraction(this.template);
        this.listKeyboardInteraction = listKeyboardInteraction;
        return [
            getEnterKeyInteraction(() => this.handleSpaceOrEnter(), true),
            getEscapeKeyInteraction(() => this.handleEscape()),
            listKeyboardInteraction
        ];
    }

    @api
    getListKeyboardInteraction() {
        return this.listKeyboardInteraction;
    }

    /**
     * Whether to move the focus to the menu on load
     */
    @api autoFocus = false;

    /**
     * Checks if the menu is empty or not
     *
     * @returns true if the menu is empty, false otherwise
     */
    @api
    isEmpty() {
        // always false here but needed so that it can be overriden in menu subclass
        return false;
    }

    /**
     * Focusing on the host element moves the focus to the component's active list element
     */
    @api
    focus() {
        this.listKeyboardInteraction.getActiveElement()?.focus();
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
     * Closes the menu
     */
    handleEscape() {
        this.closeMenu();
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    doSelectMenuItem(element?: HTMLElement) {
        this.closeMenu();
    }

    /**
     * Helper function to fire a CloseMenuEvent.
     */
    closeMenu() {
        this.dispatchEvent(new CloseMenuEvent());
    }

    /**
     * Get the menu classes
     *
     * @returns the classes for the menu
     */
    getMenuClasses(): string[] {
        // @ts-ignore
        return [this.constructor.className];
    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add(...this.getMenuClasses());

        // registers this instance with its popover parent
        dispatchPrivateItemRegister(this);
    }

    renderedCallback() {
        super.renderedCallback();

        if (this.isFirstRender && this.autoFocus) {
            this.isFirstRender = false;
            this.focus();
        }
    }
}
