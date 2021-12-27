// @ts-nocheck
import systemVariableCategory from '@salesforce/label/FlowBuilderSystemVariables.systemVariableCategory';
import { FLOW_TRIGGER_SAVE_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { getStartElementFromState } from 'builder_platform_interaction/storeUtils';
import { readonly } from 'lwc';

export const SYSTEM_VARIABLE_PREFIX = '$Flow';
export const SYSTEM_VARIABLE_CLIENT_PREFIX = '$Client';
const SYSTEM_VARIABLE_RECORD_CATEGORY = 'Record';
export const SYSTEM_VARIABLE_RECORD_PREFIX = '$' + SYSTEM_VARIABLE_RECORD_CATEGORY;
export const SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX = '$' + SYSTEM_VARIABLE_RECORD_CATEGORY + '__Prior';

export const SYSTEM_VARIABLES = {
    CURRENT_DATE_TIME: SYSTEM_VARIABLE_PREFIX + '.CurrentDateTime'
};

let systemVariables = {};

export const resetSystemVariables = () => {
    systemVariables = {};
};

/**
 * Converts serialized FlowSystemVariablesEnums to a form usable by menus.
 *
 * @param {Array} data raw variable data from the server
 */
const convertData = (data) =>
    data.reduce((acc, obj) => {
        const name = `$${obj.category}.${obj.devName}`;
        const currentObj = Object.assign({}, obj);
        const variable = Object.assign(currentObj, {
            category: systemVariableCategory,
            apiName: obj.devName,
            dataType: obj.dataType,
            guid: name,
            label: obj.devName,
            name,
            readOnly: !obj.isAssignable,
            isSystemVariable: true,
            subtype: `${obj.category}`
        });
        delete variable.devName;

        acc[name] = variable;
        return acc;
    }, {});

/**
 * Sets the system variables. This should be done during app initialization.
 *
 * @param {Object} data the data returned by the service
 */
export const setSystemVariables = (data) => {
    const variables = [...data];
    // Remove $Record var. In the current implementation $Record is treated as an alias to the start element.
    // The attributes communicated in $Record here are hard-coded in the start element factory.
    // With that the visibility of $Record communicated by the backend based on the process type is ignored in the Flow Builder.
    // If it is ever needed, it can be tracked with a dedicated local var here and surfaced in the app by
    // e.g. a function like isRecordSystemVariableEnabled().
    const index = variables.findIndex((variable) => variable.category === SYSTEM_VARIABLE_RECORD_CATEGORY);
    if (index !== -1) {
        variables.splice(index, 1);
    }
    systemVariables = readonly(convertData(variables));
};

/**
 * get the $Record__Prior system variable if available.
 * $Record__Prior is only available for Record Change trigger and the trigger fires on an Update or a Create/Update
 *
 * @param root0
 * @param root0.elements
 */
const getRecordPriorSystemVariable = ({ elements }) => {
    const startElement = getStartElementFromState({ elements });
    if (!startElement) {
        return undefined;
    }
    const isRecordTrigger =
        startElement.triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE ||
        startElement.triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE;
    const isUpdate =
        startElement.recordTriggerType === FLOW_TRIGGER_SAVE_TYPE.UPDATE ||
        startElement.recordTriggerType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE;
    if (startElement.subtype && isRecordTrigger && isUpdate) {
        return {
            category: systemVariableCategory,
            dataType: 'SObject',
            isAssignable: false,
            isAvailableInBuilder: true,
            isCollection: false,
            guid: SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX,
            name: SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX,
            readOnly: true,
            isSystemVariable: true,
            subtype: startElement.subtype
        };
    }
    return undefined;
};

export const getSystemVariablesFromState = ({ elements }, category: string) => {
    const currentSystemVariables = { ...systemVariables };
    const recordPrior = getRecordPriorSystemVariable({ elements });
    if (recordPrior) {
        currentSystemVariables[recordPrior.name] = recordPrior;
    }
    if (category) {
        const categoryVariables = {};
        Object.keys(currentSystemVariables).forEach((key) => {
            if (key.startsWith(category)) {
                categoryVariables[key] = currentSystemVariables[key];
            }
        });
        return categoryVariables;
    }
    return currentSystemVariables;
};

/**
 * Gets all available system variables. Should be used after
 * fetchAllSystemVariables completes.
 *
 * @param category
 * @returns {Object} system variables usable in menus
 */
export const getSystemVariables = (category: string) => {
    return getSystemVariablesFromState(Store.getStore().getCurrentState(), category);
};

/**
 * @param category
 */
export function isSystemVariablesCategoryNotEmpty(category) {
    const vars = getSystemVariables(category);
    return Object.keys(vars).length > 0;
}
