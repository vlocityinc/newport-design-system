import {
    getPicklistMenuData,
    getSystemAndGlobalVariableMenuData,
    intializeMenuConfigWithDefaultValues,
    isApexCollectionAnonymousAutomaticOutput,
    isElementAllowed,
    isPicklistFieldAllowed,
    isSystemVariablesAllowed
} from 'builder_platform_interaction/expressionUtils';
import {
    elementCategoriesForAllView,
    fieldInputCategoryMap,
    globalConstants,
    globalConstantsLabel,
    systemAndGlobalVariables,
    systemAndGlobalVariableSectionLabel
} from 'builder_platform_interaction/fieldInputMenuDataLib';
import {
    ELEMENT_TYPE,
    isScheduledPath,
    isSectionOrColumn,
    isSystemElement
} from 'builder_platform_interaction/flowMetadata';
import { isAutomaticField } from 'builder_platform_interaction/screenEditorUtils';
import { GLOBAL_CONSTANT_OBJECTS } from 'builder_platform_interaction/systemLib';
import {
    mutateFlowResourceToComboboxShape,
    mutateSystemAndGlobalVariablesToComboboxShape
} from './fieldInputMenuDataGenerator';

const firstLevelMenuFilteredTypes = [
    ELEMENT_TYPE.OUTCOME,
    ELEMENT_TYPE.SCREEN_FIELD,
    ELEMENT_TYPE.WAIT_EVENT,
    ELEMENT_TYPE.STAGE_STEP
];

/**
 * Filter the given menu data elements depending on the given allow param types and config
 *
 * @param flowElements the menu data elements to filter
 * @param config the configuration specials
 * @param allowedParamTypes - The allowed param types
 * @returns filtered menu data containing menu elements, start element and system/global variables
 */
function filterFlowElements(
    flowElements: FieldInput.FlowElements = [],
    config: FieldInput.MenuConfig,
    allowedParamTypes: RuleMap | undefined
): FieldInput.FlowElements {
    config = { ...intializeMenuConfigWithDefaultValues(config), sortField: 'label' } as const;

    const isTraversalEnabled = config.traversalConfig?.isEnabled;
    const allowsApexCallAnonymousAutoOutput = config.filter?.allowsApexCallAnonymousAutoOutput;
    const additionalFilter = (element) => filterChildrenComponent(element);

    return flowElements.filter(
        (element) =>
            isElementAllowed(allowedParamTypes, element, isTraversalEnabled) &&
            // exclude the start element so that it is easier to add back as a global var below
            !isSystemElement(element.elementType) &&
            (allowsApexCallAnonymousAutoOutput || !isApexCollectionAnonymousAutomaticOutput(element)) &&
            !isSectionOrColumn(element) &&
            !isScheduledPath(element) &&
            // @ts-ignore
            !isAutomaticField(element) &&
            additionalFilter(element)
    );
}

const filterChildrenComponent = (element: UI.Element) =>
    !firstLevelMenuFilteredTypes.includes(element.elementType as ELEMENT_TYPE);

type PicklistItem = {
    iconName: string;
    displayText: string;
};

const convertPicklistItems = (picklistItems: PicklistItem[]): FieldInput.MenuItem[] => {
    return picklistItems.map((picklistItem) => {
        const { displayText } = picklistItem;

        return {
            ...picklistItem,
            view: { type: 'PicklistValues' },
            name: displayText,
            label: displayText,
            value: displayText,
            iconSize: 'x-small'
        };
    });
};

/**
 * Maps global constant elements to menu items
 *
 * @param config - The menu config
 * @param allowedParamTypes - The allow types
 * @returns the menu items for the global constants
 */
export const getGlobalConstantsMenuSection = (
    config: FieldInput.MenuConfig,
    allowedParamTypes: RuleMap | undefined
): FieldInput.MenuSection => {
    // get the allowed global constants
    const globalConstantsMenuElements = getGlobalConstants(config, allowedParamTypes).filter(
        shouldIncludeGlobalConstant
    );

    // and return them mapped as menu items
    return {
        name: 'Constants',
        label: globalConstantsLabel,
        items: mapGlobalConstantsToMenuItems(globalConstantsMenuElements)
    };
};

