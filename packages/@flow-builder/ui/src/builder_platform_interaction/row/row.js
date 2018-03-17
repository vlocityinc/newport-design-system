import {Element, api} from 'engine';
import {DeleteListItemEvent, UpdateListItemEvent} from 'builder_platform_interaction-events';

/**
 * Assignment Item List Row component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author hcockburn
 * @since 214
 */
export default class Row extends Element {
    @api itemIndex;
    @api itemPrefix;
    @api showPrefix;
    @api showDelete;

    get disableDelete() {
        return !this.showDelete;
    }

    handleRowContentsChanged(event) {
        const index = this.itemIndex;
        const propertyName = event.detail.propertyChanged;
        const value = event.detail.newValue;
        // TODO plz change the error from null to appropriate value coming from lower level component
        const itemUpdatedEvent = new UpdateListItemEvent(index, propertyName, value, null);
        this.dispatchEvent(itemUpdatedEvent);
    }

    handleDelete(event) {
        event.stopPropagation();
        const itemDeletedEvent = new DeleteListItemEvent(this.itemIndex);
        this.dispatchEvent(itemDeletedEvent);
    }
}
