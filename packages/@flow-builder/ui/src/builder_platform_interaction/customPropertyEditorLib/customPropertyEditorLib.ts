/* eslint-disable lwc-core/no-inline-disable */
import { renderComponent } from 'aura';
import { createComponentPromise } from 'builder_platform_interaction/builderUtils';
import { getAutomaticOutputParameters } from 'builder_platform_interaction/complexTypeLib';
import {
    dehydrate,
    getValueFromHydratedItem,
    updateProperties,
    ValueWithError
} from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { createInputParameter, ParameterListRowItem } from 'builder_platform_interaction/elementFactory';
import { swapUidsForDevNames, translateUIModelToFlow } from 'builder_platform_interaction/translatorLib';

type ConfigurationEditorParametersAttributes = {
    elementInfo: ElementInfo;
    builderContext: BuilderContext;
    inputVariables: InputVariableValue[];
    genericTypeMappings: DehydratedDataTypeMapping[];
    automaticOutputVariables: { [key: string]: ParameterListRowItem[] };
    allInputVariables: ParameterListRowItem[];
};

export type ConfigurationEditorParameters = {
    cmpName: string;
    container: {};
    successCallback: Function;
    errorCallback: Function;
    attr: ConfigurationEditorParametersAttributes;
};

export type ElementInfo = {
    apiName?: string;
    type?: string;
};

export type ConfigurationEditor = {
    name: string | null;
    errors: [];
};

export type Reducer = (state: object, event: CustomEvent | { type: string }) => object;

export type BuilderContext = {
    variables: Metadata.Variable[];
    constants: Metadata.Constant[];
    textTemplates: Metadata.TextTemplate[];
    stages: Metadata.Stage[];
    screens: Metadata.Screen[];
    recordUpdates: Metadata.RecordUpdate[];
    recordLookups: Metadata.RecordLookup[];
    recordDeletes: Metadata.RecordDelete[];
    recordCreates: Metadata.RecordCreate[];
    formulas: Metadata.Formula[];
    apexPluginCalls: Metadata.ApexPluginCall[];
    actionCalls: Metadata.ActionCall[];
    loops: Metadata.Loop[];
    start?: Metadata.Start;
};

type InputVariableValue = {
    name: string | ValueWithError;
    value: string | ValueWithError;
    valueDataType: string;
};

type DehydratedDataTypeMapping = { typeName: string; typeValue: string };

/**
 * @param configurationEditor the caller configuration editor
 * @returns whether or not the configuration editor should be used
 */
export const useConfigurationEditor = (configurationEditor: ConfigurationEditor): boolean => {
    return !!(
        configurationEditor?.name &&
        (configurationEditor.errors == null || configurationEditor.errors.length === 0)
    );
};

/**
 * @param configurationEditor the caller configuration editor
 * @param state current state of the store
 * @returns the corresponding builder context given what's in the store
 */
export const getBuilderContext = (
    configurationEditor: ConfigurationEditor,
    state: UI.StoreState
): BuilderContext | {} => {
    if (useConfigurationEditor(configurationEditor)) {
        const flow = translateUIModelToFlow(state);
        const {
            variables = [],
            constants = [],
            textTemplates = [],
            stages = [],
            screens = [],
            recordUpdates = [],
            recordLookups = [],
            recordDeletes = [],
            recordCreates = [],
            formulas = [],
            apexPluginCalls = [],
            actionCalls = [],
            loops = [],
            start = [],
            assignments = [],
            collectionProcessors = [],
            choices = [],
            dynamicChoiceSets = [],
            decisions = [],
            recordRollbacks = [],
            waits = []
        } = flow.metadata;
        return {
            variables,
            constants,
            textTemplates,
            stages,
            screens,
            recordUpdates,
            recordLookups,
            recordDeletes,
            recordCreates,
            formulas,
            apexPluginCalls,
            actionCalls,
            loops,
            start,
            assignments,
            collectionProcessors,
            choices,
            dynamicChoiceSets,
            decisions,
            recordRollbacks,
            waits
        };
    }
    return {};
};

/**
 * @param configurationEditor the caller configuration editor
 * @param state current state of the store
 * @returns a map having the element (e.g. Action, Screen field, etc...) name as key, and an array of the corresponding parameters with automatic output as value
 */
export const getAutomaticOutputVariables = (
    configurationEditor: ConfigurationEditor,
    state: UI.StoreState
): { [key: string]: ParameterListRowItem[] } => {
    if (useConfigurationEditor(configurationEditor)) {
        const flowElements = state.elements;
        const outputVariables = Object.values(flowElements)
            .filter(({ storeOutputAutomatically }) => !!storeOutputAutomatically)
            .map((element) => ({
                [element.name!]: getAutomaticOutputParameters(element) || []
            }));
        return Object.assign({}, ...outputVariables);
    }
    return {};
};

