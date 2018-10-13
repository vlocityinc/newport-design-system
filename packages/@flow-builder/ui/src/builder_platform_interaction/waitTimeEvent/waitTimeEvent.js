import { LightningElement, api, track } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE, WAIT_TIME_EVENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import {
    PropertyChangedEvent,
    UpdateParameterItemEvent,
} from 'builder_platform_interaction/events';
import { getFerovInfoFromComboboxItem } from 'builder_platform_interaction/expressionUtils';
import { getValueFromHydratedItem, getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from "./waitTimeEventLabels";

// rules used by the input pickers in the waitTimeEvent
const timeEventRules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.WAIT);

export default class WaitTimeEvent extends LightningElement {
    parameterNames = {
        BASE_TIME: 'AlarmTime',
        EVENT_DELIVERY_STATUS: 'Status',
        OFFSET_NUMBER: 'TimeOffset',
        OFFSET_UNIT: 'TimeOffsetUnit',
    };

    @track
    _eventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;

    /**
     * The output resume time (alarm time)
     * @type {module:ParameterItem.ParameterItem}
     */
    @track
    outputResumeTime = {};

    /**
     * The event delivery status output
     *
     * @type {module:ParameterItem.ParameterItem}
     */
    @track
    outputEventDeliveryStatus = {};

    /**
     * @typedef {Object} WaitEventParameter
     * @property {String} name the name of the parameter
     * @property {String} value the ferov value of the parameter
     * @property {String} valueDataType the datatype of the ferov value
     */

    /**
     * Object of input parameters used to define the resume time
     * @type {WaitEventParameter}
     */
    @api
    resumeTimeParameters = {};

    /**
     * Object of output parameters
     *
     * @param {Object} outputParameters object of @type {WaitEventParameter}
     */
    set outputParameters(outputParameters = []) {
        // TODO: W-5502328 the translation work for outputParameters is not done yet.
        // If the shape of the output params is different this setter needs to change
        this._outputParameters = outputParameters;
        const alarmTime = outputParameters.find(param => param.name === this.parameterNames.BASE_TIME);
        this.outputResumeTime = Object.assign({},
            alarmTime,
            this.outputResumeTimeDefinition
        );
        const status = outputParameters.find(param => param.name === this.parameterNames.EVENT_DELIVERY_STATUS);
        this.outputEventDeliveryStatus = Object.assign({},
            status,
            this.outputEventDeliveryStatusDefinition
        );
    }

    @api
    get outputParameters() {
        return this._outputParameters;
    }

    /**
     * The event type of the wait event
     * @type {module:flowMetadata.WaitTimeEventType}
     */
    set eventType(eventType) {
        this._eventType = getValueFromHydratedItem(eventType);
    }

    @api
    get eventType() {
        return this._eventType;
    }

    labels = LABELS;

    _eventType;

    _outputParameters;

    dateTimeElementParam = {
        isCollection: false,
        dataType: FLOW_DATA_TYPE.DATE_TIME.value,
    };

    eventTypeValueOptions = [
        { 'label': this.labels.absoluteTimeLabel, 'value': WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME },
        { 'label': this.labels.directRecordTimeLabel, 'value': WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME },
    ];

    // TODO: W-5502328 we might be able to remove this once the translation work for outputParameters is done
    outputResumeTimeDefinition = {
        rowIndex: 0,
        isInput: false,
        isRequired: false,
        label: this.labels.resumeTimeLabel,
        dataType: FLOW_DATA_TYPE.DATE_TIME.value,
        iconName: 'utility:date_input',
    }

    // TODO: W-5502328 we might be able to remove this once the translation work for outputParameters is done
    outputEventDeliveryStatusDefinition = {
        rowIndex: 1,
        isInput: false,
        isRequired: false,
        label: this.labels.eventDeliveryStatusLabel,
        dataType: FLOW_DATA_TYPE.STRING.value,
        iconName: 'utility:type_tool',
    }

    get timeEventParameterRules() {
        return timeEventRules;
    }

    get elementType() {
        return ELEMENT_TYPE.WAIT;
    }

    /** input parameters */

    get isAbsoluteTime() {
        return this.eventType === WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
    }

    get baseTime() {
        return this.getResumeTimeParameterValue(this.parameterNames.BASE_TIME);
    }

    get baseTimeErrorMessage() {
        return this.resumeTimeParameters.AlarmTime && getErrorFromHydratedItem(this.resumeTimeParameters.AlarmTime.value);
    }

    get baseTimeComoboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.baseTimeLabel,
            this.labels.defaultPickerPlaceholder,
            null,
            true,
            true,
            false,
            FLOW_DATA_TYPE.DATE_TIME.value,
        );
    }

    get offsetNumber() {
        return this.getResumeTimeParameterValue(this.parameterNames.OFFSET_NUMBER);
    }

    get offsetUnit() {
        return this.getResumeTimeParameterValue(this.parameterNames.OFFSET_UNIT);
    }

    handleEventTypeChange(event) {
        event.stopPropagation();
        const propChangedEvent = new PropertyChangedEvent('eventType', event.detail.value, null);
        this.dispatchEvent(propChangedEvent);
    }

    handleParameterChange(event, propertyName, literalDataType, isInput) {
        const ferovObject = getFerovInfoFromComboboxItem(event.detail.item, event.detail.displayText, literalDataType);
        const updateParameterItem = new UpdateParameterItemEvent(
            isInput,
            null,
            propertyName,
            ferovObject.value,
            ferovObject.dataType,
            event.detail.error
            );
        this.dispatchEvent(updateParameterItem);
    }

    handleBaseTimeChange(event) {
        event.stopPropagation();
        this.handleParameterChange(event, this.parameterNames.BASE_TIME, FLOW_DATA_TYPE.DATE_TIME.value, true);
    }

    getResumeTimeParameterValue(paramName) {
        const param = this.resumeTimeParameters[paramName];
        return param && getValueFromHydratedItem(param.value);
    }
}