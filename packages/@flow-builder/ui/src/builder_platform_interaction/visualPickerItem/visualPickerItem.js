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

    handleChange(event) {
        event.stopPropagation();
        this.dispatchEvent(new VisualPickerItemChangedEvent(this.itemId, event.currentTarget.checked));
    }
}