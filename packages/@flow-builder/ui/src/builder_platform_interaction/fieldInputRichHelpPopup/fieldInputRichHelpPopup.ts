import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import LightningPopupSource from 'lightning/popupSource';
import { api, LightningElement } from 'lwc';
import { LABELS } from './fieldInputRichHelpPopupLabels';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    popupSource: 'lightning-popup-source'
};

// TODO (W-11154930): popupData needs to be passed down from the parent component.
// Also need to implement focus/blur functionality to show and hide the popup on arrow or tab key.
export default class FieldInputRichHelpPopup extends withKeyboardInteractions(LightningElement) {
    @api
    popupData: UI.FieldMenuPopupData = {
        description: 'Description for Global Variables',
        apiName: 'Users_from_Get_Account_Owners',
        label: 'Users from Get Account Owners',
        resourceType: 'Collection',
        resourceTypeIcon: 'utility:connected_apps',
        dataType: 'Record',
        dataTypeIcon: 'utility:connected_apps',
        subtype: 'User'
    };

    @api
    showLabel = false;

    dom = lwcUtils.createDomProxy(this, selectors);

    labels = LABELS;

    getKeyboardInteractions() {
        return [];
    }

    get sourceButtonAltText() {
        // TODO (W-10395435): The alternativeText for the button-icon will contain the
        // information presented in the popup to be read by the screen reader.
        return 'Additional Information';
    }

    get dataTypeText() {
        return this.popupData.subtype
            ? `${this.popupData.dataType} (${this.popupData.subtype})`
            : this.popupData.dataType;
    }

    /**
     * Handles the mouse enter event and opens the popup
     */
    handlePopupSourceMouseEnter() {
        const popupSource = this.dom.as<LightningPopupSource>().popupSource;
        if (popupSource) {
            popupSource.open({
                alignment: 'right',
                size: 'small'
            });
        }
    }

    /**
     * Handles the mouse leave event and closes the popup
     */
    handlePopupSourceMouseLeave() {
        const popupSource = this.dom.as<LightningPopupSource>().popupSource;
        if (popupSource) {
            popupSource.close();
        }
    }
}
