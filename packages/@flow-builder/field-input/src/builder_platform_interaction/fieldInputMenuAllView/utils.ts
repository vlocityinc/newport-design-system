import { filterAndMapToMenuItems } from 'builder_platform_interaction/fieldInputUtils';

/**
 * Get the sections for the "All" view
 *
 * @param flowElements - The flow elements
 * @param config - The menu config
 * @param rules - The allowed param rules
 * @returns The "All" view sections
 */
export function getViewAllSections(
    flowElements: FieldInput.FlowElement[],
    config: FieldInput.MenuConfig,
    rules?: RuleMap
): FieldInput.MenuSection[] {
    return filterAndMapToMenuItems(flowElements, rules, config);
}
