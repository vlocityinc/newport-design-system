import { LightningElement, api } from 'lwc';

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
export default class ReorderableVerticalNavigation extends LightningElement {
    @api defaultLabel = '';
    @api hideFooter = false;

    /**
     * @typedef MenuItem
     * @type {Object}
     * @property {Object} element
     * @property {boolean} isDraggable
     * @property {boolean} hasErrors
     */

    /**
     * @type {MenuItem[]}
     */
    @api menuItems = [];

    _activeItemId;

    get decoratedMenuItems() {
        return this.menuItems.map(menuItem => {
            const { element, label, isDraggable, hasErrors } = menuItem;
            return {
                guid: element.guid,
                label: label !== '' ? label : this.defaultLabel,
                isDraggable,
                hasErrors
            };
        });
    }

    set activeItemId(selectedItem) {
        this._activeItemId = selectedItem;
    }

    @api get activeItemId() {
        return this._activeItemId;
    }

    isItemActive(itemId) {
        return itemId === this._activeItemId;
    }

    handleItemClicked(event) {
        event.stopPropagation();
        this._activeItemId = event.detail.itemId;
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
