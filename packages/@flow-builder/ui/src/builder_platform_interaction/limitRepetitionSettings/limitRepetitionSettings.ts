import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import {
    ELEMENT_PROPS,
    MAX_MAX_RESPONSES,
    MAX_WITHIN_DAYS,
    MIN_MAX_RESPONSES,
    MIN_WITHIN_DAYS,
    ResponseTypeToLimit
} from 'builder_platform_interaction/limitRepetitionsLib';
import { api, LightningElement } from 'lwc';
import { LABELS } from './limitRepetitionSettingsLabels';

export default class LimitRepetitionSettings extends LightningElement {
    responseTypes = [
        { label: LABELS.acceptedOrRejected, value: ResponseTypeToLimit.All },
        { label: LABELS.accepted, value: ResponseTypeToLimit.Accepted },
        { label: LABELS.rejected, value: ResponseTypeToLimit.Rejected }
    ];

    minWithinDays = MIN_WITHIN_DAYS;
    maxWithinDays = MAX_WITHIN_DAYS;
    maxMaxResponses = MAX_MAX_RESPONSES;
    minMaxResponses = MIN_MAX_RESPONSES;

    @api
    maxResponses;

    @api
    withinDays;

    @api
    responseTypeToLimit;

    @api
    recordId;

    get labels() {
        return LABELS;
    }

    handleResponseTypeChange(event) {
        event.stopPropagation();
        const { value } = event.target;

        if (this.responseTypeToLimit !== value) {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.responseTypeToLimit.name, value);
            this.dispatchEvent(event);
        }
    }

    handleMaxResponsesFocusOut(event) {
        event.stopPropagation();
        const { value } = event.target;
        if (this.maxResponses !== value) {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.maxResponses.name, value);
            this.dispatchEvent(event);
        }
    }

    handleWithinDaysFocusOut(event) {
        event.stopPropagation();
        const { value } = event.target;
        if (this.withinDays !== value) {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.withinDays.name, value);
            this.dispatchEvent(event);
        }
    }
}
