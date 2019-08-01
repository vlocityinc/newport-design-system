import { LightningElement, api } from 'lwc';
import {
    EditFlowPropertiesEvent,
    RunFlowEvent,
    DebugFlowEvent,
    SaveFlowEvent,
    DiffFlowEvent,
    UndoEvent,
    RedoEvent,
    DuplicateEvent,
    ToggleFlowStatusEvent
} from 'builder_platform_interaction/events';
import { parseMetadataDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { orgHasFlowBuilderDebug } from 'builder_platform_interaction/contextLib';
import { LABELS } from './toolbarLabels';
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';

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
    @api lastModifiedDate;
    @api saveStatus;
    @api isLightningFlowBuilder;
    @api canOnlySaveAsNewDefinition;
    @api hasUnsavedChanges;
    @api flowErrorsAndWarnings;
    @api isUndoDisabled;
    @api isRedoDisabled;
    @api isActivateDisabled;

    labels = LABELS;

    statusLabelFromStatus = {
        [FLOW_STATUS.ACTIVE]: {
            label: this.labels.activeLabel,
        },
        [FLOW_STATUS.OBSOLETE]: {
            label: this.labels.deactivatedLabel,
        },
        [FLOW_STATUS.DRAFT]: {
            label: this.labels.draftLabel,
        },
        [FLOW_STATUS.INVALID_DRAFT]: {
            label: this.labels.draftLabel,
        },
        [undefined]: {
            label: undefined,
        }
    };

    get showLastSavedPill() {
        return !!this.saveStatus;
    }

    get showEmDash() {
        return !(this.showSaving || this.showActivating);
    }

    get showSaving() {
       return this.saveStatus === this.labels.savingStatus;
    }

    get activationStatus() {
        if (this.flowStatus === FLOW_STATUS.ACTIVATING) {
            return this.labels.activating;
        }
        return this.statusLabelFromStatus[this.flowStatus].label;
    }

    get showActivating() {
        return this.flowStatus === FLOW_STATUS.ACTIVATING;
    }

    get showDate() {
        return this.saveStatus === LABELS.savedStatus && this.lastModifiedDate && !this.showActivating;
    }

    get currentDate() {
        const { date } = parseMetadataDateTime(this.lastModifiedDate, true);
        return date;
    }

    get saveDisabled() {
        return (
            this.isSaveDisabled ||
            this.flowStatus === FLOW_STATUS.ACTIVE ||
            this.flowStatus === FLOW_STATUS.OBSOLETE ||
            !this.isLightningFlowBuilder ||
            this.canOnlySaveAsNewDefinition ||
            !this.hasUnsavedChanges
        );
    }

    get activateDisabled() {
        return (!this.flowStatus || this.flowStatus === FLOW_STATUS.INVALID_DRAFT || this.flowStatus === FLOW_STATUS.ACTIVE || this.hasUnsavedChanges);
    }

    get activateButtonText() {
        if (this.flowStatus === FLOW_STATUS.ACTIVE) {
            return this.labels.activeLabel;
        }
        return this.labels.activateTitle;
    }

    get isDiffFlowAllowed() {
        return orgHasFlowBuilderDebug();
    }

    handleUndo(event) {
        event.preventDefault();
        const undoEvent = new UndoEvent();
        this.dispatchEvent(undoEvent);
    }

    handleRedo(event) {
        event.preventDefault();
        const redoEvent = new RedoEvent();
        this.dispatchEvent(redoEvent);
    }
    handleDuplicateButtonClick(event) {
        event.preventDefault();
        const duplicateEvent = new DuplicateEvent();
        this.dispatchEvent(duplicateEvent);
    }

    handleEditFlowProperties(event) {
        event.preventDefault();
        if (!this.isEditFlowPropertiesDisabled) {
            const editFlowPropertiesEvent = new EditFlowPropertiesEvent();
            this.dispatchEvent(editFlowPropertiesEvent);
        }
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

    handleToggleFlowStatus(event) {
        event.preventDefault();
        const toggleFlowStatusEvent = new ToggleFlowStatusEvent();
        this.dispatchEvent(toggleFlowStatusEvent);
    }
}