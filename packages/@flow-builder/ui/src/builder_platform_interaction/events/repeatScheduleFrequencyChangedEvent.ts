/**
 * Used to change frequency selection on builder_platform_interaction-repeat-schedule
 */
const eventName = 'repeatschedulefrequencychanged';

type RepeatScheduleFrequencyChangedEventDetail = {
    value: string;
};

export class RepeatScheduleFrequencyChangedEvent extends CustomEvent<RepeatScheduleFrequencyChangedEventDetail> {
    constructor(value) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                value
            }
        });
    }

    static EVENT_NAME = eventName;
}
