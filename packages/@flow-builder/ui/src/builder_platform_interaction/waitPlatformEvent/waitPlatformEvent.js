import { LightningElement, track, api } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './waitPlatformEventLabels';
import { RULE_TYPES, getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { getValueFromHydratedItem, getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent, UpdateParameterItemEvent } from 'builder_platform_interaction/events';
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
    set resumeTimeParameters(parameterItems) {
        if (parameterItems) {
            this.filterParameters = parameterItems;

            this.filters = [];
            for (let i = 0; i < parameterItems.length; i++) {
                const inputParameter = parameterItems[i];
                const filter = {
                    expression: {
                        leftHandSide: {
                            value: inputParameter.name,
                            error: null
                        },
                        rightHandSide: {
                            value: inputParameter.value,
                            error: null
                        },
                        rightHandSideDataType: {
                            value: inputParameter.valueDataType,
                            error: null
                        }
                    },
                    rowIndex: inputParameter.rowIndex
                };
                this.filters.push(filter);
            }
        }
    }

    @api
    get resumeTimeParameters() {
        return this.filterParameters;
    }

    // TODO: this should not need to be @track once eventType is flowing down correctly instead of being set at
    // this level by handleEventTypeChanged (currently needed for tests to pass)
    @track
    _eventType;

    @track
    filterConditionLogicOptions = [
        {value: CONDITION_LOGIC.NO_CONDITIONS, label: LABELS.noConditionsLabel},
        {value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel}
    ];

    @track
    elementTypeForExpressionBuilder = ELEMENT_TYPE.WAIT;

    @track
    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementTypeForExpressionBuilder);

    @track
    filters = [];

    @track filterFields;

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
    updateFilterFields(objectType) {
        getFieldsForEntity(objectType, (fields) => {
            this.filterFields = fields;
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

    // TODO: as part of current story this should be moved up to wait event?
    handleEventTypeChanged(event) {
        event.stopPropagation();

        const itemOrDisplayText = getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;
        const error = event.detail.error;

        // fire the property change event to update event type and error
        this.firePropertyChangedEvent(WAIT_EVENT_FIELDS.EVENT_TYPE, value, error);

        // fire updateparameteritem to update name in the parameter item and clear the value
        // only if the event type is valid and there is no error
        // TODO: fire delete parameter item once available to delete old event type parameter
        if (this._lastRecordedEventTypeValue && this._lastRecordedEventTypeValue !== value && !error) {
            const { valueDataType, rowIndex = null } = this.outputParameters[this._lastRecordedEventTypeValue];
            this.fireUpdateParameterItemEvent(value, null, rowIndex, valueDataType);
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
     * Fire update parameter item event
     */
    fireUpdateParameterItemEvent(name, value, rowIndex, valueDataType) {
        const updateParamItemEvent = new UpdateParameterItemEvent(false, rowIndex, name, value, valueDataType);
        this.dispatchEvent(updateParamItemEvent);
    }
}