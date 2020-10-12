import FlcNodeMenu from 'builder_platform_interaction/flcNodeMenu';
import { api } from 'lwc';

const selectors = {
    triggerButton: 'builder_platform_interaction-start-node-trigger-button',
    contextButton: 'builder_platform_interaction-start-node-context-button',
    timeTriggerButton: 'builder_platform_interaction-start-node-time-trigger-button'
};

export default class FlcNodeStartMenu extends FlcNodeMenu {
    @api
    startData;

    get hasTrigger() {
        return this.elementMetadata.hasTrigger;
    }

    get hasContext() {
        return this.elementMetadata.hasContext;
    }

    get hasTimeTrigger() {
        // TODO: Update it as part of W-8057549
        return false;
    }

    get startNode() {
        return { ...this.startData, ...{ guid: this.guid } };
    }

    get startNodeClass() {
        return this.hasTrigger || this.hasContext
            ? 'node-menu-header slds-border_bottom slds-dropdown__header'
            : 'node-menu-header slds-dropdown__header';
    }

    moveFocusToButton = (key, nextButton, prevButton) => {
        let nextFocusElement;
        // The focus should move from trigger button -> context button -> time trigger button -> trigger button
        if (key === 'arrowDown') {
            nextFocusElement = nextButton || prevButton;
        }
        // The focus should move from trigger button -> time trigger button -> context button  -> trigger button
        if (key === 'arrowUp') {
            nextFocusElement = prevButton || nextButton;
        }

        // Moving focus to the next button if needed
        if (nextFocusElement) {
            nextFocusElement.shadowRoot.querySelector('div').focus();
        }
    };

    /**
     * Handles the ArrowKeyDownEvent coming from trigger button and moves the focus correctly
     * based on the arrow key pressed
     * @param event - ArrowKeyDownEvent coming from start-node-trigger-button
     */
    handleTriggerButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const contextButton = this.template.querySelector(selectors.contextButton);
        const timeTriggerButton = this.template.querySelector(selectors.timeTriggerButton);

        this.moveFocusToButton(event.detail.key, contextButton, timeTriggerButton);
    };

    /**
     * Handles the ArrowKeyDownEvent coming from context button and moves the focus correctly
     * based on the arrow key pressed
     * @param event - ArrowKeyDownEvent coming from start-node-context-button
     */
    handleContextButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const triggerButton = this.template.querySelector(selectors.triggerButton);
        const timeTriggerButton = this.template.querySelector(selectors.timeTriggerButton);

        this.moveFocusToButton(event.detail.key, timeTriggerButton, triggerButton);
    };

    /**
     * Handles the ArrowKeyDownEvent coming from time trigger button and moves the focus correctly
     * based on the arrow key pressed
     * @param event - ArrowKeyDownEvent coming from start-node-time-trigger-button
     */
    handleTimeTriggerButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const triggerButton = this.template.querySelector(selectors.triggerButton);
        const contextButton = this.template.querySelector(selectors.contextButton);

        this.moveFocusToButton(event.detail.key, triggerButton, contextButton);
    };
}
