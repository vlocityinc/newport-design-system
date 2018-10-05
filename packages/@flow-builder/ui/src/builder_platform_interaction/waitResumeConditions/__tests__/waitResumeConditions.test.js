import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import WaitResumeConditions from '../waitResumeConditions';

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
};

describe('waitResumeConditions', () => {
    describe('wait time event', () => {
        let waitResumeConditions;
        let props;
        beforeEach(() => {
            const mockResumeTimeParamters = [{ name: 'foo' }];
            const mockEventType = 'fizzBuzz';
            props = {
                resumeTimeParameters: mockResumeTimeParamters,
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
    });
});