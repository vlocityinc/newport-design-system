// @ts-nocheck
import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { GLOBAL_CONSTANT_OBJECTS, GLOBAL_CONSTANT_PREFIX } from './globalConstants';
import {
    getSystemVariablesFromState,
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    SYSTEM_VARIABLE_PREFIX,
    SYSTEM_VARIABLE_RECORD_PREFIX,
    SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX
} from './systemVariables';

const GLOBAL_CONSTANTS_AND_SYSTEM_VARIABLES = [
    GLOBAL_CONSTANT_PREFIX,
    SYSTEM_VARIABLE_PREFIX,
    SYSTEM_VARIABLE_CLIENT_PREFIX
];
const SYSTEM_VARIABLES = [SYSTEM_VARIABLE_PREFIX, SYSTEM_VARIABLE_CLIENT_PREFIX];

/**
 * Checks if the id passed in might point to a non-element resource such as
 * Global Constants or System Variables
 *
 * @param {string} id             id to check
 * @returns {boolean}    true if the id might point to a non-element resource, false otherwise
 */
export const isGlobalConstantOrSystemVariableId = (id) =>
    !!id && GLOBAL_CONSTANTS_AND_SYSTEM_VARIABLES.indexOf(removeCurlyBraces(id).split('.')[0]) >= 0;
export const isSystemVariableId = (id) => !!id && SYSTEM_VARIABLES.indexOf(removeCurlyBraces(id).split('.')[0]) >= 0;
export const isRecordSystemVariableIdentifier = (id) =>
    !!id && typeof id === 'string' && id.toUpperCase() === SYSTEM_VARIABLE_RECORD_PREFIX.toUpperCase();
export const isRecordPriorSystemVariableIdentifier = (id) =>
    !!id && typeof id === 'string' && id.toUpperCase() === SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX.toUpperCase();
export const isRecordSystemVariableCompositeIdentifier = (id) =>
    !!id && typeof id === 'string' && isRecordSystemVariableIdentifier(removeCurlyBraces(id).split('.')[0]);
export const isRecordPriorSystemVariableCompositeIdentifier = (id) =>
    !!id && typeof id === 'string' && isRecordPriorSystemVariableIdentifier(removeCurlyBraces(id).split('.')[0]);
export const isNonRecordGlobalResourceId = (id) =>
    !!id &&
    typeof id === 'string' &&
    removeCurlyBraces(id).startsWith('$') &&
    !isRecordSystemVariableIdentifier(id) &&
    !isRecordSystemVariableCompositeIdentifier(id) &&
    !isRecordPriorSystemVariableIdentifier(id) &&
    !isRecordPriorSystemVariableCompositeIdentifier(id);
export const isNonElementId = (id) =>
    !!id &&
    typeof id === 'string' &&
    removeCurlyBraces(id).startsWith('$') &&
    !isRecordSystemVariableIdentifier(id) &&
    !isRecordSystemVariableCompositeIdentifier(id);

export const getGlobalConstantOrSystemVariableFromState = ({ elements }, id) => {
    const reference = removeCurlyBraces(id);
    return GLOBAL_CONSTANT_OBJECTS[reference] || getSystemVariablesFromState({ elements })[reference];
};

/**
 * Returns Global Constant or System Variable referenced by id
 *
 * @param {string} id           points to a global constant or system variable
 * @returns {Object|undefined}  if the id was valid, the object it references will be returned, otherwise undefined
 */
export const getGlobalConstantOrSystemVariable = (id) => {
    return getGlobalConstantOrSystemVariableFromState(Store.getStore().getCurrentState(), id);
};

export {
    cacheVersioningDataForAllProcessTypes,
    getApiVersionsList,
    getDefaultApiVersion,
    getLatestApiVersion,
    getMinApiVersion,
    initVersioningInfoForProcessType,
    isVersioningDataInitialized,
    isVersioningSupported,
    setVersioningDataInitialized
} from './apiVersions';
export { BUILDER_MODE, getBuilderType, setBuilderType } from './builderConfigs';
export {
    addFlowTests,
    deleteFlowTestFromCache,
    FlowTestListState,
    FlowTestResultStatusType,
    getFlowTestListState,
    getFlowTests,
    resetFlowTestStore,
    updateFlowTestResults
} from './flowTestData';
export type { FlowTestAndResultDescriptor } from './flowTestData';
export { GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS, GLOBAL_CONSTANT_PREFIX } from './globalConstants';
export {
    getGlobalVariable,
    getGlobalVariables,
    getGlobalVariableTypes,
    resetGlobalVariables,
    setGlobalVariables
} from './globalVariables';
export { getProcessFeatures, getProcessTypes, setProcessTypeFeature, setProcessTypes } from './processTypes';
export { getRunInModes, setRunInModes } from './runInModes';
export {
    getSystemVariables,
    isSystemVariablesCategoryNotEmpty,
    resetSystemVariables,
    setSystemVariables,
    SYSTEM_VARIABLES,
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    SYSTEM_VARIABLE_PREFIX,
    SYSTEM_VARIABLE_RECORD_PREFIX,
    SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX
} from './systemVariables';
