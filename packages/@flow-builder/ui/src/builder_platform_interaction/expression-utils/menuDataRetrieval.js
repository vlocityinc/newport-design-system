import { isMatch, PARAM_PROPERTY, OBJECT_TYPE } from 'builder_platform_interaction-rule-lib';
import {
    writableElementsSelector,
    readableElementsSelector,
    collectionElementsSelector,
    byTypeElementsSelector,
    sObjectOrSObjectCollectionByEntitySelector
} from 'builder_platform_interaction-selectors';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { Store } from 'builder_platform_interaction-store-lib';
import * as sobjectLib from 'builder_platform_interaction-sobject-lib';
import { FLOW_DATA_TYPE, getResourceTypes } from 'builder_platform_interaction-data-type-lib';
import {
    mutateFieldToComboboxShape,
    mutateFlowResourceToComboboxShape,
    mutateEntitiesToComboboxShape,
    mutatePicklistValue,
} from './menuDataGenerator';
import newResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel';
import { GLOBAL_CONSTANT_OBJECTS } from 'builder_platform_interaction-system-lib';

// TODO: deal with loading non-flow data for comboboxes W-4664833

const SObjectType = FLOW_DATA_TYPE.SOBJECT.value;

const isPicklistFieldAllowed = (allowedTypes) => {
    // we need a param to represent picklist values so we can check if they are allowed based on the given param types
    const picklistParam = {
        dataType: FLOW_DATA_TYPE.STRING.value,
        isCollection: false,
    };
    return isElementAllowed(allowedTypes, picklistParam);
};

export const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card',
    OPTION_INLINE: 'option-inline'
};

export const RESOURCE_PICKER_MODE = {
    FEROV_MODE: 'ferov',
    ENTITY_MODE: 'entity',
};

/**
 * Eventually the elements need to be sorted alphabetically by category, as well as
 * alphabetically by devName within category. This method does that but backwards,
 * because the function that calls this needs them in backwards order.
 *
 * @param {Object} elemA an element to be compared
 * @param {Object} elemB an element to be compared
 * @returns {Integer} A negative number if elemA comes after elemB, positive number if elemB comes before elemA
 */
