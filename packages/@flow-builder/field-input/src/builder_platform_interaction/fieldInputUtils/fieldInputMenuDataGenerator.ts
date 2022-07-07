import { FLOW_DATA_TYPE, getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
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

const viewTBD: FieldInput.MenuItemViewTBD = {
    type: 'MenuItemViewTypeTbd'
} as const;

const defaultIconInfo = {
    iconName: 'missing-icon',
    iconSize: 'small'
} as const;

// make type from t FLOW_DATA_TYPE
const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;
const APEX_TYPE = FLOW_DATA_TYPE.APEX.value;
const UTILITY_ICON_TYPE = 'utility';

/**
 * Checks if the provided top level resource will support traversal within the combobox
 *
 * @param resource element from flow
 * @returns True if the resource should support traversal
 */
// TODO: is this still needed?
// const supportsTraversalOfElement = (resource: UI.FlowResource): boolean => {
//     return (
//         resource.storeOutputAutomatically ||
//         (resource.elementType !== ELEMENT_TYPE.START_ELEMENT && !!resource.childReferences?.length)
//     );
// };

/**
 * Gets the icon information for a canvas element field input item
 *
 * @param resource canvas element from flow
 * @returns icon information such as name, size etc.
 */
const getCanvasElementIconInfo = (resource: UI.FlowResource): FieldInput.MenuItemIconInfo => {
    const { nodeConfig } = getConfigForElementType(resource.elementSubtype || resource.elementType);

    // can this ever happen?
    if (nodeConfig == null) {
        return defaultIconInfo;
    }

    const { iconName, iconBackgroundColor, iconShape } = nodeConfig;

    return {
        iconName,
        iconAlternativeText: resource.elementType,
        iconSize: 'small',
        iconBackgroundColor,
        iconShape
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
export const getNonCanvasElementIconInfo = (
    dataType: UI.Datatype,
    isCollection?: boolean,
    elementType?: UI.ElementType,
    actionType?: UI.ActionType
): FieldInput.MenuItemIconInfo => {
    let iconName = getDataTypeIcons(dataType, UTILITY_ICON_TYPE);
    let iconAlternativeText = dataType;
    let iconSize: FieldInput.IconSize = 'x-small';

    let iconBackgroundColor;

    if (dataType === FLOW_DATA_TYPE.BOOLEAN.value) {
        iconName = 'utility:toggle';
    } else if (dataType === SOBJECT_TYPE && isCollection) {
        // TODO: Remove the isCollection check once the utility:record icon is ready.
        // Both record and record collection variables should have the same icon then.
        iconName = 'utility:sobject_collection';
    } else if (elementType === ELEMENT_TYPE.TEXT_TEMPLATE || elementType === ELEMENT_TYPE.STAGE) {
        const config = getConfigForElementType(elementType);
        iconName = config.nodeConfig?.utilityIconName;
        // Stages don't have a datatype. Using elementType in that case.
        iconAlternativeText = iconAlternativeText || elementType;
    } else if (elementType === ELEMENT_TYPE.STAGE_STEP) {
        iconName = actionType === ACTION_TYPE.STEP_BACKGROUND ? ICONS.backgroundStep : ICONS.interactiveStep;
        const config = getConfigForElementType(elementType);
        iconBackgroundColor = config.nodeConfig?.iconBackgroundColor;
        iconSize = 'small';
    }

    // can this ever happen?
    if (iconName == null) {
        return defaultIconInfo;
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
const getGlobalRecordMenuItem = (
    resource: UI.FlowResource,
    dataType: UI.Datatype
): FieldInput.MenuItem<FieldInput.MenuItemViewObjectFields> => {
    const iconInfo = getNonCanvasElementIconInfo(dataType, resource.isCollection, resource.elementType);

    return {
        name: SYSTEM_VARIABLE_RECORD_PREFIX,
        label: format(LABELS.globalRecordLabel, resource.subtype),
        value: SYSTEM_VARIABLE_RECORD_PREFIX,
        description: format(LABELS.globalRecordDescription, resource.subtype),
        view: { type: 'ObjectFields', objectApiName: resource.subtype! },
        category: LABELS.globalResources,
        subtype: resource.subtype,
        ...iconInfo
    };
};

/**
 * Maps a Field Input menu category to a view type
 *
 * @param category - The menu category
 * @returns The view type for the category
 */
function getViewTypeForCategory(category: FieldInput.Category): FieldInput.MenuItemViewType | undefined {
    if (category === 'RecordVariable') {
        return 'ObjectFields';
    }
    return undefined;
}
/**
 * Creates the field input menu item for various flow resources
 *
 * @param resource element from flow or global values
 * @param dataType dataType associated with the resource
 * @returns The menu item for the resource
 */
const getResourceMenuItem = (resource: UI.FlowResource, dataType: UI.Datatype): FieldInput.MenuItem => {
    // TODO: Look into hydrated element type
    const name = (resource as UI.HydratedElement).name?.value || resource.name!;

    const category = getResourceCategory({ dataType, ...resource }) || resource.category;
    const iconInfo = resource.isCanvasElement
        ? getCanvasElementIconInfo(resource)
        : getNonCanvasElementIconInfo(dataType, resource.isCollection, resource.elementType, resource.actionType);

    const viewType = getViewTypeForCategory(category);

    const { label, guid, description, subtype } = resource;

    return {
        name,
        label: label || name,
        value: guid,
        view: viewType != null ? { type: viewType } : undefined,
        // Adding description for Global values like True, False etc.
        description,
        category,
        subtype,
        dataType,
        ...iconInfo
    };
};

// TODO: is this still needed?
// const shouldDisableHasNext = (
//     dataType: string,
//     { isEnabled = true, allowSObjectField = true }: MenuTraversalConfig = {}
// ) => !isEnabled || (!allowSObjectField && dataType === FLOW_DATA_TYPE.SOBJECT.value);

/**
 * Makes copy of a Flow Element with fields as needed by combobox
 *
 * @param resource element from flow or global constants
 * @returns representation of the passed in resource in shape combobox needs
 */
export function mutateFlowResourceToComboboxShape<T extends FieldInput.MenuItemView>(
    resource: UI.FlowResource
): FieldInput.MenuItem<T> {
    const dataType: UI.Datatype = getDataType(resource);

    const menuItem =
        resource.elementType === ELEMENT_TYPE.START_ELEMENT
            ? getGlobalRecordMenuItem(resource, dataType)
            : getResourceMenuItem(resource, dataType);

    // TODO: remove this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return menuItem as any;
}

/**
 * Creates a new array of combobox menu data from an existing array of entities taken from the service
 *
 * @param entities the array of entities that you want to mutate into combobox shape
 * @returns combobox menu data for the given entities
 */
export const mutateEntitiesToComboboxShape = (entities: UI.EntityDefinition[]): FieldInput.MenuItem[] => {
    return entities.map((entity) => {
        const { entityLabel, apiName, isCollection } = entity;
        const iconInfo = getNonCanvasElementIconInfo(SOBJECT_TYPE, isCollection);

        return {
            view: viewTBD,
            label: entityLabel || apiName,
            name: apiName,
            value: apiName,
            dataType: SOBJECT_TYPE,
            isCollection,
            subtype: apiName,
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
const mutateApexClassesToComboboxShape = (classes: UI.EntityDefinition[]): FieldInput.MenuItem[] => {
    return classes.map((apexClass) => {
        const durableId = apexClass.durableId!;
        const { isCollection } = apexClass;
        const iconInfo = getNonCanvasElementIconInfo(APEX_TYPE, isCollection);

        return {
            label: durableId,
            name: durableId,
            value: durableId,
            dataType: APEX_TYPE,
            isCollection,
            subtype: durableId,
            view: viewTBD,
            ...iconInfo
        };
    });
};

export const apexClassesMenuDataSelector = createSelector(
    [apexClassesSelector],
    (apexClasses: UI.EntityDefinition[]) => {
        return apexClasses ? mutateApexClassesToComboboxShape(apexClasses) : null;
    }
);

type PicklistOption = {
    label: string;
    value: string;
};

/**
 * Mutates one picklist value into a combobox menu item
 *
 * @param picklistOption object that is a picklist value
 * @returns menu item representing the picklist value
 */
export const mutatePicklistValue = (picklistOption: PicklistOption): FieldInput.MenuItem => {
    const { label, value } = picklistOption;
    const iconInfo = getNonCanvasElementIconInfo(FLOW_DATA_TYPE.STRING.value);

    return {
        view: viewTBD,
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
export const mutateEventTypesToComboboxShape = (eventTypes: FieldInput.EventType[]): FieldInput.MenuItem[] => {
    return eventTypes.map((eventType) => {
        const iconInfo = getNonCanvasElementIconInfo(SOBJECT_TYPE);
        const { label, qualifiedApiName } = eventType;

        return {
            label: label || qualifiedApiName,
            name: qualifiedApiName,
            value: qualifiedApiName,
            dataType: SOBJECT_TYPE,
            view: viewTBD,
            subtype: qualifiedApiName,
            ...iconInfo
        };
    });
};

const formatIfNeeded = (nonFormattedValue: string, isFormatNeeded?: boolean, formatArgument?: string): string =>
    isFormatNeeded ? format(nonFormattedValue, formatArgument) : nonFormattedValue;

const globalVariablesViewMap: Record<FieldInput.SystemAndGlobalVariableName, FieldInput.MenuItemViewType> = {
    $Flow: 'Resources.Flow',
    $Organization: 'Resources.Organization',
    $Setup: 'Resources.Setup',
    $User: 'Resources.User',
    $UserRole: 'Resources.UserRole',
    $Profile: 'Resources.Profile',
    $Api: 'Resources.Api',
    $System: 'Resources.System',
    $Label: 'Resources.Labels',
    $Record: 'ObjectFields',
    $Record__Prior: 'ObjectFields'
};

export const mutateSystemAndGlobalVariablesToComboboxShape = ({
    name,
    subtype,
    dataType,
    config
}: {
    name: string;
    subtype?: string;
    dataType?: UI.Datatype;
    config: SystemAndGlobalVariablesConfig;
}): FieldInput.MenuItem => {
    const { hasLabelSubtypeParam, description, label, iconName, hasDescriptionSubtypeParam } = config;

    const viewType = globalVariablesViewMap[name];

    return {
        view: viewType != null ? { type: viewType } : viewTBD,
        value: name,
        dataType,
        subtype,
        label: formatIfNeeded(label, hasLabelSubtypeParam, subtype),
        name,
        description: formatIfNeeded(description, hasDescriptionSubtypeParam, subtype),
        category: LABELS.globalResources,
        iconName,
        iconSize: 'x-small',
        iconAlternativeText: LABELS.systemGlobalVariableCategoryIconAltText // FIXME we need the alt text for the new combobox - most likely will depend on the icon thus the config
    };
};
