import {
    GLOBAL_CONSTANT_OBJECTS,
    GLOBAL_CONSTANT_PREFIX
} from './globalConstants';
import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import {
    getSystemVariables,
    SYSTEM_VARIABLE_PREFIX,
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    SYSTEM_VARIABLE_RECORD_PREFIX
} from './systemVariables';

const GLOBAL_CONSTANTS_AND_SYSTEM_VARIABLES = [GLOBAL_CONSTANT_PREFIX, SYSTEM_VARIABLE_PREFIX, SYSTEM_VARIABLE_CLIENT_PREFIX];

/**
 * Checks if the id passed in might point to a non-element resource such as
 * Global Constants or System Variables
 *
 * @param {String} id             id to check
 * @returns {Boolean}    true if the id might point to a non-element resource, false otherwise
 */
export const isGlobalConstantOrSystemVariableId = (id) => !!id && GLOBAL_CONSTANTS_AND_SYSTEM_VARIABLES.indexOf(removeCurlyBraces(id).split('.')[0]) >= 0;
export const isRecordSystemVariableIdentifier = (id) => !!id && typeof id === 'string' && id.toUpperCase() === SYSTEM_VARIABLE_RECORD_PREFIX.toUpperCase();
export const isRecordSystemVariableCompositeIdentifier = (id) => !!id && typeof id === 'string' && isRecordSystemVariableIdentifier(removeCurlyBraces(id).split('.')[0]);

/**
 * Returns Global Constant or System Variable referenced by id
 *
 * @param {String} id           points to a global constant or system variable
 * @returns {Object|undefined}  if the id was valid, the object it references will be returned, otherwise undefined
 */
export const getGlobalConstantOrSystemVariable = id => {
    const reference = removeCurlyBraces(id);
    return (
        GLOBAL_CONSTANT_OBJECTS[reference] || getSystemVariables()[reference]
    );
};

export {
    GLOBAL_CONSTANT_PREFIX,
    GLOBAL_CONSTANTS,
    GLOBAL_CONSTANT_OBJECTS
} from './globalConstants';
export {
    setSystemVariables,
    getSystemVariables,
    isSystemVariablesCategoryNotEmpty,
    SYSTEM_VARIABLE_PREFIX,
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    SYSTEM_VARIABLE_RECORD_PREFIX,
    SYSTEM_VARIABLES
} from './systemVariables';
export {
    setGlobalVariables,
    getGlobalVariableTypes,
    getGlobalVariables,
    getGlobalVariable
} from './globalVariables';
export {
    setProcessTypes,
    getProcessTypes,
    getProcessFeatures,
    setProcessTypeFeature
} from './processTypes';

export {
    getSupportedFeatures,
    setSupportedFeatures
} from './supportedFeatures';
