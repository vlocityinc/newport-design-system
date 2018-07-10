import { isMatch, elementToParam } from "builder_platform_interaction-rule-lib";
import {
    writableElementsSelector,
    readableElementsSelector,
    collectionElementsSelector,
    byTypeElementsSelector,
    sObjectOrSObjectCollectionByEntitySelector
} from "builder_platform_interaction-selectors";
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { Store } from 'builder_platform_interaction-store-lib';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import * as sobjectLib from 'builder_platform_interaction-sobject-lib';
import { FLOW_DATA_TYPE, getResourceTypes } from 'builder_platform_interaction-data-type-lib';
import {
    createMenuItem,
    mutateFieldToComboboxShape,
    mutateFlowElementToComboboxShape,
    mutateEntitiesToComboboxShape,
    mutatePicklistValue,
} from './menuDataGenerator';

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

export const getResourceByUniqueIdentifier = (identifier) => {
    let resource = null;
    if (identifier && !identifier.startsWith('$')) {
        resource = getElementByGuid(identifier);
    }
    // TODO: add a case for global constants
    return resource;
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


// TODO Uncomment when we get to W-5164547
// /**
//  * Returns new resource menu item
//  * @returns {Object} menu data group object with only new resource as item
//  */
// function getNewResourceItem() {
//     return {
//         text : newResourceLabel,
//         type : COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE,
//         value : COMBOBOX_NEW_RESOURCE_VALUE,
//         iconName : 'utility:add'
//     };
// }

/**
 * The 5 possible situations are:
 * a) "guid" holds a literal the user entered
 * b) "guid" references a flow element that is NOT an sobject variable, and "fieldName" is empty
 * c) "guid" references an sobject variable, and "fieldName" is empty
 * d) "guid" references an sobject variable, and "fieldName" is a field on that sobject
 * e) "guid" holds an sobject api name, and fieldName is a field on that sobject
 *
 * @typedef {Object} complexGuid
 * @param {String} guid                 a flow element's guid OR a literal
 * @param {String|undefined} fieldName  if the flow element is an sobjectVar this may be a field on that sobject, or undefined
 */

/**
 * If a guid contains more than one level, separates it out to two parts
 * @param {String} potentialGuid The guid to sanitize. This can be the value in the case of literals.
 * @returns {complexGuid} The complex object containing the guid and the field name. Returns an empty object in the literals case.
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
 * @param {String} rhsIdentifier    used to identify RHS, could be GUID or literal
 * @param {Object} normalizedLHS    the normalized LHS we receive from normalizeLHS call, represents the LHS of expression
 * @returns {String}                combobox display value
 */
export const normalizeRHS = (rhsIdentifier, normalizedLHS) => {
    const rhs = {};
    const complexGuid = sanitizeGuid(rhsIdentifier);
    const flowElement = getResourceByUniqueIdentifier(complexGuid.guid);
    if (flowElement && complexGuid.fieldName) {
        // TODO: W-4960448: the field will appear empty briefly when fetching the first time
        sobjectLib.getFieldsForEntity(flowElement.objectType, (fields) => {
            rhs.itemOrDisplayText = mutateFieldToComboboxShape(fields[complexGuid.fieldName], mutateFlowElementToComboboxShape(flowElement), true, true);
            rhs.fields = fields;
        });
    } else if (flowElement) {
        rhs.itemOrDisplayText = mutateFlowElementToComboboxShape(flowElement);
    } else {
        // in the case that we have a literal string, we must also check for a picklist value when the LHS is a picklist field
        let foundValue;
        if (normalizedLHS.activePicklistValues) {
            // if the lhs is a picklist field and the user did not select an element then match the picklist with the field
            foundValue = normalizedLHS.activePicklistValues.find(item => item.value === rhsIdentifier);
        }
        rhs.itemOrDisplayText = foundValue ? mutatePicklistValue(foundValue) : rhsIdentifier;
    }
    return rhs;
};

/**
 * Builds the parameter representation of a field.
 *
 * @param {String} sobject           the sobject type this field belongs to
 * @param {String} fieldName         API name of the field to be described
 * @param {function} callback        to be executed after the field is retrieved
 * @returns {Object}                 the parameter representation of this field, to be used with the rules service
 */
export const getFieldParamRepresentation = (sobject, fieldName, callback) => {
    let fieldParam;
    sobjectLib.getFieldsForEntity(sobject, (fields) => {
        const field = fields[fieldName];
        field.isCollection = false;
        fieldParam = elementToParam(field);
        if (callback) {
            callback(field);
        }
    });
    return fieldParam;
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
    const flowElement = getResourceByUniqueIdentifier(complexGuid.guid);
    if (!flowElement) {
        // Pass in lhsIdentifier as string in the default case
        lhs.item = lhsIdentifier;
    }
    if (complexGuid.fieldName) {
        // TODO: W-4960448: the field will appear empty briefly when fetching the first time
        const sobject = (flowElement) ? flowElement.objectType : complexGuid.guid;
        lhs.parameter = getFieldParamRepresentation(sobject, complexGuid.fieldName, (field) => {
            const isFieldOnSobjectVar = !!flowElement;
            const fieldParent = isFieldOnSobjectVar ? mutateFlowElementToComboboxShape(flowElement) : {value: field.sobjectName};
            lhs.item = mutateFieldToComboboxShape(field, fieldParent, isFieldOnSobjectVar, isFieldOnSobjectVar);
            if (callback) {
                callback(lhsIdentifier);
            }
            lhs.activePicklistValues = field.activePicklistValues;
        });
    } else if (flowElement) {
        lhs.item = mutateFlowElementToComboboxShape(flowElement);
        lhs.parameter = elementToParam(flowElement);
    }
    return lhs;
};

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
        case ELEMENT_TYPE.RECORD_LOOKUP:
            return sObjectSelector ? sObjectOrSObjectCollectionByEntitySelector({isCollection, entityName}) : shouldBeWritable ? writableElementsSelector : readableElementsSelector;
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
 * @param {boolean} allowSObjectForFields   true if sObjects should be included, to allow users to access sObject fields
 * @param {boolean} disableHasNext if true, then all menu items will have hasNext set to false regardless of the real value
 * @param {Array}   activePicklistValues the picklist values that will be appended to the menu data if picklist values are allowed
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function getElementsForMenuData(elementConfig, allowedParamTypes, includeNewResource,
    allowSObjectForFields = false, disableHasNext = false, activePicklistValues = []) {
    const state = Store.getStore().getCurrentState();

    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    // TODO: if this function ever deals with server calls, we need to memoize it, because it gets called everytime the component rerenders
    const menuData = getSelector(elementConfig)(state)
        .filter(element => isElementAllowed(allowedParamTypes, element, allowSObjectForFields))
        .map(element => {
            const menuItem = mutateFlowElementToComboboxShape(element);
            menuItem.hasNext = disableHasNext ? false : menuItem.hasNext;

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
        // TODO Uncomment when we get to W-5164547
        // menuData.unshift(getNewResourceItem());
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
 * @param {String} recordEntityName   name of the selected entity
 * @param {String[]} excludedFields   the excluded fields
 * @param {function} callback the callback function with menudata
 */
export function getFieldsMenuData(recordEntityName, excludedFields, callback) {
    sobjectLib.getFieldsForEntity(recordEntityName, fields => {
        const menuData = [];
        Object.keys(fields).forEach(field => {
            if (!excludedFields.includes(field)) {
                menuData.push(createMenuItem(COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE, field, undefined, field, undefined, field));
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