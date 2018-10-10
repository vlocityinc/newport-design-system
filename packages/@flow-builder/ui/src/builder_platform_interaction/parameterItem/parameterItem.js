import { LightningElement, track, api } from 'lwc';
import { getDataTypeIcons, FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { getResourceFerovDataType } from "builder_platform_interaction/expressionUtils";
import { isObject, isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { getErrorFromHydratedItem, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { PARAM_PROPERTY } from "builder_platform_interaction/ruleLib";
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { UpdateParameterItemEvent, DeleteParameterItemEvent } from 'builder_platform_interaction/events';
import { LABELS } from './parameterItemLabels';

export default class ParameterItem extends LightningElement {
    labels = LABELS;

    @track state = {
        toggleStatus: false,
        parameterItem: {},
    }

    @api
    itemIndex = 0;

    /**
     * element type: ActionCall or ApexPlugin or Subflow (ELEMENT_TYPE.ACTION_CALL, ELEMENT_TYPE.APEX_PLUGIN_CALL, ELEMENT_TYPE.SUBFLOW)
     */
    @api
    elementType;

    @api
    hideParameterIcon = false;

    @api
    disabled = false;

    @api
    showDelete = false;

    @api
    warningBadge;

    @api
    warningMessage;

    /**
     * Holds the rules used for fetching full menu data, used the ferovResourcePicker to display allowed inputs
     * @type {module:rules.operatorRule[]}
     */
    @api
    rules = [];

    /**
     * preserve the combobox's value before switching the toggle to OFF
     */
    preservedValue = {value: null, valueDataType: null};

    /**
     * @typedef {Object} ParameterItem
     * @property {String} name  parameter's name (may be hydrated)
     * @property {String} rowIndex  the unique identifier
     * @property {boolean} isInput  true if the parameter is input parameter
     * @property {boolean} isRequired   true if the parameter is required input parameter
     * @property {String|Object} [label]   parameter label (may be hydrated)
     * @property {String|Object} dataType     the flow data type, see FLOW_DATA_TYPE (may be hydrated)
     * @property {Number} [maxOccurs]   the maximum occurrences
     * @property {String} [objectType] the api name of sobject if dataType is FLOW_DATA_TYPE.SOBJECT (may be hydrated)
     * @property {Object} [value]    parameter's value (must be hydrated)
     * @property {String} [valueDataType]   parameter's value data type
     * @property {String} [iconName] parameter's icon name, if we wish to use a custom icon rather than lookup icon by data type
     * @example <caption>input parameter</caption
     * {
     * name: 'subjectOrTargetId',
     * isInput: true,
     * isRequired: true,
     * label: 'Subject or Target Id',
     * dataType: 'String',
     * maxOccurs: 1,
     * objectType: null,
     * value: {value: 'textVar', error: null},
     * valueDataType: 'reference',
     * }
     * @example <caption>output parameter</caption>
     * {
     * name: 'feedId',
     * isInput: false,
     * isRequired: false,
     * label: 'Feed Id',
     * dataType: 'String',
     * maxOccurs: 1,
     * objectType: null,
     * value: {value: 'textVar', error: null},
     * valueDataType: 'reference',
     * iconName: 'utility:events'
     * }
     */

    /**
     * @param {ParameterItem} parameter item
     */
    set item(parameter) {
        this.state.parameterItem = parameter;
        this.state.toggleStatus = !this.state.parameterItem.isInput || this.state.parameterItem.isRequired || this.checked;
    }

    @api
    get item() {
        return this.state.parameterItem;
    }

    get showToggle() {
        return this.isOptionalInput() && !this.showDelete;
    }

    /**
     * true if this parameter is optional input parameter and it has a value
     */
    get checked() {
        return (this.isOptionalInput() && !isUndefinedOrNull(getValueFromHydratedItem(this.state.parameterItem.value)));
    }

    /**
     * true if data type of this parameter is a collection
     */
    get isCollection() {
        return (this.state.parameterItem.hasOwnProperty('maxOccurs') && this.state.parameterItem.maxOccurs > 1);
    }

    /**
     * @returns {boolean} true if this parameter is optional input parameter
     */
    isOptionalInput() {
        return this.state.parameterItem.isInput && !this.state.parameterItem.isRequired;
    }

    /**
     * show divider
     */
    get itemClass() {
        return "slds-p-around_x-small slds-m-bottom_x-small " + ((this.itemIndex > 0) ? "slds-item" : "");
    }

    get comboboxAriaHidden() {
        const ariaHidden = !this.showCombobox;
        return ariaHidden.toString();
    }

    get comboboxClass() {
        return (this.state.toggleStatus) ? '' : 'slds-hide';
    }

    get parameterLabel() {
        const label = getValueFromHydratedItem(this.state.parameterItem.label);
        return label ? label : getValueFromHydratedItem(this.state.parameterItem.name);
    }
    /**
     * @return {String|Object} returns the default value for the combobox or null
     */
    get parameterValue() {
        const value = getValueFromHydratedItem(this.state.parameterItem.value);
        return value ? value : null;
    }

    /**
     * @return {Object} config to pass in ferov-resource-picker component
     **/
    get parameterComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.parameterLabel,
            this.labels.parameterPlaceholder, // placeholder
            this.errorMessage, // errorMessage
            this.state.parameterItem.isInput, // literalsAllowed
            this.state.parameterItem.isRequired, // required
            this.disabled, // disabled
            this.getDataType()
        );
    }

    get elementParam() {
        return {
            [PARAM_PROPERTY.DATA_TYPE]: this.getDataType(),
            [PARAM_PROPERTY.IS_COLLECTION]: this.isCollection,
            [PARAM_PROPERTY.ELEMENT_TYPE]: this.elementType,
            objectType: getValueFromHydratedItem(this.state.parameterItem.objectType),
        };
    }

    get errorMessage() {
        return getErrorFromHydratedItem(this.state.parameterItem.value);
    }

    get disableFieldDrilldown() {
        return this.getDataType() === FLOW_DATA_TYPE.SOBJECT.value;
    }

    getDataType() {
        return getValueFromHydratedItem(this.state.parameterItem.dataType);
    }

    /**
     * icon for parameter
     */
    get iconName() {
        return this.state.parameterItem.iconName || getDataTypeIcons(this.getDataType(), 'utility');
    }

    /**
     * alternative text
     */
    get alternativeText() {
        return this.getDataType();
    }

    /**
     * @return {String} the css class for badge
     */
    get badgeClasses() {
        let classes = 'slds-align-middle slds-m-left_xx-small';
        if (this.state.parameterItem.isOutput || this.checked) {
            classes = `${classes} slds-theme_warning`;
        }
        return classes;
    }

    /**
     * TODO: will remove comment when W-5422703 is fixed
     */
    /*
    get warningMessages() {
        return [{messages: this.warningMessage}];
    }
    */

    /**
     * handle the toggle changed event
     * @param {Object} event event fired from input toggle
     */
    handleToggleChanged(event) {
        event.stopPropagation();
        let error = null;
        this.state.toggleStatus = event.detail.checked;
        const newValue = {value: null, valueDataType: null};
        if (!this.state.toggleStatus) { // from ON to OFF
            if (this.state.parameterItem.hasOwnProperty('value')) {
                this.preservedValue = {value: this.state.parameterItem.value, valueDataType: this.state.parameterItem.valueDataType};
            }
        } else if (this.preservedValue.value) {
            newValue.value = getValueFromHydratedItem(this.preservedValue.value);
            newValue.valueDataType = this.preservedValue.valueDataType;
            error = getErrorFromHydratedItem(this.preservedValue.value);
            this.preservedValue = {value: null, valueDataType: null};
        } else {
            newValue.value = '';
            newValue.valueDataType = this.getDataType();
        }
        this.dispatchParameterEvent(newValue, error);
    }

    /**
     * handle update parameter's value
     * @param {Object} event event fired from the combobox
     */
    handleUpdateParameter(event) {
        event.stopPropagation();
        const itemOrDisplayText = event.detail.item ? event.detail.item : event.detail.displayText;
        const newValue = {value: null, valueDataType: null};
        if (isObject(itemOrDisplayText)) {
            newValue.value = itemOrDisplayText.value;
            newValue.valueDataType = getResourceFerovDataType(itemOrDisplayText.value);
        } else {
            newValue.value = itemOrDisplayText;
            newValue.valueDataType = this.getDataType();
        }
        this.dispatchParameterEvent(newValue, event.detail.error);
    }

    /**
     * @typedef {Object} ParameterItemNewValue
     * @property {String} value the new value
     * @property {String} valueDataType the new value's data type
     */
    /**
     * dispatch UpdateParameterItemEvent
     * @param {ParameterItemNewValue} newValue event fired from the combobox
     * @param {String} error error message
     */
    dispatchParameterEvent(newValue, error) {
        const itemUpdatedEvent = new UpdateParameterItemEvent(this.state.parameterItem.isInput, this.state.parameterItem.rowIndex, getValueFromHydratedItem(this.state.parameterItem.name), newValue.value, newValue.valueDataType, error);
        this.dispatchEvent(itemUpdatedEvent);
    }

    /**
     * handle delete parameter
     * @param {Object} event event fired from the delete icon
     */
    handleDelete(event) {
        event.stopPropagation();
        const itemDeleteEvent = new DeleteParameterItemEvent(this.state.parameterItem.isInput, this.state.parameterItem.rowIndex, getValueFromHydratedItem(this.state.parameterItem.name));
        this.dispatchEvent(itemDeleteEvent);
    }
}
