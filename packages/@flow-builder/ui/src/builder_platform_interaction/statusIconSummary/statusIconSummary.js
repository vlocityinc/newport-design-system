import { LightningElement, api } from 'lwc';
import { LABELS } from './statusIconSummaryLabels';
import { format } from 'builder_platform_interaction/commonUtils';

export default class StatusIconSummary extends LightningElement {
    @api header;
    @api sections = {};
    @api type;
    @api allCount;
    @api handleClickCallback;
    @api showOnlyNumberOfErrors = false;
    @api showTotalCounts;
    @api showSections = false;

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
        const popOverClasses =
            'slds-popover slds-show slds-popover_' + this.type;
        return this.type === 'warning'
            ? popOverClasses + ' slds-popover_large'
            : popOverClasses + ' slds-popover_medium';
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
        if (this.type === 'warning') {
            return this.allCount > 1
                ? format(LABELS.popupWarningMessagePlural, this.allCount)
                : format(LABELS.popupWarningMessageSingular, this.allCount);
        }
        return this.allCount > 1
            ? format(LABELS.popupErrorMessagePlural, this.allCount)
            : format(LABELS.popupErrorMessageSingular, this.allCount);
    }

    /**
     * @returns {boolean} hasSectionHeader : section header based on type
     */
    get hasSectionHeader() {
        return this.type === 'warning' && this.showSections;
    }

    /**
     * @returns {string} sectionStyle: the section style css based on type
     */
    get hasSections() {
        return this.type === 'warning' ? 'slds-item' : 'slds-p-around_x-small';
    }

    /**
     * @returns {string} sectionItemStyle: the section item style css based on type
     */
    get hasSectionItems() {
        const sectionItemClasses =
            'slds-is-nested slds-list_vertical-space-medium';
        return (this.type === 'warning' && this.showSections) ||
            this.type === 'error'
            ? sectionItemClasses + ' slds-list_dotted'
            : sectionItemClasses;
    }
}
