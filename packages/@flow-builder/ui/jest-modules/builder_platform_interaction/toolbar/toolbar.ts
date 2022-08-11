import { api, LightningElement } from 'lwc';

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
    isViewAllTestsDisabled;

    @api
    isAddToTestDisabled;

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
    autolayoutCanvasMode;

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
    showCanvasModeCombobox;

    @api
    showFlowStatus;

    @api
    showEditFlowButton;

    @api
    showRunButton;

    @api
    showDebugButton;

    @api
    showAddToTestButton;

    @api
    showRunTestButton;

    @api
    showRestartRunButton;

    @api
    hideSelectionButton;

    @api
    showSaveButton;

    @api
    showSaveAsButton;

    @api
    showActivateButton;

    @api
    showUndoRedoButton;

    @api
    showViewAllTestsButton;

    @api
    builderMode;

    @api
    showEditTestButton;

    @api
    isLeftPanelToggled;

    @api
    showLeftPanelToggle;

    @api
    resetComboboxValueToFreeForm;

    @api focus = jest.fn();
}
