// @ts-nocheck
import { filterAndMutateMenuData, filterFieldsForChosenElement, getChildrenItemsPromise } from './menuDataRetrieval';
import { getStoreElements } from './storeElementsFilter';

/**
 * Retrieve fields of selected element
 * @param {Function} populateParamTypesFn
 * @param {Object} parentItem the selected element
 * @param {Object} entityFields fields of selected
 * @param {boolean} [options.shouldBeWritable] true if fields must be writable
 * @param {boolean} [options.allowSObjectFieldsTraversal] true if sobject fields that are spannable can be traversed
 * @param {Object}  [options.sObjectSelectorConfig] if set, means that we need to select only sobject or element that contain sobject with the given settings (isCollection, creatable/queryable/updateable/deleteable, ...)
 * @returns {MenuItem[]} array of alphabetized menu items
 */
const getFieldMenuData = (
    populateParamTypesFn,
    parentItem,
    entityFields,
    {
        allowSObjectFields = true,
        allowSObjectFieldsTraversal = true,
        shouldBeWritable = false,
        sObjectSelectorConfig
    } = {}
) => {
    const options = {
        allowedParamTypes: populateParamTypesFn(),
        showAsFieldReference: true,
        showSubText: true,
        allowSObjectFieldsTraversal,
        shouldBeWritable,
        sObjectSelectorConfig,
        allowSObjectFields
    };
    if (entityFields) {
        return Promise.resolve(filterFieldsForChosenElement(parentItem, entityFields, options));
    }
    return getChildrenItemsPromise(parentItem).then(fields =>
        filterFieldsForChosenElement(parentItem, fields, options)
    );
};

const getFerovMenuData = (
    elementConfig,
    propertyEditorElementType,
    populateParamTypesFn,
    allowGlobalConstants,
    enableFieldDrilldown,
    storeInstance,
    includeNewResource,
    showSystemVariables,
    showGlobalVariables,
    allowSObjectFields
) => {
    const menuDataElements = getStoreElements(
        storeInstance.getCurrentState(),
        elementConfig || { elementType: propertyEditorElementType }
    );

    return filterAndMutateMenuData(
        menuDataElements,
        populateParamTypesFn(),
        includeNewResource,
        allowGlobalConstants,
        !enableFieldDrilldown,
        null,
        showSystemVariables,
        showGlobalVariables,
        allowSObjectFields,
        elementConfig ? elementConfig.allowsApexCollAnonymousAutoOutput : true
    );
};

/**
 * Populate menu data
 *
 * @param {Object} elementConfig    element config
 * @param {String} propertyEditorElementType    property editor element type
 * @param {String} populateParamTypesFn    the resource picker's function to populate paramTypes
 * @param {Object} storeInstance    instance of the store
 * @param {Object|undefined} parentItem    parent item
 * @param {Array} fields fields to be populated if parentItem is defined
 * @param {Object} [options]
 * @param {boolean} [options.allowGlobalConstants]    whether to show sobjects in menudata to allow users to select fields
 * @param {boolean} [options.enableFieldDrilldown]    whether to set hasNext to false for all menu items
 * @param {boolean} [options.includeNewResource]    whether to show the "New Resource" option
 * @param {boolean} [options.showSystemVariables]    whether to show system variables
 * @param {boolean} [options.showGlobalVariables]    whether to show global variables
 * @param {boolean} [options.allowSObjectFields]    whether or not drill down into SObject is allowed
 * @returns {Item[]} Array of resources
 */
export const getMenuData = (
    elementConfig,
    propertyEditorElementType,
    populateParamTypesFn,
    storeInstance,
    parentItem,
    fields,
    {
        enableFieldDrilldown = true,
        allowGlobalConstants = true,
        includeNewResource = true,
        showSystemVariables = true,
        showGlobalVariables = false,
        allowSObjectFieldsTraversal = true,
        allowSObjectFields = true
    } = {}
) => {
    if (parentItem) {
        return getFieldMenuData(populateParamTypesFn, parentItem, fields, {
            allowSObjectFields,
            allowSObjectFieldsTraversal,
            shouldBeWritable: !!(elementConfig && elementConfig.shouldBeWritable),
            sObjectSelectorConfig: elementConfig && elementConfig.sObjectSelectorConfig
        });
    }
    return Promise.resolve(
        getFerovMenuData(
            elementConfig,
            propertyEditorElementType,
            populateParamTypesFn,
            allowGlobalConstants,
            enableFieldDrilldown,
            storeInstance,
            includeNewResource,
            showSystemVariables,
            showGlobalVariables,
            allowSObjectFields
        )
    );
};
