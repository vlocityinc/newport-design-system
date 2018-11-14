import { isMatch, PARAM_PROPERTY, OBJECT_TYPE, getDataType } from "builder_platform_interaction/ruleLib";
import {
    writableElementsSelector,
    readableElementsSelector,
    collectionElementsSelector,
    byTypeWritableElementsSelector,
    sObjectOrSObjectCollectionByEntitySelector,
    choiceSelector,
} from "builder_platform_interaction/selectors";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { Store } from "builder_platform_interaction/storeLib";
import * as sobjectLib from "builder_platform_interaction/sobjectLib";
import { FLOW_DATA_TYPE, getResourceTypes } from "builder_platform_interaction/dataTypeLib";
import {
    mutateFieldToComboboxShape,
    mutateFlowResourceToComboboxShape,
    mutateEntitiesToComboboxShape,
    mutatePicklistValue,
    mutateEventTypesToComboboxShape,
    getSystemAndGlobalVariableMenuData,
    COMBOBOX_ITEM_DISPLAY_TYPE,
} from './menuDataGenerator';
import newResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel';
import { GLOBAL_CONSTANT_OBJECTS, getSystemVariables, SYSTEM_VARIABLE_PREFIX, getProcessTypes, getGlobalVariables } from "builder_platform_interaction/systemLib";

const { SOBJECT_FIELD_REQUIREMENT, SYSTEM_VARIABLE_REQUIREMENT } = PARAM_PROPERTY;

const SObjectType = FLOW_DATA_TYPE.SOBJECT.value;

const isPicklistFieldAllowed = (allowedTypes) => {
    // we need a param to represent picklist values so we can check if they are allowed based on the given param types
    const picklistParam = {
        dataType: FLOW_DATA_TYPE.STRING.value,
        isCollection: false,
    };
    return isElementAllowed(allowedTypes, picklistParam);
};

export const RESOURCE_PICKER_MODE = {
    FEROV_MODE: 'ferov',
    ENTITY_MODE: 'entity',
};

/**
 * Cache of event types mutated to shape the combobox expects.
 * Event types data does not change. This helps to not create new combobox menu data for every get event types.
 */
let _eventTypesCache;

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
 * @param {boolean} showSObjectsForFields   true if fields are allowed here - sobjects should be shown so that users can drill down to fields
 * @returns {boolean}                       whether this element matches one or more of the specified rule params
 */
export function isElementAllowed(allowedParamTypes, element, showSObjectsForFields = false) {
    const isElementMatchForProperty = (property) => {
        return (allowedParamTypes.hasOwnProperty(property) && elementMatchesRule(allowedParamTypes[property], element));
    };

    return !allowedParamTypes
        || isElementMatchForProperty(getDataType(element))
        || isElementMatchForProperty(element[PARAM_PROPERTY.ELEMENT_TYPE])
        || isElementMatchForProperty(element[OBJECT_TYPE])
        || (showSObjectsForFields && element.dataType === SObjectType && !element.isCollection);
}

export const COMBOBOX_NEW_RESOURCE_VALUE = '%%NewResource%%';

/**
 * Returns new resource menu item
 * @returns {Object} menu data group object with only new resource as item
 */
function getNewResourceItem() {
    return {
        displayText: newResourceLabel,
        text : newResourceLabel,
        type : COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE,
        value : COMBOBOX_NEW_RESOURCE_VALUE,
        iconName : 'utility:add'
    };
}

/**
 * @typedef filterInformation
 * @property selector    the selector that can be used to get items for this filter from the store
 * @property isWritable  whether or not everything allowed by this filter must be writable
 */

// TODO: all of this regarding filtering & selectors will be revisited with W-5462144

/**
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @returns filterInformation
 */
function writableOrReadableElement(shouldBeWritable) {
    return {
        selector: shouldBeWritable ? writableElementsSelector : readableElementsSelector,
        isWritable: shouldBeWritable,
    };
}

/**
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @param {Object} elementType          the element type this expression builder lives in
 * @param {Boolean} isCollection        true if using selector to retrieve collection variables
 * @param {String} dataType             data type for menu data items
 * @param {String} entityName           optional: name of the sobject, used to retrieve a list of sobject/sobject collection variables. If it's empty or null, retrieve all the sobject/sobject collection variables.
 * @param {Boolean} sObjectSelector     optional: true if using selector to retrieve sobject/sobject collection variables
 * @returns filterInformation
 */
function queryableElements(shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector) {
    const selector = sObjectSelector ? sObjectOrSObjectCollectionByEntitySelector({isCollection, entityName, queryable:true})
        : shouldBeWritable ? writableElementsSelector : readableElementsSelector;
    return {
        selector,
        isWritable: !sObjectSelector && shouldBeWritable,
    };
}

/**
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @param {Object} elementType          the element type this expression builder lives in
 * @param {Boolean} isCollection        true if using selector to retrieve collection variables
 * @param {String} dataType             data type for menu data items
 * @param {String} entityName           optional: name of the sobject, used to retrieve a list of sobject/sobject collection variables. If it's empty or null, retrieve all the sobject/sobject collection variables.
 * @param {Boolean} sObjectSelector     optional: true if using selector to retrieve sobject/sobject collection variables
 * @returns filterInformation
 */
