import { OrchestratedStage, ParameterListRowItem, StageStep } from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import {
    mergeInputOutputParameters,
    mergeWithInputOutputParameters,
    removeUnsetParametersByProperty,
    updateParameterItemByProperty
} from 'builder_platform_interaction/calloutEditorLib';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';

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
 */
export const updateParameterItem = <T extends OrchestratedStage | StageStep>(state: T, detail): T => {
    const property: string | undefined = findInputParameterProperty(state, detail.rowIndex);

    if (!property) {
        return state;
    }
    return updateParameterItemByProperty(state, detail, property);
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
