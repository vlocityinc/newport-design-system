/**
 * Mock object for the store library.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
let mock = {};

let createSelectorMock = () => {};

let storeMock = {
    getStore : () => {
        return {
            subscribe: () => {
                return () => {}
            }
        };
    },
};

// Store
export { mock as combinedReducer };
export { createSelectorMock as createSelector };
export { storeMock as Store };
export { mock as guid };
export { mock as deepCopy };
