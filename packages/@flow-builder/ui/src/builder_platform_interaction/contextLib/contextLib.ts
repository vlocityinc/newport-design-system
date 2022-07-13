// @ts-nocheck

type Context = {
    access: Access;
    devMode: boolean;
    testMode: boolean;
    orgId: string;
    canVAD: boolean;
    builderConfig: BuilderConfig;
    preferredExperience: string;
};
type Access = {
    orgHasFlowBuilderDebug: boolean;
    orgHasComplianceBannerEnabled: boolean;
    orgHasBeforeSaveEnabled: boolean;
    orgHasFlowBuilderAutomaticFields: boolean;
    orgHasFlowScreenSections: boolean;
    orgHasComponentPreview: boolean;
    orgHasFlowBuilderGuardrails: boolean;
    orgHasFlowFormulaBuilder: boolean;
    orgHasScreenFlowsInSlack: boolean;
};
type BuilderConfig = {
    builderType: string;
    newFlowConfig: NewFlowConfig;
    name: string;
    icon: string;
    componentConfigs: ComponentConfigs;
    usePanelForPropertyEditor: boolean;
    supportedProcessTypes?: string[] | null;
};
type NewFlowConfig = {
    showRecommended: boolean;
    showAll: boolean;
};
type ComponentConfigs = {
    editMode: EditorConfig;
    debugMode: EditorConfig;
};
type EditorConfig = {
    rightPanelConfig: RightPanelConfig;
    toolbarConfig: ToolbarConfig;
    headerConfig: HeaderConfig;
    leftPanelConfig: LeftPanelConfig;
    canvasConfig: CanvasConfig;
};
type RightPanelConfig = {
    showDebugPanel: boolean;
};
type ToolbarConfig = {
    showEditFlowPropertiesButton: boolean;
    showCopyPasteButton: boolean;
    showDebugButton: boolean;
    showEditFlowButton: boolean;
    showCanvasModeToggle: boolean;
    showRunButton: boolean;
    showFlowStatus: boolean;
    showRestartRunButton: boolean;
    showSaveAsButton: boolean;
    showSaveButton: boolean;
    showActivateButton: boolean;
    showUndoRedoButton: boolean;
    showViewAllTestsButton: boolean;
    showEditTestButton: boolean;
};
export type HeaderConfig = {
    showDebugStatus: boolean;
    showInterviewLabel: boolean;
    showTestStatus: boolean;
};
type LeftPanelConfig = {
    showLeftPanel: boolean;
};

let context: Context = {
    access: {}
};

/**
 * Sets the application context. This should be done before the editor is
 * rendered.
 *
 * @param {Context} obj - the application context
 */
export function setContext(obj: Context) {
    context = obj;
}

/**
 *
 */
export function isDevMode() {
    return context.devMode;
}

/**
 *
 */
export function isTestMode() {
    return context.testMode;
}

/**
 *
 */
export function getOrgId() {
    return context.orgId;
}

/**
 *
 */
export function orgHasFlowBuilderDebug() {
    return context.access?.orgHasFlowBuilderDebug;
}

/**
 * @returns true if ScreenFlowsInSlack perm is enabled
 */
export function orgHasScreenFlowsInSlack() {
    return context.access?.orgHasScreenFlowsInSlack;
}

/**
 *
 */
export function orgHasComponentPreview() {
    return context.access?.orgHasComponentPreview;
}

/*
 * @returns true if the auto layout feature is available
 */
/**
 *
 */
export function isAutoLayoutCanvasEnabled() {
    return !isTestMode();
}

/**
 *
 */
export function orgHasFlowScreenSections() {
    return context.access?.orgHasFlowScreenSections;
}

/**
 *
 */
export function canUserVAD() {
    return context.canVAD;
}
/**
 *
 */
export function orgHasBeforeSaveEnabled() {
    return context.access?.orgHasBeforeSaveEnabled;
}

/**
 *
 */
export function orgHasFlowBuilderGuardrails() {
    return context.access?.orgHasFlowBuilderGuardrails;
}

/*
 * @returns true if the automatic fields org perm is enabled
 */
/**
 *
 */
export function orgHasFlowBuilderAutomaticFields() {
    return context.access?.orgHasFlowBuilderAutomaticFields;
}

/**
 * @returns true if the flow formular builder is enabled
 */
export function orgHasFlowFormulaBuilder() {
    return true; /* W-11403686 captures the work to clean this up*/
}

export const CLASSIC_EXPERIENCE = 'CLASSIC';

/**
 *
 */
export function getPreferredExperience() {
    return context.preferredExperience as string;
}
