/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

import { Registry, RuleFilter, Engine } from 'analyzer_framework/engine';
import { FlowDataProvider } from './flowDataProvider';
import { FlowRuleFactory } from './flowRules';
import { FlowMetricService } from './flowMetricsService';

const CONTEXT = 'FLOW';

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
        registry.addDataProvider(CONTEXT, this.flowDataProvider);
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
    async evaluate(flow) {
        if (!flow) {
            return null;
        }

        this.flowDataProvider.updateFlow(flow);

        const guardrailsResult = await this.engine.execute([CONTEXT]);

        // TODO move to guardrails UI handling W-7119448
        // Parse the result and convert it into needed form
        const data = Array.from(guardrailsResult.results.keys());
        let results = null;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === flow.fullName) {
                results = guardrailsResult.results.get(data[i]);
                for (let j = 0; j < results.length; ++j) {
                    results[j].id = j;
                }
                break;
            }
        }
        return results;
    }
}
