/**
 * Formats an arbitrary number of arguments into a string by replacing {0}, {1}, ... {n} with the corresponding argument supplied after 'formatString'.
 *
 * @param formatString The string to be formatted.
 * @param args The list of arguments to splice into formatString.
 * @returns a formatted String
 */
export const format = (formatString: string, ...args: any[]) => {
    return formatString.replace(/\{(\d+)\}/gm, (match, index) => {
        const substitution = args[index];
        if (substitution === undefined) {
            return match;
        }
        return substitution + '';
    });
};

/**
 * Condition to check for closing the modal
 *
 * @param {Function} closeModalCallback callback function
 * @param {boolean} closeCallback true if closeCallback set
 * @returns true if callback function exists to be called
 */
export function checkCloseCallback(closeModalCallback: Function, closeCallback: boolean) {
    return typeof closeModalCallback === 'function' && closeCallback === true;
}

/**
 * Simple memoizer, which holds on to a most recent successful invocation and its result.
 *
 * @param func The function to memoize.
 * @returns memoized function
 */
export function memoize(func: Function) {
    if (!(typeof func === 'function')) {
        throw new Error('Not a function');
    }

    let everInvoked = false;
    let lastArguments;
    let lastResult;
    return function () {
        // Invoke the memoized function, but only if never invoked or if the arguments are different.
        if (everInvoked === false || !equalArguments(lastArguments, arguments)) {
            lastResult = func.apply(null, arguments);
            lastArguments = arguments;
            everInvoked = true;
        }
        return lastResult;
    };
}

/**
 * Compares two arrays for equality. For the two arrays to be equal they should either be
 * the same arrays or they should contain exact same elements and in the same order.
 *
 * @param left One array to compare.
 * @param right Another array to compare.
 * @returns 'true' if the arrays are equal. Otherwise - 'false'.
 */
function equalArguments(left: IArguments, right: IArguments) {
    if (left === null || left === undefined || left.length !== right.length) {
        return false;
    }

    for (let i = 0; i < right.length; i++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }

    return true;
}
