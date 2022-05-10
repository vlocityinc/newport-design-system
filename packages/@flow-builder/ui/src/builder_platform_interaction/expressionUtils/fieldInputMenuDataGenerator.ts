import { FLOW_DATA_TYPE, getDataTypeIcons, isComplexType } from 'builder_platform_interaction/dataTypeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { getResourceCategory } from 'builder_platform_interaction/fieldInputMenuDataLib';
import { ACTION_TYPE, ELEMENT_TYPE, ICONS } from 'builder_platform_interaction/flowMetadata';
import { getDataType } from 'builder_platform_interaction/ruleLib';
import { apexClassesSelector } from 'builder_platform_interaction/selectors';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { createSelector } from 'builder_platform_interaction/storeLib';
import { SYSTEM_VARIABLE_RECORD_PREFIX } from 'builder_platform_interaction/systemVariableConstantsLib';
import { LABELS } from './expressionUtilsLabels';
const { format } = commonUtils;

const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;
const APEX_TYPE = FLOW_DATA_TYPE.APEX.value;
const UTILITY_ICON_TYPE = 'utility';
const S_ICON_SIZE = 'small';
const XS_ICON_SIZE = 'x-small';
const RIGHT_ICON_NAME = `${UTILITY_ICON_TYPE}:chevronright`;

export const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card'
};

/**
 * Checks if the provided top level resource will support traversal within the combobox
 *
 * @param resource element from flow
 * @returns True if the resource should support traversal
 */
const supportsTraversalOfElement = (resource: UI.FlowResource): boolean => {
    return (
        resource.storeOutputAutomatically ||
        (resource.elementType !== ELEMENT_TYPE.START_ELEMENT && !!resource.childReferences?.length)
    );
};

/**
 * Gets the icon information for a canvas element field input item
 *
 * @param resource canvas element from flow
 * @returns icon information such as name, size etc.
 */
const getCanvasElementIconInfo = (resource: UI.FlowResource) => {
    const config = getConfigForElementType(resource.elementSubtype || resource.elementType);
    return {
        iconName: config.nodeConfig?.iconName,
        iconAlternativeText: resource.elementType,
        iconSize: S_ICON_SIZE,
        iconBackgroundColor: config.nodeConfig?.iconBackgroundColor,
        iconShape: config.nodeConfig?.iconShape
    };
};

/**
 * Gets the icon information for a non canvas element field input item
 *
 * @param dataType dataType associated with the resource
 * @param isCollection boolean value determining if the resource is a collection or not
 * @param elementType elementType associated with a given flow resource
 * @param actionType actionType associated with a given flow resource
 * @returns icon information such as name, size etc.
 */
const getNonCanvasElementIconInfo = (
    dataType: UI.Datatype,
    isCollection?: boolean,
    elementType?: UI.ElementType,
    actionType?: UI.ActionType
) => {
    let iconName = getDataTypeIcons(dataType, UTILITY_ICON_TYPE);
    let iconAlternativeText = dataType;
    let iconSize = XS_ICON_SIZE;
    let iconBackgroundColor;

    if (dataType === FLOW_DATA_TYPE.BOOLEAN.value) {
        iconName = `${UTILITY_ICON_TYPE}:toggle`;
    } else if (dataType === SOBJECT_TYPE && isCollection) {
        // TODO: Remove the isCollection check once the utility:record icon is ready.
        // Both record and record collection variables should have the same icon then.
        iconName = `${UTILITY_ICON_TYPE}:sobject_collection`;
    } else if (elementType === ELEMENT_TYPE.TEXT_TEMPLATE || elementType === ELEMENT_TYPE.STAGE) {
        const config = getConfigForElementType(elementType);
        iconName = config.nodeConfig?.utilityIconName;
        // Stages don't have a datatype. Using elementType in that case.
        iconAlternativeText = iconAlternativeText || elementType;
    } else if (elementType === ELEMENT_TYPE.STAGE_STEP) {
        iconName = actionType === ACTION_TYPE.STEP_BACKGROUND ? ICONS.backgroundStep : ICONS.interactiveStep;
        const config = getConfigForElementType(elementType);
        iconBackgroundColor = config.nodeConfig?.iconBackgroundColor;
        iconSize = S_ICON_SIZE;
    }

    return {
        iconName,
        iconAlternativeText,
        iconBackgroundColor,
        iconSize
    };
};

