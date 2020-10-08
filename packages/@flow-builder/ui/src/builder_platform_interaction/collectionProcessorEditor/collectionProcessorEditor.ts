import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { collectionProcessorReducer } from './collectionProcessorReducer';

/**
 * @constant UPDATE_PROPERTY
 * @type {string}
 */

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

    @api
    get node() {
        return this.collectionProcessorElement;
    }

    set node(newValue) {
        this.collectionProcessorElement = newValue || {};
    }

    @api
    editorParams;

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.collectionProcessorElement;
    }

    connectedCallback() {
        this.hasConfigurationEditor = true;
        this.collectionProcessorSubtype = this.collectionProcessorElement.elementSubtype;
        this.configurationEditor = {
            name: elementTypeToConfigMap[this.collectionProcessorSubtype].flowBuilderConfigComponent
        };
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();
        this.collectionProcessorElement = collectionProcessorReducer(this.collectionProcessorElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.collectionProcessorElement));
    }
}
