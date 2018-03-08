import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';
import { elementTypeToConfigMap } from 'builder_platform_interaction-element-config';
import { pick } from 'builder_platform_interaction-data-mutation-lib';

/**
 * List of Flow metadata fields that can be references to other Flow elements
 * i.e. fields whose values need to be converted from dev names to GUIDs when loading the flow into the UI client and vice versa.
 */
export const REFERENCE_FIELDS = new Set([
    'elementReference',
    'targetReference',
    'assignToReference',
    'assignNextValueToReference',
    'collectionReference',
    'inputReference',
    'outputReference',
    'assignRecordIdToReference'
]);

/**
 * List of Flow metadata fields that can contain {!reference} tags referencing flow elements
 * These would also need to be replaced
 */
export const TEMPLATE_FIELDS = new Set([]);

export const ELEMENT_INFOS = {};
Object.entries(elementTypeToConfigMap).forEach(([elementType, config]) => {
    if (elementType !== ELEMENT_TYPE.DEFAULT) {
        ELEMENT_INFOS[elementType] = pick(config, [
            'metadataKey',
            'canvasElement'
        ]);
    }
});

// Top level fields to be copied over
export const FLOW_PROPERTIES = [
    'label',
    'description',
    'interviewLabel',
    'processType'
];
