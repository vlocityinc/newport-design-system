import { Element, track, api } from 'engine';
import { FLOW_DATA_TYPE, getFlowDataType } from 'builder_platform_interaction-data-type-lib';
import { getElementsForMenuData } from 'builder_platform_interaction-expression-utils';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { getRulesForContext, getRHSTypes, RULE_PROPERTY_INFO, RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';
import { getParameterLabel, isInputParameter, isRequiredParameter, getParameterDataType } from 'builder_platform_interaction-parameter-item-utils';
import { UpdateParameterItemEvent } from 'builder_platform_interaction-events';

export default class ParameterItem extends Element {
    @track state = {
        toggleStatus: null,
        parameterItem: {}
    }

    @api
    itemIndex = 0;

    /**
     * preserve the combobox's value before switching the toggle to OFF
     */
    preservedValue;

    flowDataType;

    /**
     * element type: ActionCall or ApexPlugin or Subflow (ELEMENT_TYPE.ACTION_CALL, ELEMENT_TYPE.APEX_PLUGIN_CALL, ELEMENT_TYPE.SUBFLOW)
     */
    @api
    elementType;

    /**
     * @typedef {Object} InputParameterValue
     * @property {ValueErrorObject} elementReference or flowTypeValue (example: stringValue, numberValue...)
     */

    /**
     * @typedef {Object} ParameterItem
     * @property {String} id parameter Id
     * @property {boolean} isInput  true if the parameter is input parameter
     * @property {boolean} isOutput true if the parameter is output parameter
     * @property {boolean} isRequired   true if the parameter is required input parameter
     * @property {String} label   parameter label
     * @property {String} description     parameter description
     * @property {String} dataType     data type of the parameter
     * @property {InputParameterValue} value    if it's an input parameter and has a value
     * @property {ValueErrorObject} assignToReference    if it's an output parameter and assign to a reference
     */

    /**
     * @param {ParameterItem} parameter item
     */
    @api
    set item(parameter) {
        this.state.parameterItem = parameter;
    }

    @api
    get item() {
        return this.state.parameterItem;
    }

    /**
     * the label of parameter
     */
    get label() {
        return getParameterLabel(this.state.parameterItem, this.elementType);
    }

    /**
     * true if this parameter is input
     */
    get isInput() {
        return isInputParameter(this.state.parameterItem, this.elementType);
    }

    /**
     * true if this parameter is required input parameter
     */
    get isRequired() {
        return isRequiredParameter(this.state.parameterItem, this.elementType);
    }

    /**
     * true if this parameter is optional input parameter
     */
    get showToggle() {
        return this.isOptionalInput();
    }

    /**
     * true if this parameter is optional input parameter and it has a value
     */
    get checked() {
        return (this.isOptionalInput() && this.state.parameterItem.hasOwnProperty('value') && this.state.parameterItem.value[Object.keys(this.item.value)[0]] !== null);
    }

    /**
     * true if this parameter is output parameter or it is optional input parameter and has a value
     * toggle ON/OFF will show/hide the combobox
     */
    get showCombobox() {
        if (this.state.toggleStatus !== null) {
            return this.state.toggleStatus;
        }
        return !this.isInput || this.isRequired || this.checked;
    }

    /**
     * true if data type of this parameter is a collection
     */
    get isCollection() {
        return (this.state.parameterItem.hasOwnProperty('maxOccurs') && this.state.parameterItem.maxOccurs > 1);
    }

    /**
     * get the flow data type to pass in the combobox.
     */
    get type() {
        if (!this.flowDataType) {
            const paramType = getParameterDataType(this.state.parameterItem, this.elementType);
            this.flowDataType = getFlowDataType(paramType);
        }
        return this.flowDataType;
    }

    /**
     * @returns {boolean} true if this parameter is optional input parameter
     */
    isOptionalInput() {
        return this.isInput && !this.isRequired;
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
        return (this.showCombobox) ? '' : 'slds-hide';
    }

    /**
     * combobox's value from item's value
     */
    get comboboxValue() {
        if (this.isInput) {
            // return  '' if this parameter is input parameter and no value
            if (!this.state.parameterItem.value) {
                return '';
            }
            // return  {!value} if this parameter is input parameter and has a reference value
            if (this.state.parameterItem.value.elementReference) {
                const varRef = this.state.parameterItem.value.elementReference.value;
                const varName = this.getVariableName(varRef);
                const value = (varName) ? varName : varRef;
                // varRef can be a System's Constant, in that case, varName is undefined, then using this varRef as a comboboxValue
                return '{!' + value + '}';
            }
            // TODO: value = literals + VARIABLE (My name is {!VARIRABLE_1}. Hello world!)
            const value = this.state.parameterItem.value[Object.keys(this.item.value)[0]].value;
            return value ? value : '';
        }
        // return {!value} if this parameter is output parameter and has a reference value
        if (this.state.parameterItem.assignToReference) {
            return '{!' + this.getVariableName(this.state.parameterItem.assignToReference.value) + '}';
        }
        return '';
    }

    /**
     * map from var ref to variable name
     * @param {String} varRef the variable reference
     * @return {String} name of variable or undefined if not found
     */
    getVariableName(varRef) {
        const varElement = getElementByGuid(varRef);
        return (varElement) ? varElement.name : undefined;
    }

    /**
     * get combobox menu data, depends on the dataType & elementType
     * TODO: menuData is different for input and output parameter
     */
    get menuData() {
        const leftElement = {
            [RULE_PROPERTY_INFO.DATA_TYPE]: this.type,
            [RULE_PROPERTY_INFO.IS_COLLECTION]: this.isCollection,
        };
        const rules = getRulesForContext({elementType: this.elementType});
        const rhsTypes = getRHSTypes(leftElement, RULE_OPERATOR.ASSIGN, rules);
        const shouldBeWritable = this.isInput;
        const menuD = getElementsForMenuData({element: this.elementType, shouldBeWritable}, rhsTypes, true);
        return menuD;
    }

    /**
     * icon for parameter
     */
    get iconName() {
        // TODO: W-4632619
        let iconName = 'utility:type_tool';
        switch (this.type) {
            case FLOW_DATA_TYPE.DATE.value:
            case FLOW_DATA_TYPE.DATE_TIME.value:
                iconName = 'utility:event';
                break;
            case FLOW_DATA_TYPE.SOBJECT.value:
                iconName = 'utility:standard_objects';
                break;
            case FLOW_DATA_TYPE.PICKLIST.value:
            case FLOW_DATA_TYPE.MULTI_PICKLIST.value:
                iconName = 'utility:picklist';
                break;
            default:
                break;
        }
        return iconName;
    }

    /**
     * alternative text
     */
    get alternativeText() {
        return this.type;
    }

    /**
     * handle the toggle changed event
     * @param {Object} event event fired from input toggle
     */
    handleToggleChanged(event) {
        event.stopPropagation();
        this.state.toggleStatus = event.detail.checked;
        let value = null;
        if (!this.state.toggleStatus) {
            if (this.state.parameterItem.hasOwnProperty('value')) {
                this.preservedValue = this.state.parameterItem.value;
            }
        } else if (this.preservedValue) {
            value = this.preservedValue;
            this.preservedValue = null;
        }
        // dispatch event to update this item in list: UpdateParameterItemEvent
        const itemUpdatedEvent = new UpdateParameterItemEvent(this.isInput, this.itemIndex, value, event.detail.error);
        this.dispatchEvent(itemUpdatedEvent);
    }

    /**
     * handle the value changed event
     * @param {Object} event event fired from the combobox
     */
    handleValueChanged(event) {
        event.stopPropagation();
        let value;
        if (this.isInput) {
            value = this.convertComboxValueToInputParameterValue(event.detail.value);
        } else {
            value = {value: event.detail.value};
        }
        // dispatch event to update this item in list: UpdateParameterItemEvent
        const itemUpdatedEvent = new UpdateParameterItemEvent(this.isInput, this.itemIndex, value, event.detail.error);
        this.dispatchEvent(itemUpdatedEvent);
    }

    handleFetchMenuData(event) {
        event.stopPropagation();
        // TODO: fetch menu data
    }

    /**
     * convert to input parameter's value from the combobox's value
     * @param {String} comboboxValue the combobox's value
     * @return {InputParameterValue} the parameter's value
     */
    convertComboxValueToInputParameterValue(comboboxValue) {
        const varName = this.getVariableName(comboboxValue);
        if (varName) {
            return {elementReference: {value: comboboxValue}};
        }
        const key = this.getParameterValueKey();
        return {[key]: {value: comboboxValue}};
    }

    /**
     * @return {String} the key, depends on the parameter flow data type
     */
    getParameterValueKey() {
        switch (this.type) {
            case FLOW_DATA_TYPE.DATE.value:
                return 'dateValue';
            case FLOW_DATA_TYPE.DATE_TIME.value:
                return 'dateTimeValue';
            case FLOW_DATA_TYPE.NUMBER.value:
                return 'numberValue';
            case FLOW_DATA_TYPE.BOOLEAN.value:
                return 'booleanValue';
            default:
                return 'stringValue';
        }
    }
}
