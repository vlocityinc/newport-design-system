export const defaultWaitElement = {
    waitEvents: {
        value: [
            {
                conditionLogic: { error: null, value: 'no_conditions' },
                conditions: [],
                elementType: 'WAIT_EVENT',
                eventType: { value: 'AlarmEvent', error: null },
                offset: { value: null, error: null },
                offsetUnit: { value: null, error: null },
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
