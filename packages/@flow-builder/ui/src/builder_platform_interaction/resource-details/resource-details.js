import { Element, api } from 'engine';
import { EditElementEvent, DeleteResourceEvent } from 'builder_platform_interaction-events';

import typeText from '@label/FlowBuilderResourceDetailsPanel.typeText';
import uniqueNameText from '@label/FlowBuilderResourceDetailsPanel.uniqueNameText';
import descriptionText from '@label/FlowBuilderResourceDetailsPanel.descriptionText';
import detailsText from '@label/FlowBuilderResourceDetailsPanel.detailsText';
import editButtonLabel from '@label/FlowBuilderResourceDetailsPanel.editButtonLabel';
import deleteButtonLabel from '@label/FlowBuilderResourceDetailsPanel.deleteButtonLabel';

const LABELS = {
    RESOURCE_DETAILS_PANEL_TYPE_TEXT: typeText,
    RESOURCE_DETAILS_PANEL_UNIQUE_NAME_TEXT: uniqueNameText,
    RESOURCE_DETAILS_PANEL_DESCRIPTION_TEXT: descriptionText,
    RESOURCE_DETAILS_PANEL_DETAILS_TEXT: detailsText,
    RESOURCE_DETAILS_PANEL_EDIT_BUTTON_TEXT: editButtonLabel,
    RESOURCE_DETAILS_PANEL_DELETE_BUTTON_TEXT: deleteButtonLabel
};

export default class ResourceDetails extends Element {
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
