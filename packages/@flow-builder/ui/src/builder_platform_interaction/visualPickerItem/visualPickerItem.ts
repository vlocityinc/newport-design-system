// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { VisualPickerItemChangedEvent } from 'builder_platform_interaction/events';

export default class VisualPickerItem extends LightningElement {
    @api
    isSelected;
    @api
    iconName;
    @api
    label;
    @api
    description;
    @api
    itemId;
    @api
    radioGroupName;

    renderedCallback() {
        const inputSelector = this.template.querySelector('input');
        if (inputSelector && this.isSelected) {
            inputSelector.focus();
        }
    }

    handleChange(event) {
        event.stopPropagation();
        this.dispatchEvent(new VisualPickerItemChangedEvent(this.itemId, event.currentTarget.checked));
    }

    /** when no icon provided, hide the whole icon section including border */
    get itemClasses() {
        return this.iconName
            ? 'slds-media__body slds-border_left slds-p-left_small'
            : 'slds-media__body slds-p-left_small';
    }
}
