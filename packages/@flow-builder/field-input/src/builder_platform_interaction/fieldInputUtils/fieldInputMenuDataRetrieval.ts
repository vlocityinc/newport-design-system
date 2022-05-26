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
import { generateGuid } from 'builder_platform_interaction/storeLib';
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
 * @param allowedParamTypes
 * @returns filtered menu data containing menu elements, start element and system/global variables
 */
function filterFlowElements(
    flowElements: UI.Element[] = [],
    config: MenuConfig,
    allowedParamTypes: RuleMap
): UI.Element[] {
    config = intializeMenuConfigWithDefaultValues(config);
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
    displayText: string;
};

const convertPicklistItems = (picklistItems: PicklistItem[]): FieldInput.MenuItem[] => {
    return picklistItems.map((picklistItem) => {
        const { displayText } = picklistItem;

        return {
            ...picklistItem,
            viewType: 'PicklistValues',
            name: displayText,
            label: displayText,
            value: displayText
        };
    });
};

const getGlobalConstantsMenuSection = (
    config: MenuConfig,
    allowedParamTypes: RuleMap
): FieldInput.MenuSection | undefined => {
    const globalConstantsElements = getGlobalConstants(config, allowedParamTypes) || [];
    const globalConstantNames = globalConstants.map((constant) => constant.name);

    const globalConstantsMenuElements: Partial<Record<FieldInput.GlobalConstantsName, UI.Element>> =
        globalConstantsElements.reduce((acc, element) => {
            const { name } = element;

            if (name && globalConstantNames.includes(name as FieldInput.GlobalConstantsName)) {
                acc[name] = element;
            }
            return acc;
        }, {});

    if (Object.keys(globalConstantsMenuElements).length > 0) {
        const items = globalConstants
            .filter((globalConstant) => globalConstantsMenuElements[globalConstant.name])
            .map((globalConstant) => {
                const globalConstantMenuElement = globalConstantsMenuElements[globalConstant.name];

                const { label, description, iconName, name } = globalConstant;
                const viewType: FieldInput.MenuItemViewType = 'MenuItemViewTypeTbd';

                return {
                    // TODO: should pick what to include
                    ...globalConstantMenuElement,
                    label,
                    name,
                    description,
                    iconName,
                    viewType,
                    value: ''
                } as FieldInput.MenuItem;
            });

        // TODO: FF fix key
        return { key: globalConstantsLabel, label: globalConstantsLabel, items };
    }

    return undefined;
};

/**
 *
 * @param systemAndGlobalVariablesItems
 * @returns
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
 *
 * @param flowElements
 * @param config
 * @param allowedParamTypes
 * @returns
 */
export const filterAndMapToMenuItems = (
    flowElements: UI.Element[] = [],
    allowedParamTypes: RuleMap = {},
    config: MenuConfig
): FieldInput.MenuSection[] => {
    const isTraversalEnabled = config.traversalConfig?.isEnabled;
    const startElement = flowElements.find(
        (element) =>
            element.elementType === ELEMENT_TYPE.START_ELEMENT &&
            isElementAllowed(allowedParamTypes, element, isTraversalEnabled)
    );
    flowElements = filterFlowElements(flowElements, config, allowedParamTypes);

    const sortField = config.sortField || 'label';
    const sortedMenuElementsGroupedByCategory = sortAndGroupFlowElements(flowElements, sortField);

    const orderedCategories = elementCategoriesForAllView;
    const menuSections = [getPicklistValuesSection(config, allowedParamTypes)!]
        .concat(orderedCategories.map((category) => sortedMenuElementsGroupedByCategory[category.label]))
        .concat([
            getGlobalConstantsMenuSection(config, allowedParamTypes)!,
            getSystemAndGlobalVariablesMenuSection(config, allowedParamTypes, startElement)!
        ])
        .filter((section) => section && section.items.length !== 0);

    // TODO: use natural, stable key
    return menuSections.map((menuSections) => ({ ...menuSections, key: generateGuid() }));
};

/**
 * @param config
 * @param allowedParamTypes
 */
function getGlobalConstants(config: MenuConfig, allowedParamTypes: RuleMap): UI.Element[] | undefined {
    if (config.filter.allowGlobalConstants) {
        // global constants should be included in menuData for FEROVs
        return filterFlowElements(Object.values(GLOBAL_CONSTANT_OBJECTS), config, allowedParamTypes);
    }

    return undefined;
}

/**
 * @param flowElements
 * @param config
 * @param allowedParamTypes
 * @param startElement
 */
function getSystemAndGlobalVariablesMenuSection(
    config: MenuConfig,
    allowedParamTypes: RuleMap,
    startElement: UI.Element | undefined
): FieldInput.MenuSection | undefined {
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

    if (systemAndGlobalVariablesMenuItems.length === 0) {
        return undefined;
    }

    return {
        key: 'system-and-global-variables-menu-section',
        label: systemAndGlobalVariableSectionLabel,
        items: sortAndMapSystemVariables(systemAndGlobalVariablesMenuItems)
    };
}

/**
 * @param flowElements
 * @param config
 * @param sortField
 */
function sortAndGroupFlowElements(
    flowElements: UI.Element[],
    sortField: string
): Partial<Record<FieldInput.Category, FieldInput.MenuSection>> {
    const initialValue: Partial<Record<FieldInput.Category, FieldInput.MenuSection>> = {};

    return (
        flowElements
            .map((element) => mutateFlowResourceToComboboxShape(element))
            // .filter((element) => element.category != null)
            .sort((element1, element2) => element1[sortField]!.localeCompare(element2[sortField]!))
            .reduce((acc, element) => {
                const category = element.category as FieldInput.Category;

                let section = acc[category];
                if (section == null) {
                    section = {
                        key: category,
                        label: category,
                        items: []
                    };
                    acc[category] = section;
                }
                section.items.push(element);

                return acc;
            }, initialValue)
    );
}

/**
 * @param config
 * @param allowedParamTypes
 */
function getPicklistValuesSection(config: MenuConfig, allowedParamTypes: RuleMap): FieldInput.MenuSection | undefined {
    const hasPicklistValues = config.activePicklistValues?.length || 0;

    if (!hasPicklistValues || !isPicklistFieldAllowed(allowedParamTypes)) {
        return undefined;
    }

    const picklistData = getPicklistMenuData(config.activePicklistValues!);

    if (Object.values(picklistData).length === 0) {
        return undefined;
    }

    const { label, items } = picklistData;

    return {
        key: 'picklist-values',
        label,
        items: convertPicklistItems(items)
    };
}
