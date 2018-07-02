import { deepCopy, generateGuid } from 'builder_platform_interaction-store-lib';
import { ELEMENT_INFOS, FLOW_PROPERTIES } from './translation-config';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { swapDevNamesToUids } from './uid-swapping';
import { pick } from 'builder_platform_interaction-data-mutation-lib';
import { ELEMENT_TYPE, RESOURCE_TYPES } from 'builder_platform_interaction-flow-metadata';
import { createConnectorsAndConnectionProperties, createStartElement, CONNECTOR_TYPE } from 'builder_platform_interaction-connector-utils';

/**
 * Decorate the element with ui specific data and data corresponding to it's element type
 *
 * @param {Object} element           element to be converted
 * @param {String} elementType       type of element ex: assignment,
 * @param {boolean} isCanvasElement  indicator if the element shows on the canvas
 *
 * @returns {Object}                 decorated element
 */
export function convertElement(element, elementType, isCanvasElement) {
    // include transient fields
    element = deepCopy(element);
    element.elementType = elementType;
    element.guid = generateGuid(element.elementType); // generates an id like assignment_00012
    element.isCanvasElement = isCanvasElement;

    if (element.isCanvasElement) {
        element.config = { isSelected: false };
    }

    return element;
}

/**
 * Convert all decision rules to outcomes
 *
 * @param {Object} decision Flow decision
 * @returns {Object} Map of guids->outcomes
 */
const convertDecisionRules = decision => {
    return decision.rules.map(rule => {
        rule.dataType = 'Boolean';
        return convertElement(rule, ELEMENT_TYPE.OUTCOME, false);
    });
};

/**
 * Converting decision rules to outcomes and clean up decision
 *
 * @param {Object} decision Decision flow object
 * @returns {Object} Array of all outcomes for the decision
 */
const convertDecision = decision => {
    const outcomes = convertDecisionRules(decision);

    // For now, just create the array of rule devNames. These will be converted
    // to guids when all other devName->guid conversion happens
    decision.outcomeReferences = outcomes.map(outcome => {
        return { outcomeReference: outcome.name };
    });

    decision.availableConnections = outcomes.map(outcome => {
        return {
            type: CONNECTOR_TYPE.REGULAR,
            childReference: outcome.name
        };
    });
    decision.availableConnections.push({type: CONNECTOR_TYPE.DEFAULT});

    delete decision.rules;

    return outcomes;
};

/**
 * Generates a GUID and decorates the element with it's guid, element type, canvas status
 *
 * @param {Array} elements           array of the elements of a given type
 * @param {String} elementType       type of element ex: assignment
 *
 * @returns {Array}                  list of converted elements
 */
export function convertElements(elements, elementType) {
    const convertedElements = [];
    const elementConfig = getConfigForElementType(elementType);
    const isCanvasElement = elementConfig.canvasElement;
    const canHaveFaultConnector = elementConfig.canHaveFaultConnector;
    const canHaveDefaultConnector = elementConfig.canHaveDefaultConnector;

    elements.forEach(element => {
        const convertedElement = convertElement(
            element,
            elementType,
            isCanvasElement
        );

        if (elementType === ELEMENT_TYPE.DECISION) {
            convertedElements.push(...convertDecision(convertedElement));
        } else if (elementType === ELEMENT_TYPE.LOOP) {
            convertedElement.availableConnections = [];
            convertedElement.availableConnections.push({type : CONNECTOR_TYPE.LOOP_NEXT});
            convertedElement.availableConnections.push({type : CONNECTOR_TYPE.LOOP_END});
        } else if (elementType === ELEMENT_TYPE.SCREEN) {
            for (const field of convertedElement.fields) {
                field.guid = generateGuid();
            }
        } else if (canHaveFaultConnector || canHaveDefaultConnector) {
            convertedElement.availableConnections = [];

            if (canHaveFaultConnector) {
                convertedElement.availableConnections.push({type : CONNECTOR_TYPE.FAULT});
            }

            if (canHaveDefaultConnector) {
                convertedElement.availableConnections.push({type : CONNECTOR_TYPE.DEFAULT});
            }

            convertedElement.availableConnections.push({type : CONNECTOR_TYPE.REGULAR});
        }

        convertedElements.push(convertedElement);
    });

    return convertedElements;
}

/**
 * Translate flow tooling object into UI data model
 *
 * @param {Object} flow Flow tooling object
 * @returns {Object} UI representation of the Flow in a normalized shape
 */
export function translateFlowToUIModel(flow) {
    // Map of element guids to element
    const elements = {};

    // Map of element dev names to guids
    const nameToGuid = {};

    // All resource ids (variables, formulas ...)
    const resources = [];

    // All canvas element ids
    const canvasElements = [];

    // Create start element
    const startElement = createStartElement();
    elements[startElement.guid] = startElement;
    canvasElements.push(startElement.guid);

    // Convert each type of element ex: assignments, decisions, variables
    Object.entries(ELEMENT_INFOS).forEach(([elementType, elementInfo]) => {
        let elementsToConvert = flow.metadata[elementInfo.metadataKey];
        if (elementInfo.metadataFilter && elementsToConvert) {
            // several element types for the same metadataKey (for actionCalls : ACTION_CALL, APEX_CALL, EMAIL_ALERT ...)
            elementsToConvert = elementsToConvert.filter(
                elementInfo.metadataFilter
            );
        }
        if (elementsToConvert) {
            const convertedElements = convertElements(
                elementsToConvert,
                elementType
            );

            convertedElements.forEach(element => {
                // Generate map of dev name to guid for each element
                nameToGuid[element.name] = element.guid;
                // Generate master element map of guid to elements
                elements[element.guid] = element;
                // Construct arrays of all canvas element and variable guids
                if (element.isCanvasElement) {
                    canvasElements.push(element.guid);
                } else if (RESOURCE_TYPES.indexOf(element.elementType) !== -1) {
                    resources.push(element.guid);
                }
            });
        }
    });

    // Swap out dev names for guids in all element references
    swapDevNamesToUids(nameToGuid, elements);

    // Create connector objects for all canvas elements including start element
    const connectors = [];
    let startElementTarget;
    if (flow.metadata.startElementReference) {
        startElementTarget = nameToGuid[flow.metadata.startElementReference];
    }
    canvasElements.forEach(elementId => {
        connectors.push(
            ...createConnectorsAndConnectionProperties(elementId, elements, startElementTarget)
        );
    });

    // Construct flow properties object
    const properties = pick(flow.metadata, FLOW_PROPERTIES);
    properties.fullName = flow.fullName;
    properties.versionNumber = flow.versionNumber;

    return {
        elements,
        connectors,
        resources,
        canvasElements,
        properties
    };
}
