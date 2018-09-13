import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
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
    createVariableForStore
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
        case ELEMENT_TYPE.ACTION_CALL:
            return createActionCallWithConnectors(element);
        case ELEMENT_TYPE.APEX_CALL:
            return createActionCallWithConnectors(element, ELEMENT_TYPE.APEX_CALL);
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
            return createApexPluginWithConnectors(element);
        case ELEMENT_TYPE.ASSIGNMENT:
            return createAssignmentWithConnectors(element);
        case ELEMENT_TYPE.CONSTANT:
            return createConstantForStore(element);
        case ELEMENT_TYPE.DECISION:
            return createDecisionWithOutcomeReferences(element);
        case ELEMENT_TYPE.WAIT:
            return createWaitWithConnectors(element);
        case ELEMENT_TYPE.EMAIL_ALERT:
            return createActionCallWithConnectors(element, ELEMENT_TYPE.EMAIL_ALERT);
        case ELEMENT_TYPE.FLOW_PROPERTIES:
            return createFlowProperties(element);
        case ELEMENT_TYPE.FORMULA:
            return createFormulaForStore(element);
        case ELEMENT_TYPE.LOOP:
            return createLoopWithConnectors(element);
        case ELEMENT_TYPE.RECORD_CREATE:
            return createRecordCreateWithConnectors(element);
        case ELEMENT_TYPE.RECORD_LOOKUP:
            return createRecordLookupWithConnectors(element);
        case ELEMENT_TYPE.RECORD_UPDATE:
            return createRecordUpdateWithConnectors(element);
        case ELEMENT_TYPE.RECORD_DELETE:
            return createRecordDeleteWithConnectors(element);
        case ELEMENT_TYPE.SCREEN:
            return createScreenWithConnectors(element);
        case ELEMENT_TYPE.SUBFLOW:
            return createSubflowWithConnectors(element);
        case ELEMENT_TYPE.VARIABLE:
            return createVariableForStore(element);
        default:
            return {};
    }

    // TODO Add other element types
};
