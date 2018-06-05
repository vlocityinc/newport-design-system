import { Element, api } from 'engine';
import typeText from '@label/FlowBuilderResourceDetailsPanel.typeText';
import uniqueNameText from '@label/FlowBuilderResourceDetailsPanel.uniqueNameText';
import descriptionText from '@label/FlowBuilderResourceDetailsPanel.descriptionText';
import detailsText from '@label/FlowBuilderResourceDetailsPanel.detailsText';

const LABELS = {
    RESOURCE_DETAILS_PANEL_TYPE_TEXT: typeText,
    RESOURCE_DETAILS_PANEL_UNIQUE_NAME_TEXT: uniqueNameText,
    RESOURCE_DETAILS_PANEL_DESCRIPTION_TEXT: descriptionText,
    RESOURCE_DETAILS_PANEL_DETAILS_TEXT: detailsText
};

export default class ResourceDetails extends Element {
    @api resourcedetails;

    get hasIcon() {
        return this.resourcedetails.ICON_NAME !== undefined && this.resourcedetails.ICON_NAME !== null && this.resourcedetails.ICON_NAME.length > 0;
    }

    get hasUniqueName() {
        return this.resourcedetails.NAME !== undefined && this.resourcedetails.NAME !== null && this.resourcedetails.NAME.length > 0;
    }

    get hasDescription() {
        return this.resourcedetails.DESCRIPTION !== undefined && this.resourcedetails.DESCRIPTION !== null && this.resourcedetails.DESCRIPTION.length > 0;
    }

    get labels() {
        return LABELS;
    }
}
