// @ts-nocheck
import { LightningElement, api, track, unwrap } from 'lwc';
import {
    getValueFromHydratedItem,
    getErrorFromHydratedItem,
    getErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { LABELS } from './flowPropertiesEditorLabels';
import { flowPropertiesEditorReducer } from './flowPropertiesEditorReducer';
import { format, addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { normalizeDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { SaveType } from 'builder_platform_interaction/saveType';
import { getRunInModesMenuData, getApiVersionMenuData } from 'builder_platform_interaction/expressionUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import {
    SYSTEM_VARIABLES,
    getBuilderType,
    initVersioningInfoForProcessType,
    getDefaultApiVersion,
    getLatestApiVersion,
    getMinApiVersion,
    isVersioningDataInitialized,
    isVersioningSupported
} from 'builder_platform_interaction/systemLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { isRunInModeSupported, isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { loadVersioningData } from 'builder_platform_interaction/preloadLib';

/**
 * Flow Properties property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Aniko van der Lee
 * @since 216
 */

const TOGGLE_CLASS_SHOW = 'show-advanced-button';
const TOGGLE_CLASS_HIDE = 'hide-advanced-button';

export default class FlowPropertiesEditor extends LightningElement {
    _instanceLabelId = generateGuid();
    _toggleAdvancedClass = TOGGLE_CLASS_SHOW;
    _toggleAdvancedLabel = LABELS.showAdvanced;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    @api
    editorParams;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

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
        this._originalTriggerType = this.flowProperties.triggerType ? this.flowProperties.triggerType.value : null;
        this._originalRunInMode = this.flowProperties.runInMode.value;
        this._originalInterviewLabel = this.flowProperties.interviewLabel.value;
        this._originalApiVersion = this.flowProperties.apiVersion ? this.flowProperties.apiVersion : null;

        if (this.flowProperties.saveType === SaveType.NEW_DEFINITION) {
            this.clearForNewDefinition();
        }
    }

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.flowProperties;
    }

    /**
     * public api function to run the rules from flow properties validation library
     *
     * @returns {object} list of errors
     */
    @api
    validate() {
        const event = {
            type: VALIDATE_ALL,
            isSavingExistingFlow: this.savingExistingFlow
        };
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

    @track
    isAdvancedShown = false;

    @track
    showApiVersionComboBox = false;

    @track
    apiVersionSpinner = true;

    labels = LABELS;

    @track
    _processTypes = [];

    _runInModes = getRunInModesMenuData();
    _originalLabel;
    _originalApiName;
    _originalDescription;
    _originalProcessType;
    _originalTriggerType;
    _originalRunInMode;
    _originalInterviewLabel;
    _apiVersionsList;
    _originalApiVersion;

    saveAsTypeOptions = [
        {
            label: LABELS.saveAsNewVersionTypeLabel,
            value: SaveType.NEW_VERSION
        },
        { label: LABELS.saveAsNewFlowTypeLabel, value: SaveType.NEW_DEFINITION }
    ];

    isSavingExistingFlow() {
        return this.node.saveType === SaveType.NEW_VERSION || this.node.saveType === SaveType.UPDATE;
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
    get processTypeValue() {
        const entry = this.findCurrentProcessTypeEntry();
        if (entry) {
            return entry.value;
        }
        let retVal = null;
        if (this.flowProperties.processType) {
            retVal = this.flowProperties.processType.value;
            if (this.flowProperties.triggerType) {
                retVal += ' ' + this.flowProperties.triggerType.value;
            } else {
                retVal += ' ' + FLOW_TRIGGER_TYPE.NONE;
            }
        }
        return retVal;
    }

    /**
     * The label of the currently selected process type
     */
    get processTypeLabel() {
        const entry = this.findCurrentProcessTypeEntry();
        return entry ? entry.label : null;
    }

    /**
     * Finds a closest process type entry matching by process type and trigger type.
     */
    findCurrentProcessTypeEntry() {
        let result = null;
        if (this._processTypes && this.flowProperties.processType) {
            const processType = this.flowProperties.processType.value;
            if (this.flowProperties.triggerType) {
                const triggerType = this.flowProperties.triggerType.value;
                const value = processType + ' ' + triggerType;
                result = this._processTypes.find((item) => item.value === value);
                // Find a flow entry for a trigger, which is not represented with its own flow entry.
                if (!result) {
                    result = this._processTypes.find((item) => item.triggerTypes.some((type) => type === triggerType));
                }
            }
            if (!result) {
                const value = processType + ' ' + FLOW_TRIGGER_TYPE.NONE;
                result = this._processTypes.find((item) => item.value === value);
            }
        }
        return result;
    }

    set apiVersion(value) {
        this.updateProperty('apiVersion', value);
    }

    get apiVersion() {
        let retVal = null;
        if (this.flowProperties.apiVersion && this.flowProperties.apiVersion.value) {
            retVal = String(this.flowProperties.apiVersion.value);
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

    get runInModeLabel() {
        let label = null;
        if (this.flowProperties.runInMode) {
            const runInMode = this._runInModes.find((pt) => {
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
     * Returns the localized string representing the last saved info
     * E.g. something like: '1/1/2018 by Jane Smith'
     *
     * @returns {string}
     */
    get lastModifiedText() {
        if (this.flowProperties.lastModifiedBy && this.flowProperties.lastModifiedBy.value) {
            return format(
                LABELS.lastModifiedText,
                this.flowProperties.lastModifiedBy.value,
                normalizeDateTime(this.flowProperties.lastModifiedDate.value, true)
            );
        }
        return '';
    }

    /**
     * Returns field level help text for the process type selector if saving as a new flow
     *
     * @param {string}
     */
    get processTypeFieldLevelHelp() {
        return this.isSavingExistingFlow() ? '' : LABELS.processTypeHelpText;
    }

    get runInModeHelp() {
        return LABELS.runInModeHelpText;
    }

    get showRunInModeCombobox() {
        return isRunInModeSupported(getValueFromHydratedItem(this.flowProperties.triggerType));
    }

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_FLOW_ENTRIES, {
            builderType: getBuilderType()
        }).then((flowEntries) => {
            this._processTypes = flowEntries
                // Get rid of all recommended flow templates. The rest should be the list of "blank" entries.
                .filter((item) => !(item.recommended && typeof item.flow === 'string'))
                // Create a list of items for the combobox
                .map(({ label, processType, defaultTriggerType = FLOW_TRIGGER_TYPE.NONE, triggerTypes = [] }) => ({
                    label,
                    value: processType + ' ' + defaultTriggerType,
                    triggerTypes
                }));
        });

        if (isVersioningDataInitialized()) {
            initVersioningInfoForProcessType(this._originalProcessType);
            this.initApiVersion(true);
            this.apiVersionSpinner = false;
        } else {
            loadVersioningData().then(() => {
                this.initApiVersion(true);
                this.apiVersionSpinner = false;
            });
        }
    }

    initApiVersion(setOriginalValue) {
        if (isVersioningDataInitialized()) {
            this.showApiVersionComboBox = isVersioningSupported();
            if (this.showApiVersionComboBox) {
                this._apiVersionsList = getApiVersionMenuData();
                if (setOriginalValue || this.apiVersion == null) {
                    this.apiVersion =
                        this._originalApiVersion !== null ? this._originalApiVersion : this.defaultApiVersion();
                }
            } else {
                this.apiVersion = null;
            }
        }
    }

    defaultApiVersion() {
        return this.node.saveType === SaveType.CREATE ? getLatestApiVersion() : getDefaultApiVersion();
    }

    /**
     * Sets custom validation for lightning element when 'Ok' button on the property editor is clicked
     *
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
        const propChangedEvent = new PropertyChangedEvent(propName, newValue, error);
        this.flowProperties = flowPropertiesEditorReducer(this.flowProperties, propChangedEvent);
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
        const { interviewLabel, label } = this.flowProperties;
        const flowLabelValue = getValueFromHydratedItem(label);
        const flowLabelError = getErrorFromHydratedItem(label);
        const newInterviewLabel = getValueFromHydratedItem(interviewLabel);
        if (flowLabelValue && !newInterviewLabel && !flowLabelError) {
            this.updateProperty(
                'interviewLabel',
                `${flowLabelValue} ${addCurlyBraces(SYSTEM_VARIABLES.CURRENT_DATE_TIME)}`
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
            this.updateProperty('triggerType', this._originalTriggerType);
            this.updateProperty('interviewLabel', this._originalInterviewLabel);

            initVersioningInfoForProcessType(this._originalProcessType);
            this.initApiVersion(true);
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
        let processType = event.detail.value;
        let triggerType;
        if (event.detail.value) {
            const i = event.detail.value.indexOf(' ');
            if (i !== -1) {
                processType = event.detail.value.substring(0, i);
                triggerType = event.detail.value.substring(i + 1);
            }
        }
        this.updateProperty('processType', processType);

        // This is a not so good way to support one entry for After/Before Save triggers.
        // Revert to the original trigger type
        if (
            processType === this._originalProcessType &&
            processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW &&
            isRecordChangeTriggerType(triggerType) &&
            isRecordChangeTriggerType(this._originalTriggerType)
        ) {
            triggerType = this._originalTriggerType;
        }

        if (triggerType === FLOW_TRIGGER_TYPE.NONE) {
            triggerType = null;
        }
        this.updateProperty('triggerType', triggerType);

        initVersioningInfoForProcessType(processType);
        this.initApiVersion(false);
        if (this.showApiVersionComboBox && this.apiVersion < getMinApiVersion()) {
            this.apiVersion = getMinApiVersion();
        }
    }

    handleRunInModeChange(event) {
        event.stopPropagation();
        this.updateProperty('runInMode', event.detail.value);
    }

    handleAdvancedToggle(event) {
        const { showAdvanced, hideAdvanced } = LABELS;
        event.stopPropagation();
        this.isAdvancedShown = !this.isAdvancedShown;
        this._toggleAdvancedLabel = !this.isAdvancedShown ? showAdvanced : hideAdvanced;
        this._toggleAdvancedClass = !this.isAdvancedShown ? TOGGLE_CLASS_SHOW : TOGGLE_CLASS_HIDE;
    }

    handleApiVersionChange(event) {
        event.stopPropagation();
        this.apiVersion = parseInt(event.detail.value, 10);
    }

    handleInstanceLabelChanged(event) {
        event.stopPropagation();
        this.updateProperty('interviewLabel', event.detail.value, event.detail.error);
    }

    renderedCallback() {
        if (
            this.flowProperties.processType &&
            this.flowProperties.processType.value &&
            !this.flowProperties.processType.error
        ) {
            const processTypeElement = this.template.querySelector('.process-type');
            this.setElementErrorMessage(processTypeElement, null);
        }
    }
}