/**
 * Creates the field input menu item for the $Record global variable
 *
 * @param resource $Record global resource
 * @param dataType dataType associated with the resource
 * @returns representation of the $Record global resource in the shape combobox needs
 */
const getGlobalRecordMenuItem = (resource: UI.FlowResource, dataType: UI.Datatype): UI.FieldInputMenuItem => {
    const iconInfo = getNonCanvasElementIconInfo(dataType, resource.isCollection, resource.elementType);
    return {
        name: SYSTEM_VARIABLE_RECORD_PREFIX,
        label: format(LABELS.globalRecordLabel, resource.subtype),
        value: SYSTEM_VARIABLE_RECORD_PREFIX,
        description: format(LABELS.globalRecordDescription, resource.subtype),
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        category: LABELS.globalResources,
        subtype: resource.subtype,
        ...iconInfo
    };
};

/**
 * Creates the field input menu item for various elements in the flow
 *
 * @param resource element from flow or global values
 * @param dataType dataType associated with the resource
 * @returns representation of the flow element in the shape combobox needs
 */
const getResourceMenuItem = (resource: UI.FlowResource, dataType: UI.Datatype): UI.FieldInputMenuItem => {
    // TODO: Look into hydrated element type
    const name = (resource as UI.HydratedElement).name?.value || resource.name!;
    const elementCategory = getResourceCategory({
        dataType,
        ...resource
    });
    const iconInfo = resource.isCanvasElement
        ? getCanvasElementIconInfo(resource)
        : getNonCanvasElementIconInfo(dataType, resource.isCollection, resource.elementType, resource.actionType);

    return {
        name,
        label: resource.label || name,
        value: resource.guid,
        // Adding description for Global values like True, False etc.
        description: resource.description,
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        category: resource.category || elementCategory,
        subtype: resource.subtype,
        ...iconInfo
    };
};

const shouldDisableHasNext = (
    dataType: string,
    { isEnabled = true, allowSObjectField = true }: MenuTraversalConfig = {}
) => !isEnabled || (!allowSObjectField && dataType === FLOW_DATA_TYPE.SOBJECT.value);

/**
 * Makes copy of a Flow Element with fields as needed by combobox
 *
 * @param resource element from flow or global constants
 * @param traversalConfig some additional settings for figuring out wether we need to set hasNext on items.
 * @returns representation of the passed in resource in shape combobox needs
 */
export function mutateFlowResourceToComboboxShape(
    resource: UI.FlowResource,
    traversalConfig?: MenuTraversalConfig
): UI.FieldInputMenuItem {
    const dataType = getDataType(resource);
    const menuItem =
        resource.elementType === ELEMENT_TYPE.START_ELEMENT
            ? getGlobalRecordMenuItem(resource, dataType)
            : getResourceMenuItem(resource, dataType);

    menuItem.hasNext =
        (!shouldDisableHasNext(dataType, traversalConfig) && supportsTraversalOfElement(resource)) ||
        (isComplexType(dataType) && !resource.isCollection);

    if (menuItem.hasNext) {
        menuItem.rightIconName = RIGHT_ICON_NAME;
        menuItem.rightIconSize = XS_ICON_SIZE;
    }

    return menuItem;
}

/**
 * Creates a new array of combobox menu data from an existing array of entities taken from the service
 *
 * @param entities the array of entities that you want to mutate into combobox shape
 * @returns combobox menu data for the given entities
 */
