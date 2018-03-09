import { ELEMENT_INFOS, FLOW_PROPERTIES } from './translation-config';
import { swapUidsForDevNames } from './uid-swapping';
import { omit, pick, updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { deepCopy } from 'builder_platform_interaction-store-lib';

/**
 * Translate UI data model to Flow tooling object
 * @param {Object} uiModel UI data model representation of the Flow
 * @returns {Object} Flow object that can be deserialized into the Flow tooling object
 */
export function translateUIModelToFlow(uiModel) {
    const elements = deepCopy(Object.values(uiModel.elements));
    // Swap out guids for dev names in all element references
    swapUidsForDevNames(uiModel.elements, elements);

    // Construct Flow metadata object
    let metadata = {
    };

    // create empty collections for each element type
    Object.values(ELEMENT_INFOS).forEach(elementInfo => {
        metadata[elementInfo.metadataKey] = [];
    });

    Object.keys(elements).forEach(key => {
        let element = elements[key];
        const elementInfo = ELEMENT_INFOS[element.elementType];

        if (!elementInfo) {
            throw new Error('Unknown element type ' + element.elementType);
        }

        // remove transient fields to avoid breaking deserialization
        element = omit(element, ['guid', 'elementType', 'isCanvasElement', 'config', 'connectorCount', 'maxConnections']);
        if (element.connector) {
            element.connector = omit(element.connector, ['config']);
        }

        metadata[elementInfo.metadataKey].push(element);
    });

    metadata = updateProperties(metadata, pick(uiModel.properties, FLOW_PROPERTIES));

    if (uiModel.startElement !== null &&
         uiModel.elements[uiModel.startElement]) {
        metadata.startElementReference = uiModel.elements[uiModel.startElement].name;
    }

    return {
        metadata,
        fullName: uiModel.properties.fullName
    };
}
