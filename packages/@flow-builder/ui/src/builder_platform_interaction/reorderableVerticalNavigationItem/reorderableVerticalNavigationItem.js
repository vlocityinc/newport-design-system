import { LightningElement, api } from 'lwc';
const LINK_ARIA_SELECTED_ACTIVE = 'true';
const LINK_ARIA_SELECTED_INACTIVE = 'false';

const CLASS_ACTIVE = 'slds-vertical-tabs__nav-item slds-is-active';
const CLASS_INACTIVE = 'slds-vertical-tabs__nav-item';

/**
 * Component that provides the items to be included in
 * a vertical navigation component like ReorderableVerticalNavigation
 */
export default class ReorderableVerticalNavigationItem extends LightningElement {
    @api label;
    @api navItemId;
    @api activeId;
    @api hasFrontIcon = false;
    @api hasEndIcon = false;
    @api isDraggable = false;

    get ariaSelected() {
        return this.isActive()
            ? LINK_ARIA_SELECTED_ACTIVE
            : LINK_ARIA_SELECTED_INACTIVE;
    }

    get itemClass() {
        return this.isActive() ? CLASS_ACTIVE : CLASS_INACTIVE;
    }

    // In FireFox the dragstart happens only for the anchor element;
    // we need to specifically call the handler from the draggable element
    handleDragStart(event) {
        const draggableElement = this.template.querySelector(
            'builder_platform_interaction-draggable'
        );
        draggableElement.handleDragStart(event);
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
