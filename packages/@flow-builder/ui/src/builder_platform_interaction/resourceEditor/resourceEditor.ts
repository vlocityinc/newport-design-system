import { LightningElement, api, track } from 'lwc';
import { getResourceTypesMenuData } from 'builder_platform_interaction/expressionUtils';
import { shouldNotBeNullOrUndefined } from 'builder_platform_interaction/validationRules';
import { LABELS } from './resourceEditorLabels';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';

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
     */
    _resourceTypes: Array<{ value: string; label: string }> | null = null;

    /**
     * Preconfiguration information about the new resource being created
     */
    _newResourceInfo: UI.NewResourceInfo | null = null;

    /**
     * When we are attempting to create a resource for the user, but there was a name collision or some other issue,
     * we need to pop the resource editor, prepopulate the data and validate so the user see that the issues are.
     * This flag indicates that the prevalidation is needed.
     */
    _preValidationNeeded = false;

    /**
     * A boolean flag indicating whether we should show the resource type selector or not
     */
    showResourceTypesSelector = true;

    /**
     * The currently selected resource type
     */
    @track
    selectedResourceType: string | undefined | null = null;

    @api
    editorParams;

    set newResourceInfo(newResourceInfo) {
        this._newResourceInfo = newResourceInfo;
        if (this._newResourceInfo?.resourceTypes?.length === 1) {
            this.selectedResourceType = getConfigForElementType(
                this._newResourceInfo.resourceTypes[0]
            ).nodeConfig?.value;
            this.showResourceTypesSelector = false;
        }
        this._preValidationNeeded = this._newResourceInfo?.preValidationNeeded ? true : false;
    }

    @api
    get newResourceInfo() {
        return this._newResourceInfo;
    }
    /**
     * Setter for the node passed in on modal creation
     * This is essentially a dummy no-op because new resource does not have a node
     * We need to have this to work with the existing property editor architecture
     *
     * @param {Object} node the object initially passed in, we ignore this
     */
    set node(node) {
        this.resourceNode = {};
    }

    /**
     * Gets the inner node (the editor of the chosen resource type)
     *
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
     *
     * @returns {Object} the node of the chosen resource type
     */
    @api
    getNode() {
        return this.template.querySelector(CONTAINER_SELECTOR).getNode();
    }

    /**
     * Calls validate method on the container component that contains the inner property editor
     * This method is called on OK by the property editor footer component for validation
     *
     * @returns {Array} the array of errors from validation call
     */
    @api
    validate() {
        const container = this.template.querySelector(CONTAINER_SELECTOR);
        // instead of going through the property editor validation steps (calling validateAll) we know the editor is invalid by just checking selectedResource
        const error = shouldNotBeNullOrUndefined(this.selectedResourceType);
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

    renderedCallback() {
        if (this._preValidationNeeded) {
            this._preValidationNeeded = false;
            this.validate();
        }
    }

    /**
     * Returns the resource types
     * If the resource menu data is not populated we call the expression utils to create the menu data
     *
     * @returns {Array} Menu items representing allowed resource types
     */
    get resourceTypes() {
        if (!this._resourceTypes) {
            const resourceTypes = getResourceTypesMenuData();

            if (!this._newResourceInfo || !this._newResourceInfo.resourceTypes) {
                this._resourceTypes = resourceTypes;
            } else {
                const resoureTypesFromEvent = this._newResourceInfo.resourceTypes.map(
                    (resourceType) => getConfigForElementType(resourceType).nodeConfig?.value
                );
                this._resourceTypes = resourceTypes.filter((resourceType) => {
                    return resoureTypesFromEvent.includes(resourceType.value);
                });
            }
        }
        return this._resourceTypes;
    }

    handleResourceChange(event) {
        this.selectedResourceType = event.detail.value;
        // now that we have changed the resource type we can remove any errors we may have had
        const combobox = this.template.querySelector(COMBOBOX_SELECTOR);
        if (!combobox.checkValidity()) {
            combobox.setCustomValidity(null);
            combobox.showHelpMessageIfInvalid();
        }
    }
}
