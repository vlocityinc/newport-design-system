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
    recordTriggerButton: 'builder_platform_interaction-record-trigger-start-node'
};

enum TabFocusRingItems {
    Icon = 0,
    Buttons = 1
}

export default class AlcStartMenu extends AlcNodeMenu {
    @api
    startData;

    @api
    supportsScheduledPaths;

    get hasTrigger() {
        return this.elementMetadata.hasTrigger;
    }

    get hasContext() {
        return this.elementMetadata.hasContext;
    }

    get isRecordTriggeredFlow() {
        return this.elementMetadata.isRecordTriggeredFlow;
    }

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
        const recordTriggerButton = alcMenu.querySelector(selectors.recordTriggerButton);
        if (!triggerButton && !contextButton && !scheduledPathButton && !recordTriggerButton) {
            // close the menu when there's no rows in the menu
            this.dispatchEvent(new CloseMenuEvent());
            // Move focus to the left most branch if one exists, else move focus to the next connector.
            // There's no use case where the start element can have branches but no buttons in the menu.
            // Hence branchIndexToFocus should always be undefined.
            const branchIndexToFocus = this.startData.children ? 0 : undefined;
            this.dispatchEvent(new MoveFocusToConnectorEvent(this.guid, branchIndexToFocus));
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

    firstButton() {
        const triggerButton = this.template.querySelector(selectors.triggerButton);
        const recordTriggerButton = this.template.querySelector(selectors.recordTriggerButton);
        return this.isRecordTriggeredFlow ? recordTriggerButton : triggerButton;
    }

    moveFocusToFirstButton() {
        this.firstButton().focus();
    }

    moveFocusToButton = (key, nextButton, prevButton) => {
        let nextFocusElement;
        // The focus should move from trigger button -> context button -> scheduled path button -> trigger button
        // Or for record-triggered flow: record trigger button -> scheduled path button -> record trigger button
        if (key === ArrowDown.COMMAND_NAME) {
            nextFocusElement = nextButton || prevButton;
        }
        // The focus should move from trigger button -> scheduled path button -> context button  -> trigger button
        // Or for record-triggered flow: record trigger button -> scheduled path button -> record trigger button
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
     *
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
     *
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
     *
     * @param event - ArrowKeyDownEvent coming from start-node-scheduled-path-button
     */
    handleScheduledPathButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const triggerButton = this.template.querySelector(selectors.triggerButton);
        const contextButton = this.template.querySelector(selectors.contextButton);
        const recordTriggerButton = this.template.querySelector(selectors.recordTriggerButton);

        const nextButton = this.isRecordTriggeredFlow ? recordTriggerButton : triggerButton;
        const prevButton = this.isRecordTriggeredFlow ? recordTriggerButton : contextButton;

        this.moveFocusToButton(event.detail.key, nextButton, prevButton);
    };

    /**
     * Handles the ArrowKeyDownEvent coming from record trigger button and moves the focus correctly
     * based on the arrow key pressed
     *
     * @param event - ArrowKeyDownEvent coming from record-trigger-start-node
     */
    handleRecordTriggerButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const scheduledPathButton = this.template.querySelector(selectors.scheduledPathButton);

        this.moveFocusToButton(event.detail.key, scheduledPathButton, scheduledPathButton);
    };

    tabFocusRingCmds = [
        // focus on the icon
        () => this.dispatchEvent(new MoveFocusToNodeEvent(this.guid)),
        // focus on the first button
        () => this.moveFocusToFirstButton()
    ];

    setupCommandsAndShortcuts() {
        // TODO @W-9582167: Use addKeyboardShortcuts
        const keyboardCommands = {
            Tab: new TabCommand(() => this.handleTabCommand(false), false),
            Escape: new EscapeCommand(() => this.handleEscape())
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
        const shiftTabCommand = new TabCommand(() => this.handleTabCommand(true), true);
        setupKeyboardShortcutWithShiftKey(this.keyboardInteractions, shiftTabCommand, 'Tab');
    }

    renderedCallback() {
        if (this.moveFocusToMenu && !!this.firstButton()) {
            this.moveFocusToFirstButton();
            this.tabFocusRingIndex = TabFocusRingItems.Buttons;
        }
    }
}
