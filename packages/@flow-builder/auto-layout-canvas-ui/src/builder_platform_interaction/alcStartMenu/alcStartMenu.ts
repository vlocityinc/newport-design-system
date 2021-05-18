import AlcNodeMenu from 'builder_platform_interaction/alcNodeMenu';
import { api } from 'lwc';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import {
    MoveFocusToNodeEvent,
    CloseMenuEvent,
    MoveFocusToConnectorEvent
} from 'builder_platform_interaction/alcEvents';
import {
    setupKeyboardShortcutUtil,
    setupKeyboardShortcutWithShiftKey
} from 'builder_platform_interaction/contextualMenuUtils';
const { ArrowDown, ArrowUp, TabCommand, EscapeCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    alcMenu: 'builder_platform_interaction-alc-menu',
    triggerButton: 'builder_platform_interaction-start-node-trigger-button',
    contextButton: 'builder_platform_interaction-start-node-context-button',
    scheduledPathButton: 'builder_platform_interaction-start-node-scheduled-path-button',
    menuItem: 'div[role="option"]'
};

enum TabFocusRingItems {
    Icon = 0,
    Buttons = 1
}

export default class AlcStartMenu extends AlcNodeMenu {
    @api
    startData;

    @api
    moveFocusToMenu;

    @api
    childIndex!: number;

    get hasTrigger() {
        return this.elementMetadata.hasTrigger;
    }

    get hasContext() {
        return this.elementMetadata.hasContext;
    }

    @api
    supportsScheduledPaths;

    get startNode() {
        return { ...this.startData, ...{ guid: this.guid } };
    }

    get startNodeClass() {
        return this.hasTrigger || this.hasContext
            ? 'node-menu-header slds-border_bottom slds-dropdown__header'
            : 'node-menu-header slds-dropdown__header';
    }

    @api
    moveFocus = () => {
        const alcMenu = this.template.querySelector(selectors.alcMenu);
        const triggerButton = alcMenu.querySelector(selectors.triggerButton);
        const contextButton = alcMenu.querySelector(selectors.contextButton);
        const scheduledPathButton = alcMenu.querySelector(selectors.scheduledPathButton);
        if (!triggerButton && !contextButton && !scheduledPathButton) {
            // close the menu when there's no rows in the menu
            this.dispatchEvent(new CloseMenuEvent());
            this.dispatchEvent(new MoveFocusToConnectorEvent(this.guid, this.childIndex));
        } else {
            // move focus to the first row item
            this.tabFocusRingIndex = TabFocusRingItems.Icon;
            this.handleTabCommand(false);
        }
    };

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
        this.tabFocusRingIndex = TabFocusRingItems.Icon;
    }

    moveFocusToButton = (key, nextButton, prevButton) => {
        let nextFocusElement;
        // The focus should move from trigger button -> context button -> scheduled path button -> trigger button
        if (key === ArrowDown.COMMAND_NAME) {
            nextFocusElement = nextButton || prevButton;
        }
        // The focus should move from trigger button -> scheduled path button -> context button  -> trigger button
        if (key === ArrowUp.COMMAND_NAME) {
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
        const scheduledPathButton = this.template.querySelector(selectors.scheduledPathButton);

        this.moveFocusToButton(event.detail.key, contextButton, scheduledPathButton);
    };

    /**
     * Handles the ArrowKeyDownEvent coming from context button and moves the focus correctly
     * based on the arrow key pressed
     * @param event - ArrowKeyDownEvent coming from start-node-context-button
     */
    handleContextButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const triggerButton = this.template.querySelector(selectors.triggerButton);
        const scheduledPathButton = this.template.querySelector(selectors.scheduledPathButton);

        this.moveFocusToButton(event.detail.key, scheduledPathButton, triggerButton);
    };

    /**
     * Handles the ArrowKeyDownEvent coming from scheduled path button and moves the focus correctly
     * based on the arrow key pressed
     * @param event - ArrowKeyDownEvent coming from start-node-scheduled-path-button
     */
    handleScheduledPathButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const triggerButton = this.template.querySelector(selectors.triggerButton);
        const contextButton = this.template.querySelector(selectors.contextButton);

        this.moveFocusToButton(event.detail.key, triggerButton, contextButton);
    };

    moveFocusToTriggerButton() {
        const triggerButton = this.template.querySelector(selectors.triggerButton);
        triggerButton.shadowRoot.querySelector('div').focus();
    }

    tabFocusRingCmds = [
        // focus on the icon
        () => this.dispatchEvent(new MoveFocusToNodeEvent(this.guid)),
        // focus on the first button
        () => this.moveFocusToTriggerButton()
    ];

    handleEscape() {
        this.dispatchEvent(new CloseMenuEvent());
        // Moving the focus back to the source node
        this.dispatchEvent(new MoveFocusToNodeEvent(this.guid));
    }

    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Tab: new TabCommand(() => this.handleTabCommand(false), false),
            Escape: new EscapeCommand(() => this.handleEscape())
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
        const shiftTabCommand = new TabCommand(() => this.handleTabCommand(true), true);
        setupKeyboardShortcutWithShiftKey(this.keyboardInteractions, shiftTabCommand, 'Tab');
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }

    renderedCallback() {
        if (this.moveFocusToMenu && this.hasTrigger) {
            const triggerButton = this.template.querySelector(selectors.triggerButton);
            // Trigger button is always the first button
            if (triggerButton) {
                triggerButton.shadowRoot.querySelector('div').focus();
                this.tabFocusRingIndex = TabFocusRingItems.Buttons;
            }
        }
    }
}
