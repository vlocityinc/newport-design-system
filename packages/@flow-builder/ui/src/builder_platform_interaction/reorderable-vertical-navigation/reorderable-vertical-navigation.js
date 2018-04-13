import {Element, api, track} from 'engine';

/**
 * Component that provides a vertical list of elements, styled as vertical tabs,
 * that can be selected and reordered.
 *
 * The the menu items must include the following properties:
 * {
 *      guid: "GUIDString",
 *      label: "LabelString"
 * }
 */
export default class ReorderableVerticalNavigation extends Element {
    @track activeItemId;
    @track menuItems = [];
    @api defaultLabel = '';

    initialItems = [];
    @api set initialMenuItems(initialMenuItems) {
        this.initialItems = initialMenuItems;

        this.menuItems = this.initialMenuItems.map((element) => {
            const menuItem = {
                guid: element.guid,
                label: element.label.value !== '' ? element.label.value : this.defaultLabel,
            };

            return menuItem;
        });
    }

    @api get initialMenuItems() {
        return this.initialItems;
    }

    @api set initialActiveItemId(initialItem) {
        this.activeItemId = initialItem;
    }

    @api get initialActiveItemId() {
        return this.activeItemId;
    }

    handleItemClicked(event) {
        event.stopPropagation();
        this.activeItemId = event.detail.itemId;
        const itemSelectedEvent = new CustomEvent('itemselected', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                itemId: this.activeItemId
            }
        });
        this.dispatchEvent(itemSelectedEvent);
    }
}