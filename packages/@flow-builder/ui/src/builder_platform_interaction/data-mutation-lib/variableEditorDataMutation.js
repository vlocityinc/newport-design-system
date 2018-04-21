import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';

// this is the object we get from the metadata that represents the default value of the variable
const ferovObjName = 'value';
// this is the name of the property we want to represent our default value after mutation. We transform value => defaultValue
const defaultValueProperty = 'defaultValue';
const ferovDataTypeProperty = 'ferovDataType';
/**
 * Mutate a variable element for use in the variable property editor
 * @param {Object} variable Variable element to mutate
 * @returns {Object} variable The mutated variable
 */
export const mutateVariable = variable => {
    // TODO: update this function if we have more properties we need to mutate

    // variables already have a value but we want just a scalar not the ferov object from metatda
    // variables already have a data type but in some cases the ferovDataType is different (ie: ferovDataType is 'reference')
    const mutatedVariable = mutateFEROV(variable, ferovObjName, {
        valueProperty: defaultValueProperty,
        dataTypeProperty: ferovDataTypeProperty,
    });
    return mutatedVariable;
};

/**
 * Remove any mutations we made on the variable element
 * @param {Object} variable Variable elemenet to demutate
 * @returns {Object} variable The demuated variable
 */
export const deMutateVariable = (variable) => {
    // TOOD: update this function if we end up mutating more properties
    const deMutatedVariable = deMutateFEROV(variable, ferovObjName, {
        valueProperty: defaultValueProperty,
        dataTypeProperty: ferovDataTypeProperty
    });
    return deMutatedVariable;
};