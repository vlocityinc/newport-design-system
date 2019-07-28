import { LightningElement, track, api } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    CONDITION_LOGIC,
    ELEMENT_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './waitPlatformEventLabels';
import {
    RULE_TYPES,
    getRulesForElementType
} from 'builder_platform_interaction/ruleLib';
import { getInputParametersForEventType } from 'builder_platform_interaction/sobjectLib';
import {
    getValueFromHydratedItem,
    getErrorFromHydratedItem
} from 'builder_platform_interaction/dataMutationLib';
import {
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    WaitEventAddParameterEvent,
    WaitEventDeleteParameterEvent,
    WaitEventParameterChangedEvent,
    WaitEventPropertyChangedEvent,
    UpdateWaitEventEventTypeEvent
} from 'builder_platform_interaction/events';
import { getItemOrDisplayText } from 'builder_platform_interaction/expressionUtils';
import { isWaitTimeEventType } from 'builder_platform_interaction/elementFactory';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import EntityResourcePicker from 'builder_platform_interaction/entityResourcePicker';

const OUTPUT_PARAMETER_DEFINITION = {
    label: LABELS.platformEventOutputLabel,
    iconName: 'utility:events',
    dataType: FLOW_DATA_TYPE.SOBJECT.value
};

const ASSIGNMENT_ICON = 'utility:assignment';

export default class WaitPlatformEvent extends LightningElement {
    labels = LABELS;

    filterParameters = [];

    /**
     * Object of output parameters
     *
     * @param {module:WaitTimeEvent.WaitEventParameter} outputParameters
     */
    set outputParameters(outputParameters) {
        this._outputParameters = outputParameters;
        const outputParam = outputParameters[this.eventTypeValue];
        this.outputParameterItem = Object.assign(
            {},
            outputParam,
            { subtype: this.eventTypeValue, name: this.eventTypeValue },
            OUTPUT_PARAMETER_DEFINITION
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
     * The guid associated with the event type entity resource picker
     * @type {String}
     */
    @api
    eventTypeIndex;

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
                    leftHandSide: {
                        // Expression builder needs to have the field value prefixed with event type name.
                        value: this.addEventTypePrefix(inputParameter.name),
                        error: inputParameter.name.error
                    },
                    rightHandSide: {
                        value: inputParameter.value.value,
                        error: inputParameter.value.error
                    },
                    rightHandSideDataType: {
                        value: inputParameter.valueDataType.value,
                        error: inputParameter.valueDataType.error
                    },
                    rowIndex: inputParameter.rowIndex
                };
                this.filters.push(filter);
            }

