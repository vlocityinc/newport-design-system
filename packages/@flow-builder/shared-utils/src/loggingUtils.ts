import * as metricsService from 'instrumentation/service';

let appName = 'FLOW_BUILDER';

// TODO: flesh these out
type LoggingConfig = object | null;
type LoggingContext = object | null;

/**
 * Function to set the builder name e.g FLOW_BUILDER or STRATEGY_BUILDER
 *
 * @param name
 */
export const setAppName = (name: string): void => {
    appName = name;
};

/**
 * Function to get the builder name
 */
const getAppName = (): string => {
    return appName;
};

/**
 * Wrapper function for logging Error transaction in metrics service
 *
 * @param errorMessage error message
 * @param source source of the message
 */
export const logMetricsServiceErrorTransaction = (errorMessage: string, source: string): void => {
    metricsService.error({ error: errorMessage }, source);
};

/**
 * Wrapper function for Perf Start in metrics Service
 *
 * @param name - name of perf transaction.
 * @param config - payload of the transaction.
 * @param source source of the message.
 */
export const logPerfTransactionStart = (name: string, config: LoggingConfig, source: string | null): void => {
    metricsService.perfStart(getAppName() + ':' + name, config, source);
};

/**
 * Wrapper function for Perf End in metrics Service
 *
 * @param name - name of perf transaction.
 * @param config - payload of the transaction.
 * @param source source of the message.
 */
export const logPerfTransactionEnd = (name: string, config: LoggingConfig, source: string | null): void => {
    metricsService.perfEnd(getAppName() + ':' + name, config, source);
};

/**
 * Wrapper function for mark start in metrics Service
 *
 * @param name - name of perf transaction
 * @param context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction
 */
export const logPerfMarkStart = (name: string, context: LoggingContext): void => {
    metricsService.markStart(getAppName(), name, context);
};

/**
 * Wrapper function for mark end in metrics Service
 *
 * @param name - name of perf transaction.
 * @param context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction.
 */
export const logPerfMarkEnd = (name: string, context: LoggingContext): void => {
    metricsService.markEnd(getAppName(), name, context);
};

/**
 * Wrapper function for mark in metrics Service
 *
 * @param namespace - namespace of perf transaction.
 * @param name - name of perf transaction.
 * @param context - payload of the mark.
 * Note: A mark will only appear in the log line if it falls inside the time range of an existing transaction.
 */
export const logPerfMark = (namespace: string, name: string, context: LoggingContext): void => {
    metricsService.mark(namespace, name, context);
};

/**
 * Wrapper function for interaction in metrics service
 *
 * @param target - target for interaction.
 * @param scope - scope for interaction.
 * @param context - payload for the interaction.
 * @param eventSource - click or scroll.
 * @param eventType - user / system for non-user event types.
 */
export const logInteraction = (
    target: string,
    scope: string,
    context: LoggingContext, // make sure context is an object otherwise it'll fail
    eventSource: string,
    eventType = 'user'
): void => {
    metricsService.interaction(`${getAppName()}: ${target}`, scope, context, 'synthetic-' + eventSource, eventType);
};
