import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement, getValueFromHydratedItem, GUID_SUFFIX } from 'builder_platform_interaction-data-mutation-lib';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { variableReducer } from './variable-reducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { PropertyEditorWarningEvent } from 'builder_platform_interaction-events';
import { filterMatches, getElementsForMenuData } from 'builder_platform_interaction-expression-utils';
import BaseResourcePicker from 'builder_platform_interaction-base-resource-picker';
import { getRulesForContext, getRHSTypes, RULE_OPERATOR} from 'builder_platform_interaction-rule-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

// the property names in a variable element (after mutation)
const VARIABLE_FIELDS = {
    DATA_TYPE: 'dataType',
    DESCRIPTION: 'description',
    IS_COLLECTION: 'isCollection',
    IS_INPUT: 'isInput',
    IS_OUTPUT: 'isOutput',
    NAME: 'name',
    OBJECT_TYPE: 'objectType',
    SCALE: 'scale',
    DEFAULT_VALUE: 'defaultValue',
};

// TODO: use labels W-4954505
const EXTERNAL_ACCESS_VALUES = [
    { label: 'Use as Input', value: VARIABLE_FIELDS.IS_INPUT },
    { label: 'Use as Output', value: VARIABLE_FIELDS.IS_OUTPUT }
];

// TODO: use labels W-4954505
const sobjectPickerLabel = 'Salesforce Object';
const collectionLabel = 'Collection';
const externalAccessLabel = 'Allow External Access';

const sobjectPickerPlaceholder = 'Find an object...';

// fields on which warning can be set in variable editor
const VARIABLE_WARNING_FIELDS = [VARIABLE_FIELDS.NAME, VARIABLE_FIELDS.IS_INPUT, VARIABLE_FIELDS.IS_OUTPUT];
// TODO: use FLOW_DATA_TYPE from service once availiable
const DATATYPES_WITH_NO_DEFAULT_VALUE = [FLOW_DATA_TYPE.PICKLIST.value, FLOW_DATA_TYPE.MULTI_PICKLIST.value, FLOW_DATA_TYPE.SOBJECT.value];

const flowDataTypeMenuItems = Object.values(FLOW_DATA_TYPE);

// TODO: use labels W-4954505
const dataTypeHelpText = 'Data type cannot be changed while this resource is being referenced in your flow';
const collectionHelpText = 'Use collection variables to store valeus with the same data type together. Iterate through ' +
    'your collection variable by using a loop';
const externalAccessHelpText = 'Use as Input: Variables can be set at the start of flow via URL parameters, Visualforce ' +
    'controllers, or subflow inputs. Use as output: Variables can be accessed from Visualforce controllers and master ' +
    'flows when this flow finishes.';
const warningMessage = 'Changing this field may result in runtime errors when this flow is called by another flow.';

/**
 * Variable property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Alejandro Lopez
 * @since 216
 */
export default class VariableEditor extends Element {
    // previous value of external access input output checkbox. Used to assess warning.
    _externalAccessPreviousValues = new Set();

    // currently selected external access values. Used to assess warning.
    _externalAccessSelectedValues = [];

    // previous dev name from label description. Used to assess warning.
    _devNamePreviousValue = '';

    _fullDefaultValueMenuData = {};

    _defaultValueMenuData;

    _lastRecordedDataType = '';

    /**
     * Internal state for the variable editor
     */
    @track
    variableResource;

    @api
    get node() {
        return this.variableResource;
    }

    @api
    set node(newValue) {
        // TODO: update when W-4889306 is closed
        this.variableResource = unwrap(newValue);
        this._devNamePreviousValue = this.variableResource.name;
        this._lastRecordedDataType = getValueFromHydratedItem(this.variableResource.dataType);

        this.initializeExternalAccessValues();
        this.fetchDefaultValueMenuData();
    }

    // used to keep track of whether this is an existing variable resource
    @api
    isNewMode = false;

    /**
     * Public api function to return the unwrapped node
     * Called by the property editor controller on "OK"
     * @returns {object} node - unwrapped node
     */
    @api
    getNode() {
        // TODO: might have to update when W-4889306 is closed
        return unwrap(this.variableResource);
    }

    get dataType() {
        return getValueFromHydratedItem(this.variableResource.dataType);
    }

    // we want to disable certain fields based on whether we are editing an existing variable or a new variable
    get isFieldDisabled() {
        return !this.isNewMode;
    }

    get dataTypeList() {
        return flowDataTypeMenuItems;
    }

    get dataTypeHelpText() {
        // TODO: use labels W-4954505
        return !this.isNewMode ? dataTypeHelpText : null;
    }

    get collectionHelpText() {
        // TODO: use labels W-4954505
        return collectionHelpText;
    }

