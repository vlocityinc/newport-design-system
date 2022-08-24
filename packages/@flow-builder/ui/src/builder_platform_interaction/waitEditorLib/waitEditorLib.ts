export const defaultWaitElement = {
    waitEvents: {
        value: [
            {
                conditionLogic: { error: null, value: 'no_conditions' },
                conditions: [],
                duration: { value: null, error: null },
                durationUnit: { value: null, error: null },
                elementType: 'WAIT_EVENT',
                eventType: { value: 'AlarmEvent', error: null },
                resumeDate: { value: null, error: null },
                resumeTime: { value: null, error: null },
                guid: null
            }
        ],
        error: null
    },
    timeZoneId: { value: null, error: null },
    guid: { value: null, error: null }
};
export type WaitElement = typeof defaultWaitElement;
