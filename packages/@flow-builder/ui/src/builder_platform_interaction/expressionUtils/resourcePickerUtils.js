import {
    filterAndMutateMenuData,
    filterFieldsForChosenElement,
    getStoreElements,
} from './menuDataRetrieval';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';

/**
 * Populate menu data with fields from the given object
 *
 * @param {Object} resourcePicker    resource picker
 * @param {Object} parentItem, representing the object that the fields belong to
 * @param {Object} entityFields fields for @param parentItem
 * @returns {Array} array of field objects
 */
const getFieldMenuData = (resourcePicker, parentItem, entityFields) => {
    const showAsFieldReference = true;
    const showSubText = true;
    let menuData;

    resourcePicker.populateParamTypes();
    if (entityFields) {
        menuData = filterFieldsForChosenElement(parentItem, resourcePicker.paramTypes, entityFields, showAsFieldReference, showSubText);
    } else {
        // when handling fetch menu data (user selects new sobject) we will not have the fields yet
        const entityName = parentItem.objectType;
        getFieldsForEntity(entityName, (fields) => {
            menuData = filterFieldsForChosenElement(parentItem, resourcePicker.paramTypes, fields, showAsFieldReference, showSubText);
        });
    }
    return menuData;
};

/**
 * Fetch them menu data and set it on the base resource picker.
 * If elementConfig is set use that to fetch the menu data.
 *
 * @param {Object} resourcePicker    resource picker
 * @param {Object} storeInstance    instance of the store
 * @param {Object} includeNewResource    whether to show the "New Resource" option
 * @returns {Array} array of resources
 */
const getFerovMenuData = (resourcePicker, storeInstance, includeNewResource) => {
    const elementConfig = resourcePicker.elementConfig || { elementType: resourcePicker.propertyEditorElementType };
    resourcePicker.populateParamTypes();

    const menuDataElements = getStoreElements(storeInstance.getCurrentState(), elementConfig);

    return filterAndMutateMenuData(menuDataElements, resourcePicker.paramTypes, includeNewResource,
        resourcePicker.allowSobjectForFields, resourcePicker.disableFieldDrilldown);
};

/**
 * Populate menu data
 *
 * @param {Object} resourcePicker    resource picker
 * @param {Object} storeInstance    instance of the store
 * @param {Object} includeNewResource    whether to show the "New Resource" option
 * @param {Object|undefined} parentItem    parent item
 * @param {Array} fields fields to be populated if parentItem is defined
 * @returns {Array} array of resources
 */
export const getMenuData = (resourcePicker, storeInstance, includeNewResource, parentItem, fields) => {
    let menuData;
    if (parentItem) {
        menuData = getFieldMenuData(resourcePicker, parentItem, fields);
    } else {
        menuData = getFerovMenuData(resourcePicker, storeInstance, includeNewResource);
    }
    return menuData;
};