/**
 * Sorts the system variables menu items
 *
 * @param systemAndGlobalVariablesItems - The unsorted system variables
 * @returns The sorted system variables menu items
 */
const sortAndMapSystemVariables = (systemAndGlobalVariablesItems: FieldInput.MenuItem[]): FieldInput.MenuItem[] => {
    const systemAndGlobalVariablesByApiNames = systemAndGlobalVariablesItems.reduce((acc, item) => {
        const { name } = item;
        if (name) {
            acc[name] = {
                dataType: item.dataType,
                subtype: item.subtype
            };
        }
        return acc;
    }, {});

    const sortedAndMappedItems: FieldInput.MenuItem[] = systemAndGlobalVariables
        .filter((variable) => systemAndGlobalVariablesByApiNames[variable.name])
        .map((variable) => {
            const { subtype, dataType } = systemAndGlobalVariablesByApiNames[variable.name];

            return mutateSystemAndGlobalVariablesToComboboxShape({
                name: variable.name,
                subtype,
                dataType,
                config: variable
            });
        });

    return sortedAndMappedItems;
};

/**
 * Get the element menu sections sorted by category
 *
 * @param flowElements - The flow elements
 * @param config - The menu config
 * @param allowedParamTypes - The allowed param types
 * @returns The element menu sections sorted by category
 */
export const getElementMenuSections = (
    flowElements: FieldInput.FlowElements,
    config: FieldInput.MenuConfig,
    allowedParamTypes: RuleMap | undefined
): FieldInput.MenuSection[] => {
    flowElements = filterFlowElements(flowElements, config, allowedParamTypes);

    const sortedMenuElementsGroupedByCategory = sortAndGroupFlowElements(flowElements, config.sortField);

    // return in sorted order
    return elementCategoriesForAllView
        .map((category) => sortedMenuElementsGroupedByCategory[category.name]!)
        .filter((section) => !!section);
};

/**
 * // TODO: rename this method
 * Filter and map menu items
 *
 * @param flowElements - The flow elements
 * @param allowedParamTypes - The allowed param types
 * @param config - The menu config
 * @returns the MenuSection's for the filtered flow elements
 */
export const filterAndMapToMenuItems = (
    flowElements: FieldInput.FlowElements,
    allowedParamTypes: RuleMap | undefined,
    config: FieldInput.MenuConfig
): FieldInput.MenuSection[] => {
    const isTraversalEnabled = config.traversalConfig?.isEnabled;
    const startElement = flowElements.find(
        (element) =>
            element.elementType === ELEMENT_TYPE.START_ELEMENT &&
            isElementAllowed(allowedParamTypes, element, isTraversalEnabled)
    );

    flowElements = filterFlowElements(flowElements, config, allowedParamTypes);
    const picklistValuesSection = getPicklistValuesSection(config, allowedParamTypes);

    const sections: FieldInput.MenuSection[] = [
        ...(picklistValuesSection ? [picklistValuesSection] : []),
        ...getElementMenuSections(flowElements, config, allowedParamTypes),
        getGlobalConstantsMenuSection(config, allowedParamTypes),
        getSystemAndGlobalVariablesMenuSection(config, allowedParamTypes, startElement)!
    ];

    if (config.filter.showMocks) {
        sections.push({
            label: 'Mocks',
            name: 'Mocks',
            items: [
                {
                    category: 'Mocks',
                    dataType: undefined,
                    description: 'Mock variable',
                    iconAlternativeText: 'Mock variable',
                    iconName: 'utility:all',
                    iconSize: 'x-small',
                    label: 'Random Mocks',
                    name: '$Mock',
                    subtype: '$Mock',
                    value: '$Mock',
                    view: { type: 'Mock' }
                }
            ]
        });
    }

    return sections.filter((section) => section.items.length !== 0);
};

/**
 * Maps global constants to menu items
 *
 * @param globalConstantsElements - The global constants elements
 * @returns The menu items for the global constants
 */
function mapGlobalConstantsToMenuItems(globalConstantsElements: FieldInput.FlowElements): FieldInput.MenuItem[] {
    return globalConstantsElements.map((ele) => {
        const globalConstant = globalConstants.find((globalConstant) => globalConstant.name === ele.name)!;

        const { label, description, iconName, iconSize, name } = globalConstant;

        return {
            // TODO: should pick what to include
            ...ele,
            label,
            name,
            description,
            iconName,
            iconSize,
            value: ''
        };
    });
}

