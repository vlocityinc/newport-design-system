import { LightningElement, api } from 'lwc';
import { AddListItemEvent } from 'builder_platform_interaction/events';
import { format } from 'builder_platform_interaction/commonUtils';

/**
 * Assignment Item List component for flow builder.
 * @ScrumTeam Process UI
 * @author hcockburn
 * @since 214
 */
export default class List extends LightningElement {
    @api items = [];
    @api showDelete;
    @api addLabel;

    // maximum number of items allowed
    @api
    maxItems;

    @api
    maxItemsLabel;

    handleAddClicked(event) {
        event.preventDefault();
        const index = this.items.length;
        const itemAddedEvent = new AddListItemEvent(index);
        this.dispatchEvent(itemAddedEvent);
    }

    get hasMaxItems() {
        if (this.maxItems != null) {
            return this.items.length >= this.maxItems;
        }

        return false;
    }

    get maxItemsHelpText() {
        return this.maxItemsLabel
            ? format(this.maxItemsLabel, this.maxItems)
            : '';
    }
}
