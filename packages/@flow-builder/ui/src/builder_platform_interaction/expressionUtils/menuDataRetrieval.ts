// @ts-nocheck
import newResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel';
import newTypedResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.newTypedResourceLabel';
import picklistValuesLabel from '@salesforce/label/FlowBuilderExpressionUtils.picklistValuesLabel';
import resourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.resourceLabel';
import systemGlobalVariableCategoryLabel from '@salesforce/label/FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import {
    isAutomaticOutputElementWithoutChildren,
    retrieveResourceComplexTypeFields
} from 'builder_platform_interaction/complexTypeLib';
import { FLOW_DATA_TYPE, getResourceTypes, isComplexType } from 'builder_platform_interaction/dataTypeLib';
import { elementTypeToConfigMap, getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import {
    ELEMENT_TYPE,
    isScheduledPath,
    isSectionOrColumn,
    isSystemElement,
    UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { getDataType, isMatch, PARAM_PROPERTY, SUBTYPE } from 'builder_platform_interaction/ruleLib';
import { isAutomaticField } from 'builder_platform_interaction/screenEditorUtils';
import { canElementContain, RetrieveOptions } from 'builder_platform_interaction/selectors';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    getApiVersionsList,
    getGlobalVariables,
    getProcessTypes,
    getRunInModes,
    getSystemVariables,
    GLOBAL_CONSTANT_OBJECTS,
    isSystemVariableId,
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    SYSTEM_VARIABLE_PREFIX
} from 'builder_platform_interaction/systemLib';
import {
    COMBOBOX_ITEM_DISPLAY_TYPE,
    getMenuItemsForField,
    getSystemAndGlobalVariableMenuData,
    mutateEntitiesToComboboxShape,
    mutateEventTypesToComboboxShape,
    mutateFlowResourceToComboboxShape,
    mutatePicklistValue
} from './menuDataGenerator';
import { getScreenElement } from './resourceUtils';
import { getStoreElements } from './storeElementsFilter';
const { format } = commonUtils;

const { SOBJECT_FIELD_REQUIREMENT, SYSTEM_VARIABLE_REQUIREMENT } = PARAM_PROPERTY;

const isPicklistFieldAllowed = (allowedTypes) => {
    // we need a param to represent picklist values so we can check if they are allowed based on the given param types
    const picklistParam = {
        dataType: FLOW_DATA_TYPE.STRING.value,
        isCollection: false
    };
    return isElementAllowed(allowedTypes, picklistParam);
};

/**
 * Cache of event types mutated to shape the combobox expects.
 * Event types data does not change. This helps to not create new combobox menu data for every get event types.
 */
let _eventTypesCacheManagedSetup;
let _eventTypesCacheRuntime;

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
    const elemAText = elemA.text.value || elemA.text;
    return elemA.category === elemB.category
        ? -elemAText.localeCompare(elemB.text, undefined, {
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

/**
 * @param allowedParamTypes
 * @param element
 */
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
 * @param {boolean} showComplexObjectsForFields   true if fields are allowed here - complex types should be shown so that users can drill down to fields
 * @param {Object}  selectorConfig if set, means that to figure out whether or not an element is allowed, we only rely on this config (select only element or element that contains fields that fullfill the given settings (isCollection, creatable/queryable/updateable/deleteable, ...))
 * @returns {boolean}                       whether this element matches one or more of the specified rule params
 */
export function isElementAllowed(
    allowedParamTypes,
    element,
    showComplexObjectsForFields = false,
    selectorConfig?: RetrieveOptions
) {
    // allowedParamTypes that comes along selectorConfig are only used for validation of manual entered fields.
    // menu data only relies on the  selector config
    if (selectorConfig) {
        return canElementContain(element, selectorConfig);
    }

    if (!allowedParamTypes) {
        return true;
    }

    const isElementMatchForProperty = (property) => {
        if (!property) {
            return false;
        }
        const paramTypeKey = Object.keys(allowedParamTypes).find((key) => {
            return key.toLowerCase() === property.toLowerCase();
        });
        const allowedType = paramTypeKey ? allowedParamTypes[paramTypeKey] : undefined;
        return allowedType && elementMatchesRule(allowedType, element);
    };

    const ruleElementType =
        UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE[element[PARAM_PROPERTY.ELEMENT_TYPE]] ||
        element[PARAM_PROPERTY.ELEMENT_TYPE];
    if (
        isElementMatchForProperty(getDataType(element)) ||
        isElementMatchForProperty(ruleElementType) ||
        isElementMatchForProperty(element[SUBTYPE])
    ) {
        return true;
    }
    if (showComplexObjectsForFields && !element.isCollection) {
        if (element.dataType === FLOW_DATA_TYPE.SOBJECT.value && !allowedParamTypes[SOBJECT_FIELD_REQUIREMENT]) {
            return false;
        }
        if (element.isSpanningAllowed === true) {
            // SObject field that is spannable
            return true;
        }
        // do not allow complex objects without children
        return isComplexType(element.dataType) && !isAutomaticOutputElementWithoutChildren(element);
    }
    return false;
}

export const COMBOBOX_NEW_RESOURCE_VALUE = '%%NewResource%%';

/**
 * Returns new resource menu item
 *
 * @param resourceTypeLabel
 * @returns {Object} menu data group object with only new resource as item
 */
function getNewResourceItem(resourceTypeLabel: String) {
    const newResourceItemText = resourceTypeLabel
        ? format(newTypedResourceLabel, resourceTypeLabel)
        : format(newResourceLabel, resourceLabel);
    return {
        displayText: newResourceItemText,
        text: newResourceItemText,
        type: COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_INLINE,
        value: COMBOBOX_NEW_RESOURCE_VALUE,
        iconName: 'utility:add'
    };
}

/**
 * Gets a GroupedMenuItem from the given picklist values
 *
 * @param {Object[]} picklist list of objects representing picklist values
 * @returns {module:menuDataGenerator.GroupMenuItems} menu data that has picklist values
 */
export const getPicklistMenuData = (picklist: any[]) => {
    if (!Array.isArray(picklist)) {
        throw new Error(`Picklist field values must be an array but instead was: ${typeof picklist}`);
    }
    const picklistLabel = format(picklistValuesLabel, '' + picklist.length);
    const picklistGroup = {
        label: picklistLabel,
        items: [] as any[]
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
    allowedParamTypes?,
    includeNewResource = false,
    allowGlobalConstants = false,
    disableHasNext = false,
    activePicklistValues = []
) {
    const state = Store.getStore().getCurrentState();

    // TODO: once multiple params are allowed on RHS, we may need to deal with that here
    const menuDataElements = getStoreElements(state, elementConfig);

    return filterAndMutateMenuData(menuDataElements, allowedParamTypes, {
        includeNewResource,
        allowGlobalConstants,
        disableHasNext,
        activePicklistValues
    });
}

const disableHasNextOnMenuItem = (menuItem) => {
    menuItem.hasNext = false;
    menuItem.rightIconName = '';
};

const isApexCollectionAnonymousAutomaticOutput = (menuItem) => {
    return (
        menuItem.dataType === FLOW_DATA_TYPE.APEX.value &&
        menuItem.storeOutputAutomatically &&
        menuItem.isSystemGeneratedOutput &&
        menuItem.isCollection
    );
};

const shouldDisableHasNext = (
    menuItem: UI.ComboboxItem,
    { disableHasNext = false, allowSObjectField = true } = {}
): boolean => {
    return disableHasNext || (allowSObjectField === false && menuItem.dataType === FLOW_DATA_TYPE.SOBJECT.value);
};

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
 * @param {boolean} showGlobalVariables   are global variables allowed in this context
 * @param {boolean} allowSObjectField whether or not to set hasNext on SObject
 * @param {boolean} allowsApexCollAnonymousAutoOutput whether or not apex collection from anonymous automatic outputs are allowed. Default true
 * @param {boolean} forFormula   is this request coming from a formula editor
 * @returns {Array}                     array of alphabetized objects sorted by category, in shape combobox expects
 */
export function filterAndMutateMenuData(
    menuDataElements,
    allowedParamTypes?,
    {
        includeNewResource = false,
        newResourceTypeLabel = null,
        allowGlobalConstants = false,
        disableHasNext = false,
        activePicklistValues = [],
        showSystemVariables = true,
        showGlobalVariables = true,
        allowSObjectField = true,
        allowsApexCollAnonymousAutoOutput = true,
        forFormula = false,
        shouldBeWritable = false
    } = {}
) {
    if (allowGlobalConstants) {
        // global constants should be included in menuData for FEROVs
        menuDataElements.push(...Object.values(GLOBAL_CONSTANT_OBJECTS));
    }

    // Create menu items from flow elements, sort them and group by their category.
    const menuData = menuDataElements
        .filter(
            (element) =>
                isElementAllowed(allowedParamTypes, element, !disableHasNext) &&
                // exclude the start element so that it is easier to add back as a global var below
                !isSystemElement(element.elementType) &&
                (allowsApexCollAnonymousAutoOutput || !isApexCollectionAnonymousAutomaticOutput(element)) &&
                !isSectionOrColumn(element) &&
                !isScheduledPath(element) &&
                !isAutomaticField(element)
        )
        .map((element) => {
            const menuItem = mutateFlowResourceToComboboxShape(element);
            if (shouldDisableHasNext(menuItem, { disableHasNext, allowSObjectField })) {
                disableHasNextOnMenuItem(menuItem);
            }
            return menuItem;
        })
        .sort(compareElementsByCategoryThenDevName)
        .reduce(sortIntoCategories, []);

    // Add system and global variables, if requested
    let systemAndGlobalVariableMenuItem;
    const systemVariablesAllowed =
        showSystemVariables && (!allowedParamTypes || allowedParamTypes[SYSTEM_VARIABLE_REQUIREMENT]);
    if (systemVariablesAllowed || showGlobalVariables) {
        const systemAndGlobalVariableMenuData = getSystemAndGlobalVariableMenuData(
            systemVariablesAllowed,
            showGlobalVariables,
            forFormula,
            shouldBeWritable
        );
        if (Array.isArray(systemAndGlobalVariableMenuData) && systemAndGlobalVariableMenuData.length) {
            systemAndGlobalVariableMenuItem = {
                label: systemGlobalVariableCategoryLabel,
                items: systemAndGlobalVariableMenuData
            };
            menuData.push(systemAndGlobalVariableMenuItem);
        }
    }

    // Add the start element as $Record under Global Variables
    const startElement = menuDataElements.find(
        (element) =>
            isElementAllowed(allowedParamTypes, element, !disableHasNext) &&
            // exclude the start element so that it is easier to add back as a global var below
            element.elementType === ELEMENT_TYPE.START_ELEMENT
    );
    if (startElement) {
        // Create a menu item for the start element
        const startElementMenuItem = mutateFlowResourceToComboboxShape(startElement);
        if (shouldDisableHasNext(startElementMenuItem, { disableHasNext, allowSObjectField })) {
            disableHasNextOnMenuItem(startElementMenuItem);
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
        systemAndGlobalVariableMenuItem.items.sort((item1, item2) => item1.text.localeCompare(item2.text));
    }

    // Add picklist values to the top of the menu under the Picklist Values category
    if (activePicklistValues && activePicklistValues.length > 0 && isPicklistFieldAllowed(allowedParamTypes)) {
        // if the picklist is allowed we want to include those in the menu data
        const picklistMenuData = getPicklistMenuData(activePicklistValues);
        menuData.unshift(picklistMenuData);
    }

    // Add the New Resource entry as the top entry, if requested
    if (includeNewResource) {
        menuData.unshift(getNewResourceItem(newResourceTypeLabel));
    }
    return menuData;
}

/**
 * Retrieves combobox menu data for the given entity type
 *
 * @param {string} entityType   The entity type that we want in our menu data (ex: queryable, updatable etc)
 * @returns {MenuData}             Combobox menu data with our entities
 */
export const getEntitiesMenuData = (entityType = null) => {
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
        case sobjectLib.ENTITY_TYPE.WORKFLOW_ENABLED:
            entities = sobjectLib.getWorkflowEnabledEntities();
            break;
        default:
            entities = sobjectLib.getAllEntities();
            break;
    }
    return mutateEntitiesToComboboxShape(entities);
};

const isWritable = (field) => {
    return isSystemVariableId(field.guid) ? !field.readOnly : true;
};

/**
 * Filters list of fields based on allowed types and returns them in combobox-friendly shape
 *
 * @param chosenElement The parent chosen element
 * @param fields Array of the fields to be filtered
 * @param options
 * [options.allowedParamTypes]  If present, is used to determine if each element is valid for this menuData
 * [options.showAsFieldReference] show display text as field reference
 * [options.showSubText] show sub text
 * [options.shouldBeWritable] true if fields must be writable
 * [options.allowSObjectFieldsTraversal] true if sobject fields that are spannable can be traversed
 * [options.allowApexTypeFieldsTraversal] true if apex type fields can be traversed
 * [options.selectorConfig] if set, means that we need to select only element or element that contain fields which fullfill the given settings (isCollection, creatable/queryable/updateable/deleteable, ...)
 * @param options.allowedParamTypes
 * @param options.showAsFieldReference
 * @param options.showSubText
 * @param options.shouldBeWritable
 * @param options.allowSObjectFieldsTraversal
 * @param options.allowApexTypeFieldsTraversal
 * @param options.selectorConfig
 * @param options.allowSObjectFields
 * @param options.allowElementFields
 * @returns array of alphabetized menu items
 */
export function filterFieldsForChosenElement(
    chosenElement: Object,
    fields: Object,
    {
        allowedParamTypes = null,
        showAsFieldReference = true,
        showSubText = true,
        shouldBeWritable = false,
        allowSObjectFieldsTraversal = true,
        allowApexTypeFieldsTraversal = true,
        selectorConfig,
        allowSObjectFields,
        allowElementFields = true
    } = {}
): Array<Object> {
    if (fields) {
        if (selectorConfig) {
            allowSObjectFieldsTraversal = false;
        }
        return Object.values(fields)
            .filter((field) => {
                return (
                    (shouldBeWritable ? isWritable(field) : true) &&
                    isElementAllowed(allowedParamTypes, field, allowSObjectFieldsTraversal, selectorConfig)
                );
            })
            .reduce(
                (acc, field) =>
                    acc.concat(
                        getMenuItemsForField(field, chosenElement, {
                            showAsFieldReference,
                            showSubText,
                            allowSObjectFieldsTraversal,
                            allowApexTypeFieldsTraversal,
                            allowSObjectFields,
                            allowElementFields
                        })
                    ),
                []
            )
            .filter((field) =>
                // filter a second time because several menu items may be generated, some of them possibly not with the expected dataType
                isElementAllowed(allowedParamTypes, field, allowSObjectFieldsTraversal, selectorConfig)
            )
            .sort((menuItem1, menuItem2) => {
                // display elements with children first
                if (menuItem1.hasNext === menuItem2.hasNext) {
                    return 0;
                }
                return menuItem1.hasNext ? -1 : 1;
            });
    }
    return [];
}

/**
 * get children items
 *
 * @param {Object} parentItem the parent item
 * @param {boolean} showMultiPicklistGlobalVariables whether we allow global variables of type multipicklist
 * @returns {Promise<Object>} the children items : key is the field name, value is the child item as a complex type field description
 */
export function getChildrenItemsPromise(parentItem, showMultiPicklistGlobalVariables = false) {
    const { dataType, subtype } = parentItem;
    let result;
    if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        result = sobjectLib.fetchFieldsForEntity(subtype, {
            disableErrorModal: true
        });
    } else {
        result = Promise.resolve(getChildrenItems(parentItem, showMultiPicklistGlobalVariables));
    }
    // no access on sobject fields ...
    return result.catch(() => ({}));
}

/**
 * get children items
 *
 * @param {Object} parentItem the parent item
 * @param {boolean} showMultiPicklistGlobalVariables whether we allow global variables of type multipicklist
 * @returns {Object} the children items : key is the field name, value is the child item as a complex type field description
 */
export function getChildrenItems(parentItem, showMultiPicklistGlobalVariables = false) {
    const { dataType, subtype, getChildrenItems } = parentItem;
    const elementType: ELEMENT_TYPE = FLOW_DATA_TYPE[dataType] && FLOW_DATA_TYPE[dataType].elementType;

    let result;
    if (getChildrenItems) {
        result = getChildrenItems();
    } else if (subtype === SYSTEM_VARIABLE_PREFIX || subtype === SYSTEM_VARIABLE_CLIENT_PREFIX) {
        result = getSystemVariables(subtype);
    } else if (getGlobalVariables(subtype, showMultiPicklistGlobalVariables)) {
        result = getGlobalVariables(subtype, showMultiPicklistGlobalVariables);
    } else if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        result = sobjectLib.getFieldsForEntity(subtype);
    } else if (dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value) {
        const resourceGuid = parentItem.value;
        const element = getScreenFieldElementByGuid(resourceGuid);
        result = retrieveResourceComplexTypeFields(element);
    } else if (dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value || dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value) {
        const resourceGuid = parentItem.value;
        const element = getElementByGuid(resourceGuid);
        result = retrieveResourceComplexTypeFields(element);
    } else if (dataType === FLOW_DATA_TYPE.APEX.value) {
        result = apexTypeLib.getPropertiesForClass(subtype);
    } else if (elementType && elementTypeToConfigMap[elementType].getChildrenItems) {
        const element = getElementByGuid(parentItem.value);
        return elementTypeToConfigMap[elementType].getChildrenItems(element);
    } else {
        result = {};
    }
    return result;
}

/**
 * @param guid
 */
function getScreenFieldElementByGuid(guid) {
    return getElementByGuid(guid) || getScreenElement().getFieldByGUID(guid);
}

/**
 * Comboboxes return only the devName of the selected element,
 * this finds the corresponding element.
 *
 * @param {Object} elements    all elements in the flow
 * @param {string} devName     the element's devName
 * @returns {Object}  the element with the provided devName
 */
export function getElementByDevName(elements = {}, devName) {
    return Object.values(elements).find((element) => {
        return element.name === devName;
    });
}

/**
 * Get a list of menu data based from the allowed resource types returned by the java controller
 *
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
 *
 * @returns {MenuItem[]} list of menu items representing the allowed process types
 */
export const getProcessTypesMenuData = () => {
    const processTypes = getProcessTypes();
    return processTypes.map((processTypeObject) => {
        return {
            value: processTypeObject.name,
            label: processTypeObject.label
        };
    });
};

/**
 * Get a list of menu data based from the allowed run-in modes returned by the java controller
 *
 * @returns {MenuItem[]} list of menu items representing the allowed modes.
 */
export const getRunInModesMenuData = () => {
    const runInModes = getRunInModes();
    return runInModes.map((runInModeObject) => {
        return {
            value: runInModeObject.name,
            label: runInModeObject.value
        };
    });
};

/**
 * Retrieves event types combobox menu data
 *
 * @returns {MenuData}             Combobox menu data with our entities
 */
export const getEventTypesMenuDataManagedSetup = () => {
    if (!_eventTypesCacheManagedSetup) {
        const eventTypes = sobjectLib.getEventTypes(sobjectLib.MANAGED_SETUP);
        _eventTypesCacheManagedSetup = mutateEventTypesToComboboxShape(eventTypes);
    }
    return _eventTypesCacheManagedSetup;
};

export const getEventTypesMenuDataRunTime = () => {
    if (!_eventTypesCacheRuntime) {
        const eventTypes = sobjectLib.getEventTypes(sobjectLib.RUNTIME);
        _eventTypesCacheRuntime = mutateEventTypesToComboboxShape(eventTypes);
    }
    return _eventTypesCacheRuntime;
};

export const getApiVersionMenuData = () => {
    const apiVersions = getApiVersionsList();
    return apiVersions.map((apiVersion) => {
        return {
            value: apiVersion.toString(),
            label: apiVersion.toString()
        };
    });
};
