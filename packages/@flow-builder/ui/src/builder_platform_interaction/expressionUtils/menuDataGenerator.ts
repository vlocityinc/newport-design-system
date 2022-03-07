// @ts-nocheck
import collectionDataType from '@salesforce/label/FlowBuilderDataTypes.collectionDataType';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import {
    FLOW_DATA_TYPE,
    getDataTypeIcons,
    getDataTypeLabel,
    isComplexType
} from 'builder_platform_interaction/dataTypeLib';
import { getResourceCategory, getResourceLabel } from 'builder_platform_interaction/elementLabelLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isGlobalVariablesSupported } from 'builder_platform_interaction/processTypeLib';
import { getDataType } from 'builder_platform_interaction/ruleLib';
import { getIconNameFromDataType } from 'builder_platform_interaction/screenEditorUtils';
import { apexClassesSelector } from 'builder_platform_interaction/selectors';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { createSelector } from 'builder_platform_interaction/storeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import {
    getGlobalVariableTypes,
    getSystemVariables,
    isNonElementId,
    isSystemVariablesCategoryNotEmpty
} from 'builder_platform_interaction/systemLib';
import {
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    SYSTEM_VARIABLE_ICON_NAME,
    SYSTEM_VARIABLE_PREFIX,
    SYSTEM_VARIABLE_RECORD_PREFIX,
    SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX
} from 'builder_platform_interaction/systemVariableConstantsLib';
import { LABELS } from './expressionUtilsLabels';
const { format } = commonUtils;

export const MAXIMUM_NUMBER_OF_LEVELS = 10;

const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;
const APEX_TYPE = FLOW_DATA_TYPE.APEX.value;
const STRING_TYPE = FLOW_DATA_TYPE.STRING.value;
const ICON_TYPE = 'utility';
const RIGHT_ICON_NAME = 'utility:chevronright';
const ICON_SIZE = 'xx-small';
const SYSTEM_VARIABLE_ICON = `${ICON_TYPE}:${SYSTEM_VARIABLE_ICON_NAME}`;

export const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card',
    OPTION_INLINE: 'option-inline'
};

/**
 * The subtext of a row varies a bit. This function captures those rules.
 * This will also probably use a label service eventually.
 *
 * @param {string} dataType  datatype of an element
 * @param {string} label  the label of an element, if exists
 * @param {Object} resource the resource we're getting the subtext of
 * @param {string} resource.subtype  object type or apex class of an element, if exists
 * @param {boolean} resource.isSystemGeneratedOutput whether or not that's an anonymous output
 * @param {string} resource.elementType element type (eg: recordCreate)
 * @returns {string} the subtext to display in a combobox row
 */
function getSubText(dataType, label, { subtype, isSystemGeneratedOutput, elementType }) {
    let subText = '';
    if (dataType === SOBJECT_TYPE) {
        subText = subtype;
    } else if (
        (dataType && isSystemGeneratedOutput) ||
        (elementType === ELEMENT_TYPE.RECORD_CREATE && dataType === STRING_TYPE) ||
        (elementType === ELEMENT_TYPE.LOOP && dataType && dataType !== SOBJECT_TYPE)
    ) {
        subText =
            elementType === ELEMENT_TYPE.LOOP && dataType === APEX_TYPE
                ? format(LABELS.loopApexAutoOutputSubtext, subtype)
                : getDataTypeLabel(dataType);
    } else if (label) {
        subText = label;
    } else if (dataType) {
        subText = getDataTypeLabel(dataType);
    }
    return subText;
}

/**
 * An object that represents one option in the combobox menu dropdown
 *
 * @typedef {Object} MenuItem
 * @property {string} type  the type of menu data display type ex: option-inline
 * @property {string} text  the text that will be displayed by the combobox (can be highlighted)
 * @property {string} subText the subtext that will displayed below the text
 * @property {string} displayText   the value displayed in the input field when this menu item is selected
 * @property {string} iconName  the icon that will be displayed next to the menu item in a dropdown list
 * @property {string} iconAlternativeText  the alternativeText for the icon that will be displayed next to the menu item in a dropdown list
 * @property {string} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
 * @property {Object} parent in the case that this is a second level item, this is the parent flow element in combobox shape
 * @property {string} dataType the data type for the menu item. eg: Date, Currency, SObject
 * @property {string} subtype the object type or apex when data type is SObject otherwise null. eg: Account
 * @property {boolean} isCollection true if is a collection
 */

