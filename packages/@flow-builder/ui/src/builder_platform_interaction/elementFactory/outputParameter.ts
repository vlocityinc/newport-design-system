// @ts-nocheck
import { createParameterListRowItem } from './base/baseList';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

/**
 * @param outputParameter
 */
export function createOutputParameter(outputParameter = {}) {
    const { name, assignToReference, value, valueDataType, dataType, isCollection, rowIndex } = outputParameter;

    // Subtype determined by:
    // 1. Existing subtype - rebuilding an already loaded output
    // 2. sobjectType - loading new sobject output
    // 3. apexClass - loading new apex class output
    const subtype = outputParameter.subtype || outputParameter.sobjectType || outputParameter.apexClass;

    let valueFerov;
    if (!valueDataType) {
        valueFerov = Object.assign(
            {},
            {
                name,
                value: assignToReference,
                valueDataType: FEROV_DATA_TYPE.REFERENCE
            }
        );
    }
    const newOutputParameter = Object.assign(
        {
            name,
            value,
            valueDataType,
            dataType,
            isCollection,
            rowIndex,
            subtype
        },
        valueFerov
    );
    return createParameterListRowItem(newOutputParameter);
}

/**
 * @param outputParameter
 */
export function createOutputParameterMetadataObject(outputParameter) {
    if (!outputParameter) {
        throw new Error('outputParameter is not defined');
    }

    const { name, value } = outputParameter;

    return Object.assign(
        {},
        {
            name,
            assignToReference: value
        }
    );
}
