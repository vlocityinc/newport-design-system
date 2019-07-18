import {
    isMatch,
    PARAM_PROPERTY,
    SUBTYPE,
    getDataType
} from 'builder_platform_interaction/ruleLib';
import {
    writableElementsSelector,
    readableElementsSelector,
    collectionElementsSelector,
    byTypeWritableElementsSelector,
    sObjectOrSObjectCollectionByEntitySelector,
    choiceSelector
} from 'builder_platform_interaction/selectors';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import {
    FLOW_DATA_TYPE,
    getResourceTypes,
    isComplexType
} from 'builder_platform_interaction/dataTypeLib';
import {
    mutateFieldToComboboxShape,
    mutateFlowResourceToComboboxShape,
    mutateEntitiesToComboboxShape,
    mutatePicklistValue,
    mutateEventTypesToComboboxShape,
    mutateApexClassesToComboboxShape,
    getSystemAndGlobalVariableMenuData,
    COMBOBOX_ITEM_DISPLAY_TYPE
} from './menuDataGenerator';
import newResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel';
import picklistValuesLabel from '@salesforce/label/FlowBuilderExpressionUtils.picklistValuesLabel';
import systemGlobalVariableCategoryLabel from '@salesforce/label/FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory';
import {
    GLOBAL_CONSTANT_OBJECTS,
    getSystemVariables,
    SYSTEM_VARIABLE_PREFIX,
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    getProcessTypes,
    getGlobalVariables
} from 'builder_platform_interaction/systemLib';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { getCachedExtension } from 'builder_platform_interaction/flowExtensionLib';
import { getExtensionParamDescriptionAsComplexTypeFieldDescription } from 'builder_platform_interaction/screenEditorUtils';
import { format } from 'builder_platform_interaction/commonUtils';

const {
    SOBJECT_FIELD_REQUIREMENT,
    SYSTEM_VARIABLE_REQUIREMENT
} = PARAM_PROPERTY;

const isPicklistFieldAllowed = allowedTypes => {
    // we need a param to represent picklist values so we can check if they are allowed based on the given param types
    const picklistParam = {
        dataType: FLOW_DATA_TYPE.STRING.value,
        isCollection: false
    };
    return isElementAllowed(allowedTypes, picklistParam);
};