/**
 * An object that contains a list of menu items with an optional header
 *
 * @typedef {Object} GroupedMenuItems
 * @property {string} label    an optional header/category for the list of items that will be displayed
 * @property {MenuItem[]} items    list of menu items in order that they will be displayed
 */

/**
 * The menu data that will be displayed in a flow combobox, it contains a list of GroupedMenuItems
 *
 * @typedef {GroupedMenuItems[]} MenuData
 */

/**
 * Create one menu item
 *
 * @param {string} type the type of the menu item
 * @param {string} text the text of the menu item
 * @param {string} subText  the subtext of the menu item
 * @param {string} displayText the display text of the menu item
 * @param {string} iconName the icon of the menu item
 * @param {string} iconAlternativeText alternativeText for the icon of the menu item
 * @param {string} value the value of the menu item
 * @param {Object} parent the parent flow element of the second level item in combobox shape
 * @param {boolean} isSystemVariableField true for fields if the root parent is $Record
 * @param {boolean} haveSystemVariableFields true for spannable sobject fields whose root parent is $Record
 * @param {string} dataType the data type for the menu item. eg: Date, Currency, SObject
 * @param {string} subtype the object type when data type is SObject otherwise null. eg: Account
 * @param {boolean} isCollection true if is a collection
 * @param {Function} optional function to be called to retrieve child items for the item
 * @returns {MenuItem}  the generated menu item
 */
const createMenuItem = ({
    type,
    text,
    subText,
    displayText,
    iconName,
    iconAlternativeText,
    value,
    parent,
    isSystemVariableField,
    haveSystemVariableFields,
    dataType,
    subtype,
    isCollection,
    getChildrenItems
} = {}) => ({
    type,
    text,
    subText,
    displayText,
    iconName,
    iconAlternativeText,
    iconSize: ICON_SIZE,
    value,
    parent,
    isSystemVariableField,
    haveSystemVariableFields,
    dataType,
    subtype,
    isCollection,
    getChildrenItems
});

/**
 * Determines whether to show the dataType as the subtext or not
 *
 * @param {Object} [parent] Parent object if field is a second level item
 * @returns {boolean} True if dataType should be the subtext
 */
const shouldShowDataTypeAsSubText = (parent) =>
    parent &&
    (parent.dataType === FLOW_DATA_TYPE.APEX.value ||
        parent.text === SYSTEM_VARIABLE_PREFIX ||
        parent.text === SYSTEM_VARIABLE_CLIENT_PREFIX);

/**
 * Get sub text for given field
 *
 * @param {Object} [parent] Parent object if field is a second level item
 * @param field
 * @returns {string} the subtext to display
 */
function getFieldSubText(parent, field) {
    // support for parameter items being converted to field shape
    const apiName = field.apiName || field.qualifiedApiName;
    const label = field.label || apiName;
    let subText = label;
    if (shouldShowDataTypeAsSubText(parent)) {
        const dataTypeLabel = getDataTypeLabel(field.dataType);
        if (field.isCollection && parent.dataType === FLOW_DATA_TYPE.APEX.value) {
            subText = format(collectionDataType, dataTypeLabel);
        } else {
            subText = dataTypeLabel;
        }
    }
    return subText;
}

/**
 * Get display text a field
 *
 * @param {Object} [parent] Parent object if field is a second level item
 * @param {string} fieldNameOrRelationshipName the field name or the relationship name
 * @param {string} [specificObjectName] the specific object name if field is polymorphic
 * @param {boolean} true to show the display text as field reference, otherwise return field name
 * @param showAsFieldReference
 * @returns {string} the display text for the field
 */
