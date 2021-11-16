import { SORT_COMPATIBLE_TYPES } from 'builder_platform_interaction/sortEditorLib';
import { MAP_COMPATIBLE_TYPES } from 'builder_platform_interaction/mapEditorLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { deepCopy, Store } from 'builder_platform_interaction/storeLib';
import {
    getElementByGuid,
    getUniqueDuplicateElementName,
    getElementByDevName
} from 'builder_platform_interaction/storeUtils';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import { addElement, deleteElements, updateElement } from 'builder_platform_interaction/actions';

export type CollectionProcessorFilter = ({ sortable, mappable }: { sortable: boolean; mappable: boolean }) => boolean;

export const SORTABLE_FILTER: CollectionProcessorFilter = ({ sortable }) => sortable;
export const MAPPABLE_FILTER: CollectionProcessorFilter = ({ mappable }) => mappable;

const isDataTypeSupported = (dataType, supportedDataType, isCollection) => {
    return isCollection ? supportedDataType.includes(dataType) : dataType === FLOW_DATA_TYPE.APEX.value;
};

export const DEFAULT_CURRENT_ITEM_VARIABLE = 'currentItemFromCollection';
export const DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX = 'currentItem_';
export const NODE_NAME = 'nodeName';

export const COLLECTION_PROCESSOR_PROPERTIES = {
    COLLECTION_REFERENCE: 'collectionReference',
    MAP_ITEMS: 'mapItems',
    CONDITION_LOGIC: 'conditionLogic',
    CONDITIONS: 'conditions',
    FORMULA: 'formula',
    ASSIGN_NEXT_VALUE_TO_REFERENCE: 'assignNextValueToReference'
};

/**
 * Filter the elements that can be supported in collection processor:
 * - A collection and its data type is in supported types
 * - A apex class variable in the apex defined class
 * - An automatic variables
 * - An action call/subflow outputs
 *
 * @param element element
 * @param supportedDataTypes supported data types
 */

const collectionProcessorFilter = (element, supportedDataTypes) => {
    return (
        (!element.elementType ||
            element.elementType === ELEMENT_TYPE.VARIABLE ||
            element.elementType === ELEMENT_TYPE.RECORD_LOOKUP ||
            element.elementType === ELEMENT_TYPE.APEX_CALL) &&
        element.dataType &&
        isDataTypeSupported(element.dataType, supportedDataTypes, element.isCollection)
    );
};

/**
 * Filter the elements that can be sortable
 *
 * @param element element
 * @returns collection processor filter
 */
export const sortableFilter = (element) => {
    return collectionProcessorFilter(element, SORT_COMPATIBLE_TYPES);
};

/**
 * Filter the elements that can be mappable
 *
 * @param element element
 * @returns collection processor filter
 */
export const mappableFilter = (element) => {
    return collectionProcessorFilter(element, MAP_COMPATIBLE_TYPES);
};

/**
 * Get the container of current item variable in collection
 *
 * @param element element
 * @returns the container editor element
 */
export const getContainerOfCurrentItemVariableInCollection = (element) => {
    if (element.elementType === ELEMENT_TYPE.VARIABLE) {
        const elements = Store.getStore().getCurrentState().elements;
        return Object.values(elements).find(
            (value) =>
                value.elementType === ELEMENT_TYPE.COLLECTION_PROCESSOR &&
                (value as any).assignNextValueToReference === element.name
        );
    }
    return null;
};

/**
 * Change from devName to Guid
 *
 * @param devName element name
 * @returns guid
 */
export const devNameToGuid = (devName): string | undefined => {
    // not case-sensitive
    return getElementByDevName(devName)?.guid;
};

/**
 * Get current variable
 *
 * @param assignNextValueToReference the reference
 * @returns the current variable (loop variable)
 */
export const getVariable = (assignNextValueToReference): string | undefined => {
    return getElementByGuid(assignNextValueToReference)?.name;
};

/**
 * Create the loop variable
 *
 * @param dataType data type
 * @param subtype sub type
 * @returns generated variable name
 */
export const generateVariable = (dataType = FLOW_DATA_TYPE.SOBJECT.value, subtype: string | null) => {
    const name = getUniqueDuplicateElementName(DEFAULT_CURRENT_ITEM_VARIABLE);
    const varElement = createVariable({
        name,
        dataType,
        subtype: subtype ? subtype : '',
        isCollection: false,
        isInput: false,
        isOutput: false
    });
    Store.getStore().dispatch(addElement(varElement));
    return name;
};

/**
 * Get the node name
 *
 * @param inputVariables input variables pass to CPE
 * @returns node name
 */
export const getNodeName = (inputVariables) => {
    if (inputVariables && inputVariables[0] && inputVariables[0].value && inputVariables[0].name === NODE_NAME) {
        return inputVariables[0].value;
    }
    return null;
};
/**
 * Delete or restore the current variable
 *
 * @param currentItemVariable the current variable devName
 * @param originalVariable the original variable to restore
 * @param shouldRestoreVariable should restore variable
 * @param shouldDeleteVariable should delete variable
 */

export const deleteOrRestoreVariable = (
    currentItemVariable,
    originalVariable,
    shouldRestoreVariable = false,
    shouldDeleteVariable = false
) => {
    // on cancel editing
    // if the curent item variable was created when open the editor -> delete it
    // if curent item variable was updated -> restore to its original value
    if (shouldRestoreVariable) {
        let element = getElementByDevName(currentItemVariable);
        if (shouldDeleteVariable) {
            // delete variable
            Store.getStore().dispatch(
                deleteElements({
                    elementType: ELEMENT_TYPE.VARIABLE,
                    selectedElements: [element]
                })
            );
        } else {
            // restore to original variable
            element = { ...element, ...originalVariable };
            Store.getStore().dispatch(updateElement(element));
        }
    }
};

/**
 * Update current item variable (subtype, name)
 *
 * @param  currentItemVariable current item variable
 * @param property variable property
 * @param value new value
 * @returns true if updated, false otherwise
 */

export const updateVariable = (currentItemVariable, property, value) => {
    if (currentItemVariable && property) {
        const element = getElementByDevName(currentItemVariable);
        if (element) {
            const updatedElement = deepCopy(element);
            updatedElement[property] = value;
            Store.getStore().dispatch(updateElement(updatedElement));
            return true;
        }
    }
    return false;
};
