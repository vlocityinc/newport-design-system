import { LightningElement, api, track } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE, FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE, WAIT_TIME_EVENT_TYPE, WAIT_TIME_EVENT_PARAMETER_NAMES } from 'builder_platform_interaction/flowMetadata';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import {
    UpdateParameterItemEvent,
    UpdateWaitEventEventTypeEvent,
} from 'builder_platform_interaction/events';
import { getFerovInfoAndErrorFromEvent } from 'builder_platform_interaction/expressionUtils';
import { getValueFromHydratedItem, getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from "./waitTimeEventLabels";

// rules used by the input pickers in the waitTimeEvent
const timeEventRules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.WAIT);

const SELECTORS = {
    ABSOLUTE_BASE_TIME_INPUT: '.absolute-basetime',
    SALESFORCE_OBJECT_INPUT: '.salesforce-object',
    DIRECT_RECORD_BASE_TIME_INPUT: '.direct-record-basetime',
    OFFSET_NUMBER: '.offset-number',
    OFFSET_UNIT: '.offset-unit',
};

/**
 * Turns an array of paramters into an object where each property contains one index of the array
 * This also creates inputParamter for each param
 * @param {Object[]} parameters list of parameters
 * @returns {Object} object where the key is the param name and the value is the parameter
 */
const inputParameterArrayToMap = (parameters = []) => {
    const parametersMap = new Map();

    parameters.forEach((param) => {
        parametersMap.set(getValueFromHydratedItem(param.name), param);
    });

    return parametersMap;
};

export default class WaitTimeEvent extends LightningElement {
    @track
    resumeTimeParametersMap = new Map();

    @track
    resumeTimeParametersArray = [];

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
     * @type {ParameterItem[]}
     */
    set resumeTimeParameters(resumeTimeParameters) {
        this.resumeTimeParametersArray = resumeTimeParameters;
        if (resumeTimeParameters) {
            this.resumeTimeParametersMap = inputParameterArrayToMap(resumeTimeParameters);

            const salesforceObjectInput = this.template.querySelector(SELECTORS.SALESFORCE_OBJECT_INPUT);
            this.setInputErrorMessage(salesforceObjectInput, this.getResumeTimeParameterError(WAIT_TIME_EVENT_PARAMETER_NAMES.SALESFORCE_OBJECT));

            const directBaseTimeInput = this.template.querySelector(SELECTORS.DIRECT_RECORD_BASE_TIME_INPUT);
            this.setInputErrorMessage(directBaseTimeInput, this.getResumeTimeParameterError(WAIT_TIME_EVENT_PARAMETER_NAMES.DIRECT_RECORD_BASE_TIME));

            const offsetNumberInput = this.template.querySelector(SELECTORS.OFFSET_NUMBER);
            this.setInputErrorMessage(offsetNumberInput, this.getResumeTimeParameterError(WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_NUMBER));

            const offsetUnitInput = this.template.querySelector(SELECTORS.OFFSET_UNIT);
            this.setInputErrorMessage(offsetUnitInput, this.getResumeTimeParameterError(WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_UNIT));
        }
    }

    /**
     * Array of parameter items used to define the resume time input
     * @type {ParameterItem[]}
     */
    @api
    get resumeTimeParameters() {
        return this.resumeTimeParametersArray;
    }

