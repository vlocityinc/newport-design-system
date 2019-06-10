import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';

/**
 * Get the label or name of the parameter
 *
 * @param {ParameterItem} param a parameter
 * @returns {String} return the parameter's label or parameter's name
 */
const getLabel = param => {
    const label = getValueFromHydratedItem(param.label);
    return label ? label : getValueFromHydratedItem(param.name);
};

/**
 * Compare 2 parameters by label or name
 *
 * @param {ParameterItem} paramA a parameter to be compared
 * @param {ParameterItem} paramB a parameter to be compared
 * @returns {Integer} A positive number if paramA comes after paramB, negative number if paramA comes before paramB
 */
export const compareParamsByLabel = (paramA, paramB) => {
    const labelA = getLabel(paramA);
    const labelB = getLabel(paramB);
    return labelA.localeCompare(labelB);
};

/**
 * Compare 2 parameters by isRequired property
 *
 * @param {ParameterItem} paramA a parameter to be compared
 * @param {ParameterItem} paramB a parameter to be compared
 * @returns {Integer} 0 if two parameters have the same isRequired's value, -1 if paramA.isRequired is true, otherwise return 1
 */
export const compareParamsByRequired = (paramA, paramB) => {
    const paramARequired = !!paramA.isRequired;
    const paramBRequired = !!paramB.isRequired;
    return paramARequired === paramBRequired ? 0 : paramARequired ? -1 : 1;
};