export const mutateEntitiesToComboboxShape = (entities: UI.EntityDefinition[]): UI.FieldInputMenuItem[] => {
    return entities.map((entity) => {
        const iconInfo = getNonCanvasElementIconInfo(SOBJECT_TYPE, entity.isCollection);
        return {
            type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            label: entity.entityLabel || entity.apiName,
            name: entity.apiName,
            value: entity.apiName,
            dataType: SOBJECT_TYPE,
            isCollection: entity.isCollection,
            subtype: entity.apiName,
            ...iconInfo
        };
    });
};

/**
 * Creates a new array of combobox menu data from an existing array of apex classes taken from the service
 *
 * @param classes the array of apex classes that you want to mutate into combobox shape
 * @returns combobox menu data for the given apex classes
 */
const mutateApexClassesToComboboxShape = (classes): UI.FieldInputMenuItem[] => {
    return classes.map((clazz) => {
        const iconInfo = getNonCanvasElementIconInfo(APEX_TYPE, clazz.isCollection);
        return {
            type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            label: clazz.durableId,
            name: clazz.durableId,
            value: clazz.durableId,
            dataType: APEX_TYPE,
            isCollection: clazz.isCollection,
            subtype: clazz.durableId,
            ...iconInfo
        };
    });
};

export const apexClassesMenuDataSelector = createSelector([apexClassesSelector], (apexClasses) => {
    return apexClasses ? mutateApexClassesToComboboxShape(apexClasses) : null;
});

/**
 * Mutates one picklist value into a combobox menu item
 *
 * @param picklistOption object that is a picklist value
 * @returns menu item representing the picklist value
 */
export const mutatePicklistValue = (picklistOption): UI.FieldInputMenuItem => {
    const { label, value } = picklistOption;
    const iconInfo = getNonCanvasElementIconInfo(FLOW_DATA_TYPE.STRING.value);
    return {
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        label: label || value,
        name: value,
        dataType: FLOW_DATA_TYPE.STRING.value,
        // This is to ensure uniqueness among picklist values
        value: label ? `${value}-${label}` : value,
        ...iconInfo
    };
};

/**
 * Creates a new array of combobox menu data from an existing array of event types taken from the service
 *
 * @param eventTypes the array of event types that you want to mutate into combobox shape
 * @returns combobox menu data for the given event types
 */
export const mutateEventTypesToComboboxShape = (eventTypes): UI.FieldInputMenuItem[] => {
    return eventTypes.map((eventType) => {
        const iconInfo = getNonCanvasElementIconInfo(SOBJECT_TYPE);
        return {
            type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            label: eventType.label || eventType.qualifiedApiName,
            name: eventType.qualifiedApiName,
            value: eventType.qualifiedApiName,
            dataType: SOBJECT_TYPE,
            subtype: eventType.qualifiedApiName,
            ...iconInfo
        };
    });
};

const formatIfNeeded = (nonFormattedValue: string, isFormatNeeded?: boolean, formatArgument?: string): string =>
    isFormatNeeded ? format(nonFormattedValue, formatArgument) : nonFormattedValue;

export const mutateSystemAndGlobalVariablesToComboboxShape = ({
    name,
    subtype,
    dataType,
    config
}: {
    name: string;
    subtype?: string;
    dataType?: string;
    config: SystemAndGlobalVariablesConfig;
}): UI.FieldInputMenuItem => ({
    value: name,
    dataType,
    subtype,
    label: formatIfNeeded(config.label, config.hasLabelSubtypeParam, subtype),
    name,
    description: formatIfNeeded(config.description, config.hasDescriptionSubtypeParam, subtype),
    category: LABELS.globalResources,
    type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
    hasNext: true,
    iconName: `${UTILITY_ICON_TYPE}:${config.iconName}`,
    iconSize: XS_ICON_SIZE,
    rightIconName: RIGHT_ICON_NAME,
    rightIconSize: XS_ICON_SIZE,
    iconAlternativeText: LABELS.systemGlobalVariableCategoryIconAltText // FIXME we need the alt text for the new combobox - most likely will depend on the icon thus the config
});
