import { filterMenuData, intializeMenuConfigWithDefaultValues } from 'builder_platform_interaction/expressionUtils';
import {
    getElementCategoriesLabelSortedAlphabetically,
    getFirstLevelNonElementCategories,
    globalConstantsLabel,
    globalConstantsMap,
    systemAndGlobalVariableSectionLabel,
    systemAndGlobalVariablesMap
} from 'builder_platform_interaction/fieldInputMenuDataLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
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
const filterChildrenComponent = (element) => !firstLevelMenuFilteredTypes.includes(element.elementType);
const convertPicklistItems = (picklistItems: any[]): UI.FieldInputMenuItem[] => {
    const convertedMenuItems: UI.FieldInputMenuItem[] = [];
    picklistItems.forEach((picklistItem) =>
        convertedMenuItems.push({ ...picklistItem, name: picklistItem.displayText, label: picklistItem.displayText })
    );
    return convertedMenuItems;
};
const addToMenuDataByCategory = (
    menuData: UI.FieldInputMenuData[],
    categoryLabels: string[],
    itemsGroupedByCategory: Record<string, UI.FieldInputMenuItem[]>
) =>
    categoryLabels.forEach((categoryLabel) => {
        const items = itemsGroupedByCategory[categoryLabel];
        if (items?.length > 0) {
            menuData.push({ label: categoryLabel, items });
        }
    });
const buildGlobalConstants = (menuData: UI.FieldInputMenuData[], menuElements: any[]) => {
    const globalConstantNames = [...globalConstantsMap.keys()];
    const globalConstantsMenuElements = menuElements.reduce((acc, element) => {
        const { name } = element;
        if (globalConstantNames.includes(name)) {
            acc[name] = element;
        }
        return acc;
    }, {});
    if (Object.keys(globalConstantsMenuElements).length > 0) {
        const items = [...globalConstantsMap.entries()].map((globalConstant) => {
            const globalConstantMenuElement = globalConstantsMenuElements[globalConstant[0]];
            if (globalConstantMenuElement) {
                const { label, description, iconName: icon } = globalConstant[1];
                return {
                    ...globalConstantMenuElement,
                    label,
                    description,
                    icon
                };
            }
            return {};
        });
        menuData.push({ label: globalConstantsLabel, items });
    }
};
const sortAndMapSystemVariables = (systemAndGlobalVariablesItems: any[]): UI.FieldInputMenuItem[] => {
    const systemAndGlobalVariablesByApiNames = systemAndGlobalVariablesItems.reduce((acc, item) => {
        const apiName = item.text || item.name;
        if (apiName) {
            acc[apiName] = {
                dataType: item.dataType,
                subtype: item.subtype
            };
        }
        return acc;
    }, {});
    const sortedAndMappedItems: UI.FieldInputMenuItem[] = [];
    [...systemAndGlobalVariablesMap.entries()].forEach(([systemOrGlobalVariableName, config]) => {
        const systemOrGlobalVariableData = systemAndGlobalVariablesByApiNames[systemOrGlobalVariableName];
        if (systemOrGlobalVariableData) {
            sortedAndMappedItems.push(
                mutateSystemAndGlobalVariablesToComboboxShape({
                    name: systemOrGlobalVariableName,
                    subtype: systemOrGlobalVariableData.subtype,
                    dataType: systemOrGlobalVariableData.dataType,
                    config
                })
            );
        }
    });
    return sortedAndMappedItems;
};

export enum SortField {
    Label = 'label',
    ApiName = 'name'
}

export const filterAndMapToMenuItems = (menuDataElements = [], allowedParamTypes?, config?: MenuConfig) => {
    const initializedConfig = intializeMenuConfigWithDefaultValues(config);
    const filteredData = filterMenuData(menuDataElements, initializedConfig, allowedParamTypes, (element) =>
        filterChildrenComponent(element)
    );
    const { menuElements, startElement, systemAndGlobalVariables, picklistData } = filteredData;

    const sortField = config?.sortField || SortField.Label;
    const sortedMenuElementsGroupedByCategory = menuElements
        .map((element) => mutateFlowResourceToComboboxShape(element, config?.traversalConfig))
        .sort((element1, element2) => element1[sortField].localeCompare(element2[sortField]))
        .reduce((acc, element) => {
            const category = element.category;
            if (category) {
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(element);
            }
            return acc;
        }, {});
    const menuData: UI.FieldInputMenuData[] = [];
    if (Object.values(picklistData).length > 0) {
        const { label, items } = picklistData as { label: string; items: [] };
        menuData.push({
            label,
            items: convertPicklistItems(items)
        });
    }
    addToMenuDataByCategory(
        menuData,
        getElementCategoriesLabelSortedAlphabetically,
        sortedMenuElementsGroupedByCategory
    );
    addToMenuDataByCategory(menuData, getFirstLevelNonElementCategories, sortedMenuElementsGroupedByCategory);
    buildGlobalConstants(menuData, menuElements);
    // When combobox is used everywhere it'll be done at the FilteredData level
    if (startElement) {
        // Create a menu item for the start element
        (systemAndGlobalVariables as UI.FieldInputMenuItem[]).push(
            mutateFlowResourceToComboboxShape(startElement, initializedConfig.traversalConfig)
        );
    }

    if (systemAndGlobalVariables?.length > 0) {
        menuData.push({
            label: systemAndGlobalVariableSectionLabel,
            items: sortAndMapSystemVariables(systemAndGlobalVariables)
        });
    }
    return menuData;
};
