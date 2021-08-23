import { LightningElement, api } from 'lwc';
import {
    FLOW_TRIGGER_TYPE,
    FLOW_PROCESS_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    CONDITION_LOGIC
} from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { LABELS } from './recordTriggerStartNodeLabels';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { setupKeyboardShortcutUtil } from 'builder_platform_interaction/contextualMenuUtils';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, CREATE_AND_UPDATE, DELETE } = FLOW_TRIGGER_SAVE_TYPE;

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    button: '.button'
};
export default class RecordTriggerStartNode extends LightningElement {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    node!: UI.Start;

    // Used for testing purposes
    @api
    keyboardInteractions;

    @api
    focus() {
        this.dom.button.focus();
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }

    get startButtonClasses() {
        return 'start-button-trigger-context slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    get selectedTriggerLabel() {
        switch (this.node.recordTriggerType) {
            case CREATE:
                return LABELS.recordTriggerTypeCreated;
            case UPDATE:
                return LABELS.recordTriggerTypeUpdated;
            case CREATE_AND_UPDATE:
                return LABELS.recordTriggerTypeCreatedOrUpdated;
            case DELETE:
                return LABELS.recordTriggerTypeDeleted;
            default:
                return '';
        }
    }

    get triggerLabel() {
        return LABELS.startElementTrigger;
    }

    get optimizeForLabel() {
        return LABELS.startElementOptimizeFor;
    }

    get selectedOptimizeForLabel() {
        switch (this.node.triggerType) {
            case BEFORE_SAVE:
                return LABELS.recordChangeTriggerTypeBeforeSave;
            case AFTER_SAVE:
                return LABELS.recordChangeTriggerTypeAfterSave;
            case BEFORE_DELETE:
                return LABELS.triggerTypeBeforeDelete;
            default:
                return '';
        }
    }

    get objectLabel() {
        return LABELS.startElementObject;
    }

    get recordConditionsLabel() {
        return LABELS.startElementRecordConditions;
    }

    get conditionsLengthLabel() {
        return this.node.filters!.length;
    }

    get isConditions() {
        return !!(this.node.filterLogic && this.node.filterLogic !== CONDITION_LOGIC.NO_CONDITIONS);
    }

    get selectedObject() {
        const item = getEntitiesMenuData().find((menuItem) => menuItem.value === this.node.object);
        return item ? item.displayText : this.node.object;
    }

    get showFlowTriggerType() {
        return getProcessType() !== FLOW_PROCESS_TYPE.ORCHESTRATOR;
    }

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    handleTriggerClick = (event?: Event) => {
        if (event) {
            event.stopPropagation();
        }

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, this.node.triggerType);
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
     * Helper function used during keyboard command
     */
    handleSpaceOrEnter() {
        this.handleTriggerClick();
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
}