    /**
     * Returns the external access options based on the data in variableResource.
     * The values returned in array should match with EXTERNAL_ACCESS_VALUES value attribute.
     * @return {Array} with options in format the checkbox-group expects. eg: ['isInput', 'isOutput']
     */
    get externalAccessValue() {
        return [VARIABLE_FIELDS.IS_INPUT, VARIABLE_FIELDS.IS_OUTPUT].filter(value => {
            return this.variableResource[value];
        });
    }

    /**
     * External access input output checkbox values
     * @return {Array} array of input for checkbox group
     */
    get externalAccessOptions() {
        return EXTERNAL_ACCESS_VALUES;
    }

    /**
     * Help text for external access input output checkboxes.
     * @return {string} help text for external access.
     */
    get externalAccessHelpText() {
        return externalAccessHelpText;
    }

    /**
     * Returns the default value for the variable resource.
     * TODO: To string logic will change once combobox latest refactor goes in.
     * @return {String} returns the default value for the variable resource if exists, otherwise empty string.
     */
    get defaultValue() {
        const defaultValue = getValueFromHydratedItem(this.variableResource.defaultValue);
        if (defaultValue && (typeof defaultValue === 'number' || typeof defaultValue === 'boolean')) {
            return defaultValue.toString();
        }
        return defaultValue;
    }

    get objectType() {
        return getValueFromHydratedItem(this.variableResource.objectType);
    }

    get hasObjectType() {
        return !!this.variableResource.objectType;
    }

    /**
     * No Default Value for Picklist, Multipicklist and SObject and collection variables.
     * @return {boolean} false for Picklist, Multipicklist and SObject data type or collection variables, otherwise true.
     */
    get hasDefaultValue() {
        return !(this.variableResource.isCollection || (this.dataType && DATATYPES_WITH_NO_DEFAULT_VALUE.includes(this.dataType)));
    }

    get elementType() {
        return ELEMENT_TYPE.VARIABLE;
    }

