import { EditElementEvent } from 'builder_platform_interaction/events';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import {
    CONDITION_LOGIC,
    FLOW_PROCESS_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    FLOW_TRIGGER_TYPE
} from 'builder_platform_interaction/flowMetadata';
import StartNodeButton from 'builder_platform_interaction/startNodeButton';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { api } from 'lwc';
import { LABELS } from './recordTriggerStartNodeLabels';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, CREATE_AND_UPDATE, DELETE } = FLOW_TRIGGER_SAVE_TYPE;

export default class RecordTriggerStartNode extends StartNodeButton {
    @api
    disableEditElements;

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

    override createEditElementEvent(): EditElementEvent {
        return new EditElementEvent(this.node.guid, this.node.triggerType, undefined, true);
    }
}
