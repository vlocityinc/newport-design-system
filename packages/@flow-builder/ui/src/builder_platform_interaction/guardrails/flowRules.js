import { RuleFactory, RuleFactoryItem } from 'analyzer_framework/api';
import { NoDMLInLoop, UnclosedLoop, LegacyElement } from './rules/index';

/**
 * Register rules to be executed by Guardrails engine.
 *
 * V1 is hardcoded list, could be dynamically created in future.
 */
export class FlowRuleFactory extends RuleFactory {
    constructor() {
        super([
            new RuleFactoryItem(NoDMLInLoop),
            new RuleFactoryItem(UnclosedLoop),
            new RuleFactoryItem(LegacyElement)
        ]);
    }
}
