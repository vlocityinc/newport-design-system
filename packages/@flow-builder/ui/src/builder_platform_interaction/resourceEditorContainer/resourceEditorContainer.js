import { LightningElement, api, track } from 'lwc';
import { hydrateWithErrors } from "builder_platform_interaction/dataMutationLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import variableEditorTemplate from "./variableEditorTemplate.html";
import constantEditorTemplate from "./constantEditorTemplate.html";
import formulaEditorTemplate from "./formulaEditorTemplate.html";
import { propertyEditorFactory } from 'builder_platform_interaction/propertyEditorFactory';

const resourceTypeElementTypeMap = {
    variable: ELEMENT_TYPE.VARIABLE,
    formula: ELEMENT_TYPE.FORMULA,
    constant: ELEMENT_TYPE.CONSTANT
};

const EDITOR_SELECTOR = '.editor_template';

/**
 * Container component that contains the logic for switching between different editors
 * We switch editors by looking at the current element type of the selected resource and picking the corresponding template
 * The templates are simple dummy wrappers that contain existing property editors
 * For more information about switching templates see this doc: https://salesforce.quip.com/nvdIAb8SaN5A
 * It also handles creation of flow elements, mutating the element, and hydrating the elements
 */
export default class ResourceEditorContainer extends LightningElement {
    /**
     * The currently selected resource
     * @type {String}
     */
    _selectedResource = null;

    /**
     * The node that represents initial state of the currently selected editor
     * Ex: If you selected variable then this is a variable editor node
     * This prop is not the current state of the inner property editor because each
     * properry editor makes a copy and modifies their copy as the user makes edits
     * Instead, we pass this node to the editor on initial creation of the flow element
     * @type {Object}
     */
    @track
    node = {};

    /**
     * Sets the selected resource
     * This will create a flow element of the corresponding element type
     * The new flow element is then mutated and hydrated
     * @param {String} resourceType the selected resource type
     */
    set selectedResource(resourceType) {
        if (!resourceType) {
            return;
        }

        this._selectedResource = resourceType;

        // go through the needed steps to create a flow element and get it ready to be used by property editor
        const elementType = resourceTypeElementTypeMap[resourceType];
        let node = propertyEditorFactory({elementType});
        // NOTE: if we ever need to pass the store state (the second allowed param) then we need to add that here
        node = hydrateWithErrors(node);

        // set this to our member variable so that we can pass to the selected property editor template
        this.node = node;
    }

    @api
    get selectedResource() {
        return this._selectedResource;
    }

    /**
     * Gets the inner node (the editor of the chosen resource type)
     * @returns {Object} the node of the chosen resource type
     */
    @api
    getNode() {
        const editor = this.template.querySelector(EDITOR_SELECTOR);
        if (editor) {
            return this.template.querySelector(EDITOR_SELECTOR).getNode();
        }
        return undefined;
    }

    /**
     * Calls validate method on the inner node (the editor of the chosen resource type)
     * @returns {Array} the array of errors from validation call
     */
    @api
    validate() {
        const editor = this.template.querySelector(EDITOR_SELECTOR);
        if (editor) {
            return this.template.querySelector(EDITOR_SELECTOR).validate();
        }
        return undefined;
    }

    render() {
        const elementType = this.node.elementType;
        switch (elementType) {
            case ELEMENT_TYPE.VARIABLE:
                return variableEditorTemplate;
            case ELEMENT_TYPE.CONSTANT:
                return constantEditorTemplate;
            case ELEMENT_TYPE.FORMULA:
                return formulaEditorTemplate;
            default:
                return undefined;
        }
    }
}