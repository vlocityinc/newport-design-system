export const defaultWaitElement = {
    durationOffset: { value: 0, error: null },
    durationUnit: { value: 'Days', error: null },
    timeValue: { value: null, error: null },
    timeZone: { value: null, error: null }
};
export type WaitElement = typeof defaultWaitElement;
