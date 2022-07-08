import { RetrieveOptions } from 'builder_platform_interaction/selectors';
import { Store } from 'builder_platform_interaction/storeLib';
import { filterAndMutateMenuData, filterFieldsForChosenElement, getChildrenItemsPromise } from './menuDataRetrieval';
import { ElementFilterConfig, getStoreElements } from './storeElementsFilter';

/**
 * Retrieve fields of selected element
 *
 * @param {Function} populateParamTypesFn
 * @param {Object} parentItem - the selected element
 * @param {Object} entityFields - fields of selected
 * @param {Object} options
 * @param {boolean} options.allowSObjectFields
 * @param {boolean} options.allowSObjectFieldsTraversal - true if sobject fields that are spannable can be traversed
 * @param {boolean} options.allowElementFields
 * @param {boolean} options.shouldBeWritable - true if fields must be writable
 * @param {Object}  options.selectorConfig - if set, means that we need to select only element or element that contain fields which fullfill the given settings (isCollection, creatable/queryable/updateable/deleteable, ...)
 * @param {boolean} options.includeEntityRelatedRecordFields - true if the entity related fields are included
 * @param {boolean} options.showMultiPicklistGlobalVariables
 * @returns {MenuItem[]} array of alphabetized menu items
 */
const getFieldMenuData = (
    populateParamTypesFn,
    parentItem,
    entityFields,
    {
        allowSObjectFields = true,
        allowSObjectFieldsTraversal = true,
        allowElementFields = true,
        shouldBeWritable = false,
        selectorConfig = undefined as RetrieveOptions | undefined,
        showMultiPicklistGlobalVariables = false,
        includeEntityRelatedRecordFields = false
    } = {}
) => {
    const options = {
        allowedParamTypes: populateParamTypesFn(),
        showAsFieldReference: true,
        showSubText: true,
        allowSObjectFieldsTraversal,
        allowElementFields,
        shouldBeWritable,
        selectorConfig,
        allowSObjectFields
    };
    if (entityFields) {
        return Promise.resolve(filterFieldsForChosenElement(parentItem, entityFields, options));
    }
    return getChildrenItemsPromise(parentItem, showMultiPicklistGlobalVariables, includeEntityRelatedRecordFields).then(
        (fields) => filterFieldsForChosenElement(parentItem, fields, options)
    );
};

const getFerovMenuData = (
    elementConfig: ElementFilterConfig | undefined,
    propertyEditorElementType,
    populateParamTypesFn,
    currentState: UI.StoreState,
    config: MenuConfig
) => {
    const menuDataElements = getStoreElements(
        currentState,
        elementConfig || { elementType: propertyEditorElementType }
    );
    return filterAndMutateMenuData(menuDataElements, populateParamTypesFn(), {
        ...config,
        filter: {
            ...config.filter,
            allowsApexCallAnonymousAutoOutput: elementConfig ? elementConfig.allowsApexCallAnonymousAutoOutput : true,
            shouldBeWritable: elementConfig ? elementConfig.shouldBeWritable : false
        }
    });
};

/**
 * Populate menu data
 *
 * @param {Object} elementConfig    element config
 * @param {string} propertyEditorElementType    property editor element type
 * @param {string} populateParamTypesFn    the resource picker's function to populate paramTypes
 * @param {Object} storeInstance    instance of the store
 * @param {Object|undefined} parentItem    parent item
 * @param {Array} fields fields to be populated if parentItem is defined
 * @param config menu configuration (what we want to filter out, etc...)
 * @returns {Item[]} Array of resources
 */
export const getMenuData = (
    elementConfig: ElementFilterConfig | undefined,
    propertyEditorElementType: string,
    populateParamTypesFn,
    storeInstance: Store,
    parentItem,
    fields,
    config: MenuConfig = {
        newResourceTypeLabel: null,
        activePicklistValues: [],
        traversalConfig: {
            isEnabled: true,
            allowSObjectFieldsTraversal: true,
            allowSObjectField: true,
            allowElementFields: true
        },
        filter: {
            allowGlobalConstants: true,
            includeNewResource: true,
            showSystemVariables: true,
            showGlobalVariables: true,
            forFormula: false,
            showFlowSystemVariable: true,
            includeEntityRelatedRecordFields: false
        }
    }
) => {
    if (parentItem) {
        return getFieldMenuData(populateParamTypesFn, parentItem, fields, {
            allowSObjectFields: config.traversalConfig?.allowSObjectField,
            allowSObjectFieldsTraversal: config.traversalConfig?.allowSObjectFieldsTraversal,
            allowElementFields: config.traversalConfig?.allowElementFields,
            shouldBeWritable: !!elementConfig?.shouldBeWritable,
            selectorConfig: elementConfig?.selectorConfig,
            showMultiPicklistGlobalVariables: config.filter?.forFormula,
            includeEntityRelatedRecordFields: config.filter?.includeEntityRelatedRecordFields
        });
    }
    return Promise.resolve(
        getFerovMenuData(
            elementConfig,
            propertyEditorElementType,
            populateParamTypesFn,
            storeInstance.getCurrentState(),
            config
        )
    );
};
