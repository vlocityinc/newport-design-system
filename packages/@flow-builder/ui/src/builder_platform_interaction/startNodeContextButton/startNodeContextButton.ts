import LAST_PUBLISH_DATETIME_FIELD from '@salesforce/schema/MarketSegment.LastPublishStatusDateTime';
import COUNT_FIELD from '@salesforce/schema/MarketSegment.LastSegmentMemberCount';
import NAME_FIELD from '@salesforce/schema/MarketSegment.Name';
import {
    EDIT_SEGMENT_CONTEXT,
    EDIT_START_JOURNEY_CONTEXT,
    EDIT_START_SCHEDULE_CONTEXT
} from 'builder_platform_interaction/elementConfig';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import StartNodeButton from 'builder_platform_interaction/startNodeButton';
import { isSegment } from 'builder_platform_interaction/triggerTypeLib';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import { wire } from 'lwc';
import { LABELS } from './startNodeContextButtonLabels';

const fields = [NAME_FIELD, LAST_PUBLISH_DATETIME_FIELD, COUNT_FIELD];

const { SCHEDULED, SCHEDULED_JOURNEY, SEGMENT } = FLOW_TRIGGER_TYPE;

export default class StartNodeContextButton extends StartNodeButton {
    labels = LABELS;

    get chooseContext() {
        switch (this.node.triggerType) {
            case SCHEDULED:
                return this.labels.startElementChooseObject;
            case SCHEDULED_JOURNEY:
                return this.labels.startElementChooseAudience;
            case SEGMENT:
                return this.labels.startElementChooseSegment;
            default:
                return '';
        }
    }

    @wire(getRecord, { recordId: '$segmentId', fields })
    segment;

    get segmentId() {
        return this.node.segment;
    }

    get isOptional() {
        return this.node.triggerType === SCHEDULED;
    }

    get optionalLabel() {
        return this.labels.startElementOptional;
    }

    get isContextSet() {
        switch (this.node.triggerType) {
            case SCHEDULED_JOURNEY:
                return !!this.node.objectContainer;
            case SEGMENT:
                return !!this.segmentId;
            default:
                return !!this.node.object;
        }
    }

    get isSegment() {
        return isSegment(this.node.triggerType);
    }

    get objectLabel() {
        if (this.isSegment) {
            return this.labels.segmentName;
        }
        return this.labels.startElementObject;
    }

    get selectedObject() {
        switch (this.node.triggerType) {
            case SCHEDULED: {
                const item = getEntitiesMenuData().find((menuItem) => menuItem.value === this.node.object);
                return item ? item.displayText : this.node.object;
            }
            case SEGMENT: {
                return getFieldValue(this.segment.data, NAME_FIELD);
            }
            default:
                return this.node.object;
        }
    }

    get isConditions() {
        return !!(this.node.filterLogic && this.node.filterLogic !== CONDITION_LOGIC.NO_CONDITIONS);
    }

    get recordConditionsLabel() {
        return this.labels.startElementRecordConditions;
    }

    get conditionsLengthLabel() {
        return this.node.filters?.length;
    }

    get segmentPopulation() {
        return getFieldValue(this.segment.data, COUNT_FIELD) || 0;
    }

    get segmentLastPublishDate() {
        return getFieldValue(this.segment.data, LAST_PUBLISH_DATETIME_FIELD);
    }

    getContextMode() {
        switch (this.node.triggerType) {
            case SCHEDULED:
                return EDIT_START_SCHEDULE_CONTEXT;
            case SCHEDULED_JOURNEY:
                return EDIT_START_JOURNEY_CONTEXT;
            case SEGMENT:
                return EDIT_SEGMENT_CONTEXT;
            default:
                return undefined;
        }
    }

    override createEditElementEvent(): EditElementEvent {
        return new EditElementEvent(this.node.guid, this.getContextMode(), undefined, true);
    }
}
