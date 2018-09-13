import { LightningElement, api, track } from 'lwc';
import { getResourceTypesMenuData } from "builder_platform_interaction/expressionUtils";
import { shouldNotBeNullOrUndefined } from "builder_platform_interaction/validationRules";
import { LABELS } from "./resourceEditorLabels";


const CONTAINER_SELECTOR = 'builder_platform_interaction-resource-editor-container';
const COMBOBOX_SELECTOR = 'lightning-combobox';

/**
 * New resource property editor
 * This component reaches into its children to call getNode & validate on its child components
 * This is so that we can leverage the existing property editor & validation architeture
 * Please refer to this doc about property editor validation
 * Property Editor Validation: https://salesforce.quip.com/KH3OAdQI553X
 * Resource Editor architecture: https://salesforce.quip.com/NS8ZAxTzYsmp
 */
export default class ResourceEditor extends LightningElement {
    /**
     * Menu items representing allowed resource types
     * @type {module:builder_platform_interaction-expression-utils.MenuItem[]}
     */
    _resourceTypes;

    /**
     * The currently selected resource type
     * @type{String}
     */
    @track
    selectedResource = null;

    /**
     * Setter for the node passed in on modal creation
     * This is essentially a dummy no-op because new resource does not have a node
     * We need to have this to work with the existing property editor architecture
     * @param {Object} node the object initially passed in, we ignore this
     */
    set node(node) {
        this.resourceNode = {};
    }

    /**
     * Gets the inner node (the editor of the chosen resource type)
     * @returns {Object} the node of the chosen resource type
     */
    @api
    get node() {
        return this.template.querySelector(CONTAINER_SELECTOR).getNode();
    }

    get labels() {
        return LABELS;
    }

    /**
     * Calls getNode method on the container component that contains the inner property editor
     * This method is called on OK by the property editor footer component
     * @returns {Object} the node of the chosen resource type
     */
    @api
    getNode() {
        return this.template.querySelector(CONTAINER_SELECTOR).getNode();
    }

    /**
     * Calls validate method on the container component that contains the inner property editor
     * This method is called on OK by the property editor footer component for validation
     * @returns {Array} the array of errors from validation call
     */
    @api
    validate() {
        const container = this.template.querySelector(CONTAINER_SELECTOR);
        // instead of going through the property editor validation steps (calling validateAll) we know the editor is invalid by just checking selectedResource
        const error = shouldNotBeNullOrUndefined(this.selectedResource);
        if (error) {
            // if we have an error set it on the combobox and return it to the property editor
            const combobox = this.template.querySelector(COMBOBOX_SELECTOR);
            combobox.setCustomValidity(error);
            combobox.showHelpMessageIfInvalid();
            return [error];
        }
        // if we don't have an error then we can call validate on our container which will then call validate on the chosen editor
        return container.validate();
    }

    /**
     * Returns the resource types
     * If the resource menu data is not populated we call the expression utils to create the menu data
     * @returns {module:builder_platform_interaction-expression-utils.MenuItem[]} Menu items representing allowed resource types
     */
    get resourceTypes() {
        if (!this._resourceTypes) {
            this._resourceTypes = getResourceTypesMenuData();
        }
        return this._resourceTypes;
    }

    handleResourceChange(event) {
        this.selectedResource = event.detail.value;
        // now that we have changed the resource type we can remove any errors we may have had
        const combobox = this.template.querySelector(COMBOBOX_SELECTOR);
        if (!combobox.checkValidity()) {
            combobox.setCustomValidity(null);
            combobox.showHelpMessageIfInvalid();
        }
    }
}