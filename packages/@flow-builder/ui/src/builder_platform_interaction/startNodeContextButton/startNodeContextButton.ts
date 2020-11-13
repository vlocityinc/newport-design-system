// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './startNodeContextButtonLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import {
    EDIT_START_RECORD_CHANGE_CONTEXT,
    EDIT_START_SCHEDULE_CONTEXT,
    EDIT_START_JOURNEY_CONTEXT
} from 'builder_platform_interaction/elementConfig';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;
const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY } = FLOW_TRIGGER_TYPE;

export default class startNodeContextButton extends LightningElement {
    @api
    node = {
        config: {}
    };

    // Used for testing purposes
    @api
    keyboardInteractions;

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get startButtonClasses() {
        return 'start-button-trigger-context slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get chooseContext() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_SAVE:
                return LABELS.startElementChooseObject;
            case BEFORE_DELETE:
                return LABELS.startElementChooseObject;
            case SCHEDULED:
                return LABELS.startElementChooseObject;
            case SCHEDULED_JOURNEY:
                return LABELS.startElementChooseAudience;
            default:
                return '';
        }
    }

    get isOptional() {
        return this.node.triggerType === SCHEDULED ? true : false;
    }

    get optionalLabel() {
        return LABELS.startElementOptional;
    }

    get isContextSet() {
        switch (this.node.triggerType) {
            case SCHEDULED_JOURNEY:
                return !!this.node.objectContainer;
            default:
                return !!this.node.object;
        }
    }

    get objectLabel() {
        return LABELS.startElementObject;
    }

    get selectedObject() {
        let item = '';
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_SAVE:
            case BEFORE_DELETE:
            case SCHEDULED:
                item = getEntitiesMenuData().find((menuItem) => menuItem.value === this.node.object);
                return item ? item.displayText : this.node.object;
            default:
                return this.node.object;
        }
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    get isConditions() {
        return !!(this.node.filterLogic && this.node.filterLogic !== CONDITION_LOGIC.NO_CONDITIONS);
    }

    get recordConditionsLabel() {
        return LABELS.startElementRecordConditions;
    }

    get conditionsAppliedLabel() {
        return format(LABELS.startElementConditionsApplied, this.node.filters.length);
    }

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    getContextMode() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_DELETE:
            case BEFORE_SAVE:
                return EDIT_START_RECORD_CHANGE_CONTEXT;
            case SCHEDULED:
                return EDIT_START_SCHEDULE_CONTEXT;
            case SCHEDULED_JOURNEY:
                return EDIT_START_JOURNEY_CONTEXT;
            default:
                return null;
        }
    }

    handleObjectClick = (event) => {
        if (event) {
            event.stopPropagation();
        }

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, this.getContextMode());
        this.dispatchEvent(editElementEvent);
    };

    /**
     * Helper function to dispatch the ArrowKeyDownEvent event that'll be handled
     * in flcNodeStartMenu
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
        const arrowDownCommand = new ArrowDown(() => this.handleArrowKeyDown('arrowDown'));
        const arrowUpCommand = new ArrowUp(() => this.handleArrowKeyDown('arrowUp'));
        const enterCommand = new EnterCommand(() => this.handleSpaceOrEnter());
        const spaceCommand = new SpaceCommand(() => this.handleSpaceOrEnter());
        this.keyboardInteractions.setupCommandAndShortcut(enterCommand, { key: 'Enter' });
        this.keyboardInteractions.setupCommandAndShortcut(spaceCommand, { key: ' ' });
        this.keyboardInteractions.setupCommandAndShortcut(arrowDownCommand, { key: 'ArrowDown' });
        this.keyboardInteractions.setupCommandAndShortcut(arrowUpCommand, { key: 'ArrowUp' });
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }
}
