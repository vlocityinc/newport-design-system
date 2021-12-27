// @ts-nocheck
import { VariableAndFieldMappingChangedEvent } from 'builder_platform_interaction/events';
import { VARIABLE_AND_FIELD_MAPPING_VALUES } from 'builder_platform_interaction/recordEditorLib';
import { invokeModal } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS, VARIABLE_AND_FIELD_MAPPING_OPTIONS } from './recordLookupVariableAndFieldMappingLabels';

export default class RecordLookupVariableAndFieldMapping extends LightningElement {
    labels = LABELS;

    @api
    value;

    get variableAndFieldMappingOptions() {
        return VARIABLE_AND_FIELD_MAPPING_OPTIONS;
    }

    askConfirmation(event) {
        invokeModal({
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
                    buttonCallback: () =>
                        this.dispatchEvent(new VariableAndFieldMappingChangedEvent(event.detail.value))
                }
            }
        });
    }

    /**
     * Handles selection/deselection of 'Use Advanced Options' checkbox
     *
     * @param {Object} event - event
     */
    handleVariableAndFieldMappingChange(event) {
        event.stopPropagation();
        const radioButtonGroup = event.target;
        radioButtonGroup.value = this.value;

        if (this.value !== event.detail.value) {
            if (event.detail.value === VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC) {
                this.askConfirmation(event);
            } else {
                this.dispatchEvent(new VariableAndFieldMappingChangedEvent(event.detail.value));
            }
        }
    }
}
