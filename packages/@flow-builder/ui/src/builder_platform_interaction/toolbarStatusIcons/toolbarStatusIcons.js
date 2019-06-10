import { LightningElement, api } from 'lwc';
import { LABELS } from './toolbarStatusIconsLabels';

export default class ToolbarStatusIcons extends LightningElement {
    @api flowErrorsAndWarnings;

    labels = LABELS;

    get flowErrors() {
        if (this.flowErrorsAndWarnings) {
            return this.flowErrorsAndWarnings.errors;
        }
        return {};
    }

    get flowWarnings() {
        if (this.flowErrorsAndWarnings) {
            return this.flowErrorsAndWarnings.warnings;
        }
        return {};
    }

    /**
     * Opens the popovers based on flow results ( warnings & errors )
     * @param {Object} flowErrorsAndWarnings
     */
    openPopOver(flowErrorsAndWarnings) {
        if (
            flowErrorsAndWarnings &&
            (flowErrorsAndWarnings.warnings || flowErrorsAndWarnings.errors)
        ) {
            if (
                (Object.keys(flowErrorsAndWarnings.warnings).length > 0 &&
                    Object.keys(flowErrorsAndWarnings.errors).length > 0) ||
                Object.keys(flowErrorsAndWarnings.errors).length > 0
            ) {
                const icon = this.template.querySelector('.error-icon');
                icon.createPanel();
            } else if (Object.keys(flowErrorsAndWarnings.warnings).length > 0) {
                const icon = this.template.querySelector('.warning-icon');
                icon.createPanel();
            }
        }
    }

    /**
     * After rendering we are setting the popover to show up (if it exists)
     * via openPopOver
     */
    renderedCallback() {
        this.openPopOver(this.flowErrorsAndWarnings);
    }
}
