// @ts-nocheck
import { copyAndUpdateDebugTraceObject, updateFlowTestObject } from 'builder_platform_interaction/debugUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { BUILDER_MODE } from 'builder_platform_interaction/systemLib';
import { TEST_ASSERTION_STATUS } from 'builder_platform_interaction/testPanelBody';
import { api, LightningElement } from 'lwc';
import { LABELS } from './debugPanelLabels';

const { format } = commonUtils;

/**
 * This is the debug panel that shows the debug run info on builder canvas (debugMode)
 *
 * - Mutate debug trace so that there's a title & body per debug accordion
 * - Add time (start time, finish time, duration)
 * - Show error if debug run fails
 */

export default class DebugPanel extends LightningElement {
    @api ifBlockResume;

    @api fromEmailDebugging;

    @api builderMode;

    @api showTransactionBoundaries;

    labels = LABELS;

    TRANSACTION_ENTRY = 'TransactionInfoEntry';

    // initial component rendering always blocks transaction boundaries
    blockedEntries = [this.TRANSACTION_ENTRY];
    _debugData;
    debugTracesFull = [];
    debugTraces = [];
    debugTraceCopy = [];

    /* this is the error message for a failed debug run, not per flow element errors */
    errorMessage = '';
    showGovLim = false;
    showApiNames = false;

    checkboxSelections: string[] = [];
    showOptions = false;
    filterOptions = [
        {
            label: LABELS.showApiNamesFilter,
            value: LABELS.showApiNamesFilter
        },
        {
            label: LABELS.govLimFilter,
            value: LABELS.govLimFilter
        },
        {
            label: LABELS.transactionFilter,
            value: LABELS.transactionFilter
        }
    ];
    _selectedOptions = LABELS.basicFilter;
    expandAll = true;
    expandLabelVar = LABELS.expandAllLabel;
    expandTitleVar = LABELS.expandAllTitle;
    fromDebugRun = false;
    // to see if it's from a expand or collapse run
    fromExpandCollapseClick = false;
    activeSections = [];
    activeSectionsForTest = [];
    // to maintain list of sections open presently, maybe different from the initial activeSections set
    openSections = [];
    fromLabelFilter = false;
    testAssertionTrace = [];

    get showTestAssertions() {
        return this.builderMode === BUILDER_MODE.TEST_MODE && !this.fromEmailDebugging;
    }

    get showTestAssertionLogs() {
        return this.builderMode === BUILDER_MODE.TEST_MODE && this.testAssertionTrace?.length > 0;
    }

    get selectedOptions() {
        return this._selectedOptions;
    }

    get options() {
        let availableOptions = [];
        if (this.fromEmailDebugging) {
            availableOptions = this.filterOptions.filter((e) => e.label !== LABELS.govLimFilter);
        } else {
            availableOptions = this.filterOptions;
        }

        if (!this.showTransactionBoundaries) {
            availableOptions = availableOptions.filter((o) => o.label !== LABELS.transactionFilter);
        }

        return availableOptions;
    }

    handleDropdown() {
        this.showOptions = !this.showOptions;
    }

    handleFilterChange(e) {
        this.checkboxSelections = Object.assign([], e.detail.value);

        if (this.checkboxSelections.length === 0) {
            this._selectedOptions = LABELS.basicFilter;
        } else if (this.checkboxSelections.length === 1) {
            this._selectedOptions = format(LABELS.singleFilterText, this.checkboxSelections.length);
        } else {
            this._selectedOptions = format(LABELS.numFiltersText, this.checkboxSelections.length);
        }

        this.showGovLim = this.checkboxSelections.includes(LABELS.govLimFilter);

        if (this.checkboxSelections.includes(LABELS.transactionFilter)) {
            this.blockedEntries = this.blockedEntries.filter((e) => e !== this.TRANSACTION_ENTRY);
        } else if (!this.blockedEntries.includes(this.TRANSACTION_ENTRY)) {
            this.blockedEntries.push(this.TRANSACTION_ENTRY);
        }
        const previousShowApiNames = this.showApiNames;
        this.showApiNames = this.checkboxSelections.includes(LABELS.showApiNamesFilter);
        this.removeBlockedEntries();
        if (this.showApiNames !== previousShowApiNames) {
            // set to empty to trigger handleSectionToggle which opens the previously opened sections
            this.activeSections = [];
            this.fromLabelFilter = true;
        }
    }

