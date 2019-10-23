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
import { logInteraction } from 'builder_platform_interaction/loggingUtils';
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
    @api
    flowStatus;

    @api
    isEditFlowPropertiesDisabled;

    @api
    isRunDebugDisabled;

    @api
    isSaveDisabled;

    @api
    isSaveAsDisabled;

    @api
    lastModifiedDate;

    @api
    saveAndPendingOperationStatus; // saved, saving..., activating..., deactivating...

    @api
    isLightningFlowBuilder;

    @api
    canOnlySaveAsNewDefinition;

    @api
    hasUnsavedChanges;

    @api
    flowErrorsAndWarnings;

    @api
    isUndoDisabled;

    @api
    isRedoDisabled;

    labels = LABELS;

    statusLabelFromStatus = {
        [FLOW_STATUS.ACTIVE]: {
            label: this.labels.activeLabel
        },
        [FLOW_STATUS.OBSOLETE]: {
            label: this.labels.deactivatedLabel
        },
        [FLOW_STATUS.DRAFT]: {
            label: this.labels.draftLabel
        },
        [FLOW_STATUS.INVALID_DRAFT]: {
            label: this.labels.draftLabel
        }
    };

    @api focus() {
        const toolbarFocusableElements = this.template.querySelectorAll('lightning-button-icon, button');
        if (toolbarFocusableElements.length > 0) {
            let index = 0;
            while (toolbarFocusableElements[index].disabled && index < toolbarFocusableElements.length - 1) {
                ++index;
            }
            toolbarFocusableElements[index].focus();
        }
    }

    get showLastSavedPill() {
        return !!this.saveAndPendingOperationStatus;
    }

    get statusIndicatorTitle() {
        if (
            this.saveAndPendingOperationStatus === this.labels.savingStatus ||
            this.saveAndPendingOperationStatus === this.labels.activating ||
            this.saveAndPendingOperationStatus === this.labels.deactivating
        ) {
            return this.saveAndPendingOperationStatus;
        }
        return (
            this.statusLabelFromStatus[this.flowStatus] &&
            this.statusLabelFromStatus[this.flowStatus].label
        );
    }

    get activationStatus() {
        if (
            this.saveAndPendingOperationStatus === this.labels.savingStatus ||
            this.saveAndPendingOperationStatus === this.labels.activating ||
            this.saveAndPendingOperationStatus === this.labels.deactivating
        ) {
            return this.saveAndPendingOperationStatus;
        }
        const activationStatusLabel =
            this.statusLabelFromStatus[this.flowStatus] &&
            this.statusLabelFromStatus[this.flowStatus].label;
        return activationStatusLabel && `${activationStatusLabel}\u2014`;
    }

    get showDate() {
        return (
            this.saveAndPendingOperationStatus === LABELS.savedStatus &&
            this.lastModifiedDate &&
            this.saveAndPendingOperationStatus !== this.labels.savingStatus &&
            this.saveAndPendingOperationStatus !== this.labels.activating
        );
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

    get activateDisabled() { // for the activate button, disables and enables activation or deactivation through the button
        return (
            !this.flowStatus ||
            this.flowStatus === FLOW_STATUS.INVALID_DRAFT ||
            this.saveAndPendingOperationStatus === this.labels.savingStatus ||
            this.saveAndPendingOperationStatus === this.labels.activating ||
            this.saveAndPendingOperationStatus === this.labels.deactivating ||
            this.hasUnsavedChanges
        );
    }

    get activateButtonText() {
        if (this.flowStatus === FLOW_STATUS.ACTIVE) {
            return this.labels.deactivateTitle;
        }
        return this.labels.activateTitle;
    }

    get activateButtonVariant() {
        if (this.flowStatus === FLOW_STATUS.ACTIVE) {
            return "destructive-text";
        }
        return "neutral";
    }

    get isDiffFlowAllowed() {
        return orgHasFlowBuilderDebug();
    }

    handleUndo(event) {
        event.preventDefault();
        const undoEvent = new UndoEvent();
        this.dispatchEvent(undoEvent);
        logInteraction(`undo-button`, 'toolbar', null, 'click');
    }

    handleRedo(event) {
        event.preventDefault();
        const redoEvent = new RedoEvent();
        this.dispatchEvent(redoEvent);
        logInteraction(`redo-button`, 'toolbar', null, 'click');
    }
    handleDuplicateButtonClick(event) {
        event.preventDefault();
        const duplicateEvent = new DuplicateEvent();
        this.dispatchEvent(duplicateEvent);
        logInteraction(`duplicate-button`, 'toolbar', null, 'click');
    }

    handleEditFlowProperties(event) {
        event.preventDefault();
        if (!this.isEditFlowPropertiesDisabled) {
            const editFlowPropertiesEvent = new EditFlowPropertiesEvent();
            this.dispatchEvent(editFlowPropertiesEvent);
            logInteraction(`flow-properties-button`, 'toolbar', null, 'click');
        }
    }

    handleRun(event) {
        event.preventDefault();
        const runFlowEvent = new RunFlowEvent();
        this.dispatchEvent(runFlowEvent);
        logInteraction(`run-button`, 'toolbar', null, 'click');
    }

    handleDebug(event) {
        event.preventDefault();
        const debugFlowEvent = new DebugFlowEvent();
        this.dispatchEvent(debugFlowEvent);
        logInteraction(`debug-button`, 'toolbar', null, 'click');
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
        logInteraction(`save-as-button`, 'toolbar', null, 'click');
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
        const operationStatus = this.flowStatus === FLOW_STATUS.OBSOLETE ? 'Activate' : 'Deactivate';
        const context = { operationStatus };
        logInteraction(`activate-button`, 'toolbar', context, 'click');
    }
}
