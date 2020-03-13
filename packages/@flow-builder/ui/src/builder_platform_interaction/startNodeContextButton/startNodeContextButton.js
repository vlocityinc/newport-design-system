import { LightningElement, api } from 'lwc';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './startNodeContextButtonLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { EDIT_START_CONTEXT } from 'builder_platform_interaction/elementConfig';

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
                return !!this.node.container;
            default:
                return !!this.node.object;
        }
    }

    get objectLabel() {
        return LABELS.startElementObject;
    }

    get selectedObject() {
        return this.node.object;
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

    handleObjectClick = event => {
        event.stopPropagation();

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, EDIT_START_CONTEXT);
        this.dispatchEvent(editElementEvent);
    };
}
