import { ELEMENT_INFOS, FLOW_PROPERTIES } from './translation-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';
import { swapUidsForDevNames } from './uid-swapping';
import { omit, pick, updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { deepCopy } from 'builder_platform_interaction-store-lib';

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
 * @param {Object} uiModel UI data model representation of the Flow
 * @returns {Object} Flow object that can be deserialized into the Flow tooling object
 */
export function translateUIModelToFlow(uiModel) {
    let elements = deepCopy(uiModel.elements);

    // Swap out guids for dev names in all element references
    swapUidsForDevNames(uiModel.elements, elements);

    elements = translateElementHashToHaveDevNameKeys(elements);

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

        // Hydrate decsions with their outcomes (rules)
        if (element.elementType === ELEMENT_TYPE.DECISION) {
            includeOutcomesInDecision(element, elements);
        } if (element.elementType === ELEMENT_TYPE.OUTCOME) {
            // outcomes are ignored, instead being included in the metadata via their
            // parent decisions
            return;
        } else if (!elementInfo) {
            throw new Error('Unknown element type ' + element.elementType);
        }

        // remove transient fields to avoid breaking deserialization
        element = omitTransientFields(element);
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
