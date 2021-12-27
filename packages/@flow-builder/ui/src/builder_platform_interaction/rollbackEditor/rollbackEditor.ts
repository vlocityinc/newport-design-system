import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './rollbackEditorLabels';
import { rollbackReducer } from './rollbackReducer';

export default class RollbackEditor extends LightningElement {
    labels = LABELS;
    /**
     * Internal state for the rollback editor
     */
    @track rollbackElement;

    get elementType() {
        return ELEMENT_TYPE.ROLLBACK;
    }

    @api
    mode;

    @api
    processType;

    @api
    get node() {
        return this.rollbackElement;
    }

    set node(newValue) {
        this.rollbackElement = newValue || {};
    }

    @api
    editorParams;

    /**
     * public api function to return the node
     *
     * @returns node
     */
    @api getNode(): UI.HydratedElement {
        return this.rollbackElement;
    }

    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.rollbackElement = rollbackReducer(this.rollbackElement, event);
        return getErrorsFromHydratedElement(this.rollbackElement);
    }

    /**
     * @param event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event: CustomEvent) {
        event.stopPropagation();
        this.rollbackElement = rollbackReducer(this.rollbackElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.rollbackElement));
    }
}
