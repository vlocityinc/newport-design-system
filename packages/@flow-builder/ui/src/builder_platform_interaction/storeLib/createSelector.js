/**
 * This is used to derive data from state in the store.
 * TODO: Memoize this function if needed W-4675340
 * @param {Array} selectors array of selectors that are needed for transformation
 * @param {Function} transformation function which will derive data based on selectors
 * @returns {Function} function in which user passes state and it transforms appropriate piece of data.
 */
export function createSelector(selectors, transformation) {
    if (!selectors || !selectors.length || !Array.isArray(selectors)) {
        throw new Error(`could not transform the ${selectors}.`);
    }
    return function selector(state) {
        const dataFromSelectors = selectors.map(arg => arg(state));
        return transformation(...dataFromSelectors);
    };
}