// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './startNodeContextButtonLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import {
    getConfigForElementType,
    EDIT_START_RECORD_CHANGE_CONTEXT,
    EDIT_START_SCHEDULE_CONTEXT,
    EDIT_START_JOURNEY_CONTEXT
} from 'builder_platform_interaction/elementConfig';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';

const { BEFORE_SAVE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY } = FLOW_TRIGGER_TYPE;

export default class startNodeContextButton extends LightningElement {
    @api
    node = {
        config: {}
    };

    getNodeConfig() {
        return getConfigForElementType(this.node.elementType).nodeConfig;
    }

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
            case SCHEDULED:
                item = getEntitiesMenuData().find(menuItem => menuItem.value === this.node.object);
                return item ? item.displayText : this.node.object;
            default:
                return this.node.object;
        }
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    get isConditions() {
        return this.node.filters.length > 0 ? true : false;
    }

    get recordConditionsLabel() {
        return LABELS.startElementRecordConditions;
    }

    get conditionsAppliedLabel() {
        return format(LABELS.startElementConditionsApplied, this.node.filters.length);
    }

    getContextMode() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
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

    handleObjectClick = event => {
        event.stopPropagation();

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, this.getContextMode());
        this.dispatchEvent(editElementEvent);
    };
}
