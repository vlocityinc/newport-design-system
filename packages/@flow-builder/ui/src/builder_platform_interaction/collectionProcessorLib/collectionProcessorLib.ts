import { SORT_COMPATIBLE_TYPES } from 'builder_platform_interaction/sortEditorLib';
import { MAP_COMPATIBLE_TYPES } from 'builder_platform_interaction/mapEditorLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';

export type CollectionProcessorFilter = ({ sortable, mappable }: { sortable: boolean; mappable: boolean }) => boolean;

export const SORTABLE_FILTER: CollectionProcessorFilter = ({ sortable }) => sortable;
export const MAPPABLE_FILTER: CollectionProcessorFilter = ({ mappable }) => mappable;

const isDataTypeSupported = (dataType, supportedDataType, isCollection) => {
    return isCollection ? supportedDataType.includes(dataType) : dataType === FLOW_DATA_TYPE.APEX.value;
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
                (value as any).currentValueFromCollection === element.name
        );
    }
    return null;
};
