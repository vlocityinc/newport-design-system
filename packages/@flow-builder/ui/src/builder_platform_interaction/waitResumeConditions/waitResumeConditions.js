import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./waitResumeConditionsLabels";
import { WAIT_TIME_EVENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';

const resumeEventType = {
    timeEventType: 'TIME_EVENT_TYPE',
    platformEventType: 'PLATFORM_EVENT_TYPE'
};

export default class WaitResumeConditions extends LightningElement {
    /**
     * The input parameters that defines the resume time for this wait event
     * @type {module:WaitTimeEvent.WaitEventParameter}
     */
    @api
    resumeTimeParameters;

    /**
     * The output parameters
     * @type {module:WaitTimeEvent.WaitEventParamter}
     */
    @api
    outputParameters;

    /**
     * @type {String} guid of the parent wait element
     */
    @api
    parentGuid;

    /**
     * The event type
     * @type {String}
     */
    set eventType(newEventType) {
        this._eventType = newEventType;
        if (newEventType) {
            this.resumeEventType = this.isTimeEvent(newEventType) ? resumeEventType.timeEventType :
                resumeEventType.platformEventType;
        }
    }

    @api
    get eventType() {
        return this._eventType;
    }

    /**
     * internal state for the wait-resume-condition
     */

    @track
    _eventType;

    @track
    resumeEventType = resumeEventType.timeEventType;

    labels = LABELS;

    resumeEventTypeOptions = [
        { 'label': LABELS.timeEventTypeLabel, 'value': resumeEventType.timeEventType },
        { 'label': LABELS.platformEventTypeLabel, 'value': resumeEventType.platformEventType},
    ];

    get isPlatformEventTypeSelected() {
        return this.resumeEventType === resumeEventType.platformEventType;
    }

    get isTimeEventTypeSelected() {
        return this.resumeEventType === resumeEventType.timeEventType;
    }

    handleOptionSelected(event) {
        event.stopPropagation();
        this.resumeEventType = event.detail.value;
        if (this.resumeEventType === resumeEventType.timeEventType) {
            // Set the default back to absolute time
            this._eventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
        }
        this.resumeTimeParameters = [];
    }

    isTimeEvent(eventType) {
        const value = getValueFromHydratedItem(eventType);
        return Object.values(WAIT_TIME_EVENT_TYPE).includes(value);
    }
}