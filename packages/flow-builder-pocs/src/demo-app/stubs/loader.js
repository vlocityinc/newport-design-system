/*
 * Totally static, non-resilient mock loader for current off-core needs.
 * This loader replaces @salesforce/loader (injected by lwc) using module mapping.
 *
 * Any component which is being loaded dynamically with x-lazy will need to be
 * resolved here
 */

// TODO: reintroduce with OrchestratedStage PR
import OrchestratedStageNode from 'builder_platform_interaction/orchestratedStageNode';

const moduleMap = new Map([['builder_platform_interaction/orchestratedStageNode', OrchestratedStageNode]]);

export function load(moduleName) {
    return { default: moduleMap.get(moduleName) };
}
