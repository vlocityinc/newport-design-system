import AlcNodeMenu from 'builder_platform_interaction/alcNodeMenu';
import { api } from 'lwc';
import { commands, lwcUtils, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import {
    MoveFocusToNodeEvent,
    CloseMenuEvent,
    MoveFocusFromEmptyStartNodeEvent
} from 'builder_platform_interaction/alcEvents';

const { EnterCommand, SpaceCommand, EscapeCommand, TabCommand } = commands;
const { Keys, createShortcutKey, createShortcut, BaseKeyboardInteraction } = keyboardInteractionUtils;

const selectors = {
    triggerButton: 'builder_platform_interaction-start-node-trigger-button',
    contextButton: 'builder_platform_interaction-start-node-context-button',
    scheduledPathButton: 'builder_platform_interaction-start-node-scheduled-path-button',
    recordTriggerButton: 'builder_platform_interaction-record-trigger-start-node',
    flowExplorerOpenButton: 'builder_platform_interaction-start-node-flow-explorer-entry-point'
};

enum TabFocusRingItems {
    Icon = 0,
    Buttons = 1
}

export default class AlcStartMenu extends AlcNodeMenu {
    dom = lwcUtils.createDomProxy(this, selectors);

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

    getKeyboardInteractions() {
        return [
            new BaseKeyboardInteraction([
                createShortcut(Keys.Enter, new EnterCommand(() => this.handleSpaceOrEnter())),
                createShortcut(Keys.Space, new SpaceCommand(() => this.handleSpaceOrEnter())),
                createShortcut(Keys.Escape, new EscapeCommand(() => this.handleEscape()))
            ])
        ];
    }

    @api
    moveFocus = () => {
        const { triggerButton, contextButton, scheduledPathButton, recordTriggerButton } = this.dom;
        if (!triggerButton && !contextButton && !scheduledPathButton && !recordTriggerButton) {
            // close the menu when there's no rows in the menu
            this.dispatchEvent(new CloseMenuEvent());
            // Moving focus to the next valid connector/element/zoom panel as needed
            this.dispatchEvent(new MoveFocusFromEmptyStartNodeEvent(this.guid));
        } else {
            // move focus to the first row item
            this.tabFocusRingIndex = TabFocusRingItems.Icon;
            this.handleTabCommand(false);
        }
    };

    constructor() {
        super();
        this.tabFocusRingIndex = TabFocusRingItems.Icon;
    }

    firstButton() {
        const { triggerButton, recordTriggerButton } = this.dom;
        return this.isRecordTriggeredFlow ? recordTriggerButton : triggerButton;
    }

    moveFocusToFirstButton() {
        this.firstButton().focus();
    }

    moveFocusToButton = (key, nextButton, prevButton) => {
        let nextFocusElement;
        // The focus should move from trigger button -> context button -> scheduled path button -> trigger button
        // Or for record-triggered flow: record trigger button -> scheduled path button -> flow explorer open button -> record trigger button
        if (key === Keys.ArrowDown) {
            nextFocusElement = nextButton || prevButton;
        }
        // The focus should move from trigger button -> scheduled path button -> context button  -> trigger button
        // Or for record-triggered flow: record trigger button -> flow explorer open button -> scheduled path button -> record trigger button
        if (key === Keys.ArrowUp) {
            nextFocusElement = prevButton || nextButton;
        }

        // Moving focus to the next button if needed
        if (nextFocusElement) {
            nextFocusElement.focus();
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
        const { contextButton, scheduledPathButton } = this.dom;

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
        const { triggerButton, scheduledPathButton } = this.dom;

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
        const { triggerButton, contextButton, recordTriggerButton, flowExplorerOpenButton } = this.dom;

        const nextButton = this.isRecordTriggeredFlow ? flowExplorerOpenButton : triggerButton;
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
        const { scheduledPathButton, flowExplorerOpenButton } = this.dom;

        this.moveFocusToButton(event.detail.key, scheduledPathButton, flowExplorerOpenButton);
    };

    /**
     * Handles the ArrowKeyDownEvent coming from flow explorer open button and moves the focus correctly
     * based on the arrow key pressed
     *
     * @param event - ArrowKeyDownEvent coming from start-node-flow-explorer-entry-point
     */
    handleFlowExplorerOpenButtonArrowKeyDown = (event) => {
        event.stopPropagation();
        const { scheduledPathButton, recordTriggerButton } = this.dom;

        this.moveFocusToButton(event.detail.key, recordTriggerButton, scheduledPathButton);
    };

    /**
     * When we receive an EditElementEvent, if we want to focus on the element to be edited
     * then moveFocusToMenu must be false or it will not focus on the element properly
     *
     * @param event - The EditElementEvent event
     */
    handleEditElement(event) {
        if (event.detail.designateFocus) {
            this.moveFocusToMenu = false;
        }
    }

    tabFocusRingCmds = [
        // focus on the icon
        () => this.dispatchEvent(new MoveFocusToNodeEvent(this.guid)),
        // focus on the first button
        () => this.moveFocusToFirstButton()
    ];

    setupCommandsAndShortcuts() {
        this.keyboardInteractions.registerShortcuts([
            createShortcut(Keys.Tab, new TabCommand(() => this.handleTabCommand(false), false)),
            createShortcut(createShortcutKey(Keys.Tab, true), new TabCommand(() => this.handleTabCommand(true), true))
        ]);
    }

    renderedCallback() {
        if (this.moveFocusToMenu && !!this.firstButton()) {
            this.moveFocusToFirstButton();
            this.tabFocusRingIndex = TabFocusRingItems.Buttons;
        }
    }
}
