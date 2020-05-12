// @ts-nocheck
/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

import { Registry, RuleFilter, Engine } from 'analyzer_framework/engine';
import { ContextInfo } from 'analyzer_framework/api';
import { FLOW_CONTEXT } from './rules/constants';
import { FlowDataProvider } from './flowDataProvider/flowDataProvider';
import { FlowRuleFactory } from './flowRules';
import { FlowMetricService } from './flowMetricsService';

/**
 * Flow impl to execute guardrails engine.
 *
 * Initializes flow data provider, rules and configuration.
 */
export class FlowGuardrailsExecutor {
    constructor(additionalInstrumentationMetrics) {
        // Create data provider
        this.flowDataProvider = new FlowDataProvider();

        // Optional filtering based on tags
        const includeTags = [];
        const excludeTags = [];
        const ruleFilter = new RuleFilter(includeTags, excludeTags);

        // Create registry which has data provider and rules
        const registry = new Registry(ruleFilter);
        registry.addDataProvider(FLOW_CONTEXT, this.flowDataProvider);
        registry.registerRules(new FlowRuleFactory());

        // Create the engine
        this.engine = new Engine(registry, new FlowMetricService(additionalInstrumentationMetrics));
    }

    /**
     * @description This method calls Guardrails engine's execute method to execute againt flow
     *
     * @param {Object} flow the flow metadata
     * @returns {Object} Guardrails result
     */
    // eslint-disable-next-line @lwc/lwc/no-async-await
    async evaluate(flow) {
        if (!flow) {
            return null;
        }

        this.flowDataProvider.updateFlow(flow);

        return this.engine.execute([new ContextInfo(FLOW_CONTEXT)]);
    }
}
