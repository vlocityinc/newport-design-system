import * as metricsService from 'instrumentation/service';
const APP_NAME = 'FLOW_BUILDER';

/**
 * NOTE: this function does not log the error's stack trace
 * Please consider using the logFlowBuilderError message
 *
 * Wrapper function for logging Error transaction in metrics service
 * @param {String} errorMessage error message
 */
export const logMetricsServiceErrorTransaction = (errorMessage) => {
    metricsService.error({error: errorMessage});
};
/**
 * Function to log an error message with its stack trace, Use this instead of throw new Error
 * @param {String} errorMessage error message
 * @param {Boolean} showErrorModal if true shows the custom alert modal with the error message
 */
export const logFlowBuilderError = (errorMessage, showErrorModal = false) => {
    const errorObj = new Error(errorMessage);
    const errorStack = errorObj.stack && errorObj.stack.toString();
    logMetricsServiceErrorTransaction(errorStack);

    if (showErrorModal) {
        throw errorObj;
    }
    // TODO Create custom modal with error message and stack trace ?
    // Add isDev mode check in first condition too if required.
};
/**
 * Wrapper function for Perf Start in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} config - payload of the transaction.
 */
export const logPerfTransactionStart = (name, config) => {
    metricsService.perfStart(APP_NAME + ':' + name, config);
};

/**
 * Wrapper function for Perf End in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} config - payload of the transaction.
 */
export const logPerfTransactionEnd = (name, config) => {
    metricsService.perfEnd(APP_NAME + ':' + name, config);
};

/**
 * Wrapper function for mark start in metrics Service
 * @param {String} name - name of perf transaction
 * @param {Object} context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction
 */
export const logPerfMarkStart = (name, context) => {
    metricsService.markStart(APP_NAME, name, context);
};

/**
 * Wrapper function for mark end in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction.
 */
export const logPerfMarkEnd = (name, context) => {
    metricsService.markEnd(APP_NAME, name, context);
};

/**
 * Wrapper function for interaction in metrics service
 * @param {String} target - target for interaction.
 * @param {String} scope - scope for interaction.
 * @param {Object} context - payload for the interaction.
 * @param {Object} eventSource - click or scroll.
 * @param {String} eventType - user / system for non-user event types.
 */
export const logInteraction = (target, scope, context, eventSource, eventType = 'user') => {
    metricsService.interaction(target, scope, context, 'synthetic-' + eventSource, eventType);
};