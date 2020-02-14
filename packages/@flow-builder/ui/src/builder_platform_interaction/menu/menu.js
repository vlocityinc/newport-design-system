import { LightningElement, api } from 'lwc';
import { getStyle } from 'builder_platform_interaction/flowUtils';
import { SelectMenuItemEvent } from 'builder_platform_interaction/events';

export default class Menu extends LightningElement {
    @api top = null;
    @api left = null;
    @api items = null;

    get style() {
        return getStyle({ top: this.top + 10, left: this.left });
    }

    handleSelectItem(event) {
        this.dispatchEvent(new SelectMenuItemEvent({ value: event.detail.value }));
    }
}
