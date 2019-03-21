import {
    FLOW_DATA_TYPE,
    getDataTypeLabel,
    getDataTypeIcons,
} from "builder_platform_interaction/dataTypeLib";
import { isGlobalConstantOrSystemVariableId, SYSTEM_VARIABLE_PREFIX, SYSTEM_VARIABLE_BROWSER_PREFIX, getGlobalVariableTypes } from "builder_platform_interaction/systemLib";
import { getElementCategory } from "builder_platform_interaction/elementConfig";
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { getDataType } from "builder_platform_interaction/ruleLib";
import { isComplexType } from "builder_platform_interaction/dataTypeLib";
import systemGlobalVariableCategoryLabel from '@salesforce/label/FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory';

const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;
const APEX_TYPE = FLOW_DATA_TYPE.APEX.value;
const ICON_TYPE = 'utility';
const RIGHT_ICON_NAME = 'utility:chevronright';
const ICON_SIZE = 'xx-small';

export const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card',
    OPTION_INLINE: 'option-inline'
};


/**
 * The subtext of a row varies a bit. This function captures those rules.
 * This will also probably use a label service eventually.
 *
 * @param {String} dataType  datatype of an element
 * @param {String} subtype  object type or apex class of an element, if exists
 * @param {String} label  the label of an element, if exists
 * @returns {String} the subtext to display in a combobox row
 */
function getSubText(dataType, subtype, label) {
    let subText = '';
    if (dataType === SOBJECT_TYPE) {
        subText = subtype;
    } else if (label) {
        subText = label;
    } else if (dataType) {
        subText = getDataTypeLabel(dataType);
    }
    return subText;
}

/**
 * An object that represents one option in the combobox menu dropdown
 * @typedef {Object} MenuItem
 * @property {String} type  the type of menu data display type ex: option-inline
 * @property {String} text  the text that will be displayed by the combobox (can be highlighted)
 * @property {String} subText the subtext that will displayed below the text
 * @property {String} displayText   the value displayed in the input field when this menu item is selected
 * @property {String} iconName  the icon that will be displayed next to the menu item in a dropdown list
 * @property {String} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
 * @property {Object} parent in the case that this is a second level item, this is the parent flow element in combobox shape
 * @property {String} dataType the data type for the menu item. eg: Date, Currency, SObject
 * @property {String} subtype the object type or apex when data type is SObject otherwise null. eg: Account
 */

/**
 * An object that contains a list of menu items with an optional header
 * @typedef {Object} GroupedMenuItems
 * @property {String} label    an optional header/category for the list of items that will be displayed
 * @property {MenuItem[]} items    list of menu items in order that they will be displayed
 */

/**
 * The menu data that will be displayed in a flow combobox, it contains a list of GroupedMenuItems
 * @typedef {GroupedMenuItems[]} MenuData
 */

/**
 * Create one menu item
 * @param {String} type the type of the menu item
 * @param {String} text the text of the menu item
 * @param {String} subText  the subtext of the menu item
 * @param {String} displayText the display text of the menu item
 * @param {String} iconName the icon of the menu item
 * @param {String} value the value of the menu item
 * @param {Object} parent the parent flow element of the second level item in combobox shape
 * @param {String} dataType the data type for the menu item. eg: Date, Currency, SObject
 * @param {String} subtype the object type when data type is SObject otherwise null. eg: Account
 * @returns {MenuItem}  the generated menu item
 */
export const createMenuItem = (type, text, subText, displayText, iconName, value, parent, dataType, subtype) => {
    return {
        type,
        text,
        subText,
        displayText,
        iconName,
        iconSize: ICON_SIZE,
        value,
        parent,
        dataType,
        subtype
    };
};

/**
 * Determines whether to show the dataType as the subtext or not
 *
 * @param {Object} [parent] Parent object if field is a second level item
 * @return {boolean} True if dataType should be the subtext
 */
