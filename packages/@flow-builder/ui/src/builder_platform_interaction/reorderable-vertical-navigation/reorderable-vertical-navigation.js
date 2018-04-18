import { Element, api } from 'engine';

const CLASS_ACTIVE = 'slds-vertical-tabs__nav-item slds-is-active';
const CLASS_INACTIVE = 'slds-vertical-tabs__nav-item';

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
    @api defaultLabel = '';
    @api menuItems = [];
    _activeItemId;

    get decoratedMenuItems() {
        return this.menuItems.map((element) => {
            const menuItem = {
                guid: element.guid,
                label: element.label.value !== '' ? element.label.value : this.defaultLabel,
                class: this.isItemActive(element.guid) ? CLASS_ACTIVE : CLASS_INACTIVE
            };
            return menuItem;
        });
    }

    @api set activeItemId(selectedItem) {
        this._activeItemId = selectedItem;
    }

    @api get activeItemId() {
        return this._activeItemId;
    }

    isItemActive(itemId) {
        return this._activeItemId && (itemId === this._activeItemId);
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