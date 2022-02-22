// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { BUILDER_MODE } from 'builder_platform_interaction/systemLib';
import { createElement } from 'lwc';
import { completedInterview } from 'mock/debugResponse/mock-completed-interview';
import { completedTestInterview } from 'mock/debugResponse/mock-completed-test-interview';
import { errorInterview } from 'mock/debugResponse/mock-error-interview';
import {
    fakePausedInterview,
    fakeResumedInterview,
    fakeResumedInterviewWithError
} from 'mock/debugResponse/mock-fake-paused-interview';
import { TEST_BODY_LABELS } from '../../testPanelBody/testPanelBodyLabels';
import DebugPanel from '../debugPanel';
import { LABELS } from '../debugPanelLabels';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const createComponentUnderTest = (
    debugData,
    newData = undefined,
    fromEmailDebugging = false,
    builderMode = BUILDER_MODE.DEBUG_MODE,
    showTransactionBoundaries = true
) => {
    const el = createElement('builder_platform_interaction-debug-panel', {
        is: DebugPanel
    });
    el.debugData = debugData;
    el.fromEmailDebugging = fromEmailDebugging;
    el.builderMode = builderMode;
    el.showTransactionBoundaries = showTransactionBoundaries;
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
    accordionSection: 'builder_platform_interaction-accordion-section-with-icon',
    debugPanelBodyComponent: 'builder_platform_interaction-debug-panel-body',
    testPanelBodyComponent: 'builder_platform_interaction-test-panel-body',
    debugPanelFilterComponent: 'builder_platform_interaction-debug-panel-filter',
    checkboxesGroup: 'lightning-checkbox-group',
    filterButton: 'lightning-button-icon.filterButton',
    filterDescription: 'lightning-formatted-text.selected-options',
    popover: 'section.slds-popover',
    closePopover: 'lightning-button-icon.slds-popover__close',
    header: 'div.slds-panel__header',
    tabset: 'lightning-tabset'
};

