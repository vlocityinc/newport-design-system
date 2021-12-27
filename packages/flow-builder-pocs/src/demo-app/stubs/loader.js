/*
 * Totally static, non-resilient mock loader for current off-core needs.
 * This loader replaces @salesforce/loader (injected by lwc) using module mapping.
 *
 * Any component which is being loaded dynamically with x-lazy will need to be
 * resolved here
 */

// TODO: reintroduce with OrchestratedStage PR
import AlcConnectorMenu from 'builder_platform_interaction/alcConnectorMenu';
import AlcNodeMenu from 'builder_platform_interaction/alcNodeMenu';
import AlcStartMenu from 'builder_platform_interaction/alcStartMenu';
import OrchestratedStageNode from 'builder_platform_interaction/orchestratedStageNode';
import iconSvgTemplatesStandard from 'lightning/iconSvgTemplatesStandard';
import iconSvgTemplatesUtility from 'lightning/iconSvgTemplatesUtility';

const moduleMap = new Map([
    ['builder_platform_interaction/alcNodeMenu', AlcNodeMenu],
    ['builder_platform_interaction/alcStartMenu', AlcStartMenu],
    ['builder_platform_interaction/alcConnectorMenu', AlcConnectorMenu],
    ['builder_platform_interaction/orchestratedStageNode', OrchestratedStageNode],
    ['lightning/iconSvgTemplatesUtility', iconSvgTemplatesUtility],
    ['lightning/iconSvgTemplatesStandard', iconSvgTemplatesStandard]
]);

export function load(moduleName) {
    return { default: moduleMap.get(moduleName) };
}
