import { FLOW_TRIGGER_SAVE_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getEventTypes, MANAGED_SETUP } from 'builder_platform_interaction/sobjectLib';
import StartNodeButton from 'builder_platform_interaction/startNodeButton';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { LABELS } from './startNodeTriggerButtonLabels';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY, PLATFORM_EVENT } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, CREATE_AND_UPDATE, DELETE } = FLOW_TRIGGER_SAVE_TYPE;

export default class StartNodeTriggerButton extends StartNodeButton {
    get chooseScheduleOrEvent() {
        switch (this.node.triggerType) {
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return LABELS.startElementSetSchedule;
            case PLATFORM_EVENT:
                return LABELS.startElementAddEvent;
            default:
                return '';
        }
    }

    get isSetTrigger() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_DELETE:
            case BEFORE_SAVE:
                return true;
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return !!this.node.startDate;
            case PLATFORM_EVENT:
                return !!this.node.object;
            default:
                return false;
        }
    }

    get selectedTriggerLabel() {
        // Record Change
        if (isRecordChangeTriggerType(this.node.triggerType)) {
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
        // Platform Event
        if (this.node.triggerType === PLATFORM_EVENT) {
            const item = getEventTypes(MANAGED_SETUP).find(
                (menuItem) => menuItem.qualifiedApiName === this.node.object
            );
            return item ? item.label : this.node.object;
        }
        // Scheduled Flow
        return this.node.label;
    }

    get triggerLabel() {
        return isRecordChangeTriggerType(this.node.triggerType)
            ? LABELS.startElementTrigger
            : this.node.triggerType === PLATFORM_EVENT
            ? LABELS.startElementEvent
            : LABELS.startElementFlowStarts;
    }

    get isPlatformEvent() {
        return this.node.triggerType === PLATFORM_EVENT;
    }

    get runFlowLabel() {
        switch (this.node.triggerType) {
            case BEFORE_SAVE:
            case BEFORE_DELETE:
            case AFTER_SAVE:
                return LABELS.startElementRunFlow;
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return LABELS.startElementFrequency;
            default:
                return '';
        }
    }

    get selectedRunFlowLabel() {
        switch (this.node.triggerType) {
            case BEFORE_SAVE:
                return LABELS.triggerTypeBeforeSave;
            case AFTER_SAVE:
                return LABELS.triggerTypeAfterSave;
            case BEFORE_DELETE:
                return LABELS.triggerTypeBeforeDelete;
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return this.node.frequency;
            default:
                return '';
        }
    }
}
