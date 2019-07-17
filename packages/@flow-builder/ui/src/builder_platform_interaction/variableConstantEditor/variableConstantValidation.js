import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import {
    FLOW_DATA_TYPE,
    isComplexType
} from 'builder_platform_interaction/dataTypeLib';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    dataType: [ValidationRules.shouldNotBeNullOrUndefined]
};

export const variableConstantValidation = new Validation(additionalRules);

export const getRules = variableConstantResource => {
    const overrideRules = Object.assign(
        {},
        variableConstantValidation.finalizedRules
    );

    if (
        isComplexType(
            getValueFromHydratedItem(variableConstantResource.dataType)
        )
    ) {
        overrideRules.subtype = [
            ValidationRules.shouldNotBeNullOrUndefined,
            ValidationRules.validateResourcePicker(
                variableConstantResource.subtypeIndex
            )
        ];
    }

    if (
        variableConstantResource.dataType &&
        !isComplexType(
            getValueFromHydratedItem(variableConstantResource.dataType)
        ) &&
        variableConstantResource.dataType.value !== FLOW_DATA_TYPE.PICKLIST &&
        variableConstantResource.dataType.value !==
            FLOW_DATA_TYPE.MULTI_PICKLIST &&
        !variableConstantResource.isCollection
    ) {
        overrideRules.defaultValue = [
            ValidationRules.validateResourcePicker(
                variableConstantResource.defaultValueIndex
            )
        ];
    }

    return overrideRules;
};
