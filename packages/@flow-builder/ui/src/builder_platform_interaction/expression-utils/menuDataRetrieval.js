import {isMatch} from "builder_platform_interaction-rule-lib";
import {writableElementsSelector, readableElementsSelector} from "builder_platform_interaction-selectors";
import {ELEMENT_TYPE} from 'builder_platform_interaction-element-config';

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

function isElementAllowed(allowedParamTypes, element) {
    return !allowedParamTypes || (allowedParamTypes.hasOwnProperty(element.dataType) && elementMatchesRule(allowedParamTypes[element.dataType], element))
        || (allowedParamTypes.hasOwnProperty(element.elementType) && elementMatchesRule(allowedParamTypes[element.elementType], element))
        || (allowedParamTypes.hasOwnProperty(element.objectType) && elementMatchesRule(allowedParamTypes[element.objectType], element));
}

export const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card',
    OPTION_INLINE: 'option-inline'
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
 * @param {Object} state                the current state of the store
 * @param {Object} elementConfig        {element, shouldBeWritable} element is the element type this expression builder is inside, shouldBeWritable is so property editors can specify the data they need
 * @param {Object} allowedParamTypes    if present, is used to determine if each element is valid for this menuData
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function getElementsForMenuData(state, elementConfig, allowedParamTypes) {
    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    return getSelector(elementConfig)(state)
        .filter(element => isElementAllowed(allowedParamTypes, element))
        .map(element => {
            return mutateFieldsToComboboxShape(element);
        })
        .sort(compareElementsByCategoryThenDevName).reduce(sortIntoCategories, []);
}

/**
 * makes copy of element, with fields as needed by combobox
 *
 * @param {Object} element   element from flow
 * @returns {Object}         representation of flow element in shape combobox needs
 */
function mutateFieldsToComboboxShape(element) {
    const newElement = {};

    newElement.text = element.name;
    newElement.value = element.name;
    newElement.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    // TODO: remove upper case-ing once we're using labels for categories W-4813532
    newElement.category = getCategory(element.elementType, element.dataType, element.isCollection).toUpperCase();
    newElement.subText = getSubText(element.dataType, element.objectType, element.label);
    newElement.id = element.guid;
    // TODO: fetch icon
    return newElement;
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
