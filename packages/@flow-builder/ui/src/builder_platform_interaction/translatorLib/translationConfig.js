import { elementTypeToConfigMap } from "builder_platform_interaction/elementConfig";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { pick } from "builder_platform_interaction/dataMutationLib";

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
