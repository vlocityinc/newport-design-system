import { RuleFactory } from 'analyzer_framework/api';
// import { LoopDml } from './rules/index';

/**
 * Register rules to be executed by Guardrails engine.
 *
 * Rules can have params - doc TBD (kolsson)
 *
 * V1 is hardcoded list, could be dynamically created in future.
 */
export class FlowRuleFactory extends RuleFactory {
    constructor() {
        super([
            /* todo implement rules
                new RuleFactoryItem(
                    LoopDml
                )
                */
        ]);
    }
}
