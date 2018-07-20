import { elementTypeToConfigMap } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { pick } from 'builder_platform_interaction-data-mutation-lib';

export const ELEMENT_INFOS = {};
Object.entries(elementTypeToConfigMap).forEach(([elementType, config]) => {
    if (elementType !== ELEMENT_TYPE.DEFAULT) {
        ELEMENT_INFOS[elementType] = pick(config, [
            'metadataKey',
            'metadataFilter',
            'canvasElement'
        ]);
    }
});

// Top level fields to be copied over
export const FLOW_PROPERTIES = [
    'label',
    'description',
    'interviewLabel',
    'processType',
    'status'
];
