import { LightningElement, track, api } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './waitPlatformEventLabels';
import { RULE_TYPES, getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import { getInputParametersForEventType } from 'builder_platform_interaction/sobjectLib';
import { getValueFromHydratedItem, getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent, WaitEventDeleteParameterEvent, WaitEventAddParameterEvent } from 'builder_platform_interaction/events';
import { getItemOrDisplayText } from 'builder_platform_interaction/expressionUtils';

// The property names in a wait event
const WAIT_EVENT_FIELDS = {
    EVENT_TYPE : 'eventType',
};

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
        const eventTypeValue = getValueFromHydratedItem(this.eventType);
        const outputParam = outputParameters[eventTypeValue];
        this.outputParameterItem = Object.assign({},
            outputParam,
            { objectType: eventTypeValue, name: eventTypeValue, },
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
    parentGuid;

    /**
     * Selected event type from the sobject picker
     * @type {String} event type of the platform event
     */
    set eventType(eventType) {
        this._eventType = eventType;

        const eventTypeValue = getValueFromHydratedItem(eventType);
        if (eventTypeValue && !getErrorFromHydratedItem(eventType)) {
            this._lastRecordedEventTypeValue = eventTypeValue;

            this.updateFilterFields(eventTypeValue);
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
                            value: inputParameter.name.value ? this.eventTypeValue + '.' + inputParameter.name.value : '',
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
        return this._eventType && this._eventType.value;
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

    handleEventTypeChanged(event) {
        event.stopPropagation();

        const itemOrDisplayText = getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;
        const error = event.detail.error;

        // fire the property change event to update event type and error
        this.firePropertyChangedEvent(WAIT_EVENT_FIELDS.EVENT_TYPE, value, error);

        // if the event type is valid and there is no error then clear all input parameters
        if (this._lastRecordedEventTypeValue && this._lastRecordedEventTypeValue !== value && !error) {
            // clear all the input parameters
            this.deleteAllFilterInputParameterItems();

            // delete the old output parameter item and add the new one
            this.fireWaitEventDeleteParameterEvent(this._lastRecordedEventTypeValue, this.parentGuid, false, null);
            this.fireWaitEventAddParameterEvent(value, this.parentGuid, false, null);

            this._lastRecordedEventTypeValue = value;
        }

        // update the event type to new value and update error
        this.eventType = { value, error };
    }

    /** Helper Methods **/

    /**
     * Fire property changed event
     */
    firePropertyChangedEvent(propName, value, error) {
        const propChangedEvent = new PropertyChangedEvent(propName, value, error);
        this.dispatchEvent(propChangedEvent);
    }

    /**
     * Fire wait event add parameter item event
     */
    fireWaitEventAddParameterEvent(name, pGuid, isInput, index) {
        const addParamItemEvent = new WaitEventAddParameterEvent(name, pGuid, isInput, index);
        this.dispatchEvent(addParamItemEvent);
    }

    /**
     * Fire wait event delete parameter item event
     */
    fireWaitEventDeleteParameterEvent(name, pGuid, isInput, index) {
        const deleteParamItemEvent = new WaitEventDeleteParameterEvent(name, pGuid, isInput, index);
        this.dispatchEvent(deleteParamItemEvent);
    }

    /**
     * Deletes all parameter items
     */
    deleteAllFilterInputParameterItems() {
        // TODO: convert to a single event
        // Counting backwards so we delete down towards index 0
        for (let i = this.filterParameters.length - 1; i >= 0;  i--) {
            this.fireWaitEventDeleteParameterEvent(null, this.parentGuid, true, i);
        }
    }
}