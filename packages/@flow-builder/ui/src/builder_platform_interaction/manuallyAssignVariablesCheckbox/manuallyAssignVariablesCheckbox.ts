// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './manuallyAssignVariablesCheckboxLabels';
import { ManuallyAssignVariablesChangedEvent } from 'builder_platform_interaction/events';
import { invokeModal } from 'builder_platform_interaction/sharedUtils';

/**
 * @param event The Event
 */
function confirmationModalButtonCallback(event) {
    this.dispatchEvent(new ManuallyAssignVariablesChangedEvent(event.detail.checked));
}

/**
 * @param event The event
 * @returns Confirmation Popup Data
 */
function confirmationModalParameter(event) {
    return {
        headerData: {
            headerTitle: LABELS.areYouSure
        },
        bodyData: {
            bodyTextOne: LABELS.clearVariableConfirmation
        },
        footerData: {
            buttonOne: {
                buttonLabel: LABELS.cancelButton
            },
            buttonTwo: {
                buttonVariant: LABELS.confirm,
                buttonLabel: LABELS.confirm,
                buttonCallback: confirmationModalButtonCallback.bind(this, event)
            }
        }
    };
}

export default class ManuallyAssignVariablesCheckbox extends LightningElement {
    static DEFAULT_INPUT_PARENT_DIV_CSS = 'slds-form_stacked slds-p-left_small';

    labels = LABELS;

    @api
    isAdvancedMode;

    @api
    inputParentDivCss = ManuallyAssignVariablesCheckbox.DEFAULT_INPUT_PARENT_DIV_CSS;

    /**
     * Handles selection/deselection of 'Manually Assign Variables' checkbox
     *
     * @param {Object} event - event
     */
    handleChangeEvent(event) {
        event.stopPropagation();
        const checkbox = event.target;
        checkbox.checked = !checkbox.checked;

        if (!event.detail.checked) {
            // Invoking the deselect confirmation modal
            invokeModal(confirmationModalParameter.call(this, event));
        } else {
            confirmationModalButtonCallback.call(this, event);
        }
    }
}
