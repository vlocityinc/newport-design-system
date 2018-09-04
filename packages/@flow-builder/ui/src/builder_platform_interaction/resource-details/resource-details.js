import { LightningElement, api } from 'lwc';
import { EditElementEvent, DeleteResourceEvent } from 'builder_platform_interaction-events';
import { LABELS } from './resource-details-labels';

export default class ResourceDetails extends LightningElement {
    @api resourceDetails;

    get hasIcon() {
        return this.resourceDetails.ICON_NAME !== undefined && this.resourceDetails.ICON_NAME !== null && this.resourceDetails.ICON_NAME.length > 0;
    }

    get hasUniqueName() {
        return this.resourceDetails.NAME !== undefined && this.resourceDetails.NAME !== null && this.resourceDetails.NAME.length > 0;
    }

    get hasDescription() {
        return this.resourceDetails.DESCRIPTION !== undefined && this.resourceDetails.DESCRIPTION !== null && this.resourceDetails.DESCRIPTION.length > 0;
    }

    get hasUsedByElements() {
        return Array.isArray(this.resourceDetails.USED_BY_ELEMENTS) && this.resourceDetails.USED_BY_ELEMENTS.length > 0;
    }

    get panelFooterClasses() {
        let classes = 'panel-footer slds-grid slds-grid_align-end slds-p-around_small slds-border_top slds-border_bottom';
        if (this.resourceDetails.IS_CHILD_ELEMENT) {
            classes = `${classes} slds-hide`;
        }
        return classes;
    }

    get labels() {
        return LABELS;
    }

    handleEditButtonClicked(event) {
        event.stopPropagation();
        const guid = this.resourceDetails.GUID;
        const editElementEvent = new EditElementEvent(guid);
        this.dispatchEvent(editElementEvent);
    }

    handleDeleteButtonClicked(event) {
        event.stopPropagation();
        const deleteEvent = new DeleteResourceEvent([this.resourceDetails.GUID], this.resourceDetails.TYPE);
        this.dispatchEvent(deleteEvent);
    }
}
