/**
 * Mock object for the loggingUtils.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
let mock = {
        logPerfTransactionStart : jest.fn(),
        logPerfTransactionEnd : jest.fn(),
        logPerfMarkStart : jest.fn(),
        logPerfMarkEnd : jest.fn(),
    };

export const logPerfTransactionStart = (arg) => {
    return mock.logPerfTransactionStart(arg);
};
export const logPerfTransactionEnd = (arg) => {
    return mock.logPerfTransactionEnd(arg);
};
export const logPerfMarkStart = (arg) => {
    return mock.logPerfMarkStart(arg);
};
export const logPerfMarkEnd = (arg) => {
    return mock.logPerfMarkEnd(arg);
};