export const RESOURCE_PICKER_MODE = {
    FEROV_MODE: 'ferov',
    ENTITY_MODE: 'entity'
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
    return elemA.category === elemB.category
        ? -elemA.text.localeCompare(elemB.text, undefined, {
              sensitivity: 'base'
          })
        : -elemA.category.localeCompare(elemB.category, undefined, {
              sensitivity: 'base'
          });
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
export function isElementAllowed(
    allowedParamTypes,
    element,
    showComplexObjectsForFields = false
) {
    const isElementMatchForProperty = property => {
        if (!property) {
            return false;
        }
        const paramTypeKey = Object.keys(allowedParamTypes).find(key => {
            return key.toLowerCase() === property.toLowerCase();
        });
        const allowedType = paramTypeKey ? allowedParamTypes[paramTypeKey] : undefined;
        return (allowedType && elementMatchesRule(allowedType, element));
    };

    return (
        !allowedParamTypes ||
        isElementMatchForProperty(getDataType(element)) ||
        isElementMatchForProperty(
            UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE[
                element[PARAM_PROPERTY.ELEMENT_TYPE]
            ] || element[PARAM_PROPERTY.ELEMENT_TYPE]
        ) ||
        isElementMatchForProperty(element[SUBTYPE]) ||
        (showComplexObjectsForFields &&
            (!element.dataType === FLOW_DATA_TYPE.SOBJECT.value ||
                allowedParamTypes[SOBJECT_FIELD_REQUIREMENT]) &&
            isComplexType(element.dataType) &&
            !element.isCollection)
    );
}

export const COMBOBOX_NEW_RESOURCE_VALUE = '%%NewResource%%';

/**
 * Returns new resource menu item
 * @returns {Object} menu data group object with only new resource as item
 */
function getNewResourceItem() {
    return {
        displayText: newResourceLabel,
        text: newResourceLabel,
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE,
        value: COMBOBOX_NEW_RESOURCE_VALUE,
        iconName: 'utility:add'
    };
}

/**
 * @typedef filterInformation
 * @property selector    the selector that can be used to get items for this filter from the store
 * @property isWritable  whether or not everything allowed by this filter must be writable
 */

// TODO: all of this regarding filtering & selectors will be revisited with W-5462144

/**
 * @param {Boolean} shouldBeWritable    if true, only writable elements will be returned
 * @returns filterInformation
 */
function writableOrReadableElement(shouldBeWritable) {
    return {
        selector: shouldBeWritable
            ? writableElementsSelector
            : readableElementsSelector,
        isWritable: shouldBeWritable
    };
}

/**
 * @param {Boolean} shouldBeWritable    if true, only writable elements will be returned
 * @param {Boolean} sObjectSelector     optional: true if using selector to retrieve sobject/sobject collection variables
 * @param {Object} retrieveOptions      Object containing the parameter of the sObjectOrSObjectCollectionByEntitySelector
 * @returns {Function}
 */
function buildCludSelector(shouldBeWritable, sObjectSelector) {
    return function (retrieveOptions) {
        const selector = sObjectSelector
            ? sObjectOrSObjectCollectionByEntitySelector(retrieveOptions)
            : shouldBeWritable
            ? writableElementsSelector
            : readableElementsSelector;
        return {
            selector,
            isWritable: !sObjectSelector && shouldBeWritable
        };
    };
}

/**
 * @param {Boolean} shouldBeWritable    if true, only writable elements will be returned
 * @param {Object} elementType          the element type this expression builder lives in
 * @param {Boolean} isCollection        true if using selector to retrieve collection variables
 * @param {String} dataType             data type for menu data items
 * @param {String} entityName           optional: name of the sobject, used to retrieve a list of sobject/sobject collection variables. If it's empty or null, retrieve all the sobject/sobject collection variables.
 * @param {Boolean} sObjectSelector     optional: true if using selector to retrieve sobject/sobject collection variables
 * @returns filterInformation
 */
function sObjectOrByTypeElements(
    shouldBeWritable,
    elementType,
    isCollection,
    dataType,
    entityName,
    sObjectSelector
) {
    return {
        selector: isCollection
            ? collectionElementsSelector
            : sObjectSelector
            ? sObjectOrSObjectCollectionByEntitySelector({ entityName })
            : byTypeWritableElementsSelector(dataType)
    };
}

/**
 * @param {Boolean} shouldBeWritable    if true, only writable elements will be returned
 * @param {String} dataType             data type for menu data items
 * @param {Boolean} choices             optional: should this menu data only contain choices
 * @returns filterInformation
 */
function screenSelectors(shouldBeWritable, choices, dataType) {
    if (shouldBeWritable) {
        return {
            selector: writableElementsSelector,
            isWritable: shouldBeWritable
        };
    }

    return {
        selector: choices ? choiceSelector(dataType) : readableElementsSelector
    };
}

const filterInformationProviderMap = {
    [ELEMENT_TYPE.EXTERNAL_SERVICE]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.ACTION_CALL]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.APEX_CALL]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.ASSIGNMENT]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.EMAIL_ALERT]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.SUBFLOW]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.VARIABLE]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.CHOICE]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.DECISION]: () => writableOrReadableElement(),
    [ELEMENT_TYPE.WAIT]: ({ shouldBeWritable }) =>
        writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.SCREEN]: ({ shouldBeWritable, dataType, choices }) =>
        screenSelectors(shouldBeWritable, choices, dataType),
    [ELEMENT_TYPE.RECORD_CREATE]: ({
        shouldBeWritable,
        isCollection,
        entityName,
        sObjectSelector
    }) =>
        buildCludSelector(shouldBeWritable, sObjectSelector)({
            isCollection,
            entityName,
            createable: true
        }),
    [ELEMENT_TYPE.RECORD_UPDATE]: ({ shouldBeWritable, sObjectSelector }) =>
        buildCludSelector(shouldBeWritable, sObjectSelector)({
            allSObjectsAndSObjectCollections: true,
            updateable: true
        }),
    [ELEMENT_TYPE.RECORD_DELETE]: ({ shouldBeWritable, sObjectSelector }) =>
        buildCludSelector(shouldBeWritable, sObjectSelector)({
            allSObjectsAndSObjectCollections: true,
            deleteable: true
        }),
    [ELEMENT_TYPE.RECORD_LOOKUP]: ({
        shouldBeWritable,
        isCollection,
        entityName,
        sObjectSelector
    }) =>
        buildCludSelector(shouldBeWritable, sObjectSelector)({
            isCollection,
            entityName,
            queryable: true
        }),
    [ELEMENT_TYPE.LOOP]: ({
        shouldBeWritable,
        elementType,
        isCollection,
        dataType,
        entityName,
        sObjectSelector
    }) =>
        sObjectOrByTypeElements(
            shouldBeWritable,
            elementType,
            isCollection,
            dataType,
            entityName,
            sObjectSelector
        )
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
function getFilterInformation(config = {}) {
    const { elementType } = config;
    return filterInformationProviderMap[elementType]
        ? filterInformationProviderMap[elementType](config)
        : {};
}

