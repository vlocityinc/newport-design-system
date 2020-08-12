// @ts-nocheck
import { LightningElement, api } from 'lwc';
import {
    EditFlowPropertiesEvent,
    EditFlowEvent,
    RunFlowEvent,
    DebugFlowEvent,
    SaveFlowEvent,
    DiffFlowEvent,
    UndoEvent,
    RedoEvent,
    CopyEvent,
    DuplicateEvent,
    ToggleFlowStatusEvent,
    ToggleSelectionModeEvent,
    ClosePropertyEditorEvent,
    NewDebugFlowEvent,
    ToggleCanvasModeEvent
} from 'builder_platform_interaction/events';
import { parseMetadataDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { orgHasFlowBuilderDebug, isAutoLayoutCanvasEnabled } from 'builder_platform_interaction/contextLib';
import { loggingUtils } from '@flow-builder/common-utils';
import { LABELS } from './toolbarLabels';
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';

const { logInteraction } = loggingUtils;
/**
 * Toolbar component for flow builder.
 *s
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class Toolbar extends LightningElement {
    @api
    flowId;

    @api
    flowStatus;

    @api
    flowVersion;

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
    isSelectionMode;

    @api
    isUndoDisabled;

    @api
    isRedoDisabled;

    @api
    isCutCopyDisabled;

    @api
    isNewDebugSupported;

    @api
    isAutoLayoutCanvas;

    @api
    showCopyPasteButton;

    @api
    showEditFlowPropertiesButton;

    @api
    showCanvasModeToggle;

    @api
    showFlowStatus;

    @api
    showEditFlowButton;

    @api
    showRunButton;

    @api
    showDebugButton;

    @api
    showRestartRunButton;

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
        },
        [FLOW_STATUS.SAVING]: {
            label: this.labels.savingStatus
        },
        [FLOW_STATUS.ACTIVATING]: {
            label: this.labels.activating
        },
        [FLOW_STATUS.DEACTIVATING]: {
            label: this.labels.deactivating
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

    get isAutoLayoutCanvasEnabled() {
        return isAutoLayoutCanvasEnabled();
    }

    get showCanvasToggle() {
        return this.isAutoLayoutCanvasEnabled && this.showCanvasModeToggle;
    }

    get showDuplicateElementButton() {
        return this.showCopyPasteButton && !this.isAutoLayoutCanvas;
    }

    get selectButtonVariant() {
        return this.isSelectionMode ? 'brand' : 'neutral';
    }

    get showLastSavedPill() {
        return !!this.saveAndPendingOperationStatus;
    }

    get isDoingOperation() {
        return (
            this.saveAndPendingOperationStatus === FLOW_STATUS.SAVING ||
            this.saveAndPendingOperationStatus === FLOW_STATUS.ACTIVATING ||
            this.saveAndPendingOperationStatus === FLOW_STATUS.DEACTIVATING
        );
    }

    get statusIndicatorTitle() {
        if (this.isDoingOperation) {
            return (
                this.statusLabelFromStatus[this.saveAndPendingOperationStatus] &&
                this.statusLabelFromStatus[this.saveAndPendingOperationStatus].label
            );
        }
        return format(
            this.labels.toolbarStatusTitle,
            this.flowVersion,
            this.statusLabelFromStatus[this.flowStatus] && this.statusLabelFromStatus[this.flowStatus].label
        );
    }

    get isDoneOperation() {
        return this.saveAndPendingOperationStatus === FLOW_STATUS.SAVED && this.lastModifiedDate;
    }

    get toolbarStatus() {
        if (this.isDoingOperation) {
            return (
                this.statusLabelFromStatus[this.saveAndPendingOperationStatus] &&
                this.statusLabelFromStatus[this.saveAndPendingOperationStatus].label
            );
        }
        return format(
            this.labels.toolbarStatus,
            this.flowVersion,
            this.statusLabelFromStatus[this.flowStatus] && this.statusLabelFromStatus[this.flowStatus].label
        );
    }

    get showDoneStatus() {
        return this.isDoneOperation && this.showFlowStatus;
    }

    get showNewDebugButton() {
        return this.isNewDebugSupported && this.showDebugButton;
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
        // for the activate button, disables and enables activation or deactivation through the button
        return (
            this.isStandardFlow() ||
            !this.flowStatus ||
            this.flowStatus === FLOW_STATUS.INVALID_DRAFT ||
            this.isDoingOperation ||
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
            return 'destructive-text';
        }
        return 'neutral';
    }

    get isDiffFlowAllowed() {
        return orgHasFlowBuilderDebug();
    }

    /**
     * Check if the flow Id belongs to a Standard (File Based) Flow Definition (e.g sfdc_checkout__CartToOrder-1),
     * a normal flow Id always starts with 301.
     */
    isStandardFlow() {
        return this.flowId && !this.flowId.startsWith('301');
    }

    handleSelectButtonClick(event) {
        event.stopPropagation();
        const toggleSelectionModeEvent = new ToggleSelectionModeEvent();
        this.dispatchEvent(toggleSelectionModeEvent);
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

    handleCopyButtonClick() {
        const copyEvent = new CopyEvent();
        this.dispatchEvent(copyEvent);
    }

    handleDuplicateButtonClick(event) {
        event.preventDefault();
        // TODO: Right now we are firing a seperate ClosePropertyEditorEvent to address the property
        // editor panel close and open happening in one tick issue. Should consider removing it and move
        // the close panel logic to duplicate event handler for cleaner logic seperation
        // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000078hChIAI/view
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
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

    handleEditFlow(event) {
        event.preventDefault();
        const editFlowEvent = new EditFlowEvent();
        this.dispatchEvent(editFlowEvent);
        logInteraction(`edit-flow-button`, 'toolbar', null, 'click');
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

    handleNewDebug(event) {
        event.preventDefault();
        const newDebugFlowEvent = new NewDebugFlowEvent();
        this.dispatchEvent(newDebugFlowEvent);
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
     * Dispatches an event named diff flow to perform a diff of the saved flow
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

    handleToggleCanvasMode(event) {
        event.stopPropagation();
        this.dispatchEvent(new ToggleCanvasModeEvent());
        this.template.querySelector('.toggle-canvas-mode').checked = false;
    }
}
