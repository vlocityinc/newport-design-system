import { isMatch, elementToParam } from "builder_platform_interaction-rule-lib";
import { writableElementsSelector, readableElementsSelector } from "builder_platform_interaction-selectors";
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { Store } from 'builder_platform_interaction-store-lib';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import * as sobjectLib from 'builder_platform_interaction-sobject-lib';
import newResourceLabel from '@label/FlowBuilderExpressionUtils.newResourceLabel';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

// TODO: deal with loading non-flow data for comboboxes W-4664833

const SObjectType = FLOW_DATA_TYPE.SOBJECT.value;

const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card',
    OPTION_INLINE: 'option-inline'
};

const RESOURCE_PICKER_MODE = {
    FEROV_MODE: 'ferov',
    ENTITY_MODE: 'entity',
};

/**
 * An object that represents one option in the combobox menu dropdown
 * @typedef {Object} MenuItem
 * @property {String} type  the type of menu data display type ex: option-inline
 * @property {String} text  the text that will be displayed by the combobox (can be highlighted)
 * @property {String} subtext the subtext that will displayed below the text
 * @property {String} displayText   the value displayed in the input field when this menu item is selected
 * @property {String} iconName  the icon that will be displayed next to the menu item in a dropdown list
 * @property {String} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
 * @property {Object} parent in the case that this is a second level item, this is the parent flow element in combobox shape
 */

/**
 * Create one menu item
 * @param {String} type the type of the menu item
 * @param {String} text the text of the menu item
 * @param {String} subtext  the subtext of the menu item
 * @param {String} displayText the display text of the menu item
 * @param {String} iconName the icon of the menu item
 * @param {String} value the value of the menu item
 * @param {Object} parent the parent flow element of the second level item in combobox shape
 * @returns {MenuItem}  the generated menu item
 */
const createMenuItem = (type, text, subtext, displayText, iconName, value, parent) => {
    return {
        type,
        text,
        subtext,
        displayText,
        iconName,
        value,
        parent,
    };
};

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
 * Determines category for display. Eventually will use the label service
 *
 * @param {String} elementType the element type of an element
 * @param {String} dataType the datatype of an element
 * @param {Boolean} isCollection whether or not that element is a collection
 * @returns {String} the full category label for this element
 */
