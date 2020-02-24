import { Data } from 'analyzer_framework/api';
import { Element } from './element';
import { getMapping } from './utils';
import { METADATA_KEY } from 'builder_platform_interaction/flowMetadata';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';

/**
 * @description The flow top level representation of data which is passed to the guardrails.
 */
export const FLOW_PROPERTIES = {
    TYPE: 'FLOW',
    CONNECTOR_TARGETS: 'connectorTargets'
};
export class Flow extends Data {
    constructor(flowModel) {
        let elements = [];
        const mappings = {};
        super(flowModel.fullName);
        for (const metadataKey of Object.keys(flowModel.metadata)) {
            if (Object.values(METADATA_KEY).includes(metadataKey)) {
                if (flowModel.metadata[metadataKey]) {
                    elements = [];
                    const elementType = Object.keys(elementTypeToConfigMap).find(key => {
                        return (
                            elementTypeToConfigMap[key].hasOwnProperty('metadataKey') &&
                            elementTypeToConfigMap[key].metadataKey === metadataKey
                        );
                    });
                    const metadataElements =
                        flowModel.metadata[metadataKey] instanceof Array
                            ? flowModel.metadata[metadataKey]
                            : [flowModel.metadata[metadataKey]];
                    for (const element of metadataElements) {
                        Object.assign(mappings, getMapping(element, elementType));
                        elements.push(new Element(element.name, elementType, element));
                    }
                    this[metadataKey] = elements;
                }
            } else {
                this[metadataKey] = flowModel.metadata[metadataKey];
            }
        }
        this.type = FLOW_PROPERTIES.TYPE;
        this.name = flowModel.name;
        this.version = flowModel.version;
        this.consumerProperties = {};
        this.consumerProperties[FLOW_PROPERTIES.CONNECTOR_TARGETS] = mappings;
    }
}