describe('Debug Panel', () => {
    it('should display error when run fails', () => {
        const panel = createComponentUnderTest(errorInterview);
        const errorText = panel.shadowRoot.querySelector(selectors.errorMessage);
        expect(errorText).not.toBeUndefined();

        const entries = panel.shadowRoot.querySelectorAll(selectors.debugPanelBodyComponent);
        expect(entries.length).toEqual(0);

        const text = errorText.value[0];
        expect(text).toEqual(errorInterview.error[0]);
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
        expect(text).toEqual(fakeResumedInterviewWithError.error[0]);
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
        expect(text).toEqual(fakeResumedInterviewWithError.error[0]);
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

        it('should not display api names on initial render', () => {
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length);
            expect(debugPanel.shadowRoot.querySelectorAll(selectors.accordionSection)[1].label).toBe(
                completedInterview.debugTrace[1].elementType + ': ' + completedInterview.debugTrace[1].elementLabel
            );
        });

        it('show "basic debug log" next to the filter icon', async () => {
            const debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
            const filterDescription = debugPanelFilter.shadowRoot.querySelector(selectors.filterDescription).value;
            expect(filterDescription).not.toBeNull();
            expect(filterDescription).toEqual(LABELS.basicFilter);
        });
    });

    describe('Debug panel after filters', () => {
        let debugPanelFilter;
        beforeEach(async () => {
            debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);
        });

        it('should display correct number of filters selected next to it', async () => {
            // checking for 0 checkboxes
            let debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
            let filterDescription = debugPanelFilter.shadowRoot.querySelector(selectors.filterDescription).value;
            expect(filterDescription).not.toBeNull();
            expect(filterDescription).toEqual(LABELS.basicFilter);

            // checking for 2 checkboxes
            debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.transactionFilter];
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);

            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(3);

            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.govLimFilter, LABELS.showApiNamesFilter]
                    }
                })
            );
            await ticks(1);

            filterDescription = debugPanelFilter.shadowRoot.querySelector(selectors.filterDescription).value;
            expect(filterDescription).not.toBeNull();
            expect(filterDescription).toEqual(commonUtils.format(LABELS.numFiltersText, 2));

            // checking for 1 checkbox
            filterDescription = debugPanelFilter.shadowRoot.querySelector(selectors.filterDescription).value;
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.govLimFilter]
                    }
                })
            );
            await ticks(1);

            debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
            filterDescription = debugPanelFilter.shadowRoot.querySelector(selectors.filterDescription).value;
            expect(filterDescription).not.toBeNull();
            expect(filterDescription).toEqual(commonUtils.format(LABELS.singleFilterText, 1));
        });

        it('should display transaction boundaries when filtered in', async () => {
            debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.transactionFilter];
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(3);
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
            expect(checkboxGroup.options).toHaveLength(3);
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

        it('should display api names when filtered in', async () => {
            debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.showApiNamesFilter];
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(3);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.showApiNamesFilter]
                    }
                })
            );
            await ticks(1);

            expect(debugPanel.shadowRoot.querySelectorAll(selectors.accordionSection)[1].label).toBe(
                completedInterview.debugTrace[1].elementType + ': ' + completedInterview.debugTrace[1].elementApiName
            );
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

        it('should NOT display api names when filtered out', async () => {
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.showApiNamesFilter]
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
            expect(debugPanel.shadowRoot.querySelectorAll(selectors.accordionSection)[1].label).toBe(
                completedInterview.debugTrace[1].elementType + ': ' + completedInterview.debugTrace[1].elementLabel
            );
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

        it('should not display api names by default', () => {
            expect(allDebugEntries.length).toEqual(completedInterview.debugTrace.length);
            expect(debugPanel.shadowRoot.querySelectorAll(selectors.accordionSection)[1].label).toBe(
                completedInterview.debugTrace[1].elementType + ': ' + completedInterview.debugTrace[1].elementLabel
            );
        });

        it('should display api names when filtered in', async () => {
            debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.showApiNamesFilter];
            const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(2);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.showApiNamesFilter]
                    }
                })
            );
            await ticks(1);

            expect(debugPanel.shadowRoot.querySelectorAll(selectors.accordionSection)[1].label).toBe(
                completedInterview.debugTrace[1].elementType + ': ' + completedInterview.debugTrace[1].elementApiName
            );
        });
    });

    describe('Resume focus behavior', () => {
        let debugPanel;
        beforeEach(() => {
            debugPanel = createComponentUnderTest(fakeResumedInterview, undefined, false, true);
        });
        it('resume card is focused when panel is rendered', () => {
            const resumeSection = debugPanel.shadowRoot.querySelector(`[data-name="${LABELS.resumeLabel}"]`);
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
            const resumeSection = debugPanel.shadowRoot.querySelector(`[data-name="${LABELS.resumeLabel}"]`);
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

describe('test assertion outcomes', () => {
    let debugPanel;
    it('should display test outcomes section only in TEST mode', () => {
        debugPanel = createComponentUnderTest(completedTestInterview, undefined, false, BUILDER_MODE.TEST_MODE);
        let testPanelBody = debugPanel.shadowRoot.querySelector(selectors.testPanelBodyComponent);
        expect(testPanelBody).not.toBeNull();

        debugPanel = createComponentUnderTest(completedInterview, undefined, false, BUILDER_MODE.TEST_MODE);
        testPanelBody = debugPanel.shadowRoot.querySelector(selectors.testPanelBodyComponent);
        expect(testPanelBody).toBeNull();
    });

    it('should not display test outcomes section if user opens flow builder from error email', () => {
        debugPanel = createComponentUnderTest(completedTestInterview, undefined, true, BUILDER_MODE.TEST_MODE);
        const testPanelBody = debugPanel.shadowRoot.querySelector(selectors.testPanelBodyComponent);
        expect(testPanelBody).toBeNull();
    });

    it('should not display test outcomes section in DEBUG mode', () => {
        debugPanel = createComponentUnderTest(completedTestInterview, undefined, false, BUILDER_MODE.DEBUG_MODE);
        const testPanelBody = debugPanel.shadowRoot.querySelector(selectors.testPanelBodyComponent);
        expect(testPanelBody).toBeNull();
    });

    it('should not display test outcomes section in EDIT mode', () => {
        debugPanel = createComponentUnderTest(completedTestInterview, undefined, false, BUILDER_MODE.EDIT_MODE);
        const testPanelBody = debugPanel.shadowRoot.querySelector(selectors.testPanelBodyComponent);
        expect(testPanelBody).toBeNull();
    });
});

describe('element icon behavior', () => {
    let debugPanel;
    const sectionNumber = 1;
    beforeEach(() => {
        debugPanel = createComponentUnderTest(completedInterview);
    });

    it('should display correct icon if elementIcon is defined', () => {
        expect(
            debugPanel.shadowRoot.querySelectorAll(selectors.accordionSection)[sectionNumber].elementIcon.iconName
        ).toBe(
            elementTypeToConfigMap[completedInterview.debugTrace[sectionNumber].elementIconType].nodeConfig.iconName
        );
    });

    it('should display no icon if elementIcon is undefined', () => {
        expect(debugPanel.shadowRoot.querySelectorAll(selectors.accordionSection)[0].elementIcon).toBe(undefined);
    });
});

describe('test debug panel filter options', () => {
    let debugPanel;
    it('should display transaction boundaries filter option when showTransactionBoundaries is true and fromEmailDebugging is true', async () => {
        debugPanel = createComponentUnderTest(fakePausedInterview, undefined, true, BUILDER_MODE.DEBUG_MODE, true);
        const debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
        debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
        await ticks(1);

        const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
        expect(checkboxGroup.options).toHaveLength(2);
        expect(checkboxGroup.options[0].value).toEqual(LABELS.showApiNamesFilter);
        expect(checkboxGroup.options[1].value).toEqual(LABELS.transactionFilter);
    });
    it('should not display transaction boundaries filter option when showTransactionBoundaries is false and fromEmailDebugging is true', async () => {
        debugPanel = createComponentUnderTest(fakePausedInterview, undefined, true, BUILDER_MODE.DEBUG_MODE, false);
        const debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
        debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
        await ticks(1);

        const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
        expect(checkboxGroup.options).toHaveLength(1);
        expect(checkboxGroup.options[0].value).toEqual(LABELS.showApiNamesFilter);
    });
    it('should display transaction boundaries filter option when showTransactionBoundaries is true and fromEmailDebugging is false', async () => {
        debugPanel = createComponentUnderTest(fakePausedInterview, undefined, false, BUILDER_MODE.DEBUG_MODE, true);
        const debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
        debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
        await ticks(1);

        const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
        expect(checkboxGroup.options).toHaveLength(3);
        expect(checkboxGroup.options[0].value).toEqual(LABELS.showApiNamesFilter);
        expect(checkboxGroup.options[1].value).toEqual(LABELS.govLimFilter);
        expect(checkboxGroup.options[2].value).toEqual(LABELS.transactionFilter);
    });
    it('should not display transaction boundaries filter option when showTransactionBoundaries is false and fromEmailDebugging is false', async () => {
        debugPanel = createComponentUnderTest(fakePausedInterview, undefined, false, BUILDER_MODE.DEBUG_MODE, false);
        const debugPanelFilter = debugPanel.shadowRoot.querySelector(selectors.debugPanelFilterComponent);
        debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
        await ticks(1);

        const checkboxGroup = debugPanel.shadowRoot.querySelector(selectors.checkboxesGroup);
        expect(checkboxGroup.options).toHaveLength(2);
        expect(checkboxGroup.options[0].value).toEqual(LABELS.showApiNamesFilter);
        expect(checkboxGroup.options[1].value).toEqual(LABELS.govLimFilter);
    });
});
describe('test debug test panel', () => {
    let debugTestPanel;
    it('should have tabsets present when in test mode and the testAssertionTrace is present', () => {
        debugTestPanel = createComponentUnderTest(
            completedTestInterview,
            undefined,
            false,
            BUILDER_MODE.TEST_MODE,
            false
        );
        const tabset = debugTestPanel.shadowRoot.querySelector(selectors.tabset);
        expect(tabset).not.toBeNull();
    });
    it('should have no filter present in the test panel', () => {
        debugTestPanel = createComponentUnderTest(
            completedTestInterview,
            undefined,
            false,
            BUILDER_MODE.TEST_MODE,
            false
        );
        const filterButton = debugTestPanel.shadowRoot.querySelector(selectors.filterButton);
        expect(filterButton).toBeNull();
    });
    it('should have header with test inspector label', () => {
        debugTestPanel = createComponentUnderTest(
            completedTestInterview,
            undefined,
            false,
            BUILDER_MODE.TEST_MODE,
            false
        );
        const header = debugTestPanel.shadowRoot.querySelector('h2');
        expect(header).not.toBeNull();
        // eslint-disable-next-line
        expect(header.innerHTML).toBe(LABELS.testInspector);
    });
    it('should have correct tabs in test panel', () => {
        debugTestPanel = createComponentUnderTest(
            completedTestInterview,
            undefined,
            false,
            BUILDER_MODE.TEST_MODE,
            false
        );
        const tabs = debugTestPanel.shadowRoot.querySelectorAll('lightning-tab');
        expect(tabs[0].label).toBe(LABELS.flowTestOutcomeTabLabel);
        expect(tabs[1].label).toBe(LABELS.flowTestLogTabLabel);
    });

    it('should not have tabsets present if in test mode but no testAssertionTrace is present', () => {
        debugTestPanel = createComponentUnderTest(completedInterview, undefined, false, BUILDER_MODE.TEST_MODE, false);
        const tabset = debugTestPanel.shadowRoot.querySelector(selectors.tabset);
        expect(tabset).toBeNull();
    });
    it('displays two test outcome logs for a flow test with two assertions', () => {
        debugTestPanel = createComponentUnderTest(
            completedTestInterview,
            undefined,
            false,
            BUILDER_MODE.TEST_MODE,
            false
        );
        const testPanelBody = debugTestPanel.shadowRoot.querySelectorAll(selectors.testPanelBodyComponent);
        const vals = testPanelBody[0].shadowRoot.querySelectorAll('lightning-formatted-rich-text');
        expect(vals[0].value).toEqual(TEST_BODY_LABELS.failureMessage);
        expect(vals[1].value).toEqual('{Var 1} equals 2');
        expect(vals[2].value).toEqual('custom fail message that customer input');
        // 2 test assertions in test outcome and 2 in test log
        expect(testPanelBody.length).toEqual(2 * 2);
    });
});
