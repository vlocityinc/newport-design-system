export const defaultWaitElement = {
    waitEvents: {
        value: [
            {
                conditionLogic: { error: null, value: 'no_conditions' },
                conditions: [],
                duration: { value: 0, error: null },
                durationUnit: { value: 'Days', error: null },
                elementType: 'WAIT_EVENT',
                eventType: { value: 'AlarmEvent', error: null },
                extendUntil: { value: null, error: null },
                guid: null
            }
        ],
        error: null
    },
    timeZoneId: { value: null, error: null },
    guid: { value: null, error: null }
};
export type WaitElement = typeof defaultWaitElement;
