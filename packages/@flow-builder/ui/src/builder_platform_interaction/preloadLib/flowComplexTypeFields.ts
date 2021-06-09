// @ts-nocheck
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { describeExtensions } from 'builder_platform_interaction/flowExtensionLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import {
    getSObjectOrSObjectCollectionByEntityElements,
    componentInstanceScreenFieldsSelector,
    byElementTypeElementsSelector,
    filteredElementsSelector
} from 'builder_platform_interaction/selectors';
import { ELEMENT_TYPE, ACTION_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { loadApexClasses } from './preloadLib';
import { fetchActiveOrLatestFlowOutputVariables } from 'builder_platform_interaction/subflowsLib';
import { StageStep } from 'builder_platform_interaction/elementFactory';

/**
 * This is called once the flow has been loaded, so that complex types in the flow have their fields loaded and cached.
 *
 * @param state
 */
export function loadFieldsForComplexTypesInFlow(state) {
    return Promise.all([
        loadFieldsForSobjectsInFlow(state),
        loadFieldsForExtensionsInFlow(state),
        loadParametersForInvocableActionsInFlow(state),
        loadParametersForStageStepsInFlow(state),
        loadFieldsForApexClassesInFlow(state),
        loadFieldsForSubflowsInFlow(state)
    ]);
}

/**
 * @param state
 */
export function loadFieldsForApexClassesInFlow(state) {
    const selector = filteredElementsSelector(
        (element) => element.dataType === FLOW_DATA_TYPE.APEX.value && !element.isCollection
    );
    const apexTypes = selector(state);
    if (apexTypes.length > 0) {
        return loadApexClasses();
    }
    return Promise.resolve();
}

/**
 * @param state
 */
export function loadFieldsForSobjectsInFlow(state) {
    // Only gets elements with sObject datatype (no collections)
    const sobjects = getSObjectOrSObjectCollectionByEntityElements(state.elements);
    const promises = [];
    for (let i = 0; i < sobjects.length; i++) {
        // fetch fields and cache them
        promises.push(
            fetchFieldsForEntity(sobjects[i].subtype, {
                disableErrorModal: true
            }).catch(() => {})
        );
    }
    return Promise.all(promises);
}

/**
 * @param state
 */
export function loadFieldsForExtensionsInFlow(state) {
    return loadFieldsForExtensions(componentInstanceScreenFieldsSelector(state));
}

/**
 * @param state
 */
export function loadFieldsForSubflowsInFlow(state) {
    const selector = filteredElementsSelector((element) => element.dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value);
    const subFlowNames = selector(state).map((subflowElement) => subflowElement.flowName);
    const promises = [];
    for (let i = 0; i < subFlowNames.length; i++) {
        // fetch fields and cache them
        promises.push(
            fetchActiveOrLatestFlowOutputVariables(subFlowNames[i], {
                disableErrorModal: true
            }).catch(() => {})
        );
    }
    return Promise.all(promises);
}

/**
 * @param actionCalls
 */
export function loadParametersForInvocableApexActionsInFlowFromMetadata(actionCalls) {
    const actionCallNamesAndTypes = actionCalls
        .filter(
            (actionCall) => actionCall.storeOutputAutomatically === true && actionCall.actionType === ACTION_TYPE.APEX
        )
        .map((actionCall) => ({
            actionName: actionCall.actionName,
            actionType: actionCall.actionType
        }));
    const promises = [];
    actionCallNamesAndTypes.forEach((actionCallNameAndType) =>
        promises.push(
            fetchDetailsForInvocableAction(actionCallNameAndType, {
                disableErrorModal: true,
                background: true
            }).catch(() => {})
        )
    );
    return Promise.all(promises);
}

/**
 * @param screenFields
 */
export function loadFieldsForExtensionsInFlowFromMetadata(screenFields: Metadata.ScreenField[]): Promise<any> {
    return loadFieldsForExtensions(screenFields);
}

/**
 * @param screenFields
 */
function loadFieldsForExtensions(screenFields: (UI.ScreenField | Metadata.ScreenField)[]): Promise<any> {
    const extensionNames = screenFields
        .filter((screenField) => screenField.storeOutputAutomatically === true)
        .map((screenField) => screenField.extensionName);
    return describeExtensions(extensionNames, {
        disableErrorModal: true,
        background: true
    }).catch(() => {});
}

/**
 * @param state
 */
export async function loadParametersForInvocableActionsInFlow(state: UI.StoreState) {
    // we only get the action that have outputs. (e.g. EMAIL_ALERT is excluded)
    const actionCallsSelector = byElementTypeElementsSelector(
        ELEMENT_TYPE.ACTION_CALL,
        ELEMENT_TYPE.APEX_CALL,
        ELEMENT_TYPE.EXTERNAL_SERVICE
    );
    const actionCallNamesAndTypes = actionCallsSelector(state)
        .filter((actionCall) => actionCall.storeOutputAutomatically === true)
        .map((actionCall) => ({
            actionName: actionCall.actionName,
            actionType: actionCall.actionType
        }));

    return loadParametersForInvocableActions(actionCallNamesAndTypes);
}

/**
 * Load output parameters for all StageSteps with actions so they will be available
 * for use in the combobox
 *
 * @param state
 */
export async function loadParametersForStageStepsInFlow(state: UI.StoreState) {
    const stageStepSelector = byElementTypeElementsSelector(ELEMENT_TYPE.STAGE_STEP);

    const steps: StageStep[] = stageStepSelector(state);

    const actionCallNamesAndTypes = steps.map((step: StageStep) => {
        return {
            actionName: step.actionName,
            actionType: step.actionType
        };
    });

    return loadParametersForInvocableActions(actionCallNamesAndTypes);
}

/**
 * @param actionCallNamesAndTypes
 */
export function loadParametersForInvocableActions(actionCallNamesAndTypes) {
    const promises = [];
    actionCallNamesAndTypes.forEach((actionCallNameAndType) =>
        promises.push(
            fetchDetailsForInvocableAction(actionCallNameAndType, {
                disableErrorModal: true,
                background: true
            }).catch(() => {})
        )
    );
    return Promise.all(promises);
}