function getFieldDisplayText(parent, fieldNameOrRelationshipName, specificObjectName, showAsFieldReference) {
    let displayText = fieldNameOrRelationshipName + (specificObjectName ? ':' + specificObjectName : '');
    if (showAsFieldReference && parent && parent.displayText) {
        displayText = parent.displayText.substring(0, parent.displayText.length - 1) + '.' + displayText + '}';
    }
    return displayText;
}

/**
 * @param root0
 * @param root0.text
 * @param root0.iconName
 * @param root0.iconAlternativeText
 * @param root0.subText
 * @param root0.displayText
 * @param root0.value
 * @param root0.parent
 * @param root0.isSystemVariableField
 * @param root0.haveSystemVariableFields
 * @param root0.hasNext
 * @param root0.dataType
 * @param root0.subtype
 * @param root0.isCollection
 * @param root0.getChildrenItems
 */
function createMenuItemForField({
    text = '',
    iconName,
    iconAlternativeText,
    subText = '',
    displayText = '',
    value,
    parent,
    isSystemVariableField,
    haveSystemVariableFields,
    hasNext = false,
    dataType,
    subtype,
    isCollection,
    getChildrenItems
} = {}): ComboboxItem {
    const menuItem = createMenuItem({
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        iconName,
        iconAlternativeText,
        text,
        subText,
        value,
        displayText,
        dataType,
        subtype,
        parent,
        isSystemVariableField,
        haveSystemVariableFields,
        isCollection,
        getChildrenItems
    });
    if (hasNext) {
        menuItem.rightIconName = RIGHT_ICON_NAME;
        menuItem.rightIconSize = ICON_SIZE;
        menuItem.hasNext = true;
    }
    return menuItem;
}

/**
 * @param field
 * @param parent
 * @param referenceToName
 * @param root0
 * @param root0.showAsFieldReference
 * @param root0.showSubText
 */
function getMenuItemForSpannableSObjectField(
    field,
    parent,
    referenceToName,
    { showAsFieldReference = true, showSubText = true } = {}
) {
    const relationshipName = field.relationshipName || field.apiName;
    const text = field.isPolymorphic ? `${relationshipName} (${referenceToName})` : relationshipName;
    let value = relationshipName + (field.isPolymorphic ? ':' + referenceToName : '');
    if (parent) {
        value = parent.value + '.' + value;
    }
    const displayText = getFieldDisplayText(
        parent,
        relationshipName,
        field.isPolymorphic && referenceToName,
        showAsFieldReference
    );
    return createMenuItemForField({
        subText: showSubText ? getFieldSubText(parent, field) : '',
        parent: showAsFieldReference ? parent : null,
        haveSystemVariableFields: showAsFieldReference ? parent.haveSystemVariableFields : null,
        hasNext: true,
        text,
        value,
        displayText,
        dataType: SOBJECT_TYPE,
        subtype: referenceToName,
        isCollection: false
    });
}

/**
 * @param item
 */
function getMergeFieldLevel(item) {
    let mergeFieldLevel = 1;
    if (item) {
        while (item.parent) {
            mergeFieldLevel++;
            item = item.parent;
        }
    }
    return mergeFieldLevel;
}

/**
 * @param field
 * @param parent
 * @param root0
 * @param root0.showAsFieldReference
 * @param root0.showSubText
 * @param root0.allowSObjectFieldsTraversal
 */
function getMenuItemsForSObjectField(
    field,
    parent,
    { showAsFieldReference = true, showSubText = true, allowSObjectFieldsTraversal = true } = {}
) {
    if (
        allowSObjectFieldsTraversal &&
        field.isSpanningAllowed === true &&
        getMergeFieldLevel(parent) < MAXIMUM_NUMBER_OF_LEVELS - 1
    ) {
        const comboboxItems = [];
        field.referenceToNames.forEach((referenceToName) => {
            comboboxItems.push(
                getMenuItemForSpannableSObjectField(field, parent, referenceToName, {
                    showAsFieldReference,
                    showSubText
                })
            );
        });
        comboboxItems.push(
            getMenuItemForField(field, parent, {
                showAsFieldReference,
                showSubText
            })
        );
        return comboboxItems;
    }
    return [
        getMenuItemForField(field, parent, {
            showAsFieldReference,
            showSubText
        })
    ];
}