const shouldShowDataTypeAsSubText = (parent) => (
    parent && (parent.dataType === FLOW_DATA_TYPE.APEX.value || parent.text === SYSTEM_VARIABLE_PREFIX
        || parent.text === SYSTEM_VARIABLE_BROWSER_PREFIX)
);

/**
 * Makes copy of server data fields of parent objects(SObjects, Global/System Variables) with fields as needed by combobox
 *
 * @param {Object} field Field to be copied
 * @param {Object} [parent] Parent object if field is a second level item
 * @param {boolean} showAsFieldReference true to show the display text as field reference on record variable, otherwise show the field's apiName
 * @param {boolean} showSubText true to show the sub text
 * @returns {MenuItem} Representation of flow element in shape combobox needs
 */
export function mutateFieldToComboboxShape(field, parent, showAsFieldReference, showSubText) {
    const formattedField = {
        iconSize: ICON_SIZE
    };
    if (parent && showAsFieldReference) {
        formattedField.parent = parent;
    }

    // support for parameter items being converted to field shape
    const apiName = field.apiName || field.qualifiedApiName;
    const label = field.label || apiName;
    const subText = shouldShowDataTypeAsSubText(parent) ? field.dataType : label;

    formattedField.text = apiName;
    formattedField.subText = (showSubText) ? subText : '';
    formattedField.value = (parent) ? (parent.value + '.' + apiName) : apiName;
    formattedField.displayText = (showAsFieldReference && parent && parent.displayText) ?
        (parent.displayText.substring(0, parent.displayText.length - 1) + '.' + apiName + '}') : apiName;
    formattedField.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    formattedField.iconName = getDataTypeIcons(field.dataType, ICON_TYPE);

    return formattedField;
}

/**
 * Makes copy of a Flow Element with fields as needed by combobox
 *
 * @param {Object} resource   element from flow
 * @returns {Object}         representation of flow element in shape combobox needs
 */
export function mutateFlowResourceToComboboxShape(resource) {
    const newElement = {
        iconSize: ICON_SIZE
    };
    const isNonElement = isGlobalConstantOrSystemVariableId(resource.guid);
    const resourceLabel = resource.type ? resource.type.label : resource.label;
    const resourceIcon = resource.type ? resource.type.icon : resource.iconName;
    const resourceDataType = getDataType(resource);
    const elementCategory = getElementCategory(resource.elementType, resourceDataType, resource.isCollection);

    newElement.text = resource.name;
    newElement.subText = isNonElement ? resource.description : getSubText(resourceDataType, resource.subtype, resourceLabel);
    newElement.value = resource.guid;
    newElement.displayText = addCurlyBraces(resource.name);
    newElement.hasNext = isComplexType(resourceDataType) && !resource.isCollection;
    newElement.category = resource.category || (elementCategory && elementCategory.toUpperCase());
    newElement.iconName = resourceIcon || getDataTypeIcons(resourceDataType, ICON_TYPE);
    newElement.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    newElement.dataType = resourceDataType;
    newElement.subtype = resource.subtype || null;
    if (newElement.hasNext) {
        newElement.rightIconName = RIGHT_ICON_NAME;
        newElement.rightIconSize = ICON_SIZE;
    }
    return newElement;
}

/**
 * Creates a new array of combobx menu data from an existing array of entities taken from the service
 * @param {Array} entities the array of entities that you want to mutate into comboobx shape
 * @returns {MenuData} combobox menu data for the given entities
 */
export const mutateEntitiesToComboboxShape = (entities) => {
    return entities.map(entity => {
        return createMenuItem(
            COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            entity.entityLabel || entity.apiName,
            entity.apiName,
            entity.entityLabel || entity.apiName,
            undefined,
            entity.apiName,
            undefined,
            SOBJECT_TYPE,
            entity.apiName,
        );
    });
};

export const mutateApexClassesToComboboxShape = (classes) => {
    return classes.map(clazz => {
        return createMenuItem(
            COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            clazz.durableId,
            undefined,
            clazz.durableId,
            undefined,
            clazz.durableId,
            undefined,
            APEX_TYPE,
            clazz.durableId,
        );
    });
};

