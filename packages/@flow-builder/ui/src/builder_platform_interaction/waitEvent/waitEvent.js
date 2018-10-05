import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./waitEventLabels";
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getConditionsWithPrefixes, showDeleteCondition } from 'builder_platform_interaction/conditionListUtils';
import { RULE_TYPES, getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import {
    DeleteWaitEventEvent,
    WaitEventPropertyChangedEvent,
    WaitEventParameterChangedEvent,
} from 'builder_platform_interaction/events';

export default class WaitEvent extends LightningElement {
    labels = LABELS;

    conditionLogicOptions = [
        {value: CONDITION_LOGIC.NO_CONDITIONS, label: LABELS.alwaysWaitLabel},
        {value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel},
        {value: CONDITION_LOGIC.OR, label: LABELS.orConditionLogicLabel},
        {value: CONDITION_LOGIC.CUSTOM_LOGIC, label: LABELS.customLogicLabel},
    ];

    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.COMPARISON, this.elementTypeForExpressionBuilder);

    @track element;

    @api get waitEvent() {
        return this.element;
    }

    set waitEvent(waitEvent) {
        this.element = waitEvent;
    }

    @api showDelete;

    handleDelete(event) {
        event.stopPropagation();

        const deleteWaitEventEvent = new DeleteWaitEventEvent(this.element.guid);
        this.dispatchEvent(deleteWaitEventEvent);
    }

    handlePropertyChanged(event) {
        event.stopPropagation();

        const { propertyName, value, error, oldValue } = event.detail;
        const guid = this.element.guid;

        const waitEventPropertyChangedEvent = new WaitEventPropertyChangedEvent(propertyName, value, error, guid, oldValue);
        this.dispatchEvent(waitEventPropertyChangedEvent);

        // TODO: W-5454625 handle label description changes
    }

    handleParameterChanged(event) {
        event.stopPropagation();
        const waitEventParameterChanged = new WaitEventParameterChangedEvent(
            event.detail.name,
            event.detail.value,
            event.detail.valueDataType,
            event.detail.error,
            this.element.guid,
            event.detail.isInput,
            );
        if (event.detail.isInput) { // TODO W-5502328: Remove this once we implement output params translation
            this.dispatchEvent(waitEventParameterChanged);
        }
    }

    get upperCaseWaitConditionsTabText() {
        return LABELS.waitConditionsTabText.toUpperCase();
    }

    get upperCaseResumeConditionsTabText() {
        return LABELS.resumeConditionsTabText.toUpperCase();
    }

    get elementTypeForExpressionBuilder() {
        return ELEMENT_TYPE.WAIT;
    }

    get conditionsWithPrefixes() {
        return this.element.conditions && this.element.conditionLogic ? getConditionsWithPrefixes(this.element.conditionLogic, this.element.conditions) : [];
    }

    /**
     * Helper method needed for conditions list
     * @return {boolean} if delete should be shown for each condition
     */
    get showDeleteCondition() {
        return this.element.conditions && showDeleteCondition(this.element.conditions);
    }
}