    /**
     * Object of output parameters
     *
     * @param {Object} outputParameters object of @type {WaitEventParameter}
     */
    set outputParameters(outputParameters) {
        this._outputParameters = outputParameters;
        const alarmTime = outputParameters[WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME];
        this.outputResumeTime = Object.assign({},
            alarmTime,
            this.outputResumeTimeDefinition
        );
        const status = outputParameters[WAIT_TIME_EVENT_PARAMETER_NAMES.EVENT_DELIVERY_STATUS];
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

    /**
     * @type {String} guid of the parent wait element
     */
    @api
    waitEventGuid;

    labels = LABELS;

    _outputParameters;

    dateTimeElementParam = {
        isCollection: false,
        dataType: FLOW_DATA_TYPE.DATE_TIME.value,
    };

    recordIdElementParam = {
        isCollection: false,
        dataType: FLOW_DATA_TYPE.STRING.value,
    };

    eventTypeValueOptions = [
        { 'label': this.labels.absoluteTimeLabel, 'value': WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME },
        { 'label': this.labels.directRecordTimeLabel, 'value': WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME },
    ];

    // TODO: W-5531948 we might be able to remove this once the translation work for outputParameters is done
    outputResumeTimeDefinition = {
        name: WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME,
        rowIndex: 0,
        isInput: false,
        isRequired: false,
        label: this.labels.resumeTimeLabel,
        dataType: FLOW_DATA_TYPE.DATE_TIME.value,
        iconName: 'utility:date_input',
    };

    // TODO: W-5531948 we might be able to remove this once the translation work for outputParameters is done
    outputEventDeliveryStatusDefinition = {
        name: WAIT_TIME_EVENT_PARAMETER_NAMES.EVENT_DELIVERY_STATUS,
        rowIndex: 1,
        isInput: false,
        isRequired: false,
        label: this.labels.eventDeliveryStatusLabel,
        dataType: FLOW_DATA_TYPE.STRING.value,
        iconName: 'utility:type_tool',
    };

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

    get absoluteBaseTime() {
        return this.getResumeTimeParameterValue(WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME);
    }

    get absoluteBaseTimeErrorMessage() {
        return this.getResumeTimeParameterError(WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME);
    }

    get absoluteBaseTimeIndex() {
        return this.getResumeTimeParameterIndex(WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME);
    }

    get absoluteBaseTimeComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.baseTimeLabel,
            this.labels.ferovPickerPlaceholder,
            null,
            true,
            true,
            false,
            FLOW_DATA_TYPE.DATE_TIME.value,
            true, // enableFieldDrilldown
        );
    }

    get recordIdComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.recordId,
            this.labels.ferovPickerPlaceholder,
            null,
            true,
            true,
            false,
            FEROV_DATA_TYPE.REFERENCE.value
        );
    }

    get offsetNumber() {
        return this.getResumeTimeParameterValue(WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_NUMBER);
    }

    get offsetUnit() {
        return this.getResumeTimeParameterValue(WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_UNIT);
    }

    get recordIdValue() {
        return this.getResumeTimeParameterValue(WAIT_TIME_EVENT_PARAMETER_NAMES.RECORD_ID);
    }

    get recordIdIndex() {
        return this.getResumeTimeParameterIndex(WAIT_TIME_EVENT_PARAMETER_NAMES.RECORD_ID);
    }

    get recordIdErrorMessage() {
        return this.getResumeTimeParameterError(WAIT_TIME_EVENT_PARAMETER_NAMES.RECORD_ID);
    }

    get salesforceObjectValue() {
        return this.getResumeTimeParameterValue(WAIT_TIME_EVENT_PARAMETER_NAMES.SALESFORCE_OBJECT);
    }

    get directRecordBaseTime() {
        return this.getResumeTimeParameterValue(WAIT_TIME_EVENT_PARAMETER_NAMES.DIRECT_RECORD_BASE_TIME);
    }

    get offsetNumberHelpText() {
        return this.eventType === WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME ? this.labels.baseTimeoffsetNumberHelpText : this.labels.fieldOffsetNumberHelpText;
    }

    handleEventTypeChange(event) {
        event.stopPropagation();

        // fire update event type event
        const updateWaitEventEventEvent = new UpdateWaitEventEventTypeEvent(event.detail.value, null, this.waitEventGuid);
        this.dispatchEvent(updateWaitEventEventEvent);
    }

    handleFerovParameterChange(event, propertyName, literalDataType, isInput) {
        const { value, dataType, error } = getFerovInfoAndErrorFromEvent(event, literalDataType);
        const updateParameterItem = new UpdateParameterItemEvent(
            isInput,
            null,
            propertyName,
            value,
            dataType,
            error,
            );
        this.dispatchEvent(updateParameterItem);
    }

    handleLiteralParameterChange(event, propertyName, literalDataType, isInput) {
        const updateParameterItem = new UpdateParameterItemEvent(
            isInput,
            null,
            propertyName,
            event.target.value,
            literalDataType,
            event.target.error
            );
        this.dispatchEvent(updateParameterItem);
    }

    handleRecordIdChanged(event) {
        event.stopPropagation();
        this.handleFerovParameterChange(event, WAIT_TIME_EVENT_PARAMETER_NAMES.RECORD_ID, FLOW_DATA_TYPE.STRING.value, true);
    }

    handleAbsoluteBaseTimeChange(event) {
        event.stopPropagation();
        this.handleFerovParameterChange(event, WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME, FLOW_DATA_TYPE.DATE_TIME.value, true);
    }

    handleOffsetNumberChange(event) {
        event.stopPropagation();

        let offset = event.target.value;

        if (Number.isNaN(offset)) {
            offset = 0;
        }

        offset = Math.trunc(offset);

        event.target.value = offset;

        if (!event.target.valid) {
            event.target.reportValidity();
        }

        const updateParameterItem = new UpdateParameterItemEvent(
            true,
            null,
            WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_NUMBER,
            offset,
            FLOW_DATA_TYPE.NUMBER.value,
            event.target.error
        );
        this.dispatchEvent(updateParameterItem);
    }

    handleOffsetUnitChange(event) {
        event.stopPropagation();
        this.handleLiteralParameterChange(event, WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_UNIT, FLOW_DATA_TYPE.STRING.value, true);
    }

    handleSalesforceObjectFocusOut(event) {
        event.stopPropagation();
        const error = event.target.value === '' ? this.labels.cannotBeBlank : null;
        const updateParameterItem = new UpdateParameterItemEvent(
            true,
            null,
            WAIT_TIME_EVENT_PARAMETER_NAMES.SALESFORCE_OBJECT,
            event.target.value,
            FLOW_DATA_TYPE.STRING.value,
            error);
        this.dispatchEvent(updateParameterItem);
    }

    handleDirectRecordBaseTimeChange(event) {
        event.stopPropagation();
        const error = event.target.value === '' ? this.labels.cannotBeBlank : null;
        const updateParameterItem = new UpdateParameterItemEvent(
            true,
            null,
            WAIT_TIME_EVENT_PARAMETER_NAMES.DIRECT_RECORD_BASE_TIME,
            event.target.value,
            FLOW_DATA_TYPE.STRING.value,
            error);
        this.dispatchEvent(updateParameterItem);
    }

    getResumeTimeParameterValue(paramName) {
        const param = this.resumeTimeParametersMap.get(paramName);
        return param ? getValueFromHydratedItem(param.value) : null;
    }

    getResumeTimeParameterIndex(paramName) {
        const param = this.resumeTimeParametersMap.get(paramName);
        return param ? param.rowIndex : null;
    }

    getResumeTimeParameterError(paramName) {
        const param = this.resumeTimeParametersMap.get(paramName);
        return param ? getErrorFromHydratedItem(param.value) : null;
    }

    /** Sets the CustomValidity if there is a valid error message.
     * @param {Object} element - the input component
     * @param {Object} error - the error
     */
    setInputErrorMessage(element, error) {
        if (element) {
            if (error) {
                element.setCustomValidity(error);
            } else {
                element.setCustomValidity('');
            }
            element.showHelpMessageIfInvalid();
        }
    }

    /**
     * LWC hook after rendering every component we are setting all errors via setCustomValidity except initial rendering.
     *
     * TODO: revisit as part of W-5676962
     * **/
    renderedCallback() {
        if (this.absoluteBaseTime && (this.absoluteBaseTime !== '' || this.absoluteBaseTimeErrorMessage)) {
            const absoluteBaseTimeInput = this.template.querySelector(SELECTORS.ABSOLUTE_BASE_TIME_INPUT);
            absoluteBaseTimeInput.setCustomValidity(this.absoluteBaseTimeErrorMessage || '');
        }
    }
}
