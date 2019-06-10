import { LightningElement, api } from 'lwc';
import {
    EditElementEvent,
    DeleteResourceEvent
} from 'builder_platform_interaction/events';
import { LABELS } from './resourceDetailsLabels';

export default class ResourceDetails extends LightningElement {
    @api resourceDetails;

    get hasIcon() {
        return !!this.resourceDetails.typeIconName;
    }

    get hasApiName() {
        return !!this.resourceDetails.apiName;
    }

    get hasDescription() {
        return !!this.resourceDetails.description;
    }

    get hasUsedByContent() {
        return (
            Array.isArray(this.resourceDetails.usedByElements) &&
            this.resourceDetails.usedByElements.length > 0
        );
    }

    get hasCreatedByElement() {
        return this.resourceDetails.createdByElement != null;
    }

    get createdByElements() {
        return this.hasCreatedByElement
            ? [this.resourceDetails.createdByElement]
            : [];
    }

    get displayButtons() {
        return this.resourceDetails.editable && this.resourceDetails.deletable;
    }

    get labels() {
        return LABELS;
    }

    handleEditButtonClicked(event) {
        event.stopPropagation();
        const editElementEvent = new EditElementEvent(
            this.resourceDetails.elementGuid
        );
        this.dispatchEvent(editElementEvent);
    }

    handleDeleteButtonClicked(event) {
        event.stopPropagation();
        const deleteEvent = new DeleteResourceEvent(
            [this.resourceDetails.elementGuid],
            this.resourceDetails.elementType
        );
        this.dispatchEvent(deleteEvent);
    }
}