/**
 * This method returns the selector that should be used to find elements for the menuData
 * @param {Object} storeInstance   reference to the storeInstance
 * @param {Object} config          contains necessary context to return the filterInformation
 * @returns {array}                retrieves elements from store
 */
export function getStoreElements(storeInstance, config) {
    let elements = [];

    const { selector } = getFilterInformation(config);
    if (selector) {
        elements = selector(storeInstance);
    }

    return elements;
}

/**
 * Gets a GroupedMenuItem from the given picklist values
 * @param {Object[]} picklist list of objects representing picklist values
 * @returns {module:menuDataGenerator.GroupMenuItems} menu data that has picklist values
 */
export const getPicklistMenuData = picklist => {
    if (!Array.isArray(picklist)) {
        throw new Error(
            `Picklist field values must be an array but instead was: ${typeof picklist}`
        );
    }
    const picklistLabel = format(picklistValuesLabel, '' + picklist.length);
    const picklistGroup = {
        label: picklistLabel,
        items: []
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
export function getElementsForMenuData(
    elementConfig,
    allowedParamTypes,
    includeNewResource = false,
    allowGlobalConstants = false,
    disableHasNext = false,
    activePicklistValues = []
) {
    const state = Store.getStore().getCurrentState();

    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    const menuDataElements = getStoreElements(state, elementConfig);

    return filterAndMutateMenuData(
        menuDataElements,
        allowedParamTypes,
        includeNewResource,
        allowGlobalConstants,
        disableHasNext,
        activePicklistValues
    );
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
export function filterAndMutateMenuData(
    menuDataElements,
    allowedParamTypes,
    includeNewResource = false,
    allowGlobalConstants = false,
    disableHasNext = false,
    activePicklistValues = [],
    showSystemVariables = true,
    showGlobalVariables = false
) {
    if (allowGlobalConstants) {
        // global constants should be included in menuData for FEROVs
        menuDataElements.push(...Object.values(GLOBAL_CONSTANT_OBJECTS));
    }

    // Create menu items from flow elements, sort them and group by their category.
    const menuData = menuDataElements
        .filter(element =>
            isElementAllowed(allowedParamTypes, element, !disableHasNext) &&
            // exclude the start element so that it is easier to add back as a global var below
            element.elementType !== ELEMENT_TYPE.START_ELEMENT
        )
        .map(element => {
            const menuItem = mutateFlowResourceToComboboxShape(element);
            if (disableHasNext) {
                menuItem.hasNext = false;
                menuItem.rightIconName = '';
            }
            return menuItem;
        })
        .sort(compareElementsByCategoryThenDevName)
        .reduce(sortIntoCategories, []);

    // Add system and global variables, if requested
    let systemAndGlobalVariableMenuItem;
    const systemVariablesAllowed =
        showSystemVariables &&
        (!allowedParamTypes || allowedParamTypes[SYSTEM_VARIABLE_REQUIREMENT]);
    if (systemVariablesAllowed || showGlobalVariables) {
        const systemAndGlobalVariableMenuData = getSystemAndGlobalVariableMenuData(
                systemVariablesAllowed,
                showGlobalVariables);
        if (systemAndGlobalVariableMenuData) {
            systemAndGlobalVariableMenuItem = {
                label: systemGlobalVariableCategoryLabel,
                items: systemAndGlobalVariableMenuData
            };
            menuData.push(systemAndGlobalVariableMenuItem);
        }
    }

    // Add the start element as $Record under Global Variables
    const startElement = menuDataElements.find(element =>
            isElementAllowed(allowedParamTypes, element, !disableHasNext) &&
            // exclude the start element so that it is easier to add back as a global var below
            element.elementType === ELEMENT_TYPE.START_ELEMENT
        );
    if (startElement) {
        // Create a menu item for the start element
        const startElementMenuItem = mutateFlowResourceToComboboxShape(startElement);
        if (disableHasNext) {
            startElementMenuItem.hasNext = false;
            startElementMenuItem.rightIconName = '';
        }

        // Add the start element menu item either to the existing Global Variables menu group or create a new group
        if (systemAndGlobalVariableMenuItem) {
            systemAndGlobalVariableMenuItem.items.push(startElementMenuItem);
        } else {
            // Create a new menu group Global Variables
            menuData.push({
                label: systemGlobalVariableCategoryLabel,
                items: [startElementMenuItem]
            });
        }
    }

    // Sort menu items in the Global Variables menu group
    if (systemAndGlobalVariableMenuItem && systemAndGlobalVariableMenuItem.items) {
        systemAndGlobalVariableMenuItem.items.sort((a, b) => a.displayText - b.displayText);
    }

    // Add picklist values to the top of the menu under the Picklist Values category
    if (
        activePicklistValues &&
        activePicklistValues.length > 0 &&
        isPicklistFieldAllowed(allowedParamTypes)
    ) {
        // if the picklist is allowed we want to include those in the menu data
        const picklistMenuData = getPicklistMenuData(activePicklistValues);
        menuData.unshift(picklistMenuData);
    }

    // Add the New Resource entry as the top entry, if requested
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
export const getEntitiesMenuData = entityType => {
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
export function filterFieldsForChosenElement(
    chosenElement,
    allowedParamTypes,
    fields,
    showAsFieldReference,
    showSubText
) {
    if (fields) {
        return Object.values(fields)
            .filter(element => isElementAllowed(allowedParamTypes, element))
            .map(element => {
                return mutateFieldToComboboxShape(
                    element,
                    chosenElement,
                    showAsFieldReference,
                    showSubText
                );
            });
    }
    return [];
}

export function getSecondLevelItems(elementConfig, topLevelItem, callback) {
    const shouldBeWritable =
        elementConfig && getFilterInformation(elementConfig).isWritable;
    const { dataType, subtype } = topLevelItem;

    const filterWritable = items => {
        const writableItems = {};
        Object.keys(items)
            .filter(key => {
                return !items[key].readOnly;
            })
            .forEach(key => {
                writableItems[key] = items[key];
            });
        return writableItems;
    };

    if (
        subtype === SYSTEM_VARIABLE_PREFIX ||
        subtype === SYSTEM_VARIABLE_CLIENT_PREFIX
    ) {
        const systemVariables = getSystemVariables(subtype);
        callback(
            shouldBeWritable ? filterWritable(systemVariables) : systemVariables
        );
    } else if (getGlobalVariables(subtype)) {
        callback(getGlobalVariables(subtype));
    } else if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        callback(sobjectLib.getFieldsForEntity(subtype));
    } else if (dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value) {
        fetchPropertiesForLightningComponentOutput(
            topLevelItem.value,
            callback
        );
    } else {
        callback(apexTypeLib.getPropertiesForClass(subtype));
    }
}

function fetchPropertiesForLightningComponentOutput(resourceGuid, callback) {
    const element = getElementByGuid(resourceGuid);
    const extension = getCachedExtension(element.extensionName);
    if (extension) {
        callback(
            extension.outputParameters.reduce((properties, parameter) => {
                properties[
                    parameter.apiName
                ] = getExtensionParamDescriptionAsComplexTypeFieldDescription(
                    parameter
                );
                return properties;
            }, {})
        );
    } else {
        callback([]);
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
    return Object.values(elements).find(element => {
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
    return resourceTypes.map(({ name }) => {
        const { nodeConfig, labels } = getConfigForElementType(name);
        const { value } = nodeConfig;
        const { menuData: label } = labels;
        return {
            value,
            label
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
            label: processTypeObject.label
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

export const getApexClassMenuData = () => {
    return mutateApexClassesToComboboxShape(apexTypeLib.getApexClasses());
};