/**
 * @param configurationEditor the caller configuration editor
 * @param node current node in the caller
 * @param state current state of the store
 * @returns the given node input parameters mapped to their name/value/datatype
 */
export const getInputVariables = (
    configurationEditor: ConfigurationEditor,
    node: UI.ActionCall | UI.ScreenField,
    state: UI.StoreState
): InputVariableValue[] => {
    if (node && node.inputParameters && useConfigurationEditor(configurationEditor)) {
        const inputParameters = node.inputParameters
            .filter(({ value }) => value != null)
            .map((inputParameter) => createInputParameter(inputParameter));
        dehydrate(inputParameters);
        swapUidsForDevNames(state.elements, inputParameters);
        return inputParameters.map(({ name, value, valueDataType }) => ({
            name,
            value,
            valueDataType
        }));
    }
    return [];
};

/**
 * Dehydrate mappings
 *
 * @param mappings an array of data type mappings
 * @returns an array of the given mappings with their name and value dehydrated
 */
const mapToValuesFromHydratedItem = (mappings: UI.DataTypeMapping[]): DehydratedDataTypeMapping[] => {
    const typeMappings = mappings.filter(({ typeValue }) => !!typeValue);
    return typeMappings.map(({ typeName, typeValue }) => ({
        typeName: getValueFromHydratedItem(typeName),
        typeValue: getValueFromHydratedItem(typeValue)
    }));
};

/**
 * @param configurationEditor the caller configuration editor
 * @param node current screen field in the caller
 * @returns the dynamic type mappings dehydrated
 */
export const getScreenFieldTypeMappings = (
    configurationEditor: ConfigurationEditor,
    node: UI.ScreenField
): DehydratedDataTypeMapping[] => {
    if (node && node.dynamicTypeMappings && useConfigurationEditor(configurationEditor)) {
        return mapToValuesFromHydratedItem(node.dynamicTypeMappings);
    }
    return [];
};

/**
 * @param configurationEditor the caller configuration editor
 * @param node current action call in the caller
 * @returns the data type mappings dehydrated
 */
export const getActionCallTypeMappings = (
    configurationEditor: ConfigurationEditor,
    node: UI.ActionCall
): DehydratedDataTypeMapping[] => {
    if (node && node.dataTypeMappings && useConfigurationEditor(configurationEditor)) {
        return mapToValuesFromHydratedItem(node.dataTypeMappings);
    }
    return [];
};

/**
 * @param name an hydrated name
 * @param type the element type
 * @returns an element info containing the name value if any as the apiName (empty string otherwise), and the given type
 */
export const getElementInfo = (name: UI.HydratedValue, type: string): ElementInfo => {
    return { apiName: name?.value || '', type };
};

/**
 * Create LWC component dynamically for custom property editor
 * PLEASE DON'T USE THIS UTIL EXCEPT FOR CUSTOM PROPERTY EDITOR
 *
 * @param params the configuration editor parameters
 * @returns Editor configuration
 */
export function createConfigurationEditor(params: ConfigurationEditorParameters) {
    if (!params?.cmpName) {
        throw new Error('Component name is not defined');
    }
    if (!params?.container) {
        throw new Error('Container component is not defined');
    }
    let newCmp;
    createComponentPromise(params.cmpName, params.attr)
        .then((cmp) => {
            renderComponent(cmp, params.container);
            newCmp = cmp;
            params.successCallback(newCmp);
        })
        .catch(params.errorCallback as any);

    const unrender = () => {
        if (newCmp) {
            // eslint-disable-next-line lwc-core/no-aura
            // @ts-ignore
            window.$A.unrender(newCmp);
            newCmp.destroy();
        }
    };
    return unrender;
}

/**
 * Handles the event to update the property changed via a custom property editor
 *
 * @param state state of the element
 * @param event ConfigurationEditorChangeEvent dispatched by the CPE with new value
 */
export const cpePropertyChanged = (state, event) => {
    const newValue =
        event.detail.newValueDataType === FEROV_DATA_TYPE.ARRAY
            ? event.detail.newValue
            : {
                  error: null,
                  value: event.detail.newValue
              };
    let updatedState = updateProperties(state, {
        [event.detail.name]: newValue
    });

    let config = state.config || {};
    if (event.detail.error && !config.hasError) {
        config = { ...config, hasError: true };
        updatedState = updateProperties(state, config);
    }

    return updatedState;
};
