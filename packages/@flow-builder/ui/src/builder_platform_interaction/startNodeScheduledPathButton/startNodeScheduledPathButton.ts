// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './startNodeScheduledPathButtonLabels';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { EDIT_START_SCHEDULED_PATHS } from 'builder_platform_interaction/elementConfig';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { setupKeyboardShortcutUtil } from 'builder_platform_interaction/contextualMenuUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

export default class StartNodeScheduledPathButton extends LightningElement {
    @api
    node = {
        config: {}
    };

    // Used for testing purposes
    @api
    keyboardInteractions;

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium slds-truncate';
    }

    get startButtonClasses() {
        return 'start-button-scheduled-path slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get addScheduledPathsLabel() {
        return LABELS.startElementAddScheduledPathsLabel;
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    get hasScheduledPaths() {
        return this.node.childReferences && this.node.childReferences.length > 0;
    }

    get scheduledPathsLabel() {
        return LABELS.startElementScheduledPaths;
    }

    get scheduledPathsAmount() {
        return this.node.childReferences.length + 1;
    }

    get scheduledPathsTitle() {
        return format(LABELS.startElementScheduledPathsTitle, this.node.childReferences.length + 1);
    }

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    handleObjectClick = (event) => {
        if (event) {
            event.stopPropagation();
        }

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, EDIT_START_SCHEDULED_PATHS);
        this.dispatchEvent(editElementEvent);
    };

    /**
     * Helper function to dispatch the ArrowKeyDownEvent event that'll be handled
     * in alcStartMenu
     *
     * @param key - The arrow key pressed
     */
    handleArrowKeyDown(key) {
        const arrowKeyDownEvent = new ArrowKeyDownEvent(key);
        this.dispatchEvent(arrowKeyDownEvent);
    }

    /**
     * Helper function used during keyboard commands
     */
    handleSpaceOrEnter() {
        this.handleObjectClick();
    }

    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Enter: new EnterCommand(() => this.handleSpaceOrEnter()),
            ' ': new SpaceCommand(() => this.handleSpaceOrEnter()),
            ArrowDown: new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME))
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }
}
