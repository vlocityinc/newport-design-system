// @ts-nocheck
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

const defaultRules = {};

/**
 * Validate the filter item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateFilter = () => ValidationRules.validateExpressionWith3PropertiesWithNoEmptyRHS();

const validateFilterLogic = {
    filterLogic: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined]
};

const additionalRules = {
    object: [ValidationRules.shouldNotBeBlank]
};

export const contextValidation = new Validation(defaultRules);

/**
 * Build specific overridden rules
 * @param {Object} nodeElement the element that need to be validated
 * @param {string} nodeElement.filterLogic - current element's filterLogic
 * @return {Object} the overridden rules
 */
export const getRules = ({ filterLogic, object, triggerType }) => {
    let overriddenRules = {};

    if (
        (triggerType && triggerType.value === FLOW_TRIGGER_TYPE.BEFORE_SAVE) ||
        triggerType.value === FLOW_TRIGGER_TYPE.AFTER_SAVE
    ) {
        overriddenRules = { ...additionalRules };
    }

    if (
        triggerType.value === FLOW_TRIGGER_TYPE.SCHEDULED ||
        triggerType.value === FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY
    ) {
        overriddenRules = { ...validateFilterLogic };
    }

    // validate filters if filter type is ALL and there is a valid Object
    if (filterLogic.value !== CONDITION_LOGIC.NO_CONDITIONS && object.value !== '' && !object.error) {
        overriddenRules.filters = validateFilter();
    }
    return overriddenRules;
};
