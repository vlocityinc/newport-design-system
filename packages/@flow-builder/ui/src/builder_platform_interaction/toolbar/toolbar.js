import { LightningElement, api } from 'lwc';
import { EditFlowPropertiesEvent, RunFlowEvent, DebugFlowEvent, SaveFlowEvent, DiffFlowEvent } from 'builder_platform_interaction/events';
import { formatDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { isDevMode } from "builder_platform_interaction/contextLib";
import { LABELS } from './toolbarLabels';

const ACTIVE = 'Active';
const OBSOLETE = 'Obsolete';
const DRAFT = 'Draft';
const INVALID_DRAFT = 'InvalidDraft';

/**
 * Toolbar component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class Toolbar extends LightningElement {
    @api flowStatus;
    @api isEditFlowPropertiesDisabled;
    @api isRunDebugDisabled;
    @api isSaveDisabled;
    @api isSaveAsDisabled;
    @api errors;
    @api lastModifiedDate;
    @api saveStatus;
    @api isLightningFlowBuilder;

    labels = LABELS;

    statusLabelAndTitle = {
        [ACTIVE]: {
            label: this.labels.activeLabel,
            title: this.labels.activeTitle
        },
        [OBSOLETE]: {
            label: this.labels.deactivatedLabel,
            title: this.labels.deactivatedTitle
        },
        [DRAFT]: {
            label: this.labels.draftLabel,
            title: this.labels.draftTitle
        },
        [INVALID_DRAFT]: {
            label: this.labels.draftLabel,
            title: this.labels.draftTitle
        }
    };

    get showLastSavedPill() {
        return !!this.saveStatus;
    }

    get showDate() {
        return (this.saveStatus === LABELS.savedStatus && this.lastModifiedDate);
    }

    // TODO: Update this work once lightning date-time-util is exposed (W-5398011)
    get currentDate() {
        return new Date(formatDateTime(this.lastModifiedDate, true));
    }

    get saveDisabled() {
        return this.isSaveDisabled || this.flowStatus === ACTIVE || this.flowStatus === OBSOLETE || !this.isLightningFlowBuilder;
    }

    get statusBadgeLabel() {
        return this.statusLabelAndTitle[this.flowStatus].label;
    }

    get statusBadgeTitle() {
        return this.statusLabelAndTitle[this.flowStatus].title;
    }

    get statusBadgeClasses() {
        let classes = 'status-badge slds-align-middle slds-m-left_xx-small';
        if (this.flowStatus === ACTIVE) {
            classes = `${classes} slds-theme_success`;
        }
        return classes;
    }

    get isDevMode() {
        return isDevMode();
    }

    headerTitleForSummary = LABELS.errorPopOverHeader;

    handleEditFlowProperties(event) {
        event.preventDefault();
        const editFlowPropertiesEvent = new EditFlowPropertiesEvent();
        this.dispatchEvent(editFlowPropertiesEvent);
    }

    handleRun(event) {
        event.preventDefault();
        const runFlowEvent = new RunFlowEvent();
        this.dispatchEvent(runFlowEvent);
    }

    handleDebug(event) {
        event.preventDefault();
        const debugFlowEvent = new DebugFlowEvent();
        this.dispatchEvent(debugFlowEvent);
    }

    /**
     * Event handler for click event on save button.
     * It dispatches an event named save which can be handled by parent component
     * @param {Object} event - Save button click event
     */
    handleSave(event) {
        event.preventDefault();
        const saveEvent = new SaveFlowEvent(SaveFlowEvent.Type.SAVE);
        this.dispatchEvent(saveEvent);
    }

    handleSaveAs(event) {
        event.preventDefault();
        const saveAsEvent = new SaveFlowEvent(SaveFlowEvent.Type.SAVE_AS);
        this.dispatchEvent(saveAsEvent);
    }

    /**
     * Event handler for click event on the diff flow button.
     * Dispatches an event named diffflow to perform a diff of the saved flow
     * to the current flow state.
     * @param event
     */
    handleDiff(event) {
        event.preventDefault();
        const diffEvent = new DiffFlowEvent();
        this.dispatchEvent(diffEvent);
    }
}