function getCategory(elementType, dataType, isCollection) {
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
 * Eventually the elements need to be sorted alphabetically by category, as well as
 * alphabetically by devName within category. This method does that but backwards,
 * because the function that calls this needs them in backwards order.
 *
 * @param {Object} elemA an element to be compared
 * @param {Object} elemB an element to be compared
 * @returns {Boolean} true if elemA should be before elemB in a sorted list, false otherwise
 */
function compareElementsByCategoryThenDevName(elemA, elemB) {
    return elemA.category === elemB.category ? elemA.text < elemB.text : elemA.category < elemB.category;
}

/**
 * Reducer to build array of data that combobox needs.
 * Elements get passed in here one by one in reverse display order.
 *
 * @param {Object} menuData     An array of objects. Each object has a 'label' field, which contains the category for a
 *                              group of elements, and an items field, which is an array of elements for that category, in display order.
 * @param {Object} element      The next element to be added into the menudata.
 * @returns {Array}             An array of objects. Each object has a 'label' field, which contains the category for a
 *                              group of elements, and an items field, which is an array of elements for that category, in display order.
 */
function sortIntoCategories(menuData, element) {
    // If this element has a different category than it's predecesor, it's the start of a new category
    if (!(menuData[0] && menuData[0].label === element.category)) {
        // Create the new category object, with label
        const newCategory = {
            // TODO: use proper labels W-4813532
            label: element.category,
            items: []
        };
        // Add this category onto the front of the menu data.
        menuData.unshift(newCategory);
    }
    // The element doesn't need it's category anymore, so we remove the field.
    delete element.category;
    // Add this element to the front of the most recent category.
    menuData[0].items.unshift(element);

    return menuData;
}

function elementMatchesRule(allowedParamTypes, element) {
    for (let i = 0; i < allowedParamTypes.length; i++) {
        if (isMatch(allowedParamTypes[i], element)) {
            return true;
        }
    }
    return false;
}

/**
 * Creates a new array of combobx menu data from an existing array of entities taken from the service
 * @param {Array} entities the array of entities that you want to mutate into comboobx shape
 * @returns {MenuData} combobox menu data for the given entities
 */
const mutateEntitiesToComboboxShape = (entities) => {
    return entities.map(entity => {
        return createMenuItem(
            COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE,
            entity.entityLabel,
            undefined,
            entity.entityLabel,
            undefined,
            entity.apiName,
        );
    });
};

export { RESOURCE_PICKER_MODE };

/**
 * Takes in a map of allowed rules and an element, and determines if that element is allowed by those param specifications
 *
 * @param {operator-rule-util/allowedParamMap} allowedParamTypes        map from dataTypes/elementTypes to rule params which specificy those data or element types
 * @param {Object} element                  object with the necessary specifications to be compared to rule params (usually flow element, but a "fake" one can be built for fields, etc)
 * @param {boolean} allowSObjectForFields   true if sObject's should be included, as a way for users to get to sObject fields
 * @returns {boolean}                       whether this element matches one or more of the specified rule params
 */
export function isElementAllowed(allowedParamTypes, element, allowSObjectForFields) {
    return !allowedParamTypes || (allowedParamTypes.hasOwnProperty(element.dataType) && elementMatchesRule(allowedParamTypes[element.dataType], element))
        || (allowedParamTypes.hasOwnProperty(element.elementType) && elementMatchesRule(allowedParamTypes[element.elementType], element))
        || (allowedParamTypes.hasOwnProperty(element.objectType) && elementMatchesRule(allowedParamTypes[element.objectType], element))
        || (allowSObjectForFields && element.dataType === SObjectType);
}

export const COMBOBOX_NEW_RESOURCE_VALUE = '%%NewResource%%';

/**
 * Returns new resource menu item
 * @returns {Object} menu data group object with only new resource as item
 */
function getNewResourceItem() {
    return {
        text : newResourceLabel,
        type : COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE,
        value : COMBOBOX_NEW_RESOURCE_VALUE,
        iconName : 'utility:add'
    };
}

/**
 * If a guid contains more than one level, separates it out to two parts
 * @param {String} potentialGuid The guid to sanitize. This can be the value in the case of literals.
 * @returns {Object} The complex object containing the guid and the field name. Returns an empty object in the literals case.
 */
export const sanitizeGuid = (potentialGuid) => {
    const complexGuid = {};
    if (typeof potentialGuid === 'string') {
        const periodIndex = potentialGuid.indexOf('.');
        if (periodIndex !== -1) {
            complexGuid.guid = potentialGuid.substring(0, periodIndex);
            complexGuid.fieldName = potentialGuid.substring(periodIndex + 1);
        } else {
            complexGuid.guid = potentialGuid;
        }
    }
    return complexGuid;
};

/**
 * Returns the combobox display value based on the unique identifier passed
 * to the RHS.
 *
 * @param {String} rhsIdentifier    used to identify RHS, could be GUID or literal
 * @param {Function} callback       The callback
 * @returns {String}                combobox display value
 */
export const normalizeRHS = (rhsIdentifier, callback) => {
    const rhs = {};
    const complexGuid = sanitizeGuid(rhsIdentifier);
    const flowElement = getElementByGuid(complexGuid.guid);
    if (flowElement && complexGuid.fieldName) {
        // TODO: W-4960448: the field will appear empty briefly when fetching the first time
        sobjectLib.getFieldsForEntity(flowElement.objectType, (fields) => {
            rhs.itemOrDisplayText = mutateFieldToComboboxShape(fields[complexGuid.fieldName], mutateFlowElementToComboboxShape(flowElement), true, true);
        });
        callback(rhsIdentifier);
    } else if (flowElement) {
        rhs.itemOrDisplayText = mutateFlowElementToComboboxShape(flowElement);
    } else {
        rhs.itemOrDisplayText = rhsIdentifier;
    }
    return rhs;
};

/**
 * The shape an expression builder needs to operator on any LHS.
 * @typedef {Object} normalizedLHS
 * @param {MenuItem} item     what the combobox needs to display this lhs
 * @param {rules/param} param       the param representation of this lhs object/element
 */

/**
 * This function handles any identifier that may be passed to the LHS,
 * such as GUIDs for flow elements, and returns what the
 * the expression builder will need to use to work with that LHS.
 *
 * @param {String} lhsIdentifier    Used to identify the LHS (e.g. GUID for flow elements)
 * @param {String} elementType      in case lhsIdentifier.guid is not the flow element, we need this to pass in elementToParam
 * @param {Function} callback       The value returned by this function. Only used in the callback
 * @returns {normalizedLHS}         {item, parameter}, lhsValue is the item to pass to the combobox, lhsParameter is needed for the rules service
 */
export const normalizeLHS = (lhsIdentifier, elementType, callback) => {
    const lhs = {};
    const complexGuid = sanitizeGuid(lhsIdentifier);
    const flowElement = getElementByGuid(complexGuid.guid);
    if (complexGuid.fieldName) {
        // TODO: W-4960448: the field will appear empty briefly when fetching the first time
        const sobject = (flowElement) ? flowElement.objectType : complexGuid.guid;
        sobjectLib.getFieldsForEntity(sobject, (fields) => {
            const field = fields[complexGuid.fieldName];
            if (flowElement) {
                lhs.item = mutateFieldToComboboxShape(field, mutateFlowElementToComboboxShape(flowElement), true, true);
                field.elementType = flowElement.elementType;
            } else {
                // in case lhsIdentifier = sobjectApiName.fieldApiName
                lhs.item = mutateFieldToComboboxShape(field, {value: field.sobjectName}, false, false);
                field.elementType = elementType;
            }
            // Can an SObject field be a collection?
            field.isCollection = false;
            lhs.parameter = elementToParam(field);
            callback(lhsIdentifier);
        });
    } else if (flowElement) {
        lhs.item = mutateFlowElementToComboboxShape(flowElement);
        lhs.parameter = elementToParam(flowElement);
    } else if (lhsIdentifier) {
        lhs.item = {};
        lhs.item.value = lhsIdentifier;
    }
    return lhs;
};

/**
 * This method returns the selector that should be used to find elements for the menuData
 * @param {Object} elementType              the element type this expression builder lives in
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @returns {function}                  retrieves elements from store
 */
function getSelector({elementType, shouldBeWritable}) {
    switch (elementType) {
        case ELEMENT_TYPE.ACTION_CALL:
        case ELEMENT_TYPE.APEX_CALL:
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.ASSIGNMENT:
        case ELEMENT_TYPE.LOOP:
        case ELEMENT_TYPE.EMAIL_ALERT:
        case ELEMENT_TYPE.SUBFLOW:
        case ELEMENT_TYPE.LOCAL_ACTION_CALL:
        case ELEMENT_TYPE.VARIABLE:
        case ELEMENT_TYPE.RECORD_LOOKUP:
            return shouldBeWritable ? writableElementsSelector : readableElementsSelector;
        case ELEMENT_TYPE.DECISION:
            return readableElementsSelector;
        default:
            return undefined;
    }
}

/**
 * Gets list of elements to display in combobox, in shape combobox expects
 *
 * @param {Object} elementConfig        {element, shouldBeWritable} element is the element type this expression builder is inside, shouldBeWritable is so property editors can specify the data they need
 * @param {operator-rule-util/allowedParamMap} allowedParamTypes    if present, is used to determine if each element is valid for this menuData
 * @param {boolean} includeNewResource  if true, include new resource as first menu item
 * @param {boolean} allowSObjectForFields   true if sObjects should be included, to allow users to access sObject fields
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function getElementsForMenuData(elementConfig, allowedParamTypes, includeNewResource, allowSObjectForFields) {
    const state = Store.getStore().getCurrentState();

    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    // TODO: if this function ever deals with server calls, we need to memoize it, because it gets called everytime the component rerenders
    const menuData = getSelector(elementConfig)(state)
        .filter(element => isElementAllowed(allowedParamTypes, element, allowSObjectForFields))
        .map(element => {
            return mutateFlowElementToComboboxShape(element);
        })
        .sort(compareElementsByCategoryThenDevName).reduce(sortIntoCategories, []);

    // TODO add Global/System Variables here as well

    if (includeNewResource) {
        menuData.unshift(getNewResourceItem());
    }
    return menuData;
}

/**
 * Retrieves combobox menu data for the given entity type
 * @param {String} entityType   The entity type that we want in our menu data (ex: queryable, updatable etc)
 * @returns {MenuData}             Combobox menu data with our entities
 */
export const getEntitiesMenuData = (entityType) => {
    let entities;
    switch (entityType) {
        case sobjectLib.ENTITY_TYPE.QUERYABLE:
            entities = sobjectLib.getQueryableEntities();
            break;
        case sobjectLib.ENTITY_TYPE.CREATABLE:
            entities = sobjectLib.getCreateableEntities();
            break;
        case sobjectLib.ENTITY_TYPE.DELETABLE:
            entities = sobjectLib.getDeletableEntities();
            break;
        case sobjectLib.ENTITY_TYPE.UPDATABLE:
            entities = sobjectLib.getUpdateableEntities();
            break;
        default:
            entities = sobjectLib.getAllEntities();
            break;
    }
    return mutateEntitiesToComboboxShape(entities);
};

/**
 * Filters list of fields based on allowed types and returns them in combobox-friendly shape
 * @param {Object} chosenElement The parent chosen element
 * @param {Object} allowedParamTypes  If present, is used to determine if each element is valid for this menuData
 * @param {Array} fields Array of the fields to be filtered
 * @param {boolean} showAsFieldReference show display text as field reference
 * @param {boolean} showSubText show sub text
 * @returns {Array} array of alphabetized objects
 */
export function filterFieldsForChosenElement(chosenElement, allowedParamTypes, fields, showAsFieldReference, showSubText) {
    return Object.values(fields).filter((element) => isElementAllowed(allowedParamTypes, element)).map((element) => {
        return mutateFieldToComboboxShape(element, chosenElement, showAsFieldReference, showSubText);
    });
}

/**
 * Makes copy of a Flow Element with fields as needed by combobox
 *
 * @param {Object} element   element from flow
 * @returns {Object}         representation of flow element in shape combobox needs
 */
function mutateFlowElementToComboboxShape(element) {
    const newElement = {};

    newElement.text = element.name;
    newElement.subText = getSubText(element.dataType, element.objectType, element.label);
    newElement.value = element.guid;
    newElement.displayText = '{!' + element.name + '}';
    newElement.hasNext = element.dataType === SObjectType && !element.isCollection;
    // TODO: remove upper case-ing once we're using labels for categories W-4813532
    newElement.category = getCategory(element.elementType, element.dataType, element.isCollection).toUpperCase();
    // TODO: fetch icon
    newElement.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    return newElement;
}

/**
 * Makes copy of server data fields of parent objects(SObjects, Globa/System Variables) with fields as needed by combobox
 *
 * @param {Object} field Field to be copied
 * @param {Object} parent Parent object
 * @param {boolean} showAsFieldReference true to show the display text as field reference, otherwise show the field's apiName
 * @param {boolean} showSubText true to show the sub text
 * @returns {Object} Representation of flow element in shape combobox needs
 */
function mutateFieldToComboboxShape(field, parent, showAsFieldReference, showSubText) {
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
 * Comboboxes return only the devName of the selected element,
 * this finds the corresponding element.
 *
 * @param {Object} elements    all elements in the flow
 * @param {String} devName     the element's devName
 * @returns {Object}  the element with the provided devName
 */
export function getElementByDevName(elements = {}, devName) {
    return Object.values(elements).find((element) => {
        return element.name === devName;
    });
}