/**
 * Mutates one picklist value into a combobox menu item
 * @param {Object} picklistOption object that is a picklist value
 * @returns {MenuItem} menu item representing the picklist value
 */
export const mutatePicklistValue = (picklistOption) => {
    return createMenuItem(
        COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        picklistOption.label || picklistOption.value,
        FLOW_DATA_TYPE.STRING.label,
        picklistOption.value,
        getDataTypeIcons(FLOW_DATA_TYPE.STRING.value, ICON_TYPE),
        // This is to insure uniqueness among picklist values
        (picklistOption.label) ? (picklistOption.value + '-' + picklistOption.label) : picklistOption.value,
    );
};

/**
 * Creates a new array of combobx menu data from an existing array of event types taken from the service
 * @param {Array} eventTypes the array of event types that you want to mutate into comboobx shape
 * @returns {MenuData} combobox menu data for the given event types
 */
export const mutateEventTypesToComboboxShape = (eventTypes) => {
    return eventTypes.map(eventType => {
        return createMenuItem(
            COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
            eventType.label || eventType.qualifiedApiName,
            eventType.qualifiedApiName,
            eventType.label || eventType.qualifiedApiName,
            undefined,
            eventType.qualifiedApiName,
            undefined,
            SOBJECT_TYPE,
            eventType.qualifiedApiName,
        );
    });
};

const mutateSystemAndGlobalVariablesToComboboxShape = (value) => {
    return {
        value,
        subtype: value,
        text: value,
        displayText: addCurlyBraces(value),
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        hasNext: true,
        iconName: ICON_TYPE + ':system_and_global_variable',
        iconSize: ICON_SIZE,
        rightIconName: RIGHT_ICON_NAME,
        rightIconSize: ICON_SIZE,
    };
};

/**
 * Gets menu data global variable types.
 *
 * @return {MenuDataItem[]} menu data for global variables
 */
export const getGlobalVariableTypeComboboxItems = () => {
    const globalVariableTypes = getGlobalVariableTypes();
    const typeMenuData = [];

    Object.keys(globalVariableTypes).forEach((type) => {
        const globalVariable = globalVariableTypes[type];
        typeMenuData.push(mutateSystemAndGlobalVariablesToComboboxShape(globalVariable.name));
    });

    return typeMenuData;
};

/**
 * The combobox item representing the System Variable ($Flow) category.
 *
 * @return {MenuDataItem[]} menu data for $Flow
 */
export const getFlowSystemVariableComboboxItem = () => {
    return mutateSystemAndGlobalVariablesToComboboxShape(SYSTEM_VARIABLE_PREFIX);
};

/**
 * The combobox item representing the System Variable ($Browser) category.
 *
 * @return {MenuDataItem[]} menu data for $Browser
 */
export const getFlowSystemBrowserVariableComboboxItem = () => {
    return mutateSystemAndGlobalVariablesToComboboxShape(SYSTEM_VARIABLE_BROWSER_PREFIX);
};

/**
 * Menu data for system and/or global variables.
 *
 * @param {Boolean} showSystemVariables   should include the system variable category
 * @param {Boolean} showGlobalVariables   should include the global variable categories
 * @return {MenuData} menu data showing system variables and/or global variables
 */
export const getSystemAndGlobalVariableMenuData = (showSystemVariables, showGlobalVariables) => {
    const categories = [];
    if (showSystemVariables) {
        categories.push(getFlowSystemVariableComboboxItem());
        categories.push(getFlowSystemBrowserVariableComboboxItem());
    }
    if (showGlobalVariables) {
        categories.push(...getGlobalVariableTypeComboboxItems());
    }
    categories.sort((a, b) => {
        return a.displayText - b.displayText;
    });
    const globalVariableCategory = {
        label: systemGlobalVariableCategoryLabel,
        items: categories,
    };

    return globalVariableCategory;
};
