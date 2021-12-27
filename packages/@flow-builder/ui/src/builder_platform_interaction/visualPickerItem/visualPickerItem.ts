// @ts-nocheck
import { sanitizeBoolean } from 'builder_platform_interaction/commonUtils';
import { VisualPickerItemChangedEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';

export default class VisualPickerItem extends LightningElement {
    _focusOnRerendering = false;
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
    @api
    get focusOnRerendering() {
        return this._focusOnRerendering;
    }
    set focusOnRerendering(val) {
        this._focusOnRerendering = sanitizeBoolean(val);
    }

    renderedCallback() {
        const inputSelector = this.template.querySelector('input');
        if (inputSelector && this.isSelected && this._focusOnRerendering) {
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
