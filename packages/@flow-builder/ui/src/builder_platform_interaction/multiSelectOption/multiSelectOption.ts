import { LightningElement, api } from 'lwc';
import { MultiSelectOptionEvent } from 'builder_platform_interaction/events';
export default class MultiSelectOption extends LightningElement {
    @api isSelected;

    @api isDefault;

    @api label;

    handleSelect() {
        this.isSelected = this.isSelected ? false : true;
        this.dispatchEvent(new MultiSelectOptionEvent(this.label, this.isDefault, this.isSelected));
    }
}
