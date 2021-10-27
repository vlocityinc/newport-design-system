import { OrchestratedStage, ParameterListRowItem, StageStep } from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import {
    mergeInputOutputParameters,
    mergeWithInputOutputParameters,
    removeUnsetParametersByProperty,
    updateParameterItemByProperty,
    deleteParameterItemByProperty
} from 'builder_platform_interaction/calloutEditorLib';
import { updateProperties, ValueWithError } from 'builder_platform_interaction/dataMutationLib';
import { Validation } from 'builder_platform_interaction/validation';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';

export enum PARAMETER_PROPERTY {
    INPUT = 'inputParameters',
    OUTPUT = 'outputParameters',
    ENTRY_INPUT = 'entryActionInputParameters',
    EXIT_INPUT = 'exitActionInputParameters'
}

/*
    we use this helper function to find the property name for the property that's storing an item with 'rowIndex' GUID value
 */
const findInputParameterProperty = <T extends OrchestratedStage | StageStep>(
    state: T,
    rowIndex: UI.Guid
): string | undefined => {
    return [PARAMETER_PROPERTY.INPUT, PARAMETER_PROPERTY.ENTRY_INPUT, PARAMETER_PROPERTY.EXIT_INPUT].find((v) =>
        state[v] ? state[v].map((x) => x.rowIndex).includes(rowIndex) : false
    );
};

/*
    This is a hacky method. Since *mergeWithInputOutputParameters()* expects an inputParameters field on the
    state object, and we want to use it to process entryActionInputParameters & exitActionInputParameters,
    we instead use *mergeInputOutputParameters()* to create return an merged parameters object whose inputs we use
    as our merged inputs
 */
export const mergeParameters = <T extends OrchestratedStage | StageStep>(
    state: T,
    params: ParameterListRowItem[],
    actionCategory: ORCHESTRATED_ACTION_CATEGORY
): T => {
    if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.STEP) {
        return mergeWithInputOutputParameters(state, params);
    }
    let parametersProperty: string | undefined;
    if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.ENTRY) {
        parametersProperty = PARAMETER_PROPERTY.ENTRY_INPUT;
    } else if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.EXIT) {
        parametersProperty = PARAMETER_PROPERTY.EXIT_INPUT;
    }

    if (!parametersProperty) {
        return state;
    }

    const newParams = mergeInputOutputParameters(params, state[parametersProperty], []);
    const newInputs = (newParams as any).inputs;
    return updateProperties(state, {
        [parametersProperty]: newInputs
    });
};

/**
 *
 * @param state the OrchestratedStage or StageStep
 * @param detail the GUID of the row item that is being unset
 * @param param
 */
export const updateParameterItem = <T extends OrchestratedStage | StageStep>(state: T, param): T => {
    const property: string | undefined = findInputParameterProperty(state, param.rowIndex);

    if (!property) {
        return state;
    }
    return updateParameterItemByProperty(state, param, property);
};

/**
 * @param state the OrchestratedStage or StageStep
 * @param param the GUID of the row item that is being unset
 * @returns the updated OrchestratedStage or StageStep
 */
export const deleteParameterItem = <T extends OrchestratedStage | StageStep>(state: T, param): T => {
    const property: string | undefined = findInputParameterProperty(state, param.rowIndex);

    if (!property) {
        return state;
    }
    return deleteParameterItemByProperty(state, param, property);
};

/**
 *
 * @param state the OrchestratedStage or StageStep
 * @param rowIndex the GUID of the row item that is being unset
 */
export const removeUnsetParameters = <T extends OrchestratedStage | StageStep>(state: T, rowIndex: UI.Guid): T => {
    const property: string | undefined = findInputParameterProperty(state, rowIndex);

    if (!property) {
        return state;
    }
    return removeUnsetParametersByProperty(state, property);
};

/**
 * Before writing the object back to the store, strip out any input parameters that have been manually excluded
 * (via unchecking "include").  Operates on action, enbtry and exit input parameters
 *
 * This method should be called before any state updates which are written to the store.
 *
 * @param state
 */
export const removeAllUnsetParameters = <T extends OrchestratedStage | StageStep>(state: T): T => {
    let newState = Object.assign({}, state);
    state[PARAMETER_PROPERTY.INPUT]?.forEach((inputParam) => {
        newState = removeUnsetParameters(newState, inputParam.rowIndex);
    });
    state[PARAMETER_PROPERTY.ENTRY_INPUT]?.forEach((inputParam) => {
        newState = removeUnsetParameters(newState, inputParam.rowIndex);
    });
    state[PARAMETER_PROPERTY.EXIT_INPUT]?.forEach((inputParam) => {
        newState = removeUnsetParameters(newState, inputParam.rowIndex);
    });
    return newState;
};

/**
 * Validation cannot know if an invalid action name has been entered. Need to merge the action error to action name.
 *
 * @param action The invocable action
 * @param actionError The action error needs to be merged
 * @returns New action with action error merged to action name
 */
export const mergeActionErrorToActionName = (
    action: InvocableAction,
    actionError: string | ValueWithError | undefined
): InvocableAction => {
    return action
        ? {
              ...action,
              actionName: action.actionName
                  ? {
                        value: action.actionName.value,
                        error: action.actionName.error || (actionError as ValueWithError)?.value || null
                    }
                  : action.actionName
          }
        : action;
};

/**
 * Call validateProperty for the given property
 *
 * @param event specifies the property to validate
 * @param validation validation object
 */
export const validateProperty = (event: CustomEvent, validation: Validation) => {
    event.detail.error =
        event.detail.error === null
            ? validation.validateProperty(event.detail.propertyName, event.detail.value, null)
            : event.detail.error;
};
