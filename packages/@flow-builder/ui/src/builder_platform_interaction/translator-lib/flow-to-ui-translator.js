import { deepCopy, generateGuid } from 'builder_platform_interaction-store-lib';
import { ELEMENT_INFOS, FLOW_PROPERTIES } from './translation-config';
import { swapDevNamesToUids } from './uid-swapping';
import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';
import { pick } from 'builder_platform_interaction-data-mutation-lib';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';

/**
 * Decorate the element with ui specific data
 * and data corresponding to it's element type )
 *
 * @param {Array} element            array of the elements
 * @param {String} elementType       type of element ex: assignment,
 * @param {boolean} isCanvasElement  indicator if the element shows on the canvas
 *
 * @returns {Object}                 decorated element
 */
export function convertElement(element, elementType, isCanvasElement) {
    // include transient fields
    element = deepCopy(element);
    element.elementType = elementType;
    element.isCanvasElement = isCanvasElement;

    if (element.isCanvasElement) {
        element.config = {isSelected:false};

        const nodeConfig = getConfigForElementType(element.elementType).nodeConfig;
        element.maxConnections = nodeConfig.maxConnections;
        element.connectorCount = 0;

        const connector = element.connector;

        if (connector && connector.targetReference) {
            connector.config = {isSelected: false};
            element.connectorCount += 1;
        }
    }
    return element;
}

/**
 * Convert all decision rules to outcomes
 * @param {Object} decision Flow decision
 * @returns {Object} Map of guids->outcomes
 */
const convertDecisionRules = (decision) => {
    return decision.rules.map((rule) => {
        return convertElement(rule, ELEMENT_TYPE.OUTCOME, false);
    });
};

/**
 * Converting decision rules to outcomes and clean up decision
 * @param {Object} decision Decision flow object
 * @returns {Object} Array of all outcomes for the decision
 */
const convertDecision = (decision) => {
    const outcomes = convertDecisionRules(decision);

    // For now, just create the array of rule devNames.  These will be converted
    // to guids when all other devName->guid conversion happens
    decision.outcomeReferences = outcomes.map((outcome) => {
        return {outcomeReference: outcome.name};
    });

    delete decision.rules;

    return outcomes;
};

/**
 * Generates a GUID and updates the GUID map
 * Add the given set of elements to the primary element map
 *
 * Decorates the element with it's element type, canvas status
 *
 * @param {Object} nameToGuid        map of dev names to GUIDs
 * @param {Array} elements           array of the elements
 * @param {String} elementType       type of element ex: assignment,
 * @param {boolean} isCanvasElement  indicator if the element shows on the canvas
 *
 * @returns {Object}                 map of guid -> elements
 */
export function convertElements(nameToGuid, elements, elementType, isCanvasElement) {
    const elementMap = {};

    const convertedElements = [];
    elements.forEach((element) => {
        const convertedElement = convertElement(element, elementType, isCanvasElement);

        if (elementType === ELEMENT_TYPE.DECISION) {
            convertedElements.push(...convertDecision(convertedElement));
        }

        convertedElements.push(convertedElement);
    });

    convertedElements.forEach((element) => {
        element.guid = generateGuid(element.elementType); // generates an id like assignment_00012
        nameToGuid[element.name] = element.guid;
        elementMap[element.guid] = element;
    });

    return elementMap;
}

/**
 * Method to create a connector object from the source element
 *
 * @param {Object} element                canvas element with an associated connector
 * @returns {Object} connector            connectors object
 */
export const createConnectorElement = (element) => {
    const connector = {};
    connector.guid = generateGuid('CONNECTOR');
    connector.source = element.guid;
    connector.target = element.connector.targetReference;
    // TODO: update for decision and other nodes
    connector.label = 'Label';
    connector.config = {
        isSelected: false
    };
    return connector;
};


/**
 * Translate flow tooling object into UI data model
 * @param {Object} flow Flow tooling object
 * @returns {Object} UI representation of the Flow in a normalized shape
 */
export function translateFlowToUIModel(flow) {
    // All variable ids
    const variables = [];

    // All outcome ids
    // Note: outcomes are actually called rules on the backend
    const outcomes = [];

    // All canvas element ids
    const canvasElements = [];

    const elements = {};

    const connectors = [];

    let properties = {};
    const nameToGuid = {};

    // convert each type of element
    // ex: assignments, decision, variables
    Object.entries(ELEMENT_INFOS).forEach(([elementType, elementInfo]) => {
        const convertedElements = convertElements(nameToGuid,
            flow.metadata[elementInfo.metadataKey],
            elementType,
            elementInfo.canvasElement
        );
        Object.assign(elements, convertedElements);
    });

    // Swap out dev names for guids in all element references
    swapDevNamesToUids(nameToGuid, elements);

    // Construct arrays of all canvas element GUIDs and all variables GUIDs
    Object.values(elements).forEach(element => {
        if (element.isCanvasElement) {
            canvasElements.push(element.guid);
            if (element.connector && element.connector.targetReference) {
                connectors.push(createConnectorElement(element));
            }
        } else if (element.elementType === ELEMENT_TYPE.VARIABLE) {
            variables.push(element.guid);
        } else if (element.elementType === ELEMENT_TYPE.OUTCOME) {
            outcomes.push(element.guid);
        }
    });

    // Construct flow properties object
    properties = pick(flow.metadata, FLOW_PROPERTIES);
    properties.fullName = flow.fullName;

    let startElement;
    if (flow.metadata.startElementReference !== null) {
        startElement = nameToGuid[flow.metadata.startElementReference];
    }

    return {
        elements,
        connectors,
        variables,
        canvasElements,
        properties,
        outcomes,
        startElement
    };
}
