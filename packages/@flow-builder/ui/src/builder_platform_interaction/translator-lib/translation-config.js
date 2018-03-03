import { ELEMENT_TYPE } from "builder_platform_interaction-constant";

/**
 * List of Flow metadata fields that can be references to other Flow elements
 * i.e. fields whose values need to be converted from dev names to GUIDs when loading the flow into the UI client and vice versa.
 */
export const REFERENCE_FIELDS = new Set([
    "elementReference",
    "targetReference",
    "assignToReference",
    "assignNextValueToReference",
    "collectionReference",
    "inputReference",
    "outputReference",
    "assignRecordIdToReference"
]);

/**
 * List of Flow metadata fields that can contain {!reference} tags referencing flow elements
 * These would also need to be replaced
 */
export const TEMPLATE_FIELDS = new Set([
]);

export const ELEMENT_INFO_ARRAY = [
    { metadataKey : 'actionCalls', elementType : ELEMENT_TYPE.ACTION_CALL, canvasElement: true },
    { metadataKey : 'assignments', elementType : ELEMENT_TYPE.ASSIGNMENT, canvasElement: true },
    { metadataKey : 'decisions', elementType : ELEMENT_TYPE.DECISION, canvasElement: true },
    { metadataKey : 'variables', elementType : ELEMENT_TYPE.VARIABLE, canvasElement: false },
    { metadataKey : 'apexPluginCalls', elementType : ELEMENT_TYPE.APEX_PLUGIN_CALL, canvasElement: false },
    { metadataKey : 'choices', elementType : ELEMENT_TYPE.CHOICE, canvasElement: false },
    { metadataKey : 'constants', elementType : ELEMENT_TYPE.CONSTANT, canvasElement: false },
    { metadataKey : 'dynamicChoiceSets', elementType : ELEMENT_TYPE.DYNAMIC_CHOICE_SET, canvasElement: false },
    { metadataKey : 'formulas', elementType : ELEMENT_TYPE.FORMULA, canvasElement: false },
    { metadataKey : 'stages', elementType : ELEMENT_TYPE.STAGE, canvasElement: false },
    { metadataKey : 'textTemplates', elementType : ELEMENT_TYPE.TEXT_TEMPLATE, canvasElement: false },
    { metadataKey : 'loops', elementType : ELEMENT_TYPE.LOOP, canvasElement: true },
    { metadataKey : 'recordCreates', elementType : ELEMENT_TYPE.RECORD_CREATE, canvasElement: true },
    { metadataKey : 'recordDeletes', elementType : ELEMENT_TYPE.RECORD_DELETE, canvasElement: true },
    { metadataKey : 'recordLookups', elementType : ELEMENT_TYPE.RECORD_LOOKUP, canvasElement: true },
    { metadataKey : 'recordUpdates', elementType : ELEMENT_TYPE.RECORD_UPDATE, canvasElement: true },
    { metadataKey : 'screens', elementType : ELEMENT_TYPE.SCREEN, canvasElement: true },
    { metadataKey : 'steps', elementType : ELEMENT_TYPE.STEP, canvasElement: true },
    { metadataKey : 'subflows', elementType : ELEMENT_TYPE.SUBFLOW, canvasElement: true },
    { metadataKey : 'waits', elementType : ELEMENT_TYPE.WAIT, canvasElement: true },
];

export const ELEMENT_INFOS = {};
ELEMENT_INFO_ARRAY.forEach(info => {
    ELEMENT_INFOS[info.elementType] = info;
});


// Top level fields to be copied over
export const FLOW_PROPERTIES = ['label',
    'description',
    'interviewLabel',
    'processType'
];
