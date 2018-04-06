import {Element, api, track} from 'engine';

/**
 * Component that provides a vertical list of elements, styled as vertical tabs,
 * that can be selected and reordered.
 *
 * The the menu items must include the following properties:
 * {
 *      guid: {value: "SomeString", error: null},
 *      label: {value: "SomeString", error: null}
 * }
 */
export default class ReorderableVerticalNavigation extends Element {
    @api initialActiveItemId;

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

        this.activeItemId = this.initialActiveItemId;
    }

    @api get initialMenuItems() {
        return this.initialItems;
    }

    @api defaultLabel = '';

    @track activeItemId;
    @track menuItems = [];

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