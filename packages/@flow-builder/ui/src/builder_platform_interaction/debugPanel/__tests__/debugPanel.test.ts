// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanel from '../debugPanel';
import { STATUS } from 'builder_platform_interaction/debugUtils';

const START = new Date('June 17, 2020 03:24:00');

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const createComponentUnderTest = debugData => {
    const el = createElement('builder_platform_interaction-debug-panel', {
        is: DebugPanel
    });
    el.debugData = debugData;
    document.body.appendChild(el);
    return el;
};

const erroredInterview = {
    interviewStatus: STATUS.ERROR,
    startInterviewTime: START,
    error: 'The selected user does not have permission to run this flow.'
};

describe('Debug Panel', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(erroredInterview);
        const errorText = panel.shadowRoot.querySelector('.error');
        expect(errorText).not.toBeUndefined();

        const text = errorText.textContent;
        expect(text).toContain(erroredInterview.error);
    });
});
