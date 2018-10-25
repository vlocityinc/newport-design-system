import { LightningElement, api, track, unwrap } from 'lwc';
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { LABELS } from "./flowPropertiesEditorLabels";
import { flowPropertiesEditorReducer } from "./flowPropertiesEditorReducer";
import { SaveType } from "builder_platform_interaction/saveType";
import { getProcessTypesMenuData } from "builder_platform_interaction/expressionUtils";
import { PropertyChangedEvent } from "builder_platform_interaction/events";
/**
 * Flow Properties property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Aniko van der Lee
 * @since 216
 */
export default class FlowPropertiesEditor extends LightningElement {
    @api
    get node() {
        return this.flowProperties;
    }

    set node(newValue) {
        this.flowProperties = unwrap(newValue);
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.flowProperties;
    }

    /**
     * public api function to run the rules from flow properties validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.flowProperties = flowPropertiesEditorReducer(this.flowProperties, event);
        const processTypeElement = this.template.querySelector('.process-type');
        if (this.flowProperties.processType && this.flowProperties.processType.error) {
            this.setElementErrorMessage(processTypeElement, this.flowProperties.processType.error);
        }
        return getErrorsFromHydratedElement(this.flowProperties);
    }

    /**
     * Internal state for the flow properties editor
     */
    @track
    flowProperties;

    labels = LABELS;

    _processTypes;

    /**
     * The value of the currently selected process type
     */
    get processType() {
        let retVal = null;
        if (this.flowProperties.processType) {
            retVal = this.flowProperties.processType.value;
        }
        return retVal;
    }

    /**
     * Indicates whether we are saving an existing to an existing flow definition (updating or saving as new version)
     */
    get savingExistingFlow() {
        return this.node.saveType === SaveType.NEW_VERSION || this.node.saveType === SaveType.UPDATE;
    }

    get showSaveTypeDescription() {
        let visible;
        switch (this.node.saveType) {
            case SaveType.CREATE:
            case SaveType.NEW_VERSION:
                visible = true;
                break;
            default:
                visible = false;
                break;
        }
        return visible;
    }

    get saveTypeDescription() {
        let description;
        switch (this.node.saveType) {
            case SaveType.CREATE:
                description = LABELS.createNewFlowDescription;
                break;
            case SaveType.NEW_VERSION:
                description = LABELS.saveAsNewVersionDescription;
                break;
            default:
                break;
        }
        return description;
    }

    /**
     * Returns the process types
     * If the process type menu data is not populated we call the expression utils to create the menu data
     * @returns {module:builder_platform_interaction/expressionUtils.MenuItem[]} Menu items representing allowed process types
     */
    get processTypes() {
        if (!this._processTypes) {
            this._processTypes = getProcessTypesMenuData();
        }
        return this._processTypes;
    }

    /**
     * Sets custom validation for lightning element when 'Ok' button on the property editor is clicked
     * @param {object} element - element that needs custom validation
     * @param {string} error - Any existing error message
     */
    setElementErrorMessage(element, error) {
        if (element) {
            if (error) {
                element.setCustomValidity(error);
            } else {
                element.setCustomValidity('');
            }
            element.showHelpMessageIfInvalid();
        }
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.flowProperties = flowPropertiesEditorReducer(this.flowProperties, event);
    }

    /**
     * @param {object} event - change event coming from the lightning-combobox component displaying process types
     */
    handleProcessTypeChange(event) {
        event.stopPropagation();
        const propChangedEvent = new PropertyChangedEvent(
            'processType',
            event.detail.value);
        this.flowProperties = flowPropertiesEditorReducer(this.flowProperties, propChangedEvent);
    }

    renderedCallback() {
        if (this.flowProperties.processType && this.flowProperties.processType.value && !this.flowProperties.processType.error) {
            const processTypeElement = this.template.querySelector('.process-type');
            this.setElementErrorMessage(processTypeElement, null);
        }
    }
}