import { ELEMENT_INFOS, FLOW_PROPERTIES } from './translation-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { swapUidsForDevNames } from './uid-swapping';
import { omit, pick, updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { deepCopy } from 'builder_platform_interaction-store-lib';
import { getFlowBounds, setConnectorsOnElements } from 'builder_platform_interaction-connector-utils';

/**
 * Helper method to get array of all canvas element objects
 * @param {Array} canvasElements All canvas elements
 * @param {Object} elements All elements in the flow
 * @return {Array} nodes Containing all canvas element objects
 */
const getCanvasElements = (canvasElements, elements) => {
    const nodes = [];
    canvasElements.map(key => {
        if (elements[key]) {
            nodes.push(elements[key]);
        }
        return key;
    });
    return nodes;
};

/**
 * With zooming and panning enabled, the user would be able to add/drop
 * elements with negative coordinates. Therefore, updating all elements to have positive coordinates on save.
 *
 * @param {Array} canvasElements All canvas elements
 * @param {Object} elements All elements in the flow
 */
const updateElementLocation = (canvasElements, elements) => {
    const EXTRA_SPACING = 50;

    const flowBounds = getFlowBounds(getCanvasElements(canvasElements, elements));

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

    if (translateX !== 0 || translateY !== 0) {
        canvasElements.forEach(key => {
            if (translateX !== 0) {
                elements[key].locationX += translateX;
            }

            if (translateY !== 0) {
                elements[key].locationY += translateY;
            }
        });
    }
};

const omitTransientFields = (element) => {
    return omit(element, ['guid', 'elementType', 'isCanvasElement', 'config', 'connectorCount', 'maxConnections']);
};

const translateElementHashToHaveDevNameKeys = (elements) => {
    Object.keys(elements).forEach(key => {
        const element = elements[key];
        elements[element.name] = element;

        delete elements[key];
    });
    return elements;
};


/**
 * Rehydrate all of a decision's outcomeReferences in to rules
 *
 * @param {Object} decision The decision element
 * @param {Object} elements All elements in the flow (including outcomes)
 */
const includeOutcomesInDecision = (decision, elements) => {
    // We use the non-translated decision element, since it still has guids (instead of devNames)
    // which are what we need as keys in the elements hash
    decision.rules = decision.outcomeReferences.map((outcomeReference) => {
        let rule = elements[outcomeReference.outcomeReference];
        rule = omitTransientFields(rule);
        return rule;
    });

    delete decision.outcomeReferences;
};

/**
 * Translate UI data model to Flow tooling object
 *
 * @param {Object} uiModel UI data model representation of the Flow
 * @returns {Object} Flow object that can be deserialized into the Flow tooling object
 */
export function translateUIModelToFlow(uiModel) {
    let elements = deepCopy(uiModel.elements);

    // Update element location
    updateElementLocation(uiModel.canvasElements, elements);

    // Set connector properties on all elements
    const startElementId = setConnectorsOnElements(uiModel.connectors, elements);

    // Swap out guids for dev names in all element references
    swapUidsForDevNames(uiModel.elements, elements);

    elements = translateElementHashToHaveDevNameKeys(elements);

    // Construct Flow metadata object
    let metadata = {
    };

    Object.keys(elements).forEach(key => {
        let element = elements[key];
        const elementInfo = ELEMENT_INFOS[element.elementType];

        if (!elementInfo) {
            throw new Error('Unknown element type ' + element.elementType);
        }

        if (!elementInfo.metadataKey) {
            // outcomes are ignored, instead being included in the metadata via their
            // parent decisions
            return;
        }

        // Hydrate decsions with their outcomes (rules)
        if (element.elementType === ELEMENT_TYPE.DECISION) {
            includeOutcomesInDecision(element, elements);
        }

        // remove transient fields to avoid breaking deserialization
        element = omitTransientFields(element);

        if (!metadata[elementInfo.metadataKey]) {
            metadata[elementInfo.metadataKey] = [];
        }

        metadata[elementInfo.metadataKey].push(element);
    });

    metadata = updateProperties(metadata, pick(uiModel.properties, FLOW_PROPERTIES));

    if (startElementId &&
         uiModel.elements[startElementId]) {
        metadata.startElementReference = uiModel.elements[startElementId].name;
    }

    return {
        metadata,
        fullName: uiModel.properties.fullName
    };
}