function createableElements(shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector) {
    const selector = sObjectSelector ? sObjectOrSObjectCollectionByEntitySelector({isCollection, entityName, createable:true})
        : shouldBeWritable ? writableElementsSelector : readableElementsSelector;
    return {
        selector,
        isWritable: !sObjectSelector && shouldBeWritable,
    };
}

/**
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @param {Object} elementType          the element type this expression builder lives in
 * @param {Boolean} isCollection        true if using selector to retrieve collection variables
 * @param {String} dataType             data type for menu data items
 * @param {String} entityName           optional: name of the sobject, used to retrieve a list of sobject/sobject collection variables. If it's empty or null, retrieve all the sobject/sobject collection variables.
 * @param {Boolean} sObjectSelector     optional: true if using selector to retrieve sobject/sobject collection variables
 * @returns filterInformation
 */
function sObjectOrByTypeElements(shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector) {
    return {
        selector: isCollection ? collectionElementsSelector : (sObjectSelector ? sObjectOrSObjectCollectionByEntitySelector({entityName}) : byTypeWritableElementsSelector(dataType)),
    };
}

function sObjectScalarsOrCollections(config) {
    return {
        selector: sObjectOrSObjectCollectionByEntitySelector(config),
    };
}

/**
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @param {String} dataType             data type for menu data items
 * @param {Boolean} choices             optional: should this menu data only contain choices
 * @returns filterInformation
 */
function screenSelectors(shouldBeWritable, choices, dataType) {
    if (shouldBeWritable) {
        return {
            selector: writableElementsSelector
        };
    }

    return {
        selector: choices ? choiceSelector(dataType) : readableElementsSelector,
    };
}

const filterInformationProviderMap = {
    [ELEMENT_TYPE.ACTION_CALL]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.APEX_CALL]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.ASSIGNMENT]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.EMAIL_ALERT]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.SUBFLOW]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.VARIABLE]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.CHOICE]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: (shouldBeWritable) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.DECISION]: () => writableOrReadableElement(),
    [ELEMENT_TYPE.WAIT]: () => writableOrReadableElement(),
    [ELEMENT_TYPE.SCREEN]: (shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector, choices) => screenSelectors(shouldBeWritable, choices, dataType),
    [ELEMENT_TYPE.RECORD_CREATE]: (shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector) => createableElements(shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector),
    [ELEMENT_TYPE.RECORD_UPDATE]: () => sObjectScalarsOrCollections({allSObjectsAndSObjectCollections: true, updateable: true}),
    [ELEMENT_TYPE.RECORD_DELETE]: () => sObjectScalarsOrCollections({allSObjectsAndSObjectCollections: true, deleteable: true}),
    [ELEMENT_TYPE.RECORD_LOOKUP]: (shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector) => queryableElements(shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector),
    [ELEMENT_TYPE.LOOP]: (shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector) => sObjectOrByTypeElements(shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector),
};

/**
 * @param {Object} elementType          the element type this expression builder lives in
 * @param {Boolean} shouldBeWritable    if this is set, only writable elements will be returned
 * @param {Boolean} isCollection        true if using selector to retrieve collection variables
 * @param {String} dataType             data type for menu data items
 * @param {String} entityName           optional: name of the sobject, used to retrieve a list of sobject/sobject collection variables. If it's empty or null, retrieve all the sobject/sobject collection variables.
 * @param {Boolean} sObjectSelector     optional: true if using selector to retrieve sobject/sobject collection variables
 * @param {Boolean} choices             optional: should this menu data only contain choices
 * @returns filterInformation
 */
function getFilterInformation({elementType, shouldBeWritable, isCollection, dataType, entityName, sObjectSelector, choices}) {
    return filterInformationProviderMap[elementType] ? filterInformationProviderMap[elementType](shouldBeWritable, elementType, isCollection, dataType, entityName, sObjectSelector, choices) : {};
}

/**
 * This method returns the selector that should be used to find elements for the menuData
 * @param {Object} storeInstance   reference to the storeInstance
 * @param {Object} config          contains necessary context to return the filterInformation
 * @returns {array}                retrieves elements from store
 */
export function getStoreElements(storeInstance, config) {
    let elements = [];

    const filterInformation = getFilterInformation(config);
    if (filterInformation.selector) {
        elements = filterInformation.selector(storeInstance);
    }

    return elements;
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
        label: picklistLabel,
        items: [],
    };
    picklistGroup.items = picklist.map(mutatePicklistValue);
    return picklistGroup;
};

