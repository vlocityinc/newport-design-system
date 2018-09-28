import { ACTION_TYPE, ELEMENT_TYPE, METADATA_KEY } from "builder_platform_interaction/flowMetadata";
import {
    createActionCallWithConnectors,
    createApexPluginWithConnectors,
    createAssignmentWithConnectors,
    createConstantForStore,
    createDecisionWithOutcomeReferences,
    createFormulaForStore,
    createFlowProperties,
    createLoopWithConnectors,
    createWaitWithConnectors,
    createRecordCreateWithConnectors,
    createRecordUpdateWithConnectors,
    createRecordLookupWithConnectors,
    createRecordDeleteWithConnectors,
    createScreenWithConnectors,
    createSubflowWithConnectors,
    createVariableForStore,
    createTextTemplateForStore,
    createStageForStore,
    createChoiceForStore,
    createStepWithConnectorsForStore,
    createPicklistChoiceGroupForStore,
    createRecordChoiceGroupForStore
} from "builder_platform_interaction/elementFactory";

/**
 * Element factory to create new objects for each element type in the shape that the store expects
 *
 * @param {String}  elementType     Element type
 * @param {Object}  element         Metadata element to be used as the base for copying information
 * @return {Object} storeObjects    Element and connector objects in the shape that the store expects for the given metadata element
 */
export const flowToUIFactory = (elementType, element) => {
    switch (elementType) {
        case METADATA_KEY.ACTION_CALLS:
            return actionCallFactory(element);
        case METADATA_KEY.APEX_PLUGIN_CALLS:
            return createApexPluginWithConnectors(element);
        case METADATA_KEY.ASSIGNMENTS:
            return createAssignmentWithConnectors(element);
        case METADATA_KEY.CONSTANTS:
            return createConstantForStore(element);
        case METADATA_KEY.DECISIONS:
            return createDecisionWithOutcomeReferences(element);
        case METADATA_KEY.WAITS:
            return createWaitWithConnectors(element);
        case METADATA_KEY.FORMULAS:
            return createFormulaForStore(element);
        case METADATA_KEY.LOOPS:
            return createLoopWithConnectors(element);
        case METADATA_KEY.RECORD_CREATES:
            return createRecordCreateWithConnectors(element);
        case METADATA_KEY.RECORD_LOOKUPS:
            return createRecordLookupWithConnectors(element);
        case METADATA_KEY.RECORD_UPDATES:
            return createRecordUpdateWithConnectors(element);
        case METADATA_KEY.RECORD_DELETES:
            return createRecordDeleteWithConnectors(element);
        case METADATA_KEY.SCREENS:
            return createScreenWithConnectors(element);
        case METADATA_KEY.SUBFLOWS:
            return createSubflowWithConnectors(element);
        case METADATA_KEY.VARIABLES:
            return createVariableForStore(element);
        case METADATA_KEY.TEXT_TEMPLATES:
            return createTextTemplateForStore(element);
        case METADATA_KEY.STAGES:
            return createStageForStore(element);
        case METADATA_KEY.CHOICES:
            return createChoiceForStore(element);
        case METADATA_KEY.STEPS:
            return createStepWithConnectorsForStore(element);
        case METADATA_KEY.DYNAMIC_CHOICE_SETS:
            return dynamicChoiceSetFactory(element);

        // Flow properties do not have metadata key
        case ELEMENT_TYPE.FLOW_PROPERTIES:
            return createFlowProperties(element);
        default:
            return {};
    }

    // TODO Add other element types
};

function actionCallFactory(element) {
    const actionType = element.actionType;
    switch (actionType) {
        case ACTION_TYPE.EMAIL_ALERT:
            return createActionCallWithConnectors(element, ELEMENT_TYPE.EMAIL_ALERT);
        case ACTION_TYPE.APEX:
            return createActionCallWithConnectors(element, ELEMENT_TYPE.APEX_CALL);
        // TODO: Handle case for action type flow
        default:
            return createActionCallWithConnectors(element);
    }
}

function dynamicChoiceSetFactory(element) {
    const dataType = element.dataType;
    switch (dataType) {
        case "Picklist":
        case "Multipicklist":
            return createPicklistChoiceGroupForStore(element);
        default:
            return createRecordChoiceGroupForStore(element);
    }
}