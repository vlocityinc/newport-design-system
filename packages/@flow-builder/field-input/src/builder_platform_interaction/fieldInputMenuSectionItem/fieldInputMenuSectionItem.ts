import { ICON_SHAPE } from 'builder_platform_interaction/elementConfig';
import { newMenuSelectItemEvent } from 'builder_platform_interaction/fieldInputUtils';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
const { withKeyboardInteractions } = keyboardInteractionUtils;
const defaultComboboxItemClass = 'slds-media slds-media_center slds-col slds-listbox__option_entity slds-p-right_none';
const defaultIconContainerClass = 'slds-media__figure slds-listbox__option-icon';

export default class FieldInputMenuSectionItem extends withKeyboardInteractions(LightningElement) {
    @api item!: FieldInput.MenuItem;

    isHovering = false;

    // TODO: a11y support will be done as part of another PR
    getKeyboardInteractions() {
        return [];
    }

    get comboboxItemClass() {
        return this.isHovering ? `${defaultComboboxItemClass} slds-size_11-of-12` : defaultComboboxItemClass;
    }

    // TODO: refactor from alc
    get iconContainerClass() {
        return this.item.iconShape === ICON_SHAPE.DIAMOND
            ? `${defaultIconContainerClass} rotate-icon-container slds-icon-standard-decision`
            : defaultIconContainerClass;
    }

    // TODO: refactor from alc
    get iconClass() {
        const classes = this.item.iconBackgroundColor || '';
        return this.item.iconShape === ICON_SHAPE.DIAMOND ? `${classes} rotate-icon-svg` : classes;
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
     *
     * @param event TBD
     */
    handleItemClick(event) {
        event.preventDefault();
        event.stopPropagation();

        this.dispatchEvent(newMenuSelectItemEvent(this.item));
    }

    get hasNext() {
        return this.item.view != null;
    }

    /**
     * Indicate whether the item is expanded. Should be null if the item is not a parent.
     *
     * @returns value for aria-expanded
     */
    get expanded(): boolean | null {
        return this.hasNext ? false : null;
    }

    get description() {
        // TODO (W-11154930): replace with actual tooltip description
        return 'description for tooltip';
    }
}