/**
 * Gets list of elements to display in combobox, in shape combobox expects.
 * Used for one-time menu data retrieval when not subscribed to the store.
 * When processing menu data based on store subscription, use filterAndMutateMenuData.
 *
 * @param {Object} elementConfig        {element, shouldBeWritable} element is the element type this expression builder is inside, shouldBeWritable is so property editors can specify the data they need
 * @param {operator-rule-util/allowedParamMap} allowedParamTypes    if present, is used to determine if each element is valid for this menuData
 * @param {boolean} includeNewResource  if true, include new resource as first menu item
 * @param {boolean} allowGlobalConstants             true if global constants should be allowed
 * @param {boolean} disableHasNext if true, then all menu items will have hasNext set to false regardless of the real value
 * @param {Array}   activePicklistValues the picklist values that will be appended to the menu data if picklist values are allowed
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function getElementsForMenuData(elementConfig, allowedParamTypes, includeNewResource = false,
                                       allowGlobalConstants = false, disableHasNext = false, activePicklistValues = []) {
    const state = Store.getStore().getCurrentState();

    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    const menuDataElements = getStoreElements(state, elementConfig);

    return filterAndMutateMenuData(menuDataElements, allowedParamTypes, includeNewResource, allowGlobalConstants, disableHasNext, activePicklistValues);
}

/**
 * Filter the list of elements, append global constants and mutate elements to shape the combobox expects.
 * Used when subscribed to store. If subscribing to store is not needed use getElementsForMenuData.
 *
 * @param {List} menuDataElements        List of elements from the store that needs to filtered and converted to shape the combobox expects.
 * @param {operator-rule-util/allowedParamMap} allowedParamTypes    if present, is used to determine if each element is valid for this menuData
 * @param {boolean} includeNewResource  if true, include new resource as first menu item
 * @param {boolean} allowGlobalConstants             true if FEROVs are allowed here; certain things are true for all FEROV's e.g. global constants should be allowed, sobjects should be shown so that users can drill down to fields
 * @param {boolean} disableHasNext if true, then all menu items will have hasNext set to false regardless of the real value
 * @param {Array}   activePicklistValues the picklist values that will be appended to the menu data if picklist values are allowed
 * @param {boolean} showSystemVariables   are system variables allowed in this context
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function filterAndMutateMenuData(menuDataElements, allowedParamTypes, includeNewResource = false,
                                        allowGlobalConstants = false, disableHasNext = false, activePicklistValues = [],
                                        showSystemVariables = true, showGlobalVariables = false) {
    if (allowGlobalConstants) {
        // global constants should be included in menuData for FEROVs
        menuDataElements.push(...Object.values(GLOBAL_CONSTANT_OBJECTS));
    }

    // the rules can block sobject fields by setting a flag on allowedParamTypes even if disableHasNext is false
    const sobjectFieldsAllowed = !disableHasNext && (!allowedParamTypes || allowedParamTypes[SOBJECT_FIELD_REQUIREMENT]);

    const menuData = menuDataElements
        .filter(element => isElementAllowed(allowedParamTypes, element, sobjectFieldsAllowed))
        .map(element => {
            const menuItem = mutateFlowResourceToComboboxShape(element);
            if (disableHasNext) {
                menuItem.hasNext = false;
                menuItem.rightIconName = '';
            }
            return menuItem;
        })
        .sort(compareElementsByCategoryThenDevName).reduce(sortIntoCategories, []);

    const systemVariablesAllowed = showSystemVariables && allowedParamTypes && allowedParamTypes[SYSTEM_VARIABLE_REQUIREMENT];
    if (systemVariablesAllowed || showGlobalVariables) {
        menuData.push(getSystemAndGlobalVariableMenuData(systemVariablesAllowed, showGlobalVariables));
    }

    if (activePicklistValues && activePicklistValues.length > 0 && isPicklistFieldAllowed(allowedParamTypes)) {
        // if the picklist is allowed we want to include those in the menu data
        const picklistMenuData = getPicklistMenuData(activePicklistValues);
        menuData.unshift(picklistMenuData);
    }

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

export function getSecondLevelItems(elementConfig, topLevelItemType, callback) {
    const shouldBeWritable = elementConfig && getFilterInformation(elementConfig).isWritable;

    const filterWritable = (items) => {
        const writableItems = {};
        Object.keys(items)
            .filter((key) => {
                return !items[key].readOnly;
            })
            .forEach((key) => {
                writableItems[key] = items[key];
            });
        return writableItems;
    };

    if (topLevelItemType === SYSTEM_VARIABLE_PREFIX) {
        const systemVariables = getSystemVariables();
        callback(shouldBeWritable ? filterWritable(systemVariables) : systemVariables);
    } else if (getGlobalVariables(topLevelItemType)) {
        callback(getGlobalVariables(topLevelItemType));
    } else {
        sobjectLib.getFieldsForEntity(topLevelItemType, callback);
    }
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

/**
 * Get a list of menu data based from the allowed process types returned by the java controller
 * @returns {MenuItem[]} list of menu items representing the allowed process types
 */
export const getProcessTypesMenuData = () => {
    const processTypes = getProcessTypes();
    return processTypes.map(processTypeObject => {
        return {
            value: processTypeObject.name,
            label: processTypeObject.label,
        };
    });
};

/**
 * Retrieves event types combobox menu data
 * @returns {MenuData}             Combobox menu data with our entities
 */
export const getEventTypesMenuData = () => {
    if (!_eventTypesCache) {
        const eventTypes = sobjectLib.getEventTypes();
        _eventTypesCache = mutateEventTypesToComboboxShape(eventTypes);
    }
    return _eventTypesCache;
};