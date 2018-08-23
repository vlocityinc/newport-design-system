import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';

// this is the object we get from the metadata that represents the default value of the variable
// (or value of the constant)
const FEROV_OBJECT_NAME = 'value';
// this is the name of the property we want to represent our default value for variable
// (or value, for constant) after mutation. We transform value => defaultValue
const DEFAULT_VALUE_PROPERTY = 'defaultValue';
export const FEROV_DATA_TYPE_PROPERTY = 'ferovDataType';
/**
 * Mutate a variable or constant element for use in the property editor
 * @param {Object} variableOrConstant Variable or constant element to mutate
 * @returns {Object} variableOrConstant The mutated variable or constant
 */
export const mutateVariableOrConstant = variableOrConstant => {
    // TODO: update this function if we have more properties we need to mutate

    // variables and constants already have a value but we want just a scalar not the ferov object from metatda
    // variables and constants already have a data type but in some cases the ferovDataType is different (ie: ferovDataType is 'reference')
    const mutatedVariableOrConstant = mutateFEROV(variableOrConstant, FEROV_OBJECT_NAME, {
        valueProperty: DEFAULT_VALUE_PROPERTY,
        dataTypeProperty: FEROV_DATA_TYPE_PROPERTY,
    });
    return mutatedVariableOrConstant;
};

/**
 * Remove any mutations we made on the variable or constant element
 * @param {Object} variableOrConstant Variable or constant element to demutate
 * @returns {Object} variableOrConstant The demutated variable or constant
 */
export const deMutateVariableOrConstant = (variableOrConstant) => {
    // TOOD: update this function if we end up mutating more properties
    const deMutatedVariableOrConstant = deMutateFEROV(variableOrConstant, FEROV_OBJECT_NAME, {
        valueProperty: DEFAULT_VALUE_PROPERTY,
        dataTypeProperty: FEROV_DATA_TYPE_PROPERTY
    });
    return deMutatedVariableOrConstant;
};