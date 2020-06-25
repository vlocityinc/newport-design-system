// @ts-nocheck
/**
 * Used by radio button group on decision outcome
 */
const eventName = 'executewhenoptionchanged';

export class ExecuteWhenOptionChangedEvent extends CustomEvent {
    constructor(guid: string, doesRequireRecordChangedToMeetCriteria: boolean) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                guid,
                doesRequireRecordChangedToMeetCriteria
            }
        });
    }
    static EVENT_NAME = eventName;
}
