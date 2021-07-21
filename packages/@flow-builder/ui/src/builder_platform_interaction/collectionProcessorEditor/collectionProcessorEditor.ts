import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
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
    hasConfigurationEditor;

    @track
    elementInfo = {};

    @api
    get node() {
        return this.collectionProcessorElement;
    }

    set node(newValue) {
        this.collectionProcessorElement = newValue || {};
        this.hasConfigurationEditor = true;
        this.configurationEditor = {
            name: elementTypeToConfigMap[this.collectionProcessorElement.elementSubtype].configComponent
        };
        this.setElementInfo();
    }

    @api
    editorParams;

    /**
     * public api function to return the node.
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
        return errors;
    }

    /**
     * set element info for sub editor
     */
    setElementInfo() {
        const {
            limit,
            collectionReference,
            assignNextValueToReference,
            outputSObjectType,
            elementType,
            elementSubtype,
            sortOptions,
            mapItems
        } = this.collectionProcessorElement;
        this.elementInfo = Object.assign(
            {},
            {
                limit,
                collectionReference,
                elementType,
                elementSubtype,
                sortOptions,
                mapItems,
                assignNextValueToReference,
                outputSObjectType
            }
        );
    }

    get configurationEditorValues() {
        return [
            {
                name: 'nodeName',
                value: this.collectionProcessorElement.name && this.collectionProcessorElement.name.value
            }
        ];
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
