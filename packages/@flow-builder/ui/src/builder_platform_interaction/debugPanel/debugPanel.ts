// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelLabels';
import { copyAndUpdateDebugTraceObject } from 'builder_platform_interaction/debugUtils';

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

    TRANSACTION_ENTRY = 'TransactionInfoEntry';

    // initial component rendering always blocks transaction boundaries
    blockedEntries = [this.TRANSACTION_ENTRY];
    _debugData;
    debugTracesFull = [];
    debugTraces = [];
    debugTraceCopy = [];

    /* this is the error message for a failed debug run, not per flow element errors */
    errorMessage = '';
    headerTitle = LABELS.debugInspector;
    showGovLim = false;

    checkboxSelections: string[] = [];
    showOptions = false;
    filterPopoverAltText = LABELS.filterPopoverAltText;
    filterClosePopoverAltText = LABELS.filterClosePopoverAltText;
    filterOptions = [
        {
            label: LABELS.govLimFilter,
            value: LABELS.govLimFilter
        },
        {
            label: LABELS.transactionFilter,
            value: LABELS.transactionFilter
        }
    ];
    expandAll = true;
    expandLabelVar = LABELS.expandAllLabel;
    expandTitleVar = LABELS.expandAllTitle;
    activeSections = [];

    _selectedOptions = LABELS.basicFilter;

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
            this.handleDefaultFilter();
        } else {
            this._selectedOptions = this.checkboxSelections.join(', ');
            // the checkbox group event detail value ONLY contains selected options
            this.filterOptions = this.filterOptions.map((e) => {
                switch (e.label) {
                    case LABELS.govLimFilter:
                        this.showGovLim = this.checkboxSelections.includes(LABELS.govLimFilter);
                        break;
                    case LABELS.transactionFilter:
                        if (this.checkboxSelections.includes(LABELS.transactionFilter)) {
                            this.blockedEntries = this.blockedEntries.filter((e) => e === !this.TRANSACTION_ENTRY);
                        } else if (!this.blockedEntries.includes(this.TRANSACTION_ENTRY)) {
                            this.blockedEntries.push(this.TRANSACTION_ENTRY);
                        }
                        break;
                    default:
                        break;
                }
                return e;
            });
        }
        this.removeBlockedEntries();
    }

    handleDefaultFilter() {
        this.showGovLim = false;
        this.blockedEntries.push(this.TRANSACTION_ENTRY);
    }

    handleExpandAll() {
        if (this.expandAll) {
            this.expandLabelVar = LABELS.collapseAllLabel;
            this.expandTitleVar = LABELS.collapseAllTitle;
            this.activeSections = this.debugTraces.map((e) => e.title);
        } else {
            this.expandLabelVar = LABELS.expandAllLabel;
            this.expandTitleVar = LABELS.expandAllTitle;
            this.activeSections = [];
        }
        this.expandAll = !this.expandAll;
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
            if (e.error || e.title === LABELS.waitEventSelectionHeader) {
                return e.title;
            }
            return '';
        });
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
        if (ac[ac.length - 1]) {
            ac[ac.length - 1].setAttribute('tabindex', '-1');
            ac[ac.length - 1].focus();
        } else {
            const resumeCard = this.template.querySelector('.slds-panel__header');
            resumeCard.focus();
        }
    }
}