            this.filterConditionLogic =
                this.filters.length === 0
                    ? { value: CONDITION_LOGIC.NO_CONDITIONS }
                    : { value: CONDITION_LOGIC.AND };
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
        {
            value: CONDITION_LOGIC.NO_CONDITIONS,
            label: LABELS.noConditionsLabel
        },
        { value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel }
    ];

    @track
    rulesForExpressionBuilder = getRulesForElementType(
        RULE_TYPES.ASSIGNMENT,
        this.elementTypeForExpressionBuilder
    );

    @track
    elementTypeForExpressionBuilder = ELEMENT_TYPE.WAIT;

    @track
    eventTypeParameters;

    @track
    filterConditionLogic = { value: CONDITION_LOGIC.NO_CONDITIONS };

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
        return this._eventType
            ? getValueFromHydratedItem(this._eventType)
            : null;
    }

    get isEventTypeValid() {
        return (
            getValueFromHydratedItem(this._eventType) &&
            !getErrorFromHydratedItem(this._eventType)
        );
    }

    get operatorIconName() {
        return ASSIGNMENT_ICON;
    }

    /**
     * get the fields of the selected entity
     */
    updateFilterFields(eventType) {
        getInputParametersForEventType(eventType, params => {
            this.filterFields = params;
        });
    }

    /**
     * Update the event type name in output parameter item
     */
    updateOutputParameterItemEventType() {
        Object.assign(this.outputParameterItem, {
            subtype: this.eventTypeValue,
            name: this.eventTypeValue
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
            true
        );
    }

    get showDelete() {
        return this.filters.length > 1;
    }

    get elementType() {
        return ELEMENT_TYPE.WAIT;
    }

    get mode() {
        return EntityResourcePicker.ENTITY_MODE.EVENT;
    }

    /**
     * Add eventType API name prefix to the parameter name.
     * @param {Object} paramName parameter name object hydrated with error
     */
    addEventTypePrefix(paramName) {
        const parameterName = getValueFromHydratedItem(paramName);
        const error = getErrorFromHydratedItem(paramName);
        const fieldPrefix = this.eventTypeValue + '.';

        // if there is an error do not add the prefix
        if (!parameterName || !isUndefinedOrNull(error)) {
            return parameterName;
        }

        if (parameterName.startsWith(fieldPrefix)) {
            return parameterName;
        }

        if (this.filterFields && this.filterFields[parameterName]) {
            return this.filterFields[parameterName].prefixedApiName;
        }

        // fallback to prepending event api name to field name
        // this is needed for unlikely scenario when the getInputParametersForEventType async call
        // to populate filterFields takes longer
        return fieldPrefix + parameterName;
    }

    /**
     * Removes eventType API name prefix from the parameter name.
     * @param {Object} paramName hydrated parameter name object
     */
    removeEventTypePrefix(paramName) {
        const parameterName = getValueFromHydratedItem(paramName);
        const error = getErrorFromHydratedItem(paramName);
        const fieldPrefix = this.eventTypeValue + '.';

        // if there is an error do not remove the prefix
        if (!parameterName || !isUndefinedOrNull(error)) {
            return parameterName;
        }

        if (parameterName.startsWith(fieldPrefix)) {
            return parameterName.substring(fieldPrefix.length);
        }

        return parameterName;
    }

    handleEventTypeChanged(event) {
        event.stopPropagation();
        const itemOrDisplayText = getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;
        const error = event.detail.error;

        // fire update event type event
        const updateWaitEvenTypeEvent = new UpdateWaitEventEventTypeEvent(
            value,
            error,
            this.waitEventGuid,
            this._lastRecordedEventTypeValue
        );
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

        let { propertyName } = event.detail;
        const { value, error, oldValue } = event.detail;

        if (event.detail.propertyName === 'conditionLogic') {
            this.filterConditionLogic = { value: event.detail.value };
            propertyName = 'platformEventConditionLogic';
        }

        const waitEventPropertyChangedEvent = new WaitEventPropertyChangedEvent(
            propertyName,
            value,
            error,
            this.waitEventGuid,
            oldValue
        );

        this.dispatchEvent(waitEventPropertyChangedEvent);
    }

    handlePlatformInputFilterEvent(event) {
        event.stopPropagation();
        switch (event.type) {
            case AddConditionEvent.EVENT_NAME:
                this.dispatchEvent(
                    new WaitEventAddParameterEvent(
                        null,
                        event.detail.parentGUID,
                        true
                    )
                );
                break;
            case DeleteConditionEvent.EVENT_NAME:
                this.dispatchEvent(
                    new WaitEventDeleteParameterEvent(
                        null,
                        event.detail.parentGUID,
                        true,
                        event.detail.index
                    )
                );
                break;
            case UpdateConditionEvent.EVENT_NAME:
                this.dispatchEvent(
                    new WaitEventParameterChangedEvent(
                        // EventType prefix should not be there in metadata/store
                        {
                            value: event.detail.value.leftHandSide
                                ? this.removeEventTypePrefix(
                                      event.detail.value.leftHandSide
                                  )
                                : undefined,
                            error: event.detail.value.leftHandSide
                                ? event.detail.value.leftHandSide.error
                                : null
                        },
                        {
                            value: event.detail.value.rightHandSide
                                ? event.detail.value.rightHandSide.value
                                : undefined,
                            error: event.detail.value.rightHandSide
                                ? event.detail.value.rightHandSide.error
                                : null
                        },
                        {
                            value: event.detail.value.rightHandSideDataType
                                ? event.detail.value.rightHandSideDataType.value
                                : undefined,
                            error: event.detail.value.rightHandSideDataType
                                ? event.detail.value.rightHandSideDataType.error
                                : null
                        },
                        event.detail.error,
                        event.detail.parentGUID,
                        true,
                        event.detail.index
                    )
                );
                break;
            default:
                break;
        }
    }
}