/**
 * @param field
 * @param parent
 * @param root0
 * @param root0.allowSObjectFieldsTraversal
 * @param root0.allowApexTypeFieldsTraversal
 * @param root0.allowSObjectFields
 * @param root0.allowApexTypeFields
 * @param root0.allowElementFields
 */
function isTraversable(
    field,
    parent,
    {
        allowSObjectFieldsTraversal = true,
        allowApexTypeFieldsTraversal = true,
        allowSObjectFields = true,
        allowApexTypeFields = true,
        allowElementFields = true
    } = {}
) {
    const { dataType, isCollection } = field;
    if (!isComplexType(dataType) || isCollection) {
        return false;
    }
    let hasNext = false;
    const parentDataType = parent && parent.dataType;
    if (parentDataType === SOBJECT_TYPE) {
        if (dataType === SOBJECT_TYPE) {
            hasNext = allowSObjectFieldsTraversal;
        }
    } else if (parentDataType === APEX_TYPE) {
        if (dataType === SOBJECT_TYPE) {
            hasNext = allowSObjectFields && allowApexTypeFieldsTraversal;
        } else if (dataType === APEX_TYPE) {
            hasNext = allowApexTypeFields && allowApexTypeFieldsTraversal;
        }
    } else if (dataType === SOBJECT_TYPE) {
        // no parent or parent is SUBFLOW_OUTPUT_TYPE, ACTION_OUTPUT_TYPE or LIGHTNING_COMPONENT_OUTPUT
        hasNext = allowSObjectFields;
    } else if (dataType === APEX_TYPE) {
        // no parent or parent is SUBFLOW_OUTPUT_TYPE, ACTION_OUTPUT_TYPE or LIGHTNING_COMPONENT_OUTPUT
        hasNext = allowApexTypeFields;
    } else if (parentDataType === FLOW_DATA_TYPE.STAGE_STEP.value && dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
        hasNext = allowElementFields;
    }

    if (hasNext && getMergeFieldLevel(parent) >= MAXIMUM_NUMBER_OF_LEVELS - 1) {
        hasNext = false;
    }
    return hasNext;
}

/**
 * Makes copy of server data fields of parent objects(SObjects, Global/System Variables) with fields as needed by combobox
 *
 * @param {Object} field Field to be copied
 * @param {Object} [parent] Parent object if field is a second level item
 * @param {Object} [options]
 * @param {boolean} [options.showAsFieldReference] true to show the display text as field reference on record variable, otherwise show the field's apiName
 * @param {boolean} [options.showSubText] true to show the sub text
 * @param {boolean} [options.allowSObjectFieldsTraversal] true if sobject fields that are spannable can be traversed
 * @param {boolean} [options.allowApexTypeFieldsTraversal] true if apex type fields can be traversed
 * @param {boolean} [options.allowSObjectFields] true to allow SObject traversal (1st level : SObject fields)
 * @param {boolean} [options.allowApexTypeFields] true to allow Apex type traversal (1st level : apex type fields)
 * @param {boolean} [options.allowElementFields] true to allow element field traversal rather than just element selection (ex: stageStep.output.foo)
 * @returns {MenuItem} Representation of flow element in shape combobox needs
 */
