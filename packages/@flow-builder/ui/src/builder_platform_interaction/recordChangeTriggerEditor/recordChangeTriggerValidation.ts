// @ts-nocheck
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const addtionalRules = {
    triggerType: [ValidationRules.shouldNotBeBlank],
    recordTriggerType: [ValidationRules.shouldNotBeBlank]
};

const defaultRules = {};

/**
 * Validate the filter item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 *
 * @returns {Function} the function to be called with each filter item to return the array of rules.
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
 *
 * @param {Object} nodeElement the element that need to be validated
 * @param {string} nodeElement.filterLogic - current element's filterLogic
 * @param nodeElement.object
 * @param nodeElement.triggerType
 * @returns {Object} the overridden rules
 */
export const getRules = ({ filterLogic, object, triggerType }) => {
    let overriddenRules = {};

    if (triggerType && isRecordChangeTriggerType(triggerType.value)) {
        overriddenRules = { ...additionalRules };
    }

    if (
        triggerType.value === FLOW_TRIGGER_TYPE.SCHEDULED ||
        triggerType.value === FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY
    ) {
        overriddenRules = { ...validateFilterLogic };
    }

    // validate filters if filter type is ALL and there is a valid Object
    if (
        filterLogic.value !== CONDITION_LOGIC.NO_CONDITIONS &&
        filterLogic.value !== CONDITION_LOGIC.FORMULA &&
        object.value !== '' &&
        !object.error
    ) {
        overriddenRules.filters = validateFilter();
    }
    return overriddenRules;
};

export const recordChangeTriggerValidation = new Validation(addtionalRules, true);
