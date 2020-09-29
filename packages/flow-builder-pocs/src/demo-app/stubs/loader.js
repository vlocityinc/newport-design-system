/*
 * Totally static, non-resilient mock loader for current off-core needs.
 * This loader replaces @salesforce/loader (injected by lwc) using module mapping.
 *
 * Any component which is being loaded dynamically with x-lazy will need to be
 * resolved here
 */

// TODO: reintroduce with SteppedStage PR
import SteppedStageNode from 'builder_platform_interaction/steppedStageNode';


const moduleMap = new Map([
    ['builder_platform_interaction/steppedStageNode', SteppedStageNode],
]);

export function load(moduleName) {
    return { default: moduleMap.get(moduleName) };
}
