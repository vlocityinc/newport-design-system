import { LightningElement, track, api } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './waitPlatformEventLabels';
import { RULE_TYPES, getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import { getInputParametersForEventType } from 'builder_platform_interaction/sobjectLib';
import { getValueFromHydratedItem, getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import {
    WaitEventPropertyChangedEvent,
    UpdateWaitEventEventTypeEvent,
} from 'builder_platform_interaction/events';
import { getItemOrDisplayText } from 'builder_platform_interaction/expressionUtils';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { isWaitTimeEventType } from 'builder_platform_interaction/elementFactory';

const OUTPUT_PARAMETER_DEFINITION = {
    label: LABELS.platformEventOutputLabel,
    iconName: 'utility:events',
    dataType: FLOW_DATA_TYPE.SOBJECT.value,
};

export default class WaitPlatformEvent extends LightningElement {
    labels = LABELS;

    filterParameters = [];

    /**
     * Object of output parameters
     *
     * @param {module:WaitTimeEvent.WaitEventParameter} outputParameters
     */
    set outputParameters(outputParameters = {}) {
        this._outputParameters = outputParameters;
        const outputParam = outputParameters[this.eventTypeValue];
        this.outputParameterItem = Object.assign({},
            outputParam,
            { objectType: this.eventTypeValue, name: this.eventTypeValue, },
            OUTPUT_PARAMETER_DEFINITION,
        );
    }

    @api
    get outputParameters() {
        return this._outputParameters;
    }

    /**
     * @type {String} guid of the parent wait element
     */
    @api
    waitEventGuid;

    /**
     * Selected event type from the sobject picker
     * @type {String} event type of the platform event
     */
    set eventType(eventType) {
        const eventTypeValue = getValueFromHydratedItem(eventType);
        // To avoid setting the Time Event Types - AlarmEvent and DateRefAlarmEvent
        if (isWaitTimeEventType(eventTypeValue)) {
            return;
        }

        this._eventType = eventType;
        if (eventTypeValue && !getErrorFromHydratedItem(eventType)) {
            this._lastRecordedEventTypeValue = eventTypeValue;
            this.updateFilterFields(eventTypeValue);
            this.updateOutputParameterItemEventType();
        }
    }

    @api
    get eventType() {
        return this._eventType;
    }

    /**
     * Object of input filter parameters
     * @type {Map}
     */
    set inputFilterParameters(parameterItems) {
        if (parameterItems) {
            this.filterParameters = parameterItems;

            this.filters = [];
            for (let i = 0; i < parameterItems.length; i++) {
                const inputParameter = parameterItems[i];
                const filter = {
                    expression: {
                        leftHandSide: {
                            value: this.getLHSValue(inputParameter),
                            error: inputParameter.name.error
                        },
                        rightHandSide: {
                            value: inputParameter.value.value,
                            error: inputParameter.value.error
                        },
                        rightHandSideDataType: {
                            value: inputParameter.valueDataType.value,
                            error: inputParameter.valueDataType.error
                        }
                    },
                    rowIndex: inputParameter.rowIndex
                };
                this.filters.push(filter);
            }
        }
    }

    @api
    get inputFilterParameters() {
        return this.filterParameters;
    }

    @track
    _eventType;

    @track
    filterConditionLogicOptions = [
        {value: CONDITION_LOGIC.NO_CONDITIONS, label: LABELS.noConditionsLabel},
        {value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel}
    ];

    @track
    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementTypeForExpressionBuilder);

    @track
    elementTypeForExpressionBuilder = ELEMENT_TYPE.WAIT;

    @track
    eventTypeParameters;

    @track
    filters = [];

    @track
    filterFields;

    /**
     * The event delivery status output
     *
     * @type {module:ParameterItem.ParameterItem}
     */
    @track
    outputParameterItem = {};

    _lastRecordedEventTypeValue = null;

    get eventTypeValue() {
        return this._eventType ? getValueFromHydratedItem(this._eventType) : null;
    }

    /**
     * @returns the selected condition logic for filtering
     */
    get filterConditionLogic() {
        return {
            value: this.filters.length === 0 ? CONDITION_LOGIC.NO_CONDITIONS : CONDITION_LOGIC.AND
        };
    }

    /**
     * get the fields of the selected entity
     */
    updateFilterFields(eventType) {
        getInputParametersForEventType(eventType, (params) => {
            this.filterFields = params;
        });
    }

    /**
     * Update the event type name in output parameter item
     */
    updateOutputParameterItemEventType() {
        Object.assign(this.outputParameterItem,
            { objectType: this.eventTypeValue, name: this.eventTypeValue, }
        );
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get eventTypeComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.eventLabel,
            LABELS.selectEventLabel,
            getErrorFromHydratedItem(this.eventType),
            false,
            true,
        );
    }

    get showDelete() {
        return this.filters.length > 1;
    }

    get elementType() {
        return ELEMENT_TYPE.WAIT;
    }

    /**
     * Expression builder needs to have the field value prefixed with event type name.
     * This function ensure that and returns the lhs value with the prefix.
     */
    getLHSValue(parameter) {
        const parameterName = getValueFromHydratedItem(parameter.name);
        const fieldPrefix = this.eventTypeValue + '.';
        if (!isUndefinedOrNull(parameterName) || parameterName.indexOf(fieldPrefix) !== -1) {
            return parameterName;
        }

        if (this.filterFields && this.filterFields[parameterName]) {
            return this.filterFields[parameterName].prefixedApiName;
        }

        // fallback to prepending event api name to field name
        return fieldPrefix + getValueFromHydratedItem(parameterName);
    }

    handleEventTypeChanged(event) {
        event.stopPropagation();
        const itemOrDisplayText = getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;
        const error = event.detail.error;

        // fire update event type event
        const updateWaitEvenTypeEvent = new UpdateWaitEventEventTypeEvent(value, error, this.waitEventGuid, this._lastRecordedEventTypeValue);
        this.dispatchEvent(updateWaitEvenTypeEvent);


        // if the event type is valid and there is no error then clear all input parameters
        if (this._lastRecordedEventTypeValue !== value && !error) {
            this._lastRecordedEventTypeValue = value;
        }

        // update the event type to new value and update error
        this.eventType = { value, error };
    }

    handlePropertyChanged(event) {
        event.stopPropagation();

        const { propertyName, value, error, oldValue } = event.detail;
        const waitEventPropertyChangedEvent = new WaitEventPropertyChangedEvent(propertyName, value, error, this.waitEventGuid, oldValue);
        this.dispatchEvent(waitEventPropertyChangedEvent);
    }
}