function compareElementsByCategoryThenDevName(elemA, elemB) {
    return elemA.category === elemB.category ?  -elemA.text.localeCompare(elemB.text, undefined, {sensitivity:'base'})
        : -elemA.category.localeCompare(elemB.category, undefined, {sensitivity:'base'});
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
 * Takes in a map of allowed rules and an element, and determines if that element is allowed by those param specifications
 *
 * @param {operator-rule-util/allowedParamMap} allowedParamTypes        map from dataTypes/elementTypes to rule params which specificy those data or element types
 * @param {Object} element                  object with the necessary specifications to be compared to rule params (usually flow element, but a "fake" one can be built for fields, etc)
 * @param {boolean} allowFerovs                 true if FEROVs are allowed here; certain things are true for all FEROV's e.g. sobjects should be shown so that users can drill down to fields
 * @returns {boolean}                       whether this element matches one or more of the specified rule params
 */
export function isElementAllowed(allowedParamTypes, element, allowFerovs = false) {
    const isElementMatchForProperty = (property) => {
        return (allowedParamTypes.hasOwnProperty(element[property]) && elementMatchesRule(allowedParamTypes[element[property]], element));
    };

    return !allowedParamTypes
        || isElementMatchForProperty(PARAM_PROPERTY.DATA_TYPE)
        || isElementMatchForProperty(PARAM_PROPERTY.ELEMENT_TYPE)
        || isElementMatchForProperty(OBJECT_TYPE)
        || (allowFerovs && element.dataType === SObjectType && !element.isCollection);
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
 * This method returns the selector that should be used to find elements for the menuData
 * @param {Object} elementType              the element type this expression builder lives in
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @param {Boolean} isCollection    true if using selector to retrieve collection variables
 * @param {String} dataType    data type to pass in byTypeElementsSelector
 * @param {String} entityName    optional: name of the sobject, used to retrieve a list of sobject/sobject collection variables. If it's empty or null, retrieve all the sobject/sobject collection variables.
 * @param {Boolean} sObjectSelector optional: true if using selector to retrieve sobject/sobject collection variables
 * @returns {function}                  retrieves elements from store
 */
function getSelector({elementType, shouldBeWritable, isCollection, dataType, entityName, sObjectSelector}) {
    switch (elementType) {
        case ELEMENT_TYPE.ACTION_CALL:
        case ELEMENT_TYPE.APEX_CALL:
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.ASSIGNMENT:
        case ELEMENT_TYPE.EMAIL_ALERT:
        case ELEMENT_TYPE.SUBFLOW:
        case ELEMENT_TYPE.LOCAL_ACTION_CALL:
        case ELEMENT_TYPE.VARIABLE:
            return shouldBeWritable ? writableElementsSelector : readableElementsSelector;
        case ELEMENT_TYPE.DECISION:
        case ELEMENT_TYPE.SCREEN:
            return readableElementsSelector;
        case ELEMENT_TYPE.RECORD_CREATE:
            return sObjectOrSObjectCollectionByEntitySelector({isCollection, createable:true});
        case ELEMENT_TYPE.RECORD_UPDATE:
            return sObjectOrSObjectCollectionByEntitySelector({allSObjectsAndSObjectCollections: true, updateable: true});
        case ELEMENT_TYPE.RECORD_DELETE:
            return sObjectOrSObjectCollectionByEntitySelector({allSObjectsAndSObjectCollections: true, deleteable: true});
        case ELEMENT_TYPE.RECORD_LOOKUP:
            return sObjectSelector ? sObjectOrSObjectCollectionByEntitySelector({isCollection, entityName, queryable:true}) : shouldBeWritable ? writableElementsSelector : readableElementsSelector;
        case ELEMENT_TYPE.LOOP:
            return isCollection ? collectionElementsSelector : (sObjectSelector ? sObjectOrSObjectCollectionByEntitySelector({entityName}) : byTypeElementsSelector(dataType));
        default:
            return undefined;
    }
}

/**
 * Gets a GroupedMenuItem from the given picklist values
 * @param {Object[]} picklist list of objects representing picklist values
 * @returns {module:menuDataGenerator.GroupMenuItems} menu data that has picklist values
 */
export const getPicklistMenuData = (picklist) => {
    if (!Array.isArray(picklist)) {
        throw new Error(`Picklist field values must be an array but instead was: ${typeof picklist}`);
    }
    const picklistLabel = 'Picklist Values';
    const picklistGroup = {
        // TODO: use proper labels W-4813532
        label: picklistLabel,
        items: [],
    };
    picklistGroup.items = picklist.map(mutatePicklistValue);
    return picklistGroup;
};

/**
 * Gets list of elements to display in combobox, in shape combobox expects
 *
 * @param {Object} elementConfig        {element, shouldBeWritable} element is the element type this expression builder is inside, shouldBeWritable is so property editors can specify the data they need
 * @param {operator-rule-util/allowedParamMap} allowedParamTypes    if present, is used to determine if each element is valid for this menuData
 * @param {boolean} includeNewResource  if true, include new resource as first menu item
 * @param {boolean} allowFerovs             true if FEROVs are allowed here; certain things are true for all FEROV's e.g. global constants should be allowed, sobjects should be shown so that users can drill down to fields
 * @param {boolean} disableHasNext if true, then all menu items will have hasNext set to false regardless of the real value
 * @param {Array}   activePicklistValues the picklist values that will be appended to the menu data if picklist values are allowed
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function getElementsForMenuData(elementConfig, allowedParamTypes, includeNewResource,
    allowFerovs = false, disableHasNext = false, activePicklistValues = []) {
    const state = Store.getStore().getCurrentState();

    // TODO Remove when we get to W-5164547
    includeNewResource = false;

    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    // TODO: if this function ever deals with server calls, we need to memoize it, because it gets called everytime the component rerenders
    const menuDataElements = getSelector(elementConfig)(state);
    if (allowFerovs) {
        // global constants should be included in menuData for FEROVs
        menuDataElements.push(...Object.values(GLOBAL_CONSTANT_OBJECTS));
    }
    const menuData = menuDataElements.filter(element => isElementAllowed(allowedParamTypes, element, allowFerovs))
        .map(element => {
            const menuItem = mutateFlowResourceToComboboxShape(element);
            if (disableHasNext) {
                menuItem.hasNext = false;
                menuItem.rightIconName = '';
            }
            return menuItem;
        })
        .sort(compareElementsByCategoryThenDevName).reduce(sortIntoCategories, []);

    if (activePicklistValues && activePicklistValues.length > 0 && isPicklistFieldAllowed(allowedParamTypes)) {
        // if the picklist is allowed we want to include those in the menu data
        const picklistMenuData = getPicklistMenuData(activePicklistValues);
        menuData.push(picklistMenuData);
    }
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

/**
 * Get the list of fields of the selected entity. This list should exclude some preselected fields to prevent selection the same field twice.
 * Then transform them to combobox menu data as a list of {type: 'option-inline', text: fieldApiName, displayText: fieldApiName, value: fieldApiName}
 *
 * @param {String} resourceEntityName   resource entity name
 * @param {String[]} excludedFields   the excluded fields
 * @param {function} callback the callback function with menudata
 */
export function getFieldsMenuData(resourceEntityName, excludedFields, callback) {
    sobjectLib.getFieldsForEntity(resourceEntityName, fields => {
        const menuData = [];
        Object.keys(fields).forEach(field => {
            if (!excludedFields.includes(field)) {
                menuData.push(mutateFieldToComboboxShape(fields[field], undefined, false, true));
            }
        });
        callback(menuData);
    });
}

/**
 * Get a list of menu data based from the allowed resource types returned by the java controller
 * @returns {MenuItem[]} list of menu items representing the allowed resource types
 */
export const getResourceTypesMenuData = () => {
    const resourceTypes = getResourceTypes();
    // TODO : include the description prop when TD-0051525 is completed and we can add subtext
    return resourceTypes.map(resourceObject => {
        return {
            value: resourceObject.value,
            label: resourceObject.label,
        };
    });
};