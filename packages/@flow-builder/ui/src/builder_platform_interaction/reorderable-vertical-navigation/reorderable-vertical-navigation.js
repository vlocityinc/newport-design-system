import { Element, api, track } from 'engine';

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
    @api initialMenuItems = [];

    @track activeItemId;
    @track menuItems = [];

    connectedCallback() {
        this.menuItems = this.initialMenuItems;
        this.activeItemId = this.initialActiveItemId;
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