/*
 * Totally static, non-resilient mock loader for current off-core needs.
 * This loader replaces @salesforce/loader (injected by lwc) using module mapping.
 *
 * Any component which is being loaded dynamically with x-lazy will need to be
 * resolved here
 */

// TODO: reintroduce with OrchestratedStage PR
import OrchestratedStageNode from 'builder_platform_interaction/orchestratedStageNode';

import iconSvgTemplatesUtility from 'lightning/iconSvgTemplatesUtility';
import iconSvgTemplatesStandard from 'lightning/iconSvgTemplatesStandard';

const moduleMap = new Map([
    ['builder_platform_interaction/orchestratedStageNode', OrchestratedStageNode],
    ['lightning/iconSvgTemplatesUtility', iconSvgTemplatesUtility],
    ['lightning/iconSvgTemplatesStandard', iconSvgTemplatesStandard]
]);

export function load(moduleName) {
    return { default: moduleMap.get(moduleName) };
}
