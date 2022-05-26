import { getFlowElementsApi, getRulesApi } from 'builder_platform_interaction/fieldInputMenuDataApi';
import { filterAndMapToMenuItems } from 'builder_platform_interaction/fieldInputUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getLHSTypes, RULE_TYPES } from 'builder_platform_interaction/ruleLib';

/**
 * Get the sections for the "All" view
 *
 * @returns The "All" view sections
 */
export function getViewAllSections(): FieldInput.MenuSection[] {
    const config: MenuConfig = {
        sortField: 'label',
        activePicklistValues: [],
        traversalConfig: { isEnabled: true },
        filter: {
            includeNewResource: true,
            allowGlobalConstants: false,
            showSystemVariables: true,
            showGlobalVariables: true,
            shouldBeWritable: false
        }
    };

    // TODO: remove hardcoded
    const ruleType = RULE_TYPES.ASSIGNMENT;
    const elementType = ELEMENT_TYPE.DECISION;

    const rules = getRulesApi(ruleType, elementType);

    const flowELements = getFlowElementsApi();

    // TODO: find better way to wait for rules to load and remove this
    if (rules != null) {
        return filterAndMapToMenuItems(flowELements, getLHSTypes(ELEMENT_TYPE.DECISION, rules), config);
    }

    return [];
}
