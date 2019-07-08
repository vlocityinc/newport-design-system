import { LightningElement, api } from 'lwc';
import {
    formatLhs,
    formatOperator,
    formatRhs
} from 'builder_platform_interaction/conditionListItemUtil';
import { DeleteListItemEvent } from 'builder_platform_interaction/events';
import { LABELS } from './conditionListItemLabels';

export default class ConditionListItem extends LightningElement {
    @api
    itemIndex;

    @api
    condition;

    @api
    deleteable;

    _lhsDataType;
    newCondition = true;

    get formattedLhs() {
        if (this.condition.leftHandSide.value) {
            const { displayText, dataType } = formatLhs(
                this.condition.leftHandSide.value
            );
            this.newCondition = false;
            this._lhsDataType = dataType;
            return displayText;
        }
        return LABELS.newCondition;
    }

    get formattedOperator() {
        return formatOperator(this.condition.operator.value);
    }

    get formattedRhs() {
        if (!this.newCondition) {
            const rhsText = formatRhs(
                this.condition.rightHandSide.value,
                this._lhsDataType
            );
            return rhsText;
        }
        return null;
    }

    handleDelete(event) {
        event.stopPropagation();
        const itemDeletedEvent = new DeleteListItemEvent(this.itemIndex);
        this.dispatchEvent(itemDeletedEvent);
    }
}
