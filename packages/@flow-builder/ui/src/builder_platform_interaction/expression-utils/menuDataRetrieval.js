import {isMatch, elementToParam} from "builder_platform_interaction-rule-lib";
import {writableElementsSelector, readableElementsSelector} from "builder_platform_interaction-selectors";
import {ELEMENT_TYPE} from 'builder_platform_interaction-element-config';
import { Store } from 'builder_platform_interaction-store-lib';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';

// TODO: deal with loading non-flow data for comboboxes W-4664833

/**
 * Determines category for display. Eventually will use the label service
 *
 * @param {String} elementType the element type of an element
 * @param {String} dataType the datatype of an element
 * @param {Boolean} isCollection whether or not that element is a collection
 * @returns {String} the full category label for this element
 */
function getCategory(elementType, dataType, isCollection) {
    return (dataType === 'SObject' ? 'SObject ' : '') +
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
    if (dataType === 'SObject') {
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
 * Takes in a map of allowed rules in the shape
 *     {
 *         [dataType or elementType] : {rule params pertaining to that dataType or elementType}
 *     }
 * and an element, and determines if that element is allowed by those param specifications
 *
 * @param {Object} allowedParamTypes        map from dataTypes/elementTypes to rule params which specificy those data or element types
 * @param {Object} element                  object with the necessary specifications to be compared to rule params (usually flow element, but a "fake" one can be built for fields, etc)
 * @returns {boolean}                       whether this element matches one or more of the specified rule params
 */
export function isElementAllowed(allowedParamTypes, element) {
    return !allowedParamTypes || (allowedParamTypes.hasOwnProperty(element.dataType) && elementMatchesRule(allowedParamTypes[element.dataType], element))
        || (allowedParamTypes.hasOwnProperty(element.elementType) && elementMatchesRule(allowedParamTypes[element.elementType], element))
        || (allowedParamTypes.hasOwnProperty(element.objectType) && elementMatchesRule(allowedParamTypes[element.objectType], element));
}

export const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card',
    OPTION_INLINE: 'option-inline'
};

export const COMBOBOX_NEW_RESOURCE_VALUE = '%%NewResource%%';

/**
 * Returns new resource menu item
 * @returns {Object} menu data group object with only new resource as item
 */
function getNewResourceItem() {
    // TODO: use proper labels W-4813532
    return {
        items: [{
            text : 'New Resource',
            type : COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE,
            value : COMBOBOX_NEW_RESOURCE_VALUE,
            iconName : 'utility:add'
        }]
    };
}

/**
 * Returns the combobox display value based on the unique identifier passed
 * to the RHS.
 *
 * @param {String} rhsIdentifier    used to identify RHS, could be GUID or literal
 * @returns {String}                combobox display value
 */
export const retrieveRHSVal = (rhsIdentifier) => {
    let rhsVal = rhsIdentifier;
    const flowElement = getElementByGuid(rhsIdentifier);
    if (flowElement) {
        rhsVal = '{!' + flowElement.name + '}';
    }
    return rhsVal;
};

/**
 * This function handles any identifier that may be passed to the LHS,
 * such as GUIDs for flow elements, and returns what the
 * the expression builder will need to use to work with that LHS.
 *
 * @param {String} lhsIdentifier      used to identify the LHS (e.g. GUID for flow elements)
 * @returns {Object}                {lhsValue, lhsParameter}, lhsValue is the combobox display value, lhsParameter is needed for the rules service
 */
export const normalizeLHS = (lhsIdentifier) => {
    const lhs = {};
    const flowElement = getElementByGuid(lhsIdentifier);
    if (flowElement) {
        lhs.display = '{!' + flowElement.name + '}';
        lhs.parameter = elementToParam(flowElement);
    } else {
        // TODO handle the case where LHS is not a flow element here
    }
    return lhs;
};

/**
 * This method returns the selector that should be used to find elements for the menuData
 * @param {Object} element              the element type this expression builder lives in
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @returns {function}                  retrieves elements from store
 */
function getSelector({element, shouldBeWritable}) {
    switch (element) {
        case ELEMENT_TYPE.ACTION_CALL:
        case ELEMENT_TYPE.APEX_CALL:
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.ASSIGNMENT:
        case ELEMENT_TYPE.EMAIL_ALERT:
        case ELEMENT_TYPE.SUBFLOW:
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
 * @param {Object} allowedParamTypes    if present, is used to determine if each element is valid for this menuData
 * @param {boolean} includeNewResource  if true, include new resource as first menu item
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function getElementsForMenuData(elementConfig, allowedParamTypes, includeNewResource) {
    const state = Store.getStore().getCurrentState();

    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    // TODO: if this function ever deals with server calls, we need to memoize it, because it gets called everytime the component rerenders
    const menuData = getSelector(elementConfig)(state)
        .filter(element => isElementAllowed(allowedParamTypes, element))
        .map(element => {
            return mutateFlowElementsToComboboxShape(element);
        })
        .sort(compareElementsByCategoryThenDevName).reduce(sortIntoCategories, []);

    // TODO add Global/System Variables here as well

    if (includeNewResource) {
        menuData.unshift(getNewResourceItem());
    }
    return menuData;
}


/**
 * Filters list of fields based on allowed types and returns them in combobox-friendly shape
 * @param {Object} chosenElement The parent chosen element
 * @param {Object} allowedParamTypes  If present, is used to determine if each element is valid for this menuData
 * @param {Array} fields Array of the fields to be filtered
 * @returns {Array} array of alphabetized objects
 */
export function filterFieldsForChosenElement(chosenElement, allowedParamTypes, fields) {
    const items = fields.filter((element) => isElementAllowed(allowedParamTypes, element)).map((element) => {
        return mutateFieldsToComboboxShape(element, chosenElement);
    });
    const objectFieldsMenuData = [{
        items
    }];
    return objectFieldsMenuData;
}

/**
 * Makes copy of a Flow Element with fields as needed by combobox
 *
 * @param {Object} element   element from flow
 * @returns {Object}         representation of flow element in shape combobox needs
 */
function mutateFlowElementsToComboboxShape(element) {
    const newElement = {};

    newElement.text = element.name;
    newElement.value = '{!' + element.name + '}';
    newElement.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    // TODO: remove upper case-ing once we're using labels for categories W-4813532
    newElement.category = getCategory(element.elementType, element.dataType, element.isCollection).toUpperCase();
    newElement.subText = getSubText(element.dataType, element.objectType, element.label);
    newElement.id = element.guid;
    // TODO: fetch icon
    return newElement;
}

/**
 * Makes copy of server data fields of parent objects(SObjects, Globa/System Variables) with fields as needed by combobox
 *
 * @param {Object} field Field to be copied
 * @param {Object} parent Parent object
 * @returns {Object} Representation of flow element in shape combobox needs
 */
function mutateFieldsToComboboxShape(field, parent) {
    const formattedField = {};

    // TODO this shape is temporary
    formattedField.text = field.apiName;
    formattedField.subText = field.label;
    formattedField.value = parent.value + '.' + field.apiName;
    formattedField.displayValue = parent.displayValue.substring(0, parent.displayValue.length - 1) + '.' + field.apiName + '}';
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
