import { LightningElement, api } from 'lwc';
import { LABELS } from "./statusIconSummaryLabels";
import { format } from "builder_platform_interaction/commonUtils";

export default class StatusIconSummary extends LightningElement {
    @api header;
    @api messages = [];
    @api type = 'error';
    @api handleClickCallback;
    @api showOnlyNumberOfErrors = false;

    labels = LABELS;
    /**
     * event handler for close button click in the header.
     * Calls the handleClickCallback
     */
    handleCloseButtonClick() {
        if (typeof this.handleClickCallback === 'function') {
            this.handleClickCallback.call();
        }
    }

    /**
     * @returns {string} sectionStyle: the section style css based on type
     */
    get sectionStyle() {
        return 'slds-popover slds-popover_medium slds-show slds-popover_' + this.type;
    }

    /**
     * @returns {string} iconNameForHeader : icon name for the header based on type
     */
    get iconNameForHeader() {
        return 'utility:' + this.type;
    }

    /**
     * TODO: W-5109914 (Make this component support various messages/different body types in status icon)
     * Note: for warnings we might need to do a bit of refactoring, by either passing in the message or replacing the whole body/tmpl
     * @returns {string} message body with the number of errors, this replaces the list of errors in the body
     */
    get messageBody() {
        return this.messages.length > 1 ? format(LABELS.popupErrorMessagePlural, this.messages.length) : format(LABELS.popupErrorMessageSingular, this.messages.length);
    }
}