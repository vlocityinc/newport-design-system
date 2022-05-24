import { ICON_SHAPE } from 'builder_platform_interaction/elementConfig';
import { FetchFieldInputMenuDataEvent } from 'builder_platform_interaction/events';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const { withKeyboardInteractions } = keyboardInteractionUtils;
const defaultComboboxItemClass = 'slds-media slds-media_center slds-col slds-listbox__option_entity slds-p-right_none';
const defaultIconContainerClass = 'slds-media__figure slds-listbox__option-icon';

export default class FieldInputMenuSection extends withKeyboardInteractions(LightningElement) {
    @api item;

    isHovering = false;

    // TODO: a11y support will be done as part of another PR
    getKeyboardInteractions() {
        return [];
    }

    get comboboxItemClass() {
        return this.isHovering ? `${defaultComboboxItemClass} slds-size_11-of-12` : defaultComboboxItemClass;
    }

    get iconContainerClass() {
        return this.item.iconShape === ICON_SHAPE.DIAMOND
            ? `${defaultIconContainerClass} rotate-icon-container slds-icon-standard-decision`
            : defaultIconContainerClass;
    }

    get iconClass() {
        const classes = this.item.iconBackgroundColor || '';
        return this.item.iconShape === ICON_SHAPE.DIAMOND ? `${classes} rotate-icon-svg` : classes;
    }

    /**
     * Indicate whether the item is expanded. Should be null if the item is not a parent.
     *
     * @returns value for aria-expanded
     */
    get expanded(): boolean | null {
        return this.item.hasNext ? false : null;
    }

    get description() {
        // TODO (W-11154930): replace with actual tooltip description
        return 'description for tooltip';
    }

    /**
     * Fires an event to display tooltip
     *
     * @param event - Event fired when mouse hovers row and info icon
     */
    handleMouseEnter = (event) => {
        event.stopPropagation();
        this.isHovering = true;
    };

    /**
     * Fires an event to remove tooltip
     *
     * @param event - Event fired when mouse leaves row
     */
    handleMouseLeave = (event) => {
        event.stopPropagation();
        this.isHovering = false;
    };

    /**
     * Fires an event to fetch the next level
     */
    handleSelect() {
        if (this.item.hasNext) {
            const fetchMenuDataEvent = new FetchFieldInputMenuDataEvent(this.item);
            this.dispatchEvent(fetchMenuDataEvent);
        }
    }
}