/**
 * Checks if a global constant should be include in the menu data
 *
 * @param resource - The global constant
 * @returns true if it should be included, false otherwise
 */
function shouldIncludeGlobalConstant(resource: UI.FlowResource): boolean {
    return (
        globalConstants.find(
            (globalConstant) => globalConstant.name === (resource.name as FieldInput.GlobalConstantsName)
        ) != null
    );
}

/**
 *  Get the elements for the global constants
 *
 * @param config - The menu config
 * @param allowedParamTypes - The allowed types
 * @returns The elements for the global constants
 */
function getGlobalConstants(
    config: FieldInput.MenuConfig,
    allowedParamTypes: RuleMap | undefined
): FieldInput.FlowElements {
    if (config.filter.allowGlobalConstants) {
        // global constants should be included in menuData for FEROVs

        return filterFlowElements(Object.values(GLOBAL_CONSTANT_OBJECTS), config, allowedParamTypes);
    }

    return [];
}

/**
 * Gets MenuSection for the system and global variables
 *
 * @param config - The menu config
 * @param allowedParamTypes - The allowed param types
 * @param startElement - The start element
 * @returns the MenuSection for the system and global variables
 */
export function getSystemAndGlobalVariablesMenuSection(
    config: FieldInput.MenuConfig,
    allowedParamTypes: RuleMap | undefined,
    startElement: UI.Element | undefined
): FieldInput.MenuSection {
    const systemAndGlobalVariablesMenuItems: FieldInput.MenuItem[] = (
        getSystemAndGlobalVariableMenuData({
            ...config.filter,
            showSystemVariables: isSystemVariablesAllowed(config.filter?.showSystemVariables, allowedParamTypes)
        }) || []
    ).map((item: FieldInput.MenuItem) => {
        // @ts-ignore
        item.name = item.name || item.text;
        return item;
    });

    // When combobox is used everywhere it'll be done at the FilteredData level
    if (startElement != null) {
        // Create a menu item for the start element
        systemAndGlobalVariablesMenuItems.push(mutateFlowResourceToComboboxShape(startElement));
    }

    return {
        name: 'GlobalResources',
        label: systemAndGlobalVariableSectionLabel,
        items: sortAndMapSystemVariables(systemAndGlobalVariablesMenuItems)
    };
}

/**
 * Get a category map for the flow element sections
 *
 * @param flowElements - The flow elements
 * @param sortField - The sort field
 * @returns A category map for the flow element sections
 */
function sortAndGroupFlowElements(
    flowElements: FieldInput.FlowElements,
    sortField: FieldInput.SortField
): Partial<Record<FieldInput.Category, FieldInput.MenuSection>> {
    const initialValue: Partial<Record<FieldInput.Category, FieldInput.MenuSection>> = {};

    return flowElements
        .map((element) => mutateFlowResourceToComboboxShape(element))
        .filter((element) => element.category != null)
        .sort((element1, element2) => element1[sortField]!.localeCompare(element2[sortField]!))
        .reduce((acc, element) => {
            const category = element.category as FieldInput.Category;

            let section = acc[category];
            if (section == null) {
                section = {
                    name: category,
                    label: fieldInputCategoryMap[category].label,
                    items: []
                };
                acc[category] = section;
            }
            section.items.push(element);

            return acc;
        }, initialValue);
}

/**
 * Creates a menu section for picklist values
 *
 * @param config The menu config
 * @param allowedParamTypes The allowed param types
 * @returns a menu section for picklist values, or undefined if none
 */
function getPicklistValuesSection(
    config: FieldInput.MenuConfig,
    allowedParamTypes: RuleMap | undefined
): FieldInput.MenuSection | undefined {
    const hasPicklistValues = config.activePicklistValues?.length || 0;

    if (!hasPicklistValues || !isPicklistFieldAllowed(allowedParamTypes)) {
        return undefined;
    }

    const picklistData = getPicklistMenuData(config.activePicklistValues!);

    const { label, items } = picklistData;

    return {
        name: 'PicklistValues',
        label,
        items: convertPicklistItems(items)
    };
}
