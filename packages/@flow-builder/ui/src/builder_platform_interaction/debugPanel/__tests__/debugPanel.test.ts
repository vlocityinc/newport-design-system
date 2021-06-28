// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanel from '../debugPanel';
import { LABELS } from '../debugPanelLabels';
import { errorInterview } from 'mock/debugResponse/mock-error-interview';
import { fakePausedInterview } from 'mock/debugResponse/mock-fake-paused-interview';
import { fakeResumedInterviewWithError, fakeResumedInterview } from 'mock/debugResponse/mock-fake-paused-interview';
import { completedInterview } from 'mock/debugResponse/mock-completed-interview';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const createComponentUnderTest = (debugData, newData = undefined, fromEmailDebugging = false) => {
    const el = createElement('builder_platform_interaction-debug-panel', {
        is: DebugPanel
    });
    el.debugData = debugData;
    el.fromEmailDebugging = fromEmailDebugging;
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
    debugPanelFilterComponent: 'builder_platform_interaction-debug-panel-filter',
    checkboxesGroup: 'lightning-checkbox-group',
    filterButton: 'lightning-button-icon.filterButton',
    popover: 'section.slds-popover',
    closePopover: 'lightning-button-icon.slds-popover__close',
    header: 'div.slds-panel__header'
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
    let panel;
    beforeEach(() => {
        panel = createComponentUnderTest(fakePausedInterview, fakeResumedInterviewWithError);
    });
    it('should display error when run fails', () => {
        const errorText = panel.shadowRoot.querySelector(selectors.errorMessage);
        expect(errorText).not.toBeUndefined();

        const entries = panel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
        // we by default omit the transaction boundary at the end
        // since we paused then resume with runtime error, there is no "how the interview finished" entry
        expect(entries.length).toEqual(fakePausedInterview.debugTrace.length - 1);

        const text = errorText.value[0];
        expect(text).toContain(fakeResumedInterviewWithError.error);
    });

    it('should still display correct entries on filter', async () => {
        const debugPanelFilter = panel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
        debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
        await ticks(1);

        const checkboxGroup = panel.shadowRoot.querySelector(selectors.checkboxesGroup);
        checkboxGroup.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    value: [LABELS.transactionFilter]
                }
            })
        );
        await ticks(1);

        const entries = panel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
        // there will be the newly visible transaction boundary entry, so an extra entry than before
        expect(entries.length).toEqual(fakePausedInterview.debugTrace.length);
        expect(entries[3].title).toContain('Committed');

        const errorText = panel.shadowRoot.querySelector(selectors.errorMessage);
        expect(errorText).not.toBeUndefined();
        const text = errorText.value[0];
        expect(text).toContain(fakeResumedInterviewWithError.error);
    });
});

