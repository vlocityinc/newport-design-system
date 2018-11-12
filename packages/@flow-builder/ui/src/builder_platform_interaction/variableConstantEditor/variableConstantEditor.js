import { LightningElement, api, track, unwrap } from 'lwc';
import { dehydrate, getErrorsFromHydratedElement, getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
import { createAction, PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { variableConstantReducer } from "./variableConstantReducer";
import { FLOW_DATA_TYPE, FEROV_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { PropertyEditorWarningEvent } from "builder_platform_interaction/events";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { LABELS } from "./variableConstantEditorLabels";
import { getResourceByUniqueIdentifier, getFerovDataTypeForValidId, mutateFlowResourceToComboboxShape, getItemOrDisplayText } from "builder_platform_interaction/expressionUtils";
import { isObject } from "builder_platform_interaction/commonUtils";
import { fetchFieldsForEntity } from "builder_platform_interaction/sobjectLib";
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { DEFAULT_VALUE_DATA_TYPE_PROPERTY } from 'builder_platform_interaction/elementFactory';
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import { deepCopy } from 'builder_platform_interaction/storeLib';


// the property names in a variable element (after mutation), a subset of these are also constant properties
const VARIABLE_CONSTANT_FIELDS = {
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

const EXTERNAL_ACCESS_VALUES = [
    { label: LABELS.externalAccessInput, value: VARIABLE_CONSTANT_FIELDS.IS_INPUT },
    { label: LABELS.externalAccessOutput, value: VARIABLE_CONSTANT_FIELDS.IS_OUTPUT }
];

// fields on which warning can be set in variable/constant editor
const WARNING_FIELDS = [VARIABLE_CONSTANT_FIELDS.NAME, VARIABLE_CONSTANT_FIELDS.IS_INPUT, VARIABLE_CONSTANT_FIELDS.IS_OUTPUT];
// TODO W-5303776: Get information about which data types are allowed for each resource,
// and which data types can have a default value, from the service once it's complete
const DATATYPES_WITH_NO_DEFAULT_VALUE = [FLOW_DATA_TYPE.PICKLIST.value, FLOW_DATA_TYPE.MULTI_PICKLIST.value, FLOW_DATA_TYPE.SOBJECT.value];
const flowDataTypeVariableMenuItems = Object.values(FLOW_DATA_TYPE);
const flowDataTypeConstantMenuItems = [FLOW_DATA_TYPE.STRING, FLOW_DATA_TYPE.NUMBER, FLOW_DATA_TYPE.CURRENCY,
    FLOW_DATA_TYPE.DATE, FLOW_DATA_TYPE.BOOLEAN];

// TODO: This is being used by the assessWarning function, which is not being used at this time. I will leave
// this here hard coded and we will move it to the labels file if and when we start using the assessWarning function.
const warningMessage = 'Changing this field may result in runtime errors when this flow is called by another flow.';

/**
 * Variable/constant property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Alejandro Lopez
 * @since 216
 */
export default class VariableConstantEditor extends LightningElement {
    // previous value of external access input output checkbox. Used to assess warning.
    _externalAccessPreviousValues = new Set();

    // currently selected external access values. Used to assess warning.
    _externalAccessSelectedValues = [];

    // previous dev name from label description. Used to assess warning.
    _devNamePreviousValue = '';

    _lastRecordedDataType = '';

    // rules for the default value ferovResourcePicker
    _rules = [];

    /**
     * Internal state for the variable/constant editor
     */
    @track
    variableConstantResource;

    _elementType;

    @api
    get node() {
        return this.variableConstantResource;
    }

    set node(newValue) {
        this._elementType = newValue.elementType;
        this.variableConstantResource = unwrap(newValue);
        this._devNamePreviousValue = this.variableConstantResource.name;
        this._lastRecordedDataType = getValueFromHydratedItem(this.variableConstantResource.dataType);
        // these rules are only used by variable editor to fetch allowed types. Constant editors use element config
        this._rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementType);
        this.initializeExternalAccessValues();
    }

    // used to keep track of whether this is an existing variable/constant resource
    @api
    isNewMode = false;

    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.variableConstantResource;
    }

    get apiNameLabel() {
        return LABELS.apiNameLabel;
    }

    get dataType() {
        return getValueFromHydratedItem(this.variableConstantResource.dataType);
    }

    get dataTypePickerValue() {
        const dataTypePickerValueObj = { dataType : getValueFromHydratedItem(this.variableConstantResource.dataType) };
        if (this.isVariable) {
            dataTypePickerValueObj.scale = this.variableConstantResource.scale;
            dataTypePickerValueObj.isCollection = this.variableConstantResource.isCollection;
        }
        return dataTypePickerValueObj;
    }

    get hideNewResourceButton() {
        return this.isNewMode;
    }

    // we want to disable certain fields based on whether we are editing an existing variable/constant or a new variable/constant
    get isFieldDisabled() {
        return !this.isNewMode;
    }

    get dataTypeList() {
        return this.isVariable ? flowDataTypeVariableMenuItems : flowDataTypeConstantMenuItems;
    }

    get dataTypeHelpText() {
        if (!this.isNewMode) {
            return this.isVariable ? LABELS.variableDataTypeHelpText : LABELS.constantDataTypeHelpText;
        }
        return null;
    }

    get collectionHelpText() {
        return LABELS.collectionHelpText;
    }

    /**
     * Returns the external access options based on the data in variableConstantResource.
     * The values returned in array should match with EXTERNAL_ACCESS_VALUES value attribute.
     * @return {Array} with options in format the checkbox-group expects. eg: ['isInput', 'isOutput']
     */
    get externalAccessValue() {
        return [VARIABLE_CONSTANT_FIELDS.IS_INPUT, VARIABLE_CONSTANT_FIELDS.IS_OUTPUT].filter(value => {
            return this.variableConstantResource[value];
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
        return LABELS.externalAccessHelpText;
    }

    get rulesForVariableDefaultValue() {
        return this._rules;
    }

    /**
     * Returns the default value for the variable/constant resource.
     * @return {String|Object} returns the default value for the variable/constant resource if exists, otherwise empty string.
     */
    get defaultValue() {
        const defaultValue = getValueFromHydratedItem(this.variableConstantResource.defaultValue);
        const defaultValueDataType = getValueFromHydratedItem(this.variableConstantResource.defaultValueDataType);
        if (defaultValueDataType === FEROV_DATA_TYPE.REFERENCE) {
            return {
                text: defaultValue,
                displayText: defaultValue,
                value: defaultValue,
            };
        }
        if (defaultValue && (typeof defaultValue === 'number' || typeof defaultValue === 'boolean')) {
            return defaultValue.toString();
        }
        return defaultValue;
    }

    get objectType() {
        return getValueFromHydratedItem(this.variableConstantResource.objectType);
    }

    get hasObjectType() {
        return this.dataType === FLOW_DATA_TYPE.SOBJECT.value;
    }

    /**
     * No Default Value for Picklist, Multipicklist and SObject and collection variables.
     * @return {boolean} false for Picklist, Multipicklist and SObject data type or collection variables, otherwise true.
     */
    get hasDefaultValue() {
        return !this.variableConstantResource.isCollection && this.dataType && !DATATYPES_WITH_NO_DEFAULT_VALUE.includes(this.dataType);
    }

    get defaultValueComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.isVariable ? LABELS.defaultValuePickerLabel : LABELS.valuePickerLabel,
            LABELS.defaultValuePlaceholder,
            this.variableConstantResource.defaultValue.error,
            true,
            false,
            false,
            this.dataType,
            this.isVariable // enableFieldDrilldown
        );
    }

    get elementType() {
        return this._elementType;
    }

    get isVariable() {
        return this._elementType === ELEMENT_TYPE.VARIABLE;
    }

    get isConstant() {
        return this._elementType === ELEMENT_TYPE.CONSTANT;
    }

    get defaultValueElementParam() {
        return this.isVariable ? this.variableConstantResource :
            {
                isCollection: false,
                dataType: this.dataType,
            };
    }

    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.sObjectPickerLabel,
            LABELS.sObjectPickerPlaceholder,
            this.variableConstantResource.objectType.error,
            false,
            true,
            this.isFieldDisabled,
            this.dataType,
        );
    }

    get sobjectPickerLabel() {
        return LABELS.sObjectPickerLabel;
    }

    get sobjectPickerPlaceholder() {
        return LABELS.sObjectPickerPlaceholder;
    }

    get externalAccessLabel() {
        return LABELS.externalAccessSectionLabel;
    }

    isDataTypeOrCollectionChange(dataType, isCollection) {
        return this.dataType !== dataType || this.variableConstantResource.isCollection !== isCollection;
    }

    /**
     * Based on the new dataType/scale/collection values, clear either default value, scale, or object type fields
     * @param {Object} value the object containing the new dataType, scale, and collection values
     */
    clearOnDataTypeChange(value) {
        // we want to clear the sobject value when switching away from it (this prevents false negatives on validation)
        if (this.hasObjectType && value.dataType !== FLOW_DATA_TYPE.SOBJECT.value) {
            this.updateProperty(VARIABLE_CONSTANT_FIELDS.OBJECT_TYPE, null, null);
        } else if (this.isDataTypeOrCollectionChange(value.dataType, value.isCollection)) {
            // we want to clear the default value and scale when either switching data types or the collection status
            this.updateDefaultValueWithLiteral(null, null);
            if (this.isVariable) { // Don't want to set the scale if this is a constant
                value.scale = null;
            }
        }
        // we want to set the scale to null when changing to a data type that does not have scale
        if (this.isVariable && value.dataType !== FLOW_DATA_TYPE.NUMBER.value && value.dataType !== FLOW_DATA_TYPE.CURRENCY.value) {
            value.scale = null;
        }
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {object} event property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        this.handleChange(event, event.detail.propertyName);
        if (event.detail.propertyName === VARIABLE_CONSTANT_FIELDS.NAME) {
            this.assessWarning();
        }
    }

    handleDataTypeChanged(event) {
        event.stopPropagation();
        const value = event.detail.value;
        value.isVariable = this.isVariable;
        // clear any values that need to be cleared (ie: default value, object type)
        this.clearOnDataTypeChange(value);
        const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value });
        this.variableConstantResource = variableConstantReducer(this.variableConstantResource, action);
    }

    /**
     * Handles the value change for external access checkbox group.
     * @param {object} event onchange from checkbox group
     */
    handleExternalAccessPropertyChanged(event) {
        // reset the values since the event has info about only selected values
        this.variableConstantResource[VARIABLE_CONSTANT_FIELDS.IS_INPUT] = false;
        this.variableConstantResource[VARIABLE_CONSTANT_FIELDS.IS_OUTPUT] = false;
        this._externalAccessSelectedValues = event.detail.value;
        this._externalAccessSelectedValues.forEach((propertyName) => {
            this.variableConstantResource[propertyName] = true;
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
      * @param {Object} event the value changed event from combobox
      */
    handleDefaultValuePropertyChanged(event) {
        this.updateDefaultValue(event);
    }

    handleObjectTypeChange(event) {
        this.updateObjectType(event, event.detail.error);
    }

    handleObjectTypeSelect(event) {
        this.updateObjectType(event, null);
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
        const error = event.detail.error || null;

        this.updateProperty(propertyName, value, error);
    }

    updateObjectType(event, error) {
        event.stopPropagation();

        const itemOrDisplayText = getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;

        this.updateProperty(VARIABLE_CONSTANT_FIELDS.OBJECT_TYPE, value, error);
    }

    /**
     * Helper method to handle a flow combobox value changed event and update the given property name
     * @param {ComboboxStateChangedEvent} event flow combobobx value changed event to handle
     */
    updateDefaultValue(event) {
        event.stopPropagation();

        const error = event.detail.error;
        // if there's an error, only store the display text even if there's an item (an item means something was selected from the dropdown)
        const itemOrDisplayText = error ? event.detail.displayText : getItemOrDisplayText(event);

        // if it's an object, we know something was selected from the menu data & there was no error
        if (isObject(itemOrDisplayText)) {
            // set the correct ferov data type based on the user selected data type
            const element = getResourceByUniqueIdentifier(itemOrDisplayText.value);
            if (element || itemOrDisplayText.parent) {
                this.updateDefaultValueWithElement(itemOrDisplayText, error);
            } else {
                // the combobox didn't send an error but we couldn't find a resource to match this item, so something is wrong
                // the main use case for this is if a user leaves the combobox with only {!$Flow.} selected
                this.updateDefaultValueWithLiteral(event.detail.displayText, genericErrorMessage);
            }
        } else {
            this.updateDefaultValueWithLiteral(itemOrDisplayText, error);
        }
    }

    updateDefaultValueWithElement(item, error) {
        const dataType = getFerovDataTypeForValidId(item.value);

        this.updateProperty(DEFAULT_VALUE_DATA_TYPE_PROPERTY, dataType, null);
        this.updateProperty(VARIABLE_CONSTANT_FIELDS.DEFAULT_VALUE, item.value, error);
    }

    updateDefaultValueWithLiteral(displayText, error) {
        this.updateProperty(DEFAULT_VALUE_DATA_TYPE_PROPERTY, this.dataType, null);
        this.updateProperty(VARIABLE_CONSTANT_FIELDS.DEFAULT_VALUE, displayText, error);
    }

    /**
     * Does the update property action with passed in property name, value and error.
     * @param {String} propertyName to update
     * @param {String} value to update with
     * @param {String} error if any
     */
    updateProperty(propertyName, value, error) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.variableConstantResource = variableConstantReducer(this.variableConstantResource, action);
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
        const hasDevNameUpdated = getValueFromHydratedItem(this.variableConstantResource.name)
            !== getValueFromHydratedItem(this._devNamePreviousValue);
        const wasExternalAccessTrue = this._externalAccessPreviousValues.size > 0;
        if (hasDevNameUpdated && wasExternalAccessTrue) {
            this.fireWarningEvent(VARIABLE_CONSTANT_FIELDS.NAME, warningMessage);
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
        WARNING_FIELDS.forEach(propertyName => {
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
     * Checks if the ferovDataType property exists with value 'reference'.
     * @return {boolean} Returns true for ferovDataType 'reference', otherwise false.
     */
    hasFerovDataTypeRef() {
        return this.variableConstantResource[DEFAULT_VALUE_DATA_TYPE_PROPERTY] === FEROV_DATA_TYPE.REFERENCE;
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
        const event = { type: VALIDATE_ALL };
        this.variableConstantResource = variableConstantReducer(this.variableConstantResource, event);
        const errors = getErrorsFromHydratedElement(this.variableConstantResource);
        // fetch fields for valid sobject variables
        this.fetchSobjectFields(errors);
        return errors;
    }

    /**
     * For valid sobject variables, fetch the fields for future use
     * @param {Array} errors list of errors
     */
    fetchSobjectFields(errors) {
        const objectType = getValueFromHydratedItem(this.variableConstantResource.objectType);
        // if there are no errors & the chosen variable is an sobject, fetch the fields
        if (!errors.length && objectType && !this.variableConstantResource.isCollection) {
            // add sobject variable to combobox cache in required shape
            // we call dehydrate here since that is the shape in store as well. This should stay consistent
            const clonedSObjectVariableResource = deepCopy(this.variableConstantResource);
            const sObjectInComboboxShape = mutateFlowResourceToComboboxShape(dehydrate(clonedSObjectVariableResource));
            addToParentElementCache(sObjectInComboboxShape.displayText, sObjectInComboboxShape);
            // fetch fields and cache them
            fetchFieldsForEntity(objectType, { disableErrorModal : true }).catch(() => {});
        }
    }
}