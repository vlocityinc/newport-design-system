import { LightningElement, api } from 'lwc';
import { LABELS } from './recordUseAdvancedOptionsCheckboxLabels';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';
import { invokeModal } from 'builder_platform_interaction/builderUtils';

function advancedOptionsSelectionChangeCallBack(event) {
    this.dispatchEvent(
        new UseAdvancedOptionsSelectionChangedEvent(event.detail.checked)
    );
}

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
                buttonCallback: advancedOptionsSelectionChangeCallBack.bind(
                    this,
                    event
                )
            }
        }
    };
}

export default class RecordUseAdvancedOptionsCheckbox extends LightningElement {
    labels = LABELS;

    @api
    isAdvancedMode;

    /**
     * Handles selection/deselection of 'Use Advanced Options' checkbox
     * @param {Object} event - event
     */
    handleUseAdvancedOptionsSelectionChange(event) {
        event.stopPropagation();
        const checkbox = event.target;
        checkbox.checked = !checkbox.checked;

        if (!event.detail.checked) {
            // Invoking the deselect Use Advanced Options confirmation modal
            invokeModal(confirmationModalParameter.call(this, event));
        } else {
            advancedOptionsSelectionChangeCallBack.call(this, event);
        }
    }
}
