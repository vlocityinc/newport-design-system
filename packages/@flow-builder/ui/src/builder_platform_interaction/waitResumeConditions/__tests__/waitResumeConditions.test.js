import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import WaitResumeConditions from '../waitResumeConditions';
import { WAIT_TIME_EVENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const createComponentUnderTest = (props) => {
    let el = createElement('builder_platform_interaction-wait-resume-conditions', {
        is: WaitResumeConditions
    });
    el = Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const selectors = {
    waitTimeEvent: 'builder_platform_interaction-wait-time-event',
    waitPlatformEvent: 'builder_platform_interaction-wait-platform-event',
    lightningRadioGroup: 'lightning-radio-group',
};

const resumeEventType = {
    timeEventType: 'TIME_EVENT_TYPE',
    platformEventType: 'PLATFORM_EVENT_TYPE'
};

const verifyResumeEventType = (waitResumeConditions, shouldShowTimeEvent) => {
    const lightningRadioGroup = getShadowRoot(waitResumeConditions).querySelector(selectors.lightningRadioGroup);
    const waitTimeEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitTimeEvent);
    const waitPlatformEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitPlatformEvent);
    if (shouldShowTimeEvent) {
        expect(lightningRadioGroup.value).toBe(resumeEventType.timeEventType);
        expect(waitTimeEvent).toBeTruthy();
        expect(waitPlatformEvent).toBeNull();
    } else {
        expect(lightningRadioGroup.value).toBe(resumeEventType.platformEventType);
        expect(waitTimeEvent).toBeNull();
        expect(waitPlatformEvent).toBeTruthy();
    }
};

describe('waitResumeConditions', () => {
    describe('resume event type', () => {
        it('is time event if absolute alarm is the event type', () => {
            const props = {
                eventType: WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME,
                resumeTimeParameters: [],
            };
            verifyResumeEventType(createComponentUnderTest(props), true);
        });

        it('is time event if direct record alarm is the event type', () => {
            const props = {
                eventType: WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME,
                resumeTimeParameters: [],
            };
            verifyResumeEventType(createComponentUnderTest(props), true);
        });

        it('is platform event if the event type with suffix __e', () => {
            const props = {
                eventType: 'MyEvent__e',
                resumeTimeParameters: [],
            };
            verifyResumeEventType(createComponentUnderTest(props), false);
        });

        it('is platform event if the event type is any random string', () => {
            const props = {
                eventType: 'foo',
                resumeTimeParameters: [],
            };
            verifyResumeEventType(createComponentUnderTest(props), false);
        });
    });

    describe('toggle between resume event types', () => {
        const dispatchChangeEvent = (waitResumeConditions, newType) => {
            const lightningRadioGroup = getShadowRoot(waitResumeConditions).querySelector(selectors.lightningRadioGroup);
            lightningRadioGroup.dispatchEvent(new CustomEvent('change', {detail: {value: newType}}));
        };
        it('sets the resume event type as platform event when switching to that', () => {
            const props = {
                eventType: WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME,
                resumeTimeParameters: [],
            };
            const waitResumeConditions = createComponentUnderTest(props);
            dispatchChangeEvent(waitResumeConditions, resumeEventType.platformEventType);
            return Promise.resolve().then(() => {
                verifyResumeEventType(waitResumeConditions, false);
            });
        });

        describe('switching from platform event type to time event type', () => {
            it('sets the resume event type as time event and resets to default event type', () => {
                const props = {
                    eventType: WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME,
                    resumeTimeParameters: [],
                };
                const waitResumeConditions = createComponentUnderTest(props);
                dispatchChangeEvent(waitResumeConditions, resumeEventType.platformEventType);
                return Promise.resolve().then(() => {
                    dispatchChangeEvent(waitResumeConditions, resumeEventType.timeEventType);
                    return Promise.resolve().then(() => {
                        verifyResumeEventType(waitResumeConditions, true);
                        const waitTimeEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitTimeEvent);
                        expect(waitTimeEvent.eventType).toEqual(WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME);
                    });
                });
            });

            it('clears params', () => {
                const props = {
                    eventType: WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME,
                    resumeTimeParameters: ['param1'],
                };
                const waitResumeConditions = createComponentUnderTest(props);
                dispatchChangeEvent(waitResumeConditions, resumeEventType.platformEventType);
                return Promise.resolve().then(() => {
                    dispatchChangeEvent(waitResumeConditions, resumeEventType.timeEventType);
                    return Promise.resolve().then(() => {
                        verifyResumeEventType(waitResumeConditions, true);
                        const waitTimeEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitTimeEvent);
                        expect(waitTimeEvent.eventType).toEqual(WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME);
                        expect(waitTimeEvent.resumeTimeParameters).toEqual([]);
                    });
                });
            });
        });
    });

    describe('wait time event', () => {
        let waitResumeConditions;
        let props;
        beforeEach(() => {
            const mockResumeTimeParamters = { foo: { name: 'foo' } };
            const mockOutputParameters = [{name: 'bar' }];
            const mockEventType = WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME;
            props = {
                resumeTimeParameters: mockResumeTimeParamters,
                outputParameters: mockOutputParameters,
                eventType: mockEventType,
            };
            waitResumeConditions = createComponentUnderTest(props);
        });

        it('passes eventType to the waitTimeEvent', () => {
            const waitTimeEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitTimeEvent);
            expect(waitTimeEvent.eventType).toEqual(props.eventType);
        });

        it('passes resumeTimeParameters to waitTimeEvent', () => {
            const waitTimeEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitTimeEvent);
            expect(waitTimeEvent.resumeTimeParameters).toEqual(props.resumeTimeParameters);
        });

        it('changing the event type is tracked', () => {
            waitResumeConditions.eventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
            return Promise.resolve().then(() => {
                const waitTimeEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitTimeEvent);
                expect(waitTimeEvent.eventType).toEqual(WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME);
            });
        });

        it('passes outputParameters to waitTimeEvent', () => {
            const waitTimeEvent = getShadowRoot(waitResumeConditions).querySelector(selectors.waitTimeEvent);
            expect(waitTimeEvent.outputParameters).toEqual(props.outputParameters);
        });
    });
});