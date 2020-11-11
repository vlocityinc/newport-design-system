// @ts-nocheck
/**
 * Mock object for the loggingUtils.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
export const logPerfTransactionStart = jest.fn();
export const logPerfTransactionEnd = jest.fn();
export const logMetricsServiceErrorTransaction = jest.fn();
export const logPerfMarkStart = jest.fn();
export const logPerfMarkEnd = jest.fn();
export const logInteraction = jest.fn();
export const setAppName = jest.fn();
