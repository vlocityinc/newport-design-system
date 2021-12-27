import { RetrieveOptions } from 'builder_platform_interaction/selectors';
import { Store } from 'builder_platform_interaction/storeLib';
import { filterAndMutateMenuData, filterFieldsForChosenElement, getChildrenItemsPromise } from './menuDataRetrieval';
import { ElementFilterConfig, getStoreElements } from './storeElementsFilter';

/**
 * Retrieve fields of selected element
 *
 * @param {Function} populateParamTypesFn
 * @param {Object} parentItem the selected element
 * @param {Object} entityFields fields of selected
 * @param {boolean} [options.shouldBeWritable] true if fields must be writable
 * @param {boolean} [options.allowSObjectFieldsTraversal] true if sobject fields that are spannable can be traversed
 * @param {Object}  [options.selectorConfig] if set, means that we need to select only element or element that contain fields which fullfill the given settings (isCollection, creatable/queryable/updateable/deleteable, ...)
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
        showMultiPicklistGlobalVariables = false
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
    return getChildrenItemsPromise(parentItem, showMultiPicklistGlobalVariables).then((fields) =>
        filterFieldsForChosenElement(parentItem, fields, options)
    );
};

const getFerovMenuData = (
    elementConfig: ElementFilterConfig | undefined,
    propertyEditorElementType,
    populateParamTypesFn,
    allowGlobalConstants,
    enableFieldDrilldown,
    activePicklistValues,
    storeInstance,
    includeNewResource,
    newResourceTypeLabel,
    showSystemVariables,
    showGlobalVariables,
    allowSObjectFields,
    forFormula
) => {
    const menuDataElements = getStoreElements(
        storeInstance.getCurrentState(),
        elementConfig || { elementType: propertyEditorElementType }
    );
    return filterAndMutateMenuData(menuDataElements, populateParamTypesFn(), {
        includeNewResource,
        newResourceTypeLabel,
        allowGlobalConstants,
        disableHasNext: !enableFieldDrilldown,
        showSystemVariables,
        showGlobalVariables,
        activePicklistValues,
        allowSObjectField: allowSObjectFields,
        allowsApexCollAnonymousAutoOutput: elementConfig ? elementConfig.allowsApexCollAnonymousAutoOutput : true,
        forFormula,
        shouldBeWritable: elementConfig ? elementConfig.shouldBeWritable : false
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
 * @param {Object} [options]
 * @param {boolean} [options.allowGlobalConstants]    whether to show sobjects in menudata to allow users to select fields
 * @param {boolean} [options.enableFieldDrilldown]    whether to set hasNext to false for all menu items
 * @param {boolean} [options.includeNewResource]    whether to show the "New Resource" option
 * @param {boolean} [options.showSystemVariables]    whether to show system variables
 * @param {boolean} [options.showGlobalVariables]    whether to show global variables
 * @param {boolean} [options.allowSObjectFields]    whether or not drill down into SObject is allowed
 * @param options.newResourceTypeLabel
 * @param options.activePicklistValues
 * @param options.forFormula
 * @param options.allowSObjectFieldsTraversal
 * @param options.allowElementFields
 * @returns {Item[]} Array of resources
 */
export const getMenuData = (
    elementConfig: ElementFilterConfig | undefined,
    propertyEditorElementType: string,
    populateParamTypesFn,
    storeInstance: Store,
    parentItem,
    fields,
    {
        enableFieldDrilldown = true,
        allowGlobalConstants = true,
        includeNewResource = true,
        newResourceTypeLabel = null,
        showSystemVariables = true,
        showGlobalVariables = true,
        activePicklistValues = [],
        forFormula = false,
        allowSObjectFieldsTraversal = true,
        allowSObjectFields = true,
        allowElementFields = true
    } = {}
) => {
    if (parentItem) {
        return getFieldMenuData(populateParamTypesFn, parentItem, fields, {
            allowSObjectFields,
            allowSObjectFieldsTraversal,
            allowElementFields,
            shouldBeWritable: !!(elementConfig && elementConfig.shouldBeWritable),
            selectorConfig: elementConfig && elementConfig.selectorConfig,
            showMultiPicklistGlobalVariables: forFormula
        });
    }
    return Promise.resolve(
        getFerovMenuData(
            elementConfig,
            propertyEditorElementType,
            populateParamTypesFn,
            allowGlobalConstants,
            enableFieldDrilldown,
            activePicklistValues,
            storeInstance,
            includeNewResource,
            newResourceTypeLabel,
            showSystemVariables,
            showGlobalVariables,
            allowSObjectFields,
            forFormula
        )
    );
};
