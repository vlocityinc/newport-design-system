import { LightningElement, api } from 'lwc';
import { LABELS } from './recordUseAdvancedOptionsCheckboxLabels';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';

export default class RecordUseAdvancedOptionsCheckbox extends LightningElement {
    labels = LABELS;

    @api
    isAdvancedMode = false;

    /**
     * Handles selection/deselection of 'Use Advanced Options' checkbox
     * @param {Object} event - event
     */
    handleUseAdvancedOptionsSelectionChange(event) {
        event.stopPropagation();
        this.dispatchEvent(
            new UseAdvancedOptionsSelectionChangedEvent(event.detail.checked)
        );
    }
}
