import {
    COMBOBOX_ITEM_DISPLAY_TYPE,
} from './menuDataRetrieval';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { isNonElementResourceId } from 'builder_platform_interaction-system-lib';

const SObjectType = FLOW_DATA_TYPE.SOBJECT.value;
/**
 * Determines category for display. Eventually will use the label service
 *
 * @param {String} elementType the element type of an element
 * @param {String} dataType the datatype of an element
 * @param {Boolean} isCollection whether or not that element is a collection
 * @returns {String} the full category label for this element
 */
function getElementCategory(elementType, dataType, isCollection) {
    return (dataType === SObjectType ? 'SObject ' : '') +
        (isCollection ? 'Collection ' : '') +
        elementType;
}

/**
 * The subtext of a row varies a bit. This function captures those rules.
 * This will also probably use a label service eventually.
 *
 * @param {String} dataType  datatype of an element
 * @param {String} objectType  object type of an element, if exists
 * @param {String} label  the label of an element, if exists
 * @returns {String} the subtext to display in a combobox row
 */
function getSubText(dataType, objectType, label) {
    let subText;
    if (dataType === SObjectType) {
        subText = objectType;
    } else if (label) {
        subText = label;
    } else {
        subText = dataType;
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
 * @property {String} objectType the object type when data type is SObject otherwise null. eg: Account
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
 * @param {String} objectType the object type when data type is SObject otherwise null. eg: Account
 * @returns {MenuItem}  the generated menu item
 */
export const createMenuItem = (type, text, subText, displayText, iconName, value, parent, dataType, objectType) => {
    return {
        type,
        text,
        subText,
        displayText,
        iconName,
        value,
        parent,
        dataType,
        objectType
    };
};

/**
 * Makes copy of server data fields of parent objects(SObjects, Globa/System Variables) with fields as needed by combobox
 *
 * @param {Object} field Field to be copied
 * @param {Object} parent Parent object
 * @param {boolean} showAsFieldReference true to show the display text as field reference, otherwise show the field's apiName
 * @param {boolean} showSubText true to show the sub text
 * @returns {Object} Representation of flow element in shape combobox needs
 */
export function mutateFieldToComboboxShape(field, parent, showAsFieldReference, showSubText) {
    const formattedField = {};

    formattedField.text = field.apiName;
    formattedField.subText = (showSubText) ? field.label : '';
    formattedField.value = parent.value + '.' + field.apiName;
    formattedField.displayText = showAsFieldReference ? (parent.displayText.substring(0, parent.displayText.length - 1) + '.' + field.apiName + '}') : field.apiName;
    formattedField.parent = parent;
    formattedField.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    // TODO: fetch icon

    return formattedField;
}

/**
 * Makes copy of a Flow Element with fields as needed by combobox
 *
 * @param {Object} resource   element from flow
 * @returns {Object}         representation of flow element in shape combobox needs
 */
export function mutateFlowResourceToComboboxShape(resource) {
    const newElement = {};
    const isNonElement = isNonElementResourceId(resource.guid);

    newElement.text = resource.name;
    newElement.subText = isNonElement ? resource.description : getSubText(resource.dataType, resource.objectType, resource.label);
    newElement.value = resource.guid;
    newElement.displayText = '{!' + resource.name + '}';
    newElement.hasNext = resource.dataType === SObjectType && !resource.isCollection;
    // TODO: remove upper case-ing once we're using labels for categories W-4813532
    newElement.category = isNonElement ?
        resource.category : getElementCategory(resource.elementType, resource.dataType, resource.isCollection).toUpperCase();
    // TODO: fetch icon
    newElement.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    newElement.dataType = resource.dataType;
    newElement.objectType = resource.objectType ? resource.objectType : null;

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
            entity.entityLabel,
            entity.apiName,
            entity.entityLabel,
            undefined,
            entity.apiName,
            undefined,
            SObjectType,
            entity.apiName,
        );
    });
};

/**
 * Mutates one picklist value into a combobox menu item
 * @param {Object} picklistValue object that is a picklist value
 * @returns {MenuItem} menu item representing the picklist value
 */
export const mutatePicklistValue = (picklistValue) => {
    return createMenuItem(
        COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD,
        picklistValue.label,
        FLOW_DATA_TYPE.STRING.label,
        picklistValue.label,
        undefined,
        picklistValue.value,
    );
};
