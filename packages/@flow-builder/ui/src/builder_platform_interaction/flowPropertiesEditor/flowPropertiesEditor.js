import { LightningElement, api, track, unwrap } from 'lwc';
import {
    getValueFromHydratedItem,
    getErrorFromHydratedItem,
    getErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { LABELS } from './flowPropertiesEditorLabels';
import { flowPropertiesEditorReducer } from './flowPropertiesEditorReducer';
import {
    format,
    addCurlyBraces
} from 'builder_platform_interaction/commonUtils';
import { normalizeDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { SaveType } from 'builder_platform_interaction/saveType';
import {
    getProcessTypesMenuData,
    getRunInModesMenuData
} from 'builder_platform_interaction/expressionUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { SYSTEM_VARIABLES } from 'builder_platform_interaction/systemLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/**
 * Flow Properties property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Aniko van der Lee
 * @since 216
 */

export default class FlowPropertiesEditor extends LightningElement {
    _instanceLabelId = generateGuid();

    @api
    get node() {
        return this.flowProperties;
    }

    set node(newValue) {
        this.flowProperties = unwrap(newValue);
        this._originalLabel = this.flowProperties.label.value;
        this._originalApiName = this.flowProperties.name.value;
        this._originalDescription = this.flowProperties.description.value;
        this._originalProcessType = this.flowProperties.processType.value;
        this._originalRunInMode = this.flowProperties.runInMode.value;
        this._originalInterviewLabel = this.flowProperties.interviewLabel.value;
        if (this.flowProperties.saveType === SaveType.NEW_DEFINITION) {
            this.clearForNewDefinition();
        }
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
        const event = {
            type: VALIDATE_ALL,
            isSavingExistingFlow: this.savingExistingFlow
        };
        this.flowProperties = flowPropertiesEditorReducer(
            this.flowProperties,
            event
        );
        const processTypeElement = this.template.querySelector('.process-type');
        if (
            this.flowProperties.processType &&
            this.flowProperties.processType.error
        ) {
            this.setElementErrorMessage(
                processTypeElement,
                this.flowProperties.processType.error
            );
        }
        return getErrorsFromHydratedElement(this.flowProperties);
    }

    /**
     * Internal state for the flow properties editor
     */
    @track
    flowProperties;

    @track
    isAdvancedShown = false;

    labels = LABELS;

    _processTypes = getProcessTypesMenuData();
    _runInModes = getRunInModesMenuData();
    _originalLabel;
    _originalApiName;
    _originalDescription;
    _originalProcessType;
    _originalRunInMode;
    _originalInterviewLabel;

    saveAsTypeOptions = [
        {
            label: LABELS.saveAsNewVersionTypeLabel,
            value: SaveType.NEW_VERSION
        },
        { label: LABELS.saveAsNewFlowTypeLabel, value: SaveType.NEW_DEFINITION }
    ];

    isSavingExistingFlow() {
        return (
            this.node.saveType === SaveType.NEW_VERSION ||
            this.node.saveType === SaveType.UPDATE
        );
    }

    isSystemModeDisabled() {
        return this._runInModes == null || this._runInModes.length === 0;
    }

    get runInSystemMode() {
        return this.flowProperties.runInSystemMode;
    }

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

    get runInMode() {
        let retVal = null;
        if (this.flowProperties.runInMode) {
            retVal = this.flowProperties.runInMode.value;
        }
        return retVal;
    }

    /**
     * The label of the currently selected process type
     */
    get processTypeLabel() {
        let label = null;
        if (this.flowProperties.processType) {
            const processType = this._processTypes.find(pt => {
                return pt.value === this.flowProperties.processType.value;
            });

            label = processType ? processType.label : null;
        }
        return label;
    }

    get runInModeLabel() {
        let label = null;
        if (this.flowProperties.runInMode) {
            const runInMode = this._runInModes.find(pt => {
                return pt.value === this.flowProperties.runInMode.value;
            });

            label = runInMode ? runInMode.label : null;
        }
        return label;
    }

    /**
     * Indicates whether we are saving an existing to an existing flow definition (updating or saving as new version)
     */
    get savingExistingFlow() {
        return this.isSavingExistingFlow();
    }

    get systemModeDisabled() {
        return this.isSystemModeDisabled();
    }

    get showSaveAsTypePicker() {
        let visible;
        switch (this.node.saveType) {
            case SaveType.NEW_VERSION:
                visible = true;
                break;
            case SaveType.NEW_DEFINITION:
                if (this.node.canOnlySaveAsNewDefinition) {
                    visible = false;
                } else {
                    visible = true;
                }
                break;
            default:
                visible = false;
                break;
        }
        return visible;
    }

    /**
     * Returns the process types
     * @returns {module:builder_platform_interaction/expressionUtils.MenuItem[]} Menu items representing allowed process types
     */
    get processTypes() {
        return this._processTypes;
    }

    get runInModes() {
        return this._runInModes;
    }

    /**
     * Returns the localized string representing the last saved info
     * E.g. something like: '1/1/2018 by Jane Smith'
     * @return {string}
     */
    get lastModifiedText() {
        return format(
            LABELS.lastModifiedText,
            this.flowProperties.lastModifiedBy.value,
            normalizeDateTime(this.flowProperties.lastModifiedDate.value, true)
        );
    }

    /**
     * Returns field level help text for the process type selector if saving as a new flow
     * @param {string}
     */
    get processTypeFieldLevelHelp() {
        return this.isSavingExistingFlow() ? '' : LABELS.processTypeHelpText;
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

    updateProperty(propName, newValue, error = null) {
        const propChangedEvent = new PropertyChangedEvent(
            propName,
            newValue,
            error
        );
        this.flowProperties = flowPropertiesEditorReducer(
            this.flowProperties,
            propChangedEvent
        );
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.flowProperties = flowPropertiesEditorReducer(
            this.flowProperties,
            event
        );
        const flowLabelValue = getValueFromHydratedItem(
            this.flowProperties.label
        );
        const flowLabelError = getErrorFromHydratedItem(
            this.flowProperties.label
        );
        const interviewLabel = getValueFromHydratedItem(
            this.flowProperties.interviewLabel
        );
        if (flowLabelValue && !interviewLabel && !flowLabelError) {
            this.updateProperty(
                'interviewLabel',
                flowLabelValue +
                    ' ' +
                    addCurlyBraces(SYSTEM_VARIABLES.CURRENT_DATE_TIME)
            );
        }
    }

    /**
     * @param {object} event - change event coming from the radio-group component displaying save as types
     */
    handleSaveAsTypeChange(event) {
        event.stopPropagation();
        this.flowProperties.saveType = event.detail.value;
        if (this.flowProperties.saveType === SaveType.NEW_VERSION) {
            // If switching from new flow to new version then restore the original name, label, description, processtype, and interviewLabel
            this.updateProperty('label', this._originalLabel);
            this.updateProperty('name', this._originalApiName);
            this.updateProperty('description', this._originalDescription);
            this.updateProperty('processType', this._originalProcessType);
            this.updateProperty('interviewLabel', this._originalInterviewLabel);
        } else {
            this.clearForNewDefinition();
        }
    }

    clearForNewDefinition() {
        // If switching from new version to new flow, clear out label, name and description
        this.updateProperty('label', '');
        this.updateProperty('name', '');
        this.updateProperty('description', '');
        this.updateProperty('interviewLabel', '');
    }

    /**
     * @param {object} event - change event coming from the lightning-combobox component displaying process types
     */
    handleProcessTypeChange(event) {
        event.stopPropagation();
        this.updateProperty('processType', event.detail.value);
    }

    handleRunInModeChange(event) {
        event.stopPropagation();
        this.updateProperty('runInMode', event.detail.value);
    }

    handleAdvancedToggle(event) {
        event.stopPropagation();
        this.isAdvancedShown = !this.isAdvancedShown;
    }

    handleInstanceLabelChanged(event) {
        event.stopPropagation();
        this.updateProperty(
            'interviewLabel',
            event.detail.value,
            event.detail.error
        );
    }

    renderedCallback() {
        if (
            this.flowProperties.processType &&
            this.flowProperties.processType.value &&
            !this.flowProperties.processType.error
        ) {
            const processTypeElement = this.template.querySelector(
                '.process-type'
            );
            this.setElementErrorMessage(processTypeElement, null);
        }
    }
}
