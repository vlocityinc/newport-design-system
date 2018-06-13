import { Element, api } from 'engine';
export default class StatusIconSummary extends Element {
    @api header;
    @api messages = [];
    @api type = 'error';
    @api handleClickCallback;
    @api showOnlyNumberOfErrors = false;

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
        return 'slds-popover slds-popover_medium slds-popover_' + this.type;
    }

    /**
     * @returns {string} iconNameForHeader : icon name for the header based on type
     */
    get iconNameForHeader() {
        return 'utility:' + this.type;
    }

    /**
     * @returns {string} message body with the number of errors, this replaces the list of errors in the body
     */
    get messageBody() {
        return 'You have ' + this.messages.length + ' ' + this.type + '(s)';
    }
}