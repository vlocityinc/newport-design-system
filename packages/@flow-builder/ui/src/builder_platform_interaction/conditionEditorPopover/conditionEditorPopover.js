import { LightningElement, api } from 'lwc';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';

const LABELS = {};

export default class ConditionEditorPopover extends LightningElement {
    @api
    condition;

    @api
    handleDone;

    labels = LABELS;

    handleDoneEditing = event => {
        event.stopPropagation();

        this.handleDone(this.condition);
    };

    handleUpdateCondition = event => {
        event.stopPropagation();

        const newValue = event.detail.newValue;
        this.condition = updateProperties(this.condition, newValue);
    };
}
