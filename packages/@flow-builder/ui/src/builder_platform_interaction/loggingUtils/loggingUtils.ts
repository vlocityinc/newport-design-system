// @ts-nocheck
import * as metricsService from 'instrumentation/service';

let appName = 'FLOW_BUILDER';

/**
 * Function to set the builder name e.g FLOW_BUILDER or STRATEGY_BUILDER
 * @param {String} name
 */
export const setAppName = (name) => {
    appName = name;
};

/**
 * Function to get the builder name
 */
const getAppName = () => {
    return appName;
};

/**
 * Wrapper function for logging Error transaction in metrics service
 * @param {String} errorMessage error message
 * @param {String} source source of the message
 */
export const logMetricsServiceErrorTransaction = (errorMessage, source) => {
    metricsService.error({ error: errorMessage }, source);
};

/**
 * Wrapper function for Perf Start in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} config - payload of the transaction.
 * @param {String} source source of the message.
 */
export const logPerfTransactionStart = (name, config, source) => {
    metricsService.perfStart(getAppName() + ':' + name, config, source);
};

/**
 * Wrapper function for Perf End in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} config - payload of the transaction.
 * @param {String} source source of the message.
 */
export const logPerfTransactionEnd = (name, config, source) => {
    metricsService.perfEnd(getAppName() + ':' + name, config, source);
};

/**
 * Wrapper function for mark start in metrics Service
 * @param {String} name - name of perf transaction
 * @param {Object} context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction
 */
export const logPerfMarkStart = (name, context) => {
    metricsService.markStart(getAppName(), name, context);
};

/**
 * Wrapper function for mark end in metrics Service
 * @param {String} name - name of perf transaction.
 * @param {Object} context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction.
 */
export const logPerfMarkEnd = (name, context) => {
    metricsService.markEnd(getAppName(), name, context);
};

/**
 * Wrapper function for mark in metrics Service
 * @param {String} namespace - namespace of perf transaction.
 * @param {String} name - name of perf transaction.
 * @param {Object} context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction.
 */
export const logPerfMark = (namespace, name, context) => {
    metricsService.mark(namespace, name, context);
};

/**
 * Wrapper function for interaction in metrics service
 * @param {String} target - target for interaction.
 * @param {String} scope - scope for interaction.
 * @param {Object} context - payload for the interaction.
 * @param {Object} eventSource - click or scroll.
 * @param {String} eventType - user / system for non-user event types.
 */
export const logInteraction = (
    target,
    scope,
    context, // make sure context is an object otherwise it'll fail
    eventSource,
    eventType = 'user'
) => {
    metricsService.interaction(`${getAppName()}: ${target}`, scope, context, 'synthetic-' + eventSource, eventType);
};
