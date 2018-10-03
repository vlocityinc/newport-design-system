const MAX_PROMISES = 50;

/**
 * Resolves 50 promises, giving lwc time to render
 *
 * @param {function} callback - callback function
 * @param {number} count - current count in the iteration
 * @return {*}
 */
export const resolveRenderCycles = (callback, count = 0) => {
    if (count === MAX_PROMISES) {
        return Promise.resolve().then(callback);
    }

    return Promise.resolve().then(() => {
        resolveRenderCycles(callback, count + 1);
    });
};
