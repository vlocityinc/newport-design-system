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

export function orgHasFlowScreenSections() {
    return context.access && context.access.orgHasFlowScreenSections;
}

export function canUserVAD() {
    return context.canVAD;
}
export function orgHasBeforeSaveEnabled() {
    return context.access.orgHasBeforeSaveEnabled;
}

// TODO: FLC TEMP
let useFlc;
export function setUseFixedLayoutCanvas(value) {
    if (useFlc == null) {
        useFlc = value;
    }
}

export function useFixedLayoutCanvas() {
    if (useFlc) {
        return true;
    }
    // TODO: use metadata to determine to use FLC or FFC
    const hash = window.location.hash;
    const [key, value] = hash.substring(1).split('=');
    return key === 'canvasMode' ? value === 'flc' : !window.Aura && !window.runningJestTest;
}

export function orgHasFlowBuilderGuardrails() {
    return context.access && context.access.orgHasFlowBuilderGuardrails;
}
