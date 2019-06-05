import { LightningElement, api } from 'lwc';
import { UpdateConditionEvent, UpdateConditionLogicEvent, AddConditionEvent } from "builder_platform_interaction/events";
import { getConditionsWithPrefixes, showDeleteCondition } from 'builder_platform_interaction/conditionListUtils';
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { showPopover, hidePopover } from 'builder_platform_interaction/builderUtils';

import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';

import { LABELS } from './componentVisibilityLabels';

// TODO:
// const MAX_CONDITIONS = 10;

export default class ComponentVisibility extends LightningElement {
    labels = LABELS;

    @api guid;
    @api visibility;

    conditionLogicOptions = [
        { value: CONDITION_LOGIC.NO_CONDITIONS, label: this.labels.noConditionsLabel },
        { value: CONDITION_LOGIC.AND, label: this.labels.andConditionLogicLabel },
        { value: CONDITION_LOGIC.OR, label: this.labels.orConditionLogicLabel },
        { value: CONDITION_LOGIC.CUSTOM_LOGIC, label: this.labels.customConditionLogicLabel }
    ];

    get conditionLogic() {
        return this.visibility.conditionLogic;
    }

    get conditionsWithPrefixes() {
        const { conditions, conditionLogic } = this.visibility;
        return getConditionsWithPrefixes(conditionLogic, conditions);
    }

    get showDeleteCondition() {
        return showDeleteCondition(this.visibility.conditions);
    }

    get showConditions() {
        return this.visibility.conditionLogic.value !== CONDITION_LOGIC.NO_CONDITIONS;
    }

    handleDeleteCondition = () => {
        if (this.visibility.conditions.length === 1) {
            this.dispatchEvent(new UpdateConditionLogicEvent(this.guid, CONDITION_LOGIC.NO_CONDITIONS));
        }

        hidePopover();
    };

    handleAddCondition = event => {
        // if the last condition is new, don't allow adding another one
        if (this.isLastConditionNew()) {
            event.stopPropagation();
        }

        hidePopover();
    };

    handlePropertyChanged = event => {
        event.stopPropagation();

        const { conditions } = this.visibility;
        const conditionLogic = event.detail.value;

        if (conditionLogic !== CONDITION_LOGIC.NO_CONDITIONS && conditions.length === 0) {
            this.dispatchEvent(new AddConditionEvent(this.guid));
        }

        this.dispatchEvent(new UpdateConditionLogicEvent(this.guid, conditionLogic));
        hidePopover();
    };

    isLastConditionNew() {
        const { conditions } = this.visibility;
        const lastCondition = conditions.length > 0 ? conditions[conditions.length - 1] : null;
        return lastCondition && this.isConditionNew(lastCondition);
    }

    renderedCallback() {
        // show the popover when the last condition is new
        if (this.isLastConditionNew()) {
            this.showVisibilityConditionPopover(this.visibility.conditions.length - 1);
        }
    }

    handleClickCondition = event => {
        event.stopPropagation();

        const index = parseInt(event.currentTarget.dataset.index, 10);
        this.showVisibilityConditionPopover(index);
    };

    handleDone = (index, condition) => {
        const { leftHandSide, operator, rightHandSide } = condition;
        const hasError = leftHandSide.error || operator.error || rightHandSide.error;

        if (!hasError) {
            this.dispatchEvent(new UpdateConditionEvent(this.guid, index, condition));
            hidePopover();
        }
    };

    handleCancelPopover = index => {
        const condition = this.visibility.conditions[index];

        if (this.isConditionNew(condition)) {
            this.deleteCondition(index);
        }

        hidePopover();
    };

    isConditionNew = condition => condition[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value === '';

    showPopover(/* referenceElement, cmpName, cmpProps, itemIndex */) {
        showPopover('builder_platform_interaction:conditionEditorPopover', {}, { referenceElement : null });
    }

    showVisibilityConditionPopover(/* index */) {
        showPopover('builder_platform_interaction:conditionEditorPopover', {}, { referenceElement : null });

        /*
        const condition = this.visibility.conditions[index];
        const cmpName = 'builder_platform_interaction:conditionVisibilityPopoverContent';
        const cmpProps = {
            containerElement: ELEMENT_TYPE.DECISION,
            rules: this.rules,
            expression: condition,
            defaultOperator: RULE_OPERATOR.EQUAL_TO,
            operatorPlaceholder: this.operatorPlaceholder,
            useVerticalLayout: true,
            handleDone: cond => this.handleDone(index, cond)
        };

        const referenceElement = this.template.querySelector(`.slds-list__item:nth-child(${index + 1}) builder_platform_interaction-condition-list-item`);
        popoverUtils.showPopover(referenceElement, cmpName, cmpProps, {
            direction: 'west',
            closeOnClickOut: true,
            showCloseButton: false,
            onClose: () => this.handleCancelPopover(index)
        });
        */
    }
}
