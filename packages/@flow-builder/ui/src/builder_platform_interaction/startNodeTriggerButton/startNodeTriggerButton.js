import { LightningElement, api } from 'lwc';
import { FLOW_TRIGGER_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent } from 'builder_platform_interaction/events';
const { BEFORE_SAVE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, CREATE_AND_UPDATE } = FLOW_TRIGGER_SAVE_TYPE;
import { LABELS } from './startNodeTriggerButtonLabels';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';

export default class startNodeTriggerButton extends LightningElement {
    @api
    node = {
        config: {}
    };

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get startButtonClasses() {
        return 'start-button-trigger-context slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get chooseSchedule() {
        switch (this.node.triggerType) {
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return LABELS.startElementSetSchedule;
            default:
                return '';
        }
    }

    get isSetTrigger() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_SAVE:
                return true;
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return !!this.node.startDate;
            default:
                return false;
        }
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    get selectedTriggerLabel() {
        if (this.isRecordChangeTrigger()) {
            switch (this.node.recordTriggerType) {
                case CREATE:
                    return LABELS.recordTriggerTypeCreated;
                case UPDATE:
                    return LABELS.recordTriggerTypeUpdated;
                case CREATE_AND_UPDATE:
                    return LABELS.recordTriggerTypeCreatedOrUpdated;
                default:
                    return '';
            }
        }
        return this.node.label;
    }

    get triggerLabel() {
        return this.isRecordChangeTrigger() ? LABELS.startElementTrigger : LABELS.startElementFlowStarts;
    }

    get triggerSize() {
        return this.isRecordChangeTrigger() ? 'trigger-label-size' : 'flow-starts-size';
    }

    get selectedTriggerSize() {
        return this.isRecordChangeTrigger()
            ? 'selected-trigger-label-size slds-truncate'
            : 'selected-flow-starts-size slds-truncate';
    }

    get runFlowLabel() {
        switch (this.node.triggerType) {
            case BEFORE_SAVE:
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
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return this.node.frequency;
            default:
                return '';
        }
    }

    isRecordChangeTrigger() {
        return this.node.triggerType === BEFORE_SAVE || this.node.triggerType === AFTER_SAVE;
    }

    getNodeConfig() {
        return getConfigForElementType(this.node.elementType).nodeConfig;
    }

    handleTriggerClick = event => {
        event.stopPropagation();

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, this.node.triggerType);
        this.dispatchEvent(editElementEvent);
    };
}
