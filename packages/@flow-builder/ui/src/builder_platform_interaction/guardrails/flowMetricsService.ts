// @ts-nocheck
import {
    logPerfTransactionStart,
    logPerfTransactionEnd,
    logPerfMarkStart,
    logPerfMarkEnd,
    logPerfMark,
    logMetricsServiceErrorTransaction
} from 'builder_platform_interaction/loggingUtils';

/**
 * Wrapper for instrumentation service for guardrails logging.
 */
export class FlowMetricService {
    constructor(additionalInstrumentationMetrics) {
        this.additionalInstrumentationMetrics = additionalInstrumentationMetrics;
    }

    perfStart(name, attributes, source) {
        attributes.additionalInstrumentationMetrics = this.additionalInstrumentationMetrics;
        logPerfTransactionStart(name, attributes, source);
    }

    perfEnd(name, attributes, source) {
        logPerfTransactionEnd(name, attributes, source);
    }

    markStart(namespace, name, context) {
        logPerfMarkStart(name, context);
    }

    markEnd(namespace, name, context) {
        logPerfMarkEnd(name, context);
    }

    mark(namespace, name, context) {
        logPerfMark(namespace, name, context);
    }

    error(message, source, data) {
        logMetricsServiceErrorTransaction(
            JSON.stringify(
                Object.assign(
                    {
                        message
                    },
                    data || {}
                )
            ),
            source
        );
    }
}
