import {
    EDIT_START_JOURNEY_CONTEXT,
    EDIT_START_RECORD_CHANGE_CONTEXT,
    EDIT_START_SCHEDULE_CONTEXT
} from 'builder_platform_interaction/elementConfig';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import StartNodeButton from 'builder_platform_interaction/startNodeButton';
import { LABELS } from './startNodeContextButtonLabels';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY } = FLOW_TRIGGER_TYPE;

export default class StartNodeContextButton extends StartNodeButton {
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
        return this.node.triggerType === SCHEDULED;
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
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_SAVE:
            case BEFORE_DELETE:
            case SCHEDULED: {
                const item = getEntitiesMenuData().find((menuItem) => menuItem.value === this.node.object);
                return item ? item.displayText : this.node.object;
            }
            default:
                return this.node.object;
        }
    }

    get isConditions() {
        return !!(this.node.filterLogic && this.node.filterLogic !== CONDITION_LOGIC.NO_CONDITIONS);
    }

    get recordConditionsLabel() {
        return LABELS.startElementRecordConditions;
    }

    get conditionsLengthLabel() {
        return this.node.filters?.length;
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
                return undefined;
        }
    }

    override createEditElementEvent(): EditElementEvent {
        return new EditElementEvent(this.node.guid, this.getContextMode(), undefined, true);
    }
}