describe('filter behaviour', () => {
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
        let debugPanelFilter;
        beforeEach(async () => {
            debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);
        });

        it('should display transaction boundaries when filtered in', async () => {
            debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.transactionFilter];
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(2);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.transactionFilter]
                    }
                })
            );
            await ticks(1);

            const allDebugEntries = debugPanel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length + 1);
            expect(allDebugEntries[2].title).toContain('ROLLBACK');
        });

        it('should display governor limits when filtered in', async () => {
            debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.govLimFilter];
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(2);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.govLimFilter]
                    }
                })
            );
            await ticks(1);

            const govLimContent = allDebugEntries[1].shadowRoot.querySelector(selectors.govLimText);
            expect(govLimContent).toBeTruthy();
            const limits = govLimContent.querySelectorAll('lightning-formatted-rich-text');
            expect(limits.length).toEqual(completedInterview.debugTrace[1].limits.length);
        });

        it('should NOT display transaction boundaries when filtered out', async () => {
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.transactionFilter]
                    }
                })
            );
            await ticks(1);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: []
                    }
                })
            );
            await ticks(1);

            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length);
            for (let i = 0; i < allDebugEntries.length - 1; i++) {
                // this interview example uses rollback mode which is of TransactionInfoEntry type
                expect(allDebugEntries[i].title).not.toContain('ROLLBACK');
            }
        });

        it('should NOT display governor limits when filtered out', async () => {
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.govLimFilter]
                    }
                })
            );
            await ticks(1);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: []
                    }
                })
            );
            await ticks(1);

            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length);
            expect(allDebugEntries[1].shadowRoot.querySelector(selectors.govLimText)).toBeFalsy();
        });
    });

    describe('Debug panel in one click debugging filter behaviour', () => {
        let debugPanel;
        let allDebugEntries;
        let debugPanelFilter;
        beforeEach(async () => {
            debugPanel = createComponentUnderTest(completedInterview, undefined, true);
            allDebugEntries = debugPanel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
            debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);
        });

        it('should not show transaction boundaries by default', () => {
            // we always add an extra 'How interview finished entry'. Without transaction, cards.length = debugTrace.length
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length);
            for (let i = 0; i < allDebugEntries.length - 1; i++) {
                // this interview example uses rollback mode which is of TransactionInfoEntry type
                expect(allDebugEntries[i].title).not.toContain('ROLLBACK');
            }
        });

        it('should display transaction boundaries when filtered in', async () => {
            debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.transactionFilter];
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(1);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.transactionFilter]
                    }
                })
            );
            await ticks(1);

            const allDebugEntries = debugPanel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length + 1);
            expect(allDebugEntries[2].title).toContain('ROLLBACK');
        });
    });

    describe('Resume focus behavior', () => {
        let debugPanel;
        beforeEach(() => {
            debugPanel = createComponentUnderTest(fakeResumedInterview, undefined, false, true);
        });
        it('resume card is focused when panel is rendered', () => {
            const resumeSection = debugPanel.shadowRoot.querySelector('[data-name="Resume label"]');
            const focusedElement = document.activeElement;
            // eslint-disable-next-line
            expect(resumeSection.innerHTML).toBe(focusedElement.shadowRoot.activeElement.innerHTML);
        });
    });
    describe('debug focus behavior', () => {
        let debugPanel;
        beforeEach(() => {
            debugPanel = createComponentUnderTest(fakeResumedInterview);
        });
        it('tabindex of debug details header should be -1', () => {
            const head = debugPanel.shadowRoot.querySelector(selectors.header);
            expect(head.getAttribute('tabindex')).toEqual('-1');
        });
        it('focus is not shifted to resume card when other buttons are clicked', async () => {
            const resumeSection = debugPanel.shadowRoot.querySelector('[data-name="Resume label"]');
            const expandButton = debugPanel.shadowRoot.querySelector('.test-expand-button');
            expandButton.focus();
            const callback = jest.fn();
            resumeSection.addEventListener('focus', callback);
            expandButton.click();
            await ticks(1);
            expect(callback).toBeCalledTimes(0);
        });
    });
});

describe('expand card behavior', () => {
    let debugPanel;
    beforeEach(() => {
        debugPanel = createComponentUnderTest(completedInterview);
    });
    it('should change label on pressing button', async () => {
        const expandButton = debugPanel.shadowRoot.querySelector('.test-expand-button');
        expect(expandButton.label).toBe(LABELS.expandAllLabel);
        expandButton.click();
        await ticks(1);
        expect(expandButton.label).toBe(LABELS.collapseAllLabel);
    });
    it('should change title on pressing button', async () => {
        const expandButton = debugPanel.shadowRoot.querySelector('.test-expand-button');
        expect(expandButton.title).toBe(LABELS.expandAllTitle);
        expandButton.click();
        await ticks(1);
        expect(expandButton.title).toBe(LABELS.collapseAllTitle);
    });
    it('should change label back to original label on pressing even number of times', async () => {
        const expandButton = debugPanel.shadowRoot.querySelector('.test-expand-button');
        expect(expandButton.label).toBe(LABELS.expandAllLabel);
        expandButton.click();
        await ticks(1);
        expandButton.click();
        await ticks(1);
        expect(expandButton.label).toBe(LABELS.expandAllLabel);
    });
});
