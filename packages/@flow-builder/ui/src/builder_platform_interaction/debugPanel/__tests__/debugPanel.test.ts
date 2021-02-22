// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanel from '../debugPanel';
import { errorInterview } from 'mock/debugResponse/mock-error-interview';
import { fakePausedInterview } from 'mock/debugResponse/mock-fake-paused-interview';
import { fakeResumedInterviewWithError } from 'mock/debugResponse/mock-fake-paused-interview';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const createComponentUnderTest = (debugData, newData = undefined) => {
    const el = createElement('builder_platform_interaction-debug-panel', {
        is: DebugPanel
    });
    el.debugData = debugData;
    setDocumentBodyChildren(el);

    if (newData !== undefined) {
        el.debugData = newData;
        setDocumentBodyChildren(el);
    }
    return el;
};

describe('Debug Panel', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(errorInterview);
        const errorText = panel.shadowRoot.querySelector('.errorMsg');
        expect(errorText).not.toBeUndefined();

        const entries = panel.shadowRoot.querySelectorAll('.entries');
        expect(entries.length).toEqual(0);

        const text = errorText.value[0];
        expect(text).toContain(errorInterview.error);
    });
});

describe('Debug Panel for Pause and Error Resume', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(fakePausedInterview, fakeResumedInterviewWithError);
        const errorText = panel.shadowRoot.querySelector('.errorMsg');
        expect(errorText).not.toBeUndefined();

        const entries = panel.shadowRoot.querySelectorAll('.entries');
        expect(entries.length).toEqual(fakePausedInterview.debugTrace.length);

        const text = errorText.value[0];
        expect(text).toContain(fakeResumedInterviewWithError.error);
    });
});
