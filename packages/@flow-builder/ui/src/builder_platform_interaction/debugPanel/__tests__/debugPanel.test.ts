// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanel from '../debugPanel';
import { errorInterview } from 'mock/debugResponse/mock-error-interview';

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

describe('Debug Panel', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(errorInterview);
        const errorText = panel.shadowRoot.querySelector('.error');
        expect(errorText).not.toBeUndefined();

        const text = errorText.textContent;
        expect(text).toContain(errorInterview.error);
    });
});
