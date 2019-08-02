const mockSystemLib = require('builder_platform_interaction/systemLib');
import globalConstantFalseLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantFalse';
import globalConstantCategory from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantCategory';
import emptyStringMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.emptyStringMetaLine';
import trueMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.trueMetaLine';
import falseMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.falseMetaLine';
import { systemVariablesForFlow as systemVariables } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';

const removeCurlyBraces = (id) => {
    if (typeof id === 'string' && id.startsWith('{!') && id.endsWith('}')) {
        return id.substring(2, id.length - 1);
    }
    return id;
};

mockSystemLib.setSystemVariables(systemVariables);

export const GLOBAL_CONSTANT_PREFIX = mockSystemLib.GLOBAL_CONSTANT_PREFIX;
export const SYSTEM_VARIABLE_PREFIX = '$Flow';
export const SYSTEM_VARIABLE_CLIENT_PREFIX = '$Client';

export const GLOBAL_CONSTANTS = mockSystemLib.GLOBAL_CONSTANTS;

export const GLOBAL_CONSTANT_OBJECTS = {
    [GLOBAL_CONSTANTS.BOOLEAN_TRUE] : {
        label: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        name: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        guid: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        isCollection: false,
        dataType: 'Boolean',
        category: globalConstantCategory,
        description: trueMetaLine,
    },
    [GLOBAL_CONSTANTS.BOOLEAN_FALSE] : {
        label: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        name: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        guid: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        isCollection: false,
        dataType: 'Boolean',
        category: globalConstantCategory,
        description: falseMetaLine,
    },
    [GLOBAL_CONSTANTS.EMPTY_STRING] : {
        label: GLOBAL_CONSTANTS.EMPTY_STRING,
        name: GLOBAL_CONSTANTS.EMPTY_STRING,
        guid: GLOBAL_CONSTANTS.EMPTY_STRING,
        isCollection: false,
        dataType: 'String',
        category: globalConstantCategory,
        description: emptyStringMetaLine,
    },
};

export const isGlobalConstantOrSystemVariableId = (id) => {
    id = removeCurlyBraces(id);
    return id === GLOBAL_CONSTANTS.BOOLEAN_TRUE
        || id === GLOBAL_CONSTANTS.BOOLEAN_FALSE
        || id === GLOBAL_CONSTANTS.EMPTY_STRING
        || mockSystemLib.getSystemVariables()[id];
};

export const getGlobalConstantOrSystemVariable = (id) => {
    return GLOBAL_CONSTANT_OBJECTS[removeCurlyBraces(id)] || mockSystemLib.getSystemVariables()[id];
};

export const getGlobalVariable = mockSystemLib.getGlobalVariable;
export const getGlobalVariables = mockSystemLib.getGlobalVariables;
export const getGlobalVariableTypes = mockSystemLib.getGlobalVariableTypes;
export const setGlobalVariables = mockSystemLib.setGlobalVariables;

export const getSystemVariables = mockSystemLib.getSystemVariables;
export const setSystemVariables = mockSystemLib.setSystemVariables;