import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { memoize } = commonUtils;

/**
 * This is used to derive data from a state in the store.
 *
 * @param selectors An array of selectors that are needed for transformation.
 * @param transformation A function, which derives data based on selectors.
 * @param shouldMemoize Set to true to memoize the selectors and the transformation.
 * @returns A function in which a user passes the state and it transforms an appropriate piece of data.
 */
export function createSelector(selectors: Function[], transformation: Function, shouldMemoize = false): Function {
    if (!selectors || !selectors.length || !Array.isArray(selectors)) {
        throw new Error(`could not transform the ${selectors}.`);
    }

    let transformationFunc = transformation;
    // Memoize the transformation, if requested
    if (shouldMemoize) {
        transformationFunc = memoize(function () {
            return transformation.apply(null, arguments);
        });
    }

    let selector = function (...args: any[]) {
        // Invoke each selector with supplied arguments, collecting results into an array.
        const dataFromSelectors = selectors.map((arg) => arg.apply(null, args));
        // Invoke the transformation, passing it the array of selectors' results.
        return transformationFunc(...dataFromSelectors);
    };

    // Memoize the selector, if requested
    if (shouldMemoize) {
        selector = memoize(selector);
    }

    return selector;
}
