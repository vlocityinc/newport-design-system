// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanel from '../debugPanel';
import { errorInterview } from 'mock/debugResponse/mock-error-interview';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const createComponentUnderTest = (debugData) => {
    const el = createElement('builder_platform_interaction-debug-panel', {
        is: DebugPanel
    });
    el.debugData = debugData;
    setDocumentBodyChildren(el);
    return el;
};

describe('Debug Panel', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(errorInterview);
        const errorText = panel.shadowRoot.querySelector('.errorMsg');
        expect(errorText).not.toBeUndefined();

        const text = errorText.value[0];
        expect(text).toContain(errorInterview.error);
    });
});
