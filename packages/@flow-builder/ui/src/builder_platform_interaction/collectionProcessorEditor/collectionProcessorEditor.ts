import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE, COLLECTION_PROCESSOR_SUB_TYPE } from 'builder_platform_interaction/flowMetadata';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { collectionProcessorReducer } from './collectionProcessorReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { ElementValidationError, getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';

const SELECTORS = {
    CUSTOM_PROPERTY_EDITOR: 'builder_platform_interaction-custom-property-editor'
};

export default class CollectionProcessorEditor extends LightningElement {
    /**
     * Internal state for the collectionProcessor editor
     */
    @track collectionProcessorElement;

    get elementType() {
        return ELEMENT_TYPE.COLLECTION_PROCESSOR;
    }

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    configurationEditor;

    @api
    configurationEditorValues;

    @api
    hasConfigurationEditor;

    @api
    collectionProcessorSubtype;

    @track
    elementInfo = {};

    @api
    get node() {
        return this.collectionProcessorElement;
    }

    set node(newValue) {
        this.collectionProcessorElement = newValue || {};
        this.hasConfigurationEditor = true;
        this.collectionProcessorSubtype = this.collectionProcessorElement.elementSubtype;
        this.configurationEditor = {
            name: elementTypeToConfigMap[this.collectionProcessorSubtype].configComponent
        };
        this.setElementInfo(this.collectionProcessorSubtype);
    }

    @api
    editorParams;

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.collectionProcessorElement;
    }

    @api validate() {
        let errors: ElementValidationError[] = [];
        // validate the inner editor
        const editor = this.template.querySelector(SELECTORS.CUSTOM_PROPERTY_EDITOR);
        if (editor) {
            errors = editor.validate();
        }
        const event = new CustomEvent(VALIDATE_ALL);
        this.collectionProcessorElement = collectionProcessorReducer(this.collectionProcessorElement, event);
        errors.push(...getErrorsFromHydratedElement(this.collectionProcessorElement));
        // remove duplicated error
        const errorKey = 'key';
        return errors.filter(
            (element, index, self) => self.findIndex((t) => t[errorKey] === element[errorKey]) === index
        );
    }

    /**
     * @param subType - the collection processor sub type: sort, filter ...
     */
    setElementInfo(subType: string) {
        switch (subType) {
            case COLLECTION_PROCESSOR_SUB_TYPE.SORT: {
                const { sortOptions, limit, collectionReference, elementSubtype } = this.collectionProcessorElement;
                this.elementInfo = Object.assign({}, { sortOptions, limit, collectionReference, elementSubtype });
                break;
            }
            default:
                break;
        }
    }

    /**
     * @param event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event: CustomEvent) {
        event.stopPropagation();
        this.collectionProcessorElement = collectionProcessorReducer(this.collectionProcessorElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.collectionProcessorElement));
    }

    /**
     * @param event - update collection changed event
     */
    handleUpdateCollectionProcessor(event: CustomEvent) {
        event.stopPropagation();
        this.collectionProcessorElement = collectionProcessorReducer(this.collectionProcessorElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.collectionProcessorElement));
    }
}