export function getMenuItemForField(
    field,
    parent,
    {
        showAsFieldReference = true,
        showSubText = true,
        allowSObjectFieldsTraversal = true,
        allowApexTypeFieldsTraversal = true,
        allowSObjectFields = true,
        allowApexTypeFields = true,
        allowElementFields = true
    } = {}
) {
    // support for parameter items being converted to field shape
    const apiName = field.apiName || field.qualifiedApiName;
    const hasNext = isTraversable(field, parent, {
        allowSObjectFieldsTraversal,
        allowApexTypeFieldsTraversal,
        allowSObjectFields,
        allowApexTypeFields,
        allowElementFields
    });
    const { dataType, isCollection, subtype, getChildrenItems } = field;
    const text = apiName;
    const comboboxItem = createMenuItemForField({
        iconName: getDataTypeIcons(field.dataType, ICON_TYPE),
        iconAlternativeText: dataType,
        isCollection,
        dataType,
        subtype,
        subText: showSubText ? getFieldSubText(parent, field) : '',
        parent: showAsFieldReference ? parent : null,
        isSystemVariableField: parent ? parent.haveSystemVariableFields : false,
        text,
        value: parent ? parent.value + '.' + apiName : apiName,
        hasNext,
        displayText: getFieldDisplayText(parent, apiName, undefined, showAsFieldReference),
        getChildrenItems
    });
    return comboboxItem;
}

/**
 * Get menu items for a field. For sobject fields, there can be more than one menu item for a given field.
 *
 * @param {Object} field Field for which to get the menu items
 * @param {Object} [parent] Parent object if field is a second level item
 * @param {Object} options
 * @param {Object} [options]
 * @param {boolean} [options.showAsFieldReference] true to show the display text as field reference on record variable, otherwise show the field's apiName
 * @param {boolean} [options.showSubText] true to show the sub text
 * @param {boolean} [options.allowSObjectFieldsTraversal] true if sobject fields that are spannable can be traversed
 * @param {boolean} [options.allowApexTypeFieldsTraversal] true if apex type fields can be traversed
 * @param {boolean} [options.allowSObjectFields] true to allow SObject traversal (1st level : SObject fields)
 * @param {boolean} [options.allowApexTypeFields] true to allow Apex type traversal (1st level : apex type fields)
 * @param options.allowElementFields
 * @returns {MenuItem[]} menu items for the field (possibly more than one for SObject fields that are spannable)
 */
export function getMenuItemsForField(
    field,
    parent,
    {
        showAsFieldReference = true,
        showSubText = true,
        allowSObjectFieldsTraversal = true,
        allowApexTypeFieldsTraversal = true,
        allowSObjectFields = true,
        allowApexTypeFields = true,
        allowElementFields = true
    } = {}
) {
    if (parent && parent.dataType === SOBJECT_TYPE) {
        return getMenuItemsForSObjectField(field, parent, {
            showAsFieldReference,
            showSubText,
            allowSObjectFieldsTraversal
        });
    }
    return [
        getMenuItemForField(field, parent, {
            showAsFieldReference,
            showSubText,
            allowSObjectFieldsTraversal,
            allowApexTypeFieldsTraversal,
            allowSObjectFields,
            allowApexTypeFields,
            allowElementFields
        })
    ];
}

const shouldDisableHasNext = (
    dataType: string,
    { isEnabled = true, allowSObjectField = true }: MenuTraversalConfig = {}
) => !isEnabled || (!allowSObjectField && dataType === FLOW_DATA_TYPE.SOBJECT.value);

/**
 * Makes copy of a Flow Element with fields as needed by combobox
 *
 * @param {Object} resource element from flow
 * @param traversalConfig some additional settings for figuring out wether we need to set hasNext on items.
 * @returns {Object} representation of flow element in shape combobox needs
 */
