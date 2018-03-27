import { Element, track, api } from 'engine';
import { FLOW_DATA_TYPE, RULE_PROPERTY_INFO } from 'builder_platform_interaction-constant';
import { Store } from 'builder_platform_interaction-store-lib';
import { getElementsForMenuData } from 'builder_platform_interaction-expression-utils';
import { getRulesForElementType, getRHSTypes } from 'builder_platform_interaction-rule-lib';
import { getFlowDataType, getParameterLabel, isInputParameter, isRequiredParameter, getParameterDataType } from 'builder_platform_interaction-parameter-item-utils';
import { UpdateParameterItemEvent } from 'builder_platform_interaction-events';

let storeInstance;

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

    constructor() {
        super();
        storeInstance = Store.getStore();
    }

    /**
     * parameter item
     * @param {Object} parameter the input parameter or output parameter
     * example for parameter from Action:
     * @param {String}
     *            parameter.Id      parameter Id
     * @param {boolean}
     *            parameter.IsInput  true if the parameter is input parameter
     * @param {boolean}
     *            parameter.IsOutput true if the parameter is output parameter
     * @param {boolean}
     *            parameter.IsRequired   true if the parameter is required input parameter
     * @param {String}
     *            parameter.Label   parameter label
     * @param {String}
     *            parameter.Description     parameter description
     * @param {String}
     *            parameter.DataType     data type of the parameter (ref: in SfdcDisplayType)
     * @param {Object}
     *            parameter.value    if it's an input parameter and has a value
     * @param {String}
     *            parameter.assignToReference    if it's an output parameter and assign to a reference
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
     * FIXME: there is no maxOccurs property in the record returned by the service for now
     */
    get isCollection() {
        return false;
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

    /**
     * combobox's value from item's value
     */
    get comboboxValue() {
        if (this.isInput) {
            // return  '' if this parameter is input parameter and no value
            if (!this.state.parameterItem.hasOwnProperty('value')) {
                return '';
            }
            // return  {!value} if this parameter is input parameter and has a reference value
            if (this.state.parameterItem.value.hasOwnProperty('elementReference') && this.state.parameterItem.value.elementReference !== null) {
                return '{!' + this.getVariableName(this.state.parameterItem.value.elementReference) + '}';
            }
            return this.state.parameterItem.value[Object.keys(this.item.value)[0]];
        }
        // return {!value} if this parameter is output parameter and has a reference value
        if (this.state.parameterItem.hasOwnProperty('assignToReference')) {
            return '{!' + this.getVariableName(this.state.parameterItem.assignToReference) + '}';
        }
        return '';
    }

    /**
     * map from VARIABLE_1 to variable name
     * @param {String} varRef the variable reference
     * @return {String} name of variable
     */
    getVariableName(varRef) {
        const varName = storeInstance.getCurrentState().elements[varRef];
        return (varName) ? varName.name : '';
    }

    /**
     * get combobox menu data, depends on the dataType & elementType
     */
    get menuData() {
        const leftElement = {
            [RULE_PROPERTY_INFO.DATA_TYPE]: this.type,
            [RULE_PROPERTY_INFO.ELEMENT_TYPE]: this.elementType,
            [RULE_PROPERTY_INFO.IS_COLLECTION]: this.isCollection,
        };
        const rules = getRulesForElementType(this.elementType);
        const rhsTypes = getRHSTypes(leftElement, "EqualTo", rules);
        const menuD = getElementsForMenuData(storeInstance.getCurrentState().elements, storeInstance.getCurrentState().variables, rhsTypes);
        return menuD;
    }

    /**
     * icon for parameter
     */
    get iconName() {
        // TODO: W-4632619
        let iconName = 'utility:type_tool';
        switch (this.type) {
            case FLOW_DATA_TYPE.DATE:
            case FLOW_DATA_TYPE.DATE_TIME:
                iconName = 'utility:event';
                break;
            case FLOW_DATA_TYPE.SOBJECT:
                iconName = 'utility:standard_objects';
                break;
            case FLOW_DATA_TYPE.PICKLIST:
            case FLOW_DATA_TYPE.MULTI_PICKLIST:
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
        this.state.toggleStatus = event.currentTarget.checked;
        if (!this.state.toggleStatus) {
            if (this.state.parameterItem.hasOwnProperty('value')) {
                this.preservedValue = this.state.parameterItem.value[Object.keys(this.state.parameterItem.value)[0]];
                this.state.parameterItem.value[Object.keys(this.state.parameterItem.value)[0]] = null;
            }
        } else if (this.preservedValue) {
            this.state.parameterItem.value[Object.keys(this.state.parameterItem.value)[0]] = this.preservedValue;
            this.preservedValue = null;
        }
        // dispatch event to update this item in list: UpdateParameterItemEvent
        const itemUpdatedEvent = new UpdateParameterItemEvent(this.isInput, this.itemIndex, this.state.parameterItem, event.detail.error);
        this.dispatchEvent(itemUpdatedEvent);
    }

    /**
     * handle the value changed event
     * @param {Object} event event fired from the combobox
     */
    handleValueChanged(event) {
        event.stopPropagation();
        if (this.isInput) {
            this.state.parameterItem.value = this.getItemValue(event.detail.value);
        } else {
            this.state.parameterItem.assignToReference = event.detail.value;
        }
        // dispatch event to update this item in list: UpdateParameterItemEvent
        const itemUpdatedEvent = new UpdateParameterItemEvent(this.isInput, this.itemIndex, this.item, event.detail.error);
        this.dispatchEvent(itemUpdatedEvent);
    }

    handleFetchMenuData(event) {
        event.stopPropagation();
        // TODO: fetch menu data
    }

    /**
     * get the parameter's value from the combobox's value
     * @param {String} value the combobox's value
     * @return {Object} the parameter's value
     */
    getItemValue(value) {
        const varName = this.getVariableName(value);
        if (varName) {
            return {elementReference: value};
        }
        const key = this.getParameterValueKey();
        return {[key]:value};
    }

    /**
     * @return {String} the key, depends on the parameter flow data type
     */
    getParameterValueKey() {
        switch (this.type) {
            case FLOW_DATA_TYPE.DATE:
                return 'dateValue';
            case FLOW_DATA_TYPE.DATE_TIME:
                return 'dateTimeValue';
            case FLOW_DATA_TYPE.NUMBER:
                return 'numberValue';
            case FLOW_DATA_TYPE.BOOLEAN:
                return 'booleanValue';
            default:
                return 'stringValue';
        }
    }
}
