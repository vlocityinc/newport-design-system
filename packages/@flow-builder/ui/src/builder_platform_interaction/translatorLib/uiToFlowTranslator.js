import { ELEMENT_INFOS } from "./translationConfig";
import { ELEMENT_TYPE, PROCESS_METADATA_VALUES } from "builder_platform_interaction/flowMetadata";
import { swapUidsForDevNames } from "./uidSwapping";
import { updateProperties } from "builder_platform_interaction/dataMutationLib";
import { getFlowBounds } from "builder_platform_interaction/connectorUtils";
import { uiToFlowFactory } from "./uiToFlowFactory";

const getXYTranslate = (canvasElements) => {
    const EXTRA_SPACING = 180;

    const flowBounds = getFlowBounds(canvasElements);

    let translateX = 0;
    let translateY = 0;

    // Adding extra spacing so that the left most element doesn't end up on the very left edge.
    if (flowBounds.minX < 0) {
        translateX = EXTRA_SPACING - flowBounds.minX;
    }

    // Adding extra spacing so that the top most element doesn't end up on the very top edge.
    if (flowBounds.minY < 0) {
        translateY = EXTRA_SPACING - flowBounds.minY;
    }

    return { translateX, translateY };
};

/**
 * Translate UI data model to Flow tooling object
 *
 * @param {Object} uiModel UI data model representation of the Flow
 * @returns {Object} Flow object that can be deserialized into the Flow tooling object
 */
export function translateUIModelToFlow(uiModel) {
    const elements = uiModel.elements;
    const connectors = uiModel.connectors;
    const { name, versionNumber } = uiModel.properties;

    // Get map of source element guids to connectors
    const connectorMap = {};
    for (let i = 0; i < connectors.length; i++) {
        const connector = connectors[i];
        const sourceGuid = connector.childSource || connector.source;
        const sourceConnectorList = connectorMap[sourceGuid] || [];
        sourceConnectorList.push(connector);
        Object.assign(connectorMap, {[sourceGuid] : sourceConnectorList});
    }

    // Get x, y coordinate translate numbers
    const canvasElements = uiModel.canvasElements.map(guid => elements[guid]);
    const xyTranslate = getXYTranslate(canvasElements);

    const config = { xyTranslate, connectorMap };

    // Construct Flow metadata object
    let metadata = {};
    let startElementId;

    const elementKeys = Object.keys(elements);
    for (let i = 0; i < elementKeys.length; i++) {
        const key = elementKeys[i];
        const element = elements[key];
        const elementInfo = ELEMENT_INFOS[element.elementType];

        if (!elementInfo) {
            throw new Error('Unknown element type ' + element.elementType);
        }

        if (element.elementType === ELEMENT_TYPE.START_ELEMENT) {
            const startConnectors = connectorMap[element.guid];
            if (startConnectors && startConnectors.length > 0) {
                startElementId = startConnectors[0].target;
            }
        } else if (elementInfo.metadataKey) {
            if (!metadata[elementInfo.metadataKey]) {
                metadata[elementInfo.metadataKey] = [];
            }

            const metadataElement = uiToFlowFactory(element, config);

            metadata[elementInfo.metadataKey].push(metadataElement);
        }
    }

    const flowProperties = uiToFlowFactory(uiModel.properties);
    metadata = updateProperties(metadata, flowProperties);

    // Swap out guids for dev names in all element references
    swapUidsForDevNames(elements, metadata);

    if (startElementId && elements[startElementId]) {
        const startElementReference = elements[startElementId].name;
        Object.assign(metadata, { startElementReference });
    }

    const processMetadataValues = PROCESS_METADATA_VALUES;
    Object.assign(metadata, { processMetadataValues });

    return {
        metadata,
        fullName: name,
        versionNumber
    };
}