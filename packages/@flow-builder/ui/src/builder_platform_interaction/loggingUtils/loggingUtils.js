import * as metricsService from "instrumentation/service";

const APP_NAME = "FLOW_BUILDER";

/**
 * Wrapper function for Perf Start in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} config - payload of the transaction.
 */
export const logPerfTransactionStart = (name, config) => {
    metricsService.perfStart(APP_NAME + ":" + name, config);
};

/**
 * Wrapper function for Perf End in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} config - payload of the transaction.
 */
export const logPerfTransactionEnd = (name, config) => {
    metricsService.perfEnd(APP_NAME + ":" + name, config);
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