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
