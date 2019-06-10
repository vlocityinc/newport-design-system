import { LightningElement, api } from 'lwc';
import {
    DeleteListItemEvent,
    UpdateListItemEvent
} from 'builder_platform_interaction/events';
import deleteRowAlternativeText from '@salesforce/label/FlowBuilderRows.deleteRowAlternativeText';

/**
 * Assignment Item List Row component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author hcockburn
 * @since 214
 */
export default class Row extends LightningElement {
    @api itemIndex;
    @api itemPrefix;
    @api showPrefix;
    @api showDelete;

    get disableDelete() {
        return !this.showDelete;
    }

    get deleteAlternativeText() {
        return deleteRowAlternativeText;
    }

    get rowContentsClass() {
        let contentsClass =
            'slds-grid slds-grid_horizontal slds-grid_vertical-align-start slds-gutters slds-gutters_xx-small';
        if (this.showPrefix) {
            contentsClass = 'slds-m-left_x-large ' + contentsClass;
        }
        return contentsClass;
    }

    handleRowContentsChanged(event) {
        const index = this.itemIndex;
        const value = event.detail.newValue;
        const itemUpdatedEvent = new UpdateListItemEvent(index, value);
        this.dispatchEvent(itemUpdatedEvent);
    }

    handleDelete(event) {
        event.stopPropagation();
        const itemDeletedEvent = new DeleteListItemEvent(this.itemIndex);
        this.dispatchEvent(itemDeletedEvent);
    }
}
