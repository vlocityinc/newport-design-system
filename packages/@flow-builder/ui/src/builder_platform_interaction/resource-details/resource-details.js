import { Element, api, track } from 'engine';
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
    // We are initializing an empty state during the left panel component rendering as we switch the css classes upfront.
     @track
     internalResourceDetails = {
         TYPE: '',
         GUID: '',
         LABEL: '',
         ICON_NAME: '',
         DESCRIPTION: '',
         NAME: ''
     };

     get hasIcon() {
         return this.internalResourceDetails.ICON_NAME !== undefined && this.internalResourceDetails.ICON_NAME !== null && this.internalResourceDetails.ICON_NAME.length > 0;
     }

     get hasUniqueName() {
         return this.internalResourceDetails.NAME !== undefined && this.internalResourceDetails.NAME !== null && this.internalResourceDetails.NAME.length > 0;
     }

     get hasDescription() {
         return this.internalResourceDetails.DESCRIPTION !== undefined && this.internalResourceDetails.DESCRIPTION !== null && this.internalResourceDetails.DESCRIPTION.length > 0;
     }

     get labels() {
         return LABELS;
     }

     @api
     get resourceDetails() {
         return this.internalResourceDetails;
     }

     @api
     set resourceDetails(value) {
         this.internalResourceDetails = value;
     }
}