export function mutateFlowResourceToComboboxShape(resource, traversalConfig?: MenuTraversalConfig) {
    const newElement: UI.ComboboxItem = {
        iconSize: ICON_SIZE
    };

    const resourceDataType = getDataType(resource);
    const resourceLabel = resource.type ? resource.type.label : resource.label;
    let elementCategory, isNonElement, resourceIcon;

    if (resource.elementType === ELEMENT_TYPE.START_ELEMENT) {
        resourceIcon = SYSTEM_VARIABLE_ICON;
        newElement.text = SYSTEM_VARIABLE_RECORD_PREFIX;
        newElement.value = SYSTEM_VARIABLE_RECORD_PREFIX;
        newElement.haveSystemVariableFields = resource.haveSystemVariableFields;
        isNonElement = false;
    } else {
        // For screen fields fetch icon based on data type instead of screen field type.
        if (resource.elementType === ELEMENT_TYPE.SCREEN_FIELD) {
            resourceIcon = getIconNameFromDataType(resource.dataType);
        } else {
            resourceIcon = resource.type ? resource.type.icon : resource.iconName;
        }
        elementCategory = getResourceCategory({
            ...resource,
            dataType: resourceDataType
        });
        newElement.text = getResourceLabel(resource);
        newElement.value = resource.guid;
        isNonElement = isNonElementId(resource.guid);
    }
    newElement.displayText = addCurlyBraces(resource.isNewField ? resource.name.value : resource.name);
    newElement.subText = isNonElement ? resource.description : getSubText(resourceDataType, resourceLabel, resource);

    newElement.hasNext =
        !shouldDisableHasNext(resourceDataType, traversalConfig) &&
        isComplexType(resourceDataType) &&
        !resource.isCollection;
    newElement.rightIconName = newElement.hasNext ? RIGHT_ICON_NAME : '';
    newElement.category = resource.category || elementCategory?.toUpperCase();
    newElement.iconName = resourceIcon || getDataTypeIcons(resourceDataType, ICON_TYPE);
    newElement.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    newElement.dataType = resourceDataType;
    newElement.subtype = resource.subtype || null;
    if (newElement.hasNext) {
        newElement.rightIconSize = ICON_SIZE;
    }

    newElement.iconAlternativeText =
        resourceDataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value
            ? LABELS.lightningComponentScreenFieldIconAltText
            : resourceDataType;
    return newElement;
}

/**
 * Creates a new array of combobox menu data from an existing array of entities taken from the service
 *
 * @param {Array} entities the array of entities that you want to mutate into comboobx shape
 * @returns {MenuData} combobox menu data for the given entities
 */
export const mutateEntitiesToComboboxShape = (entities): ComboboxItem[] => {
    return entities.map((entity) => {
        return createMenuItem({
            type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            text: entity.entityLabel || entity.apiName,
            subText: entity.apiName,
            displayText: entity.entityLabel || entity.apiName,
            value: entity.apiName,
            dataType: SOBJECT_TYPE,
            isCollection: entity.isCollection,
            subtype: entity.apiName,
            getChildrenItems: entity.getChildrenItems
        });
    });
};

export const mutateApexClassesToComboboxShape = (classes) => {
    return classes.map((clazz) => {
        return createMenuItem({
            type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            text: clazz.durableId,
            displayText: clazz.durableId,
            value: clazz.durableId,
            dataType: APEX_TYPE,
            isCollection: clazz.isCollection,
            subtype: clazz.durableId
        });
    });
};

export const apexClassesMenuDataSelector = createSelector([apexClassesSelector], (apexClasses) => {
    return apexClasses ? mutateApexClassesToComboboxShape(apexClasses) : null;
});

/**
 * Mutates one picklist value into a combobox menu item
 *
 * @param {Object} picklistOption object that is a picklist value
 * @returns {MenuItem} menu item representing the picklist value
 */
export const mutatePicklistValue = (picklistOption) => {
    return createMenuItem({
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        text: picklistOption.label || picklistOption.value,
        dataType: FLOW_DATA_TYPE.STRING.value,
        subText: FLOW_DATA_TYPE.STRING.label,
        displayText: picklistOption.value,
        iconName: getDataTypeIcons(FLOW_DATA_TYPE.STRING.value, ICON_TYPE),
        iconAlternativeText: FLOW_DATA_TYPE.STRING.value,
        // This is to insure uniqueness among picklist values
        value: picklistOption.label ? picklistOption.value + '-' + picklistOption.label : picklistOption.value
    });
};

/**
 * Creates a new array of combobx menu data from an existing array of event types taken from the service
 *
 * @param {Array} eventTypes the array of event types that you want to mutate into comboobx shape
 * @returns {MenuData} combobox menu data for the given event types
 */