    handleExpandAll() {
        if (this.expandAll) {
            this.expandLabelVar = LABELS.collapseAllLabel;
            this.expandTitleVar = LABELS.collapseAllTitle;
            this.activeSections = this.debugTraces.map((e) => {
                if (this.showApiNames) {
                    return e.titleWithApiName;
                }
                return e.titleWithLabel;
            });
        } else {
            this.expandLabelVar = LABELS.expandAllLabel;
            this.expandTitleVar = LABELS.expandAllTitle;
            this.activeSections = [];
        }
        this.fromExpandCollapseClick = true;
        this.expandAll = !this.expandAll;
    }

    handleSectionToggle(event) {
        // to see if it's from a exapnd-collapse all call
        if (this.fromExpandCollapseClick) {
            this.fromExpandCollapseClick = false;
        } else if (this.fromLabelFilter) {
            if (this.showApiNames) {
                this.activeSections = this.debugTraces
                    .filter((e) => this.openSections.includes(e.titleWithLabel))
                    .map((e) => e.titleWithApiName);
            } else {
                this.activeSections = this.debugTraces
                    .filter((e) => this.openSections.includes(e.titleWithApiName))
                    .map((e) => e.titleWithLabel);
            }
        } else if (this.fromDebugRun) {
            this.activeSections = this.debugTraces
                .filter((e) => {
                    return e.error || e.titleWithLabel === LABELS.waitEventSelectionHeader;
                })
                .map((e) => {
                    if (this.showApiNames) {
                        return e.titleWithApiName;
                    }
                    return e.titleWithLabel;
                });
        }
        this.openSections = event.detail.openSections;
        this.fromLabelFilter = false;
    }

    get hasErrors() {
        return this.debugData && this.debugData.error && !!this.debugData.error[0];
    }

    get showAssertionsNotExecutedMsg() {
        return this.hasErrors ? false : this.testAssertionTrace?.length === 0;
    }

    @api
    get debugData() {
        return this._debugData;
    }

    set debugData(value) {
        this._debugData = value;
        this.updateProperties(this._debugData);
        this.activeSections = this.debugTraces.map((e) => {
            if (this.showApiNames) {
                return e.titleWithApiName;
            }
            return e.titleWithLabel;
        });
        this.activeSectionsForTest = this.testAssertionTrace?.map((e, index) => {
            if (e.status === TEST_ASSERTION_STATUS.FAIL || e.status === TEST_ASSERTION_STATUS.ERROR) {
                return `Assertion ${index + 1}`;
            }
            return '';
        });
        this.fromDebugRun = true;
        this.expandAll = true;
        this.expandLabelVar = LABELS.expandAllLabel;
        this.expandTitleVar = LABELS.expandAllTitle;
    }

    updateProperties(data) {
        this.debugTracesFull = [];
        if (!this.hasErrors && data && data.debugTrace) {
            const traces = copyAndUpdateDebugTraceObject(data);
            this.debugTracesFull = traces.debugTraces;
            this.debugTraceCopy = traces.copyTraces;
        } else if (this.hasErrors) {
            this.debugTracesFull = this.debugTraceCopy;
            this.errorMessage = data.error;
        }
        this.removeBlockedEntries();
        this.testAssertionTrace = updateFlowTestObject(data?.testAssertionTrace);
    }

    removeBlockedEntries() {
        if (this.blockedEntries.length === 0) {
            this.debugTraces = this.debugTracesFull;
        }
        this.debugTraces = this.debugTracesFull.filter((e) => !this.blockedEntries.includes(e.entryType));
        this.debugTraces = this.updateTitleForTraceData(this.debugTraces);
    }

    updateTitleForTraceData(data) {
        return data.map((trace) => ({
            ...trace,
            title: this.showApiNames ? trace.titleWithApiName : trace.titleWithLabel
        }));
    }

    renderedCallback() {
        const ac = this.template.querySelectorAll(`[data-name="${LABELS.resumeLabel}"]`);
        if (ac.length > 0 && ac[ac.length - 1] && this.fromDebugRun) {
            ac[ac.length - 1].setAttribute('tabindex', '-1');
            ac[ac.length - 1].focus();
        } else if (this.fromDebugRun) {
            const header = this.template.querySelector('.slds-panel__header');
            header.focus();
        }
        // reset this here everytime the panel renders, so it's only set to true when a debug run is made
        this.fromDebugRun = false;
    }

    @api
    focus() {
        this.template.querySelector('.test-expand-button').focus();
    }
}
