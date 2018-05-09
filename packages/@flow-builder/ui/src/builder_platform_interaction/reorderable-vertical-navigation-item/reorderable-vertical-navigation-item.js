import { Element, api } from 'engine';
const LINK_ARIA_SELECTED_ACTIVE = 'true';
const LINK_ARIA_SELECTED_INACTIVE = 'false';

/**
 * Component that provides the items to be included in
 * a vertical navigation component like ReorderableVerticalNavigation
 */
export default class ReorderableVerticalNavigationItem extends Element {
    @api label;
    @api navItemId;
    @api activeId;
    @api hasFrontIcon = false;
    @api hasEndIcon = false;
    @api isDraggable = false;

    get ariaSelected() {
        return this.isActive() ? LINK_ARIA_SELECTED_ACTIVE : LINK_ARIA_SELECTED_INACTIVE;
    }

    handleClick(event) {
        event.preventDefault();

        if (this.isActive()) {
            return;
        }

        const itemClickedEvent = new CustomEvent('itemclicked', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                itemId: this.navItemId
            }
        });
        this.dispatchEvent(itemClickedEvent);
    }

    isActive() {
        return this.activeId === this.navItemId;
    }
}