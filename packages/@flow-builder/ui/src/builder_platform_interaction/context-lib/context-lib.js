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

export function orgHasFlowBuilderPreview() {
    return context.access && context.access.orgHasFlowBuilderPreview;
}