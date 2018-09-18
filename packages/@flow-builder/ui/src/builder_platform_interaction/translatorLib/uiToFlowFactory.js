import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import {
    createActionCallMetadataObject,
    createApexPluginMetadataObject,
    createAssignmentMetadataObject,
    createConstantMetadataObject,
    createDecisionMetadataObject,
    createFlowPropertiesMetadataObject,
    createFormulaMetadataObject,
    createLoopMetadataObject,
    createRecordCreateMetadataObject,
    createRecordUpdateMetadataObject,
    createRecordLookupMetadataObject,
    createRecordDeleteMetadataObject,
    createScreenMetadataObject,
    createSubflowMetadataObject,
    createVariableMetadataObject,
    createTextTemplateMetadataObject
} from "builder_platform_interaction/elementFactory";

/**
 * Element factory to create new objects for each element type in the shape that the store expects
 * @param {Object} element       Metadata element to be used as the base for copying information
 * @param {Object} config        Config for element creation
 * @return {Object}              New element object in the shape that the store expects
 */
export const uiToFlowFactory = (element, config) => {
    switch (element.elementType) {
        case ELEMENT_TYPE.ACTION_CALL:
            return createActionCallMetadataObject(element, config);
        case ELEMENT_TYPE.APEX_CALL:
            return createActionCallMetadataObject(element, config);
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
            return createApexPluginMetadataObject(element, config);
        case ELEMENT_TYPE.ASSIGNMENT:
            return createAssignmentMetadataObject(element, config);
        case ELEMENT_TYPE.CONSTANT:
            return createConstantMetadataObject(element, config);
        case ELEMENT_TYPE.EMAIL_ALERT:
            return createActionCallMetadataObject(element, config);
        case ELEMENT_TYPE.FLOW_PROPERTIES:
            return createFlowPropertiesMetadataObject(element);
        case ELEMENT_TYPE.FORMULA:
            return createFormulaMetadataObject(element, config);
        case ELEMENT_TYPE.LOOP:
            return createLoopMetadataObject(element, config);
        case ELEMENT_TYPE.DECISION:
            return createDecisionMetadataObject(element, config);
        case ELEMENT_TYPE.RECORD_CREATE:
            return createRecordCreateMetadataObject(element, config);
        case ELEMENT_TYPE.RECORD_UPDATE:
            return createRecordUpdateMetadataObject(element, config);
        case ELEMENT_TYPE.RECORD_LOOKUP:
            return createRecordLookupMetadataObject(element, config);
        case ELEMENT_TYPE.RECORD_DELETE:
            return createRecordDeleteMetadataObject(element, config);
        case ELEMENT_TYPE.SCREEN:
            return createScreenMetadataObject(element, config);
        case ELEMENT_TYPE.SUBFLOW:
            return createSubflowMetadataObject(element, config);
        case ELEMENT_TYPE.VARIABLE:
            return createVariableMetadataObject(element, config);
        case ELEMENT_TYPE.TEXT_TEMPLATE:
            return createTextTemplateMetadataObject(element, config);
        default:
            return {};
    }

    // TODO Add other element types
};
