// @ts-nocheck
let context = {
    access: {}
};

/**
 * Sets the application context. This should be done before the editor is
 * rendered.
 *
 * @param {Object}
 *            obj the application context
 */
export function setContext(obj) {
    context = obj;
}

export function isDevMode() {
    return context.devMode;
}

export function isTestMode() {
    return context.testMode;
}

export function getUserPreferences() {
    return context.userPrefs;
}

export function getOrgId() {
    return context.orgId;
}

export function orgHasFlowBuilderDebug() {
    return context.access && context.access.orgHasFlowBuilderDebug;
}

/*
 * @returns true if the auto layout feature is available
 */
export function isAutoLayoutCanvasEnabled() {
    return !isTestMode();
}

export function orgHasFlowScreenSections() {
    return context.access && context.access.orgHasFlowScreenSections;
}

export function canUserVAD() {
    return context.canVAD;
}
export function orgHasBeforeSaveEnabled() {
    return context.access.orgHasBeforeSaveEnabled;
}

export function orgHasFlowBuilderGuardrails() {
    return context.access && context.access.orgHasFlowBuilderGuardrails;
}
