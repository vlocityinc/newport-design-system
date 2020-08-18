// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { EditElementEvent, DeleteResourceEvent } from 'builder_platform_interaction/events';
import { logInteraction } from 'builder_platform_interaction/loggingUtils';
import { RESOURCES_TYPE_WITH_AUTOMATIC_OUTPUT_PARAMETERS_CONFIGURATION } from 'builder_platform_interaction/resourceDetailsParameters';
import { LABELS } from './resourceDetailsLabels';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export default class ResourceDetails extends LightningElement {
    @api
    resourceDetails;

    @api
    showLocatorIcon;

    @track
    state = {
        hasAutomaticOutputParameters: false
    };
    _isAutomaticOutputParametersSupported = undefined;

    labels = LABELS;

    get hasIcon() {
        return !!this.resourceDetails.typeIconName;
    }

    get hasApiName() {
        return !!this.resourceDetails.apiName && !this.isAutomaticOutputFromGetRecordOrCreateRecord();
    }

    get hasDescription() {
        return !!this.resourceDetails.description;
    }

    get hasUsedByContent() {
        return Array.isArray(this.resourceDetails.usedByElements) && this.resourceDetails.usedByElements.length > 0;
    }

    get hasCreatedByElement() {
        return this.resourceDetails.createdByElement != null;
    }

    @api
    get createdByElements() {
        return this.hasCreatedByElement ? [this.resourceDetails.createdByElement] : [];
    }

    get displayButtons() {
        return this.resourceDetails.editable && this.resourceDetails.deletable;
    }

    get isAutomaticOutputParametersSupported() {
        if (this._isAutomaticOutputParametersSupported === undefined) {
            this._isAutomaticOutputParametersSupported =
                this.resourceDetails.storeOutputAutomatically &&
                !this.resourceDetails.isSystemGeneratedOutput &&
                RESOURCES_TYPE_WITH_AUTOMATIC_OUTPUT_PARAMETERS_CONFIGURATION.get(this.resourceDetails.elementType);
        }
        return this._isAutomaticOutputParametersSupported;
    }

    handleEditButtonClicked() {
        const editElementEvent = new EditElementEvent(this.resourceDetails.elementGuid);
        this.dispatchEvent(editElementEvent);
        logInteraction(
            `edit-element-button`,
            'resource-details',
            {
                elementType: this.resourceDetails.elementType,
                typeLabel: this.resourceDetails.typeLabel,
                usedByElementsCount: this.resourceDetails.usedByElements.length
            },
            'click'
        );
    }

    handleDeleteButtonClicked() {
        const deleteEvent = new DeleteResourceEvent(
            [this.resourceDetails.elementGuid],
            this.resourceDetails.elementType
        );
        this.dispatchEvent(deleteEvent);
        logInteraction(
            `delete-element-button`,
            'resource-details',
            {
                elementType: this.resourceDetails.elementType,
                typeLabel: this.resourceDetails.typeLabel,
                usedByElementsCount: this.resourceDetails.usedByElements.length
            },
            'click'
        );
    }

    isAutomaticOutputFromGetRecordOrCreateRecord() {
        return (
            (this.resourceDetails.elementType === ELEMENT_TYPE.RECORD_LOOKUP ||
                this.resourceDetails.elementType === ELEMENT_TYPE.RECORD_CREATE) &&
            this.resourceDetails.storeOutputAutomatically
        );
    }
}