export const mutateEventTypesToComboboxShape = (eventTypes) => {
    return eventTypes.map((eventType) => {
        return createMenuItem({
            type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            text: eventType.label || eventType.qualifiedApiName,
            subText: eventType.qualifiedApiName,
            displayText: eventType.label || eventType.qualifiedApiName,
            value: eventType.qualifiedApiName,
            dataType: SOBJECT_TYPE,
            subtype: eventType.qualifiedApiName
        });
    });
};

const mutateSystemAndGlobalVariablesToComboboxShape = ({ value, dataType, subtype }) => {
    return {
        value,
        dataType,
        subtype,
        text: value,
        displayText: addCurlyBraces(value),
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        hasNext: true,
        iconName: SYSTEM_VARIABLE_ICON,
        iconSize: ICON_SIZE,
        rightIconName: RIGHT_ICON_NAME,
        rightIconSize: ICON_SIZE,
        iconAlternativeText: LABELS.systemGlobalVariableCategoryIconAltText,
        subText: dataType === SOBJECT_TYPE ? subtype : undefined
    };
};

/**
 * Gets menu data global variable types.
 *
 * @returns {MenuDataItem[]} menu data for global variables
 */
export const getGlobalVariableTypeComboboxItems = () => {
    const globalVariableTypes = getGlobalVariableTypes();
    const typeMenuData = [];
    if (globalVariableTypes) {
        Object.keys(globalVariableTypes).forEach((type) => {
            const globalVariable = globalVariableTypes[type];
            typeMenuData.push(
                mutateSystemAndGlobalVariablesToComboboxShape({
                    value: globalVariable.name,
                    subtype: globalVariable.name
                })
            );
        });
    }

    return typeMenuData;
};

/**
 * The combobox item representing the System Variable ($Flow) category.
 *
 * @returns {MenuDataItem[]} menu data for $Flow
 */
export const getFlowSystemVariableComboboxItem = () => {
    return mutateSystemAndGlobalVariablesToComboboxShape({
        value: SYSTEM_VARIABLE_PREFIX,
        subtype: SYSTEM_VARIABLE_PREFIX
    });
};

/**
 * The combobox item representing the System Variable ($Client) category.
 *
 * @returns {MenuDataItem[]} menu data for $Client
 */
const getFlowSystemClientVariableComboboxItem = () =>
    mutateSystemAndGlobalVariablesToComboboxShape({
        value: SYSTEM_VARIABLE_CLIENT_PREFIX,
        subtype: SYSTEM_VARIABLE_CLIENT_PREFIX
    });

/**
 * Menu data for system and/or global variables.
 *
 * @param {boolean} showSystemVariables   should include the system variable category
 * @param {boolean} showGlobalVariables   should include the global variable categories
 * @param {boolean} forFormula   if we are retrieving menu data for formula editor
 * @param shouldBeWritable
 * @param {boolean} showFlowSystemVariable   should include the $Flow system variable
 * @returns {MenuData} menu data showing system variables and/or global variables
 */
export const getSystemAndGlobalVariableMenuData = ({
    showSystemVariables,
    showGlobalVariables,
    forFormula = false,
    shouldBeWritable = false,
    showFlowSystemVariable = true
}: MenuFilter = {}) => {
    const categories = [];
    if (showSystemVariables) {
        if (showFlowSystemVariable) {
            categories.push(getFlowSystemVariableComboboxItem());
        }
        if (isSystemVariablesCategoryNotEmpty(SYSTEM_VARIABLE_CLIENT_PREFIX)) {
            categories.push(getFlowSystemClientVariableComboboxItem());
        }
        if (!shouldBeWritable) {
            const recordPriorVariable = getSystemVariables(SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX)[
                SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX
            ];
            if (recordPriorVariable) {
                categories.push(
                    mutateSystemAndGlobalVariablesToComboboxShape({
                        value: recordPriorVariable.name,
                        dataType: recordPriorVariable.dataType,
                        subtype: recordPriorVariable.subtype
                    })
                );
            }
        }
    }
    if (showGlobalVariables && (forFormula || isGlobalVariablesSupported(getProcessType()))) {
        categories.push(...getGlobalVariableTypeComboboxItems());
    }
    return categories;
};
