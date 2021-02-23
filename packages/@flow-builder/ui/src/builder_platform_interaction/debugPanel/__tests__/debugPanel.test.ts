// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanel from '../debugPanel';
import { errorInterview } from 'mock/debugResponse/mock-error-interview';
import { fakePausedInterview } from 'mock/debugResponse/mock-fake-paused-interview';
import { fakeResumedInterviewWithError } from 'mock/debugResponse/mock-fake-paused-interview';
import { completedInterview } from 'mock/debugResponse/mock-completed-interview';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

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

const selectors = {
    errorMessage: '.errorMsg',
    govLimText: '.govLim',
    debugPanelBodyComponent: 'builder_platform_interaction-debug-panel-body',
    comboboxComponent: 'builder_platform_interaction-multi-select-combobox',
    optionComponent: 'builder_platform_interaction-multi-select-option',
    comboboxInputField: 'input',
    clickableOption: '.slds-listbox__item'
};

describe('Debug Panel', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(errorInterview);
        const errorText = panel.shadowRoot.querySelector(selectors.errorMessage);
        expect(errorText).not.toBeUndefined();

        const entries = panel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
        expect(entries.length).toEqual(0);

        const text = errorText.value[0];
        expect(text).toContain(errorInterview.error);
    });
});

describe('Debug Panel for Pause and Error Resume', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(fakePausedInterview, fakeResumedInterviewWithError);
        const errorText = panel.shadowRoot.querySelector(selectors.errorMessage);
        expect(errorText).not.toBeUndefined();

        const entries = panel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
        expect(entries.length).toEqual(fakePausedInterview.debugTrace.length);

        const text = errorText.value[0];
        expect(text).toContain(fakeResumedInterviewWithError.error);
    });
});

describe('Debug Panel Filter Behavior', () => {
    let debugPanel;
    let allDebugEntries;
    beforeEach(() => {
        debugPanel = createComponentUnderTest(completedInterview);
        allDebugEntries = debugPanel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
    });

    describe('Debug panel on render without filters', () => {
        it('should not display transaction boundaries on initial render', () => {
            // we always add an extra 'How interview finished entry'. Without transaction, cards.length = debugTrace.length
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length);
            for (let i = 0; i < allDebugEntries.length - 1; i++) {
                // this interview example uses rollback mode which is of TransactionInfoEntry type
                expect(allDebugEntries[i].title).not.toContain('ROLLBACK');
            }
        });

        it('should not display governor limits on initial render', () => {
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length);
            expect(allDebugEntries[1].shadowRoot.querySelector(selectors.govLimText)).toBeFalsy();
        });
    });

    describe('Debug panel after filters', () => {
        let govLimFilterOption;
        let transactionFilterOption;
        beforeEach(async () => {
            const combobox = debugPanel.shadowRoot.querySelector(selectors.comboboxComponent);
            combobox.shadowRoot.querySelector(selectors.comboboxInputField).click();
            await ticks(1);

            const optionComponents = combobox.shadowRoot.querySelectorAll(selectors.optionComponent);
            govLimFilterOption = optionComponents[1];
            transactionFilterOption = optionComponents[2];
        });

        it('should display transaction boundaries when filtered in', async () => {
            transactionFilterOption.shadowRoot.querySelector(selectors.clickableOption).click();
            await ticks(1);

            const allDebugEntries = debugPanel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length + 1);
            expect(allDebugEntries[2].title).toContain('ROLLBACK');
        });

        it('should display governor limits when filtered in', async () => {
            govLimFilterOption.shadowRoot.querySelector(selectors.clickableOption).click();
            await ticks(1);

            const govLimContent = allDebugEntries[1].shadowRoot.querySelector(selectors.govLimText);
            expect(govLimContent).toBeTruthy();
            const limits = govLimContent.querySelectorAll('lightning-formatted-rich-text');
            expect(limits.length).toEqual(completedInterview.debugTrace[1].limits.length);
        });
    });
});
