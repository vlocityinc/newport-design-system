// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelLabels';
import { copyAndUpdateDebugTraceObject } from 'builder_platform_interaction/debugUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
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
            label: LABELS.govLimFilter,
            value: LABELS.govLimFilter
        },
        {
            label: LABELS.transactionFilter,
            value: LABELS.transactionFilter
        },
        {
            label: LABELS.showApiNamesFilter,
            value: LABELS.showApiNamesFilter
        }
    ];
    _selectedOptions = LABELS.basicFilter;
    expandAll = true;
    expandLabelVar = LABELS.expandAllLabel;
    expandTitleVar = LABELS.expandAllTitle;
    fromDebugRun = false;
    activeSections = [];
    // to maintain list of sections open presently, maybe different from the initial activeSections set
    openSections = [];
    fromLabelFilter = false;

    get selectedOptions() {
        return this._selectedOptions;
    }

    get options() {
        if (this.fromEmailDebugging) {
            return this.filterOptions.filter((e) => e.label !== LABELS.govLimFilter);
        }
        return this.filterOptions;
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
        this.expandAll = !this.expandAll;
    }

    handleSectionToggle(event) {
        if (this.fromLabelFilter) {
            if (this.showApiNames) {
                this.activeSections = this.debugTraces
                    .filter((e) => this.openSections.includes(e.titleWithLabel))
                    .map((e) => e.titleWithApiName);
            } else {
                this.activeSections = this.debugTraces
                    .filter((e) => this.openSections.includes(e.titleWithApiName))
                    .map((e) => e.titleWithLabel);
            }
        } else {
            this.openSections = event.detail.openSections;
        }
        this.fromLabelFilter = false;
    }

    get hasErrors() {
        return this.debugData && this.debugData.error && !!this.debugData.error[0];
    }

    @api
    get debugData() {
        return this._debugData;
    }

    set debugData(value) {
        this._debugData = value;
        this.updateProperties(this._debugData);
        this.activeSections = this.debugTraces.map((e) => {
            if (e.error || e.titleWithLabel === LABELS.waitEventSelectionHeader) {
                if (this.showApiNames) {
                    return e.titleWithApiName;
                }
                return e.titleWithLabel;
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
    }

    removeBlockedEntries() {
        if (this.blockedEntries.length === 0) {
            this.debugTraces = this.debugTracesFull;
        }
        this.debugTraces = this.debugTracesFull.filter((e) => !this.blockedEntries.includes(e.entryType));
    }

    renderedCallback() {
        const ac = this.template.querySelectorAll('[data-name="Resume label"]');
        if (ac[ac.length - 1] && this.fromDebugRun) {
            ac[ac.length - 1].setAttribute('tabindex', '-1');
            ac[ac.length - 1].focus();
        } else if (this.fromDebugRun) {
            const resumeCard = this.template.querySelector('.slds-panel__header');
            resumeCard.focus();
        }
        // reset this here everytime the panel renders, so it's only set to true when a debug run is made
        this.fromDebugRun = false;
    }

    @api
    focus() {
        // ToDo: Assign focus to the first focusable item in the Debug Panel
    }
}
