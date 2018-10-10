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

// rules used by the pickers in resume time section of the waitTimeEvent
const resumeTimeRules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.WAIT);

export default class WaitTimeEvent extends LightningElement {
    @track
    _eventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;

    /**
     * @typedef {Object} ResumeTimeParameter
     * @property {String} name the name of the paramter
     * @property {String} value the ferov value of the parameter
     * @property {String} valueDataType the datatype of the ferov value
     */

    /**
     * Object of input parameters used to define the resume time
     * @type{ResumeTimeParameter}
     */
    @api
    resumeTimeParameters = [];

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

    baseTimeElementParam = {
        isCollection: false,
        dataType: FLOW_DATA_TYPE.DATE_TIME.value,
    };

    eventTypeValueOptions = [
        { 'label': this.labels.absoluteTimeLabel, 'value': WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME },
        { 'label': this.labels.directRecordTimeLabel, 'value': WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME },
    ];

    get resumeTimeParameterRules() {
        return resumeTimeRules;
    }

    get elementType() {
        return ELEMENT_TYPE.WAIT;
    }

    get isAbsoluteTime() {
        return this.eventType === WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
    }

    get baseTime() {
        return this.resumeTimeParameters.AlarmTime && getValueFromHydratedItem(this.resumeTimeParameters.AlarmTime.value);
    }

    get baseTimeErrorMessage() {
        return this.resumeTimeParameters.AlarmTime && getErrorFromHydratedItem(this.resumeTimeParameters.AlarmTime.value);
    }

    get baseTimeComoboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.baseTimeLabel,
            this.labels.baseTimePlaceholder,
            null,
            true,
            true,
            false,
            FLOW_DATA_TYPE.DATE_TIME.value,
        );
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
            propertyName,
            propertyName,
            ferovObject.value,
            ferovObject.dataType,
            event.detail.error
            );
        this.dispatchEvent(updateParameterItem);
    }

    handleBaseTimeChange(event) {
        event.stopPropagation();
        this.handleParameterChange(event, 'AlarmTime', FLOW_DATA_TYPE.DATE_TIME.value, true);
    }
}