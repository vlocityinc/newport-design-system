import { api, LightningElement } from 'lwc';
import { classSet } from 'lightning/utils';
import { PopoverToggledEvent } from 'builder_platform_interaction/alcEvents';
import { addKeyboardShortcuts, Keys } from 'builder_platform_interaction/contextualMenuUtils';

/**
 * Popover component that supports custom LWC child components for the trigger and content and
 * manages the mouse and keyboard interactions between them.
 */
export default class Popover extends LightningElement {
    // whether to display the popover content
    private showContent = false;

    // whether to focus on the popover content
    private focusOnContent = false;

    // name for the trigger component slot
    private triggerSlotName = 'trigger';

    // name for the content component slot
    private contentSlotName = 'content';

    // ref to trigger component
    private triggerComponent;

    // ref to content component
    private contentComponent;

    private keyboardInteractions;

    /**
     * Moves the focus to the popover trigger
     */
    @api
    focus() {
        this.moveFocusToTrigger();
    }

    // whether to inline the rendering of the popover content
    @api
    inline = false;

    connectedCallback() {
        this.keyboardInteractions = addKeyboardShortcuts(this, [
            { key: Keys.Enter, handler: () => this.handleSpaceOrEnter() },
            { key: Keys.Space, handler: () => this.handleSpaceOrEnter() },
            { key: Keys.Escape, handler: () => this.handleEscape() }
        ]);
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }

    /**
     * Closes the popover on focus out to somewhere other that the popover
     *
     * @param event - The focus out event
     */
    handleFocusOut(event) {
        if (this.shouldIgnoreFocusOut(event)) {
            return;
        }
        this.updateShowContent(false);
    }

    /**
     * Closes the popover
     */
    handleEscape() {
        this.updateShowContent(false);
    }

    /**
     * Helper function used during keyboard commands
     */
    handleSpaceOrEnter() {
        // move the focus to the content when using enter or space to open the popover
        this.focusOnContent = true;
        this.toggleShowContent();
    }

    /**
     * Helper function to move focus out of the popover and back to the trigger.
     */
    handleContentFocusOut() {
        this.moveFocusToTrigger();
    }

    /**
     * Prevents propagration of the event when content in the popover is clicked.
     *
     * @param e the event that fired
     */
    handleContentClick(e: Event) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * Closes the popover content and move the focus to the trigger
     *
     * @param event the event
     */
    handleClosePopover(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.showContent) {
            this.updateShowContent(false);
            this.moveFocusToTrigger();
        }
    }

    /**
     * Registers the trigger component
     *
     * @param event the event that fires the trigger registration
     */
    handleRegisterTrigger(event: CustomEvent) {
        this.triggerComponent = event.detail.component;
    }

    /**
     * Registers the trigger component
     *
     * @param event the event that fires the content registration
     */
    handleRegisterContent(event: CustomEvent) {
        this.contentComponent = event.detail.component;

        if (this.focusOnContent) {
            this.moveFocusToContent();
        }

        this.triggerComponent.isTriggered = this.showContent;
    }

    /**
     * Move the focus to a component
     *
     * @param component A component to move the focus to
     */
    moveFocusToComponent(component: HTMLElement) {
        component.focus();
    }

    /**
     * Moves the focus to the trigger
     */
    moveFocusToTrigger() {
        this.moveFocusToComponent(this.triggerComponent);
    }

    /**
     * Moves the focus to the content
     */
    moveFocusToContent() {
        this.moveFocusToComponent(this.contentComponent);
    }

    /**
     * Toggles showing the content when the trigger is clicked
     */
    handleTriggerClick() {
        this.focusOnContent = false;
        this.toggleShowContent();
    }

    /**
     * Toggles showing the content
     */
    toggleShowContent() {
        this.updateShowContent(!this.showContent);
    }

    /**
     * Updates the value of showContent and dispatches a popover event if
     * ths value changed.
     *
     * @param nextShowContent The new showContent value
     */
    updateShowContent(nextShowContent) {
        if (this.showContent !== nextShowContent) {
            this.showContent = nextShowContent;
            this.triggerComponent.isTriggered = this.showContent;
        }
    }

    /**
     * Returns true if the focus out event should be ignored
     *
     * @param event - the Focus out event
     * @returns true when the focus out event should be ignored
     */
    shouldIgnoreFocusOut(event) {
        // ignore focus out events when they originate from the popover itself (eg, clicking on some white space on the popover)

        // TODO: find a better way to do this
        const shouldIgnore = [this.triggerSlotName, this.contentSlotName].includes(
            event.relatedTarget?.parentElement?.slot
        );
        if (shouldIgnore) {
            event.stopPropagation();
            event.preventDefault();
        }

        return shouldIgnore;
    }

    renderedCallback() {
        this.dispatchEvent(new PopoverToggledEvent(this.showContent));
    }

    get contentClasses() {
        return classSet('content').add({ inline: this.inline });
    }
}