    /**
     * Menu data for the default value combobox.
     * @return {*} menu data in format grouped-combobox expects
     */
    get defaultValueMenuData() {
        return this._defaultValueMenuData;
    }

    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.sobjectPickerLabel,
            this.sobjectPickerPlaceholder,
            undefined,
            undefined,
            true,
            this.isFieldDisabled,
            this.dataType,
        );
    }

    get sobjectPickerLabel() {
        return sobjectPickerLabel;
    }

    get sobjectPickerPlaceholder() {
        return sobjectPickerPlaceholder;
    }

    get collectionLabel() {
        return collectionLabel;
    }

    get externalAccessLabel() {
        return externalAccessLabel;
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {object} event property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        this.handleChange(event, event.detail.propertyName);
        if (event.detail.propertyName === VARIABLE_FIELDS.NAME) {
            this.assessWarning();
        }
    }

    handleDataTypeSelect(event) {
        this.handleChange(event, VARIABLE_FIELDS.DATA_TYPE);
        // TODO: handle clearing of fields when data type is changed

        const selectedDataType = getValueFromHydratedItem(this.variableResource.defaultValue);
        if (this._lastRecordedDataType !== selectedDataType) {
            this._lastRecordedDataType = selectedDataType;
            this.fetchDefaultValueMenuData();
        }
    }

    handleCollectionChange(event) {
        const isCollection = event.detail.checked;
        this.updateProperty(VARIABLE_FIELDS.IS_COLLECTION, isCollection, null);
        if (!isCollection && !this._defaultValueMenuData) {
            this.fetchDefaultValueMenuData();
        }
    }

    /**
     * Handles the value change for external access checkbox group.
     * @param {object} event onchange from checkbox group
     */
    handleExternalAccessPropertyChanged(event) {
        // reset the values since the event has info about only selected values
        this.variableResource[VARIABLE_FIELDS.IS_INPUT] = false;
        this.variableResource[VARIABLE_FIELDS.IS_OUTPUT] = false;
        this._externalAccessSelectedValues = event.detail.value;
        this._externalAccessSelectedValues.forEach((propertyName) => {
            this.variableResource[propertyName] = true;
        });
    }

    /**
     * Handles the blur even for external access checkbox group.
     */
    handleExternalAccessOnBlur() {
        this.assessWarning();
    }

    /**
     * Handles the value change event from default value combobox.
     * @param {object} event - Value changed event from combobox.
     */
    handleDefaultValuePropertyChanged(event) {
        this.handleFlowComboboxChange(event, VARIABLE_FIELDS.DEFAULT_VALUE);
    }

    /**
     * Use the filter matches utils to filter the combobox data when user types the search text
     * @param {object} event Filter matches event from combobox.
     */
    handleDefaultValueFilterMatches(event) {
        event.stopPropagation();
        this._defaultValueMenuData = filterMatches(event.detail.value, this._fullDefaultValueMenuData);
    }

    handleObjectTypeChange(event) {
        this.handleFlowComboboxChange(event, VARIABLE_FIELDS.OBJECT_TYPE);
    }

    /** *********************************/
    /*         Helper methods           */
    /** *********************************/

    /**
     * Helper method to update the property based extracting value from the event.
     * @param {object} event to handle
     * @param {string} propertyName property name to update
     */
    handleChange(event, propertyName) {
        event.stopPropagation();

        const value = event.detail.value;
        const error = event.detail.error;

        this.updateProperty(propertyName, value, error);
    }

    /**
     * Helper method to handle a flow combobox value changed event and update the given property name
     * @param {ComboboxValueChangedEvent} event flow combobobx value changed event to handle
     * @param {String} propertyName proeprty name to update
     */
    handleFlowComboboxChange(event, propertyName) {
        event.stopPropagation();
        const payload = this.getComboboxEventPayload(event);
        const error = event.detail.error;
        let valueToUpdate = payload;

        // the value we want to dispatch is inside
        if (propertyName === VARIABLE_FIELDS.OBJECT_TYPE) {
            // the value of is the api name of the selected sobject
            valueToUpdate = payload.value;
        }
        // for defaultValue extract out the guid and value from menu item
        if (propertyName === VARIABLE_FIELDS.DEFAULT_VALUE) {
            let defaultValueGuidValue;
            // if we have a display text then we have a select, otherwise we are dealing with a literal
            if (payload.displayText) {
                valueToUpdate = payload.displayText;
                defaultValueGuidValue = payload.value;
            } else {
                defaultValueGuidValue = '';
            }
            this.updateProperty(VARIABLE_FIELDS.DEFAULT_VALUE + GUID_SUFFIX, defaultValueGuidValue, null);
        }
        this.updateProperty(propertyName, valueToUpdate, error);
    }

    /**
     * Does the update property action with passed in property name, value and error.
     * @param {String} propertyName to update
     * @param {String} value to update with
     * @param {String} error if any
     */
    updateProperty(propertyName, value, error) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.variableResource = variableReducer(this.variableResource, action);
    }

    /**
     * Initialize the external access previous and selected values.
     */
    initializeExternalAccessValues() {
        this.externalAccessValue.forEach(value => {
            this._externalAccessPreviousValues.add(value);
            this._externalAccessSelectedValues.push(value);
        });
    }

    /**
     * Assess warnings and fire the property editor warning event
     */
    assessWarning() {
        this.clearWarnings();

        // If input or output was true and dev name is updated show warning
        const hasDevNameUpdated = getValueFromHydratedItem(this.variableResource.name)
            !== getValueFromHydratedItem(this._devNamePreviousValue);
        const wasExternalAccessTrue = this._externalAccessPreviousValues.size > 0;
        if (hasDevNameUpdated && wasExternalAccessTrue) {
            this.fireWarningEvent(VARIABLE_FIELDS.NAME, warningMessage);
        }

        // check if input output was true and now its false, if so show warning
        this._externalAccessPreviousValues.forEach(value => {
            if (!this._externalAccessSelectedValues.includes(value)) {
                this.fireWarningEvent(value, warningMessage);
            }
        });
    }

    /**
     * Clears warning from all the fields on which warning can be set.
     */
    clearWarnings() {
        VARIABLE_WARNING_FIELDS.forEach(propertyName => {
            this.fireWarningEvent(propertyName, null);
        });
    }

    /**
     * Fires propeditorwarning event with warning message.
     * @param {string} propertyName to set the warning for
     * @param {string} message the warning message
     */
    fireWarningEvent(propertyName, message) {
        const warningEvent = new PropertyEditorWarningEvent(propertyName, message);
        this.dispatchEvent(warningEvent);
    }

    /**
     * Fetch the element data based on the data type of the variable.
     */
    fetchDefaultValueMenuData() {
        if (this.hasDefaultValue) {
            const element = ELEMENT_TYPE.VARIABLE;
            const rhsTypes = getRHSTypes(this.variableResource, RULE_OPERATOR.ASSIGN, getRulesForContext({elementType: ELEMENT_TYPE.VARIABLE}));
            this._fullDefaultValueMenuData = this._defaultValueMenuData = getElementsForMenuData({element}, rhsTypes, true /* include new resource */);
        }
    }

    /**
     * Extract out value from the event or item if payload is from combobox
     * Ex: If a select happened it will have an item as payload
     * Ex: if a literal is typed then the event will not have an item, just a display text
     * @param {Object} event Event for the data type
     * @return {Object|String} value of the event payload
     */
    getComboboxEventPayload(event) {
        // if it is a combobox value changed event we have two cases: literals or item select
        return event.detail.item ? event.detail.item : event.detail.displayText;
    }

    /** *********************************/
    /*       Validation methods         */
    /** *********************************/

    /**
     * public api function to run the rules from assignment validation library
     * TODO: validation W-4900878
     * @returns {object} list of errors
     */
    @api
    validate() {
        // NOTE: if we find there is a case where an error can happen on a field without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        return getErrorsFromHydratedElement(this.variableResource);
    }
}