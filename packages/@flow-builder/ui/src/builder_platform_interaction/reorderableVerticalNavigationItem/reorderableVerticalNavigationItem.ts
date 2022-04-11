import { ListItemInteractionEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';

const LINK_ARIA_SELECTED_ACTIVE = 'true';
const LINK_ARIA_SELECTED_INACTIVE = 'false';

const CLASS_ACTIVE = 'slds-vertical-tabs__nav-item slds-m-right_none slds-is-active';
const CLASS_INACTIVE = 'slds-vertical-tabs__nav-item slds-m-right_none';

/**
 * Component that provides the items to be included in
 * a vertical navigation component like ReorderableVerticalNavigation
 */
export default class ReorderableVerticalNavigationItem extends LightningElement {
    @api label;
    @api navItemId;
    @api activeId;
    @api focusId;
    @api hasFrontIcon = false;
    @api hasEndIcon = false;
    @api isDraggable = false;

    isActive() {
        return this.activeId === this.navItemId;
    }

    isFocused() {
        return this.focusId === this.navItemId;
    }

    // @ts-ignore TODO: remove me
    get ariaSelected() {
        return this.isActive() ? LINK_ARIA_SELECTED_ACTIVE : LINK_ARIA_SELECTED_INACTIVE;
    }

    get itemClass() {
        return this.isActive() ? CLASS_ACTIVE : CLASS_INACTIVE;
    }

    get itemTabIndex() {
        return this.focusId ? (this.isFocused() ? 0 : -1) : this.isActive() ? 0 : -1;
    }

    handleClick() {
        const itemClickedEvent = new ListItemInteractionEvent(this.navItemId, ListItemInteractionEvent.Type.Click);
        this.dispatchEvent(itemClickedEvent);
    }

    handleBlur(event) {
        event.stopPropagation();
        const itemBlurEvent = new ListItemInteractionEvent(this.navItemId, ListItemInteractionEvent.Type.Blur);
        this.dispatchEvent(itemBlurEvent);
    }

    @api
    focus() {
        this.template.querySelector<HTMLElement>('.slds-vertical-tabs__nav-item')?.focus();
    }
}
