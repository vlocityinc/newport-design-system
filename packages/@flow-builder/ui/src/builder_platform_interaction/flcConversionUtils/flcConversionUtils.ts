import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    Guid,
    FlowElements,
    CanvasElement,
    FlowConnector,
    StoreState,
    AvailableConnection
} from 'builder_platform_interaction/flowModel';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/**
 * Generates end connectors for a Free Form Canvas UI Model.
 * Generates end connectors for the available connections of each canvas element
 *
 * @param storeState - The FFC UI Model
 * @return The generated end connectorss
 */
function generateEndConnectors(elements: FlowElements): FlowConnector[] {
    const endConnectors: FlowConnector[] = [];

    Object.values(elements).forEach(element => {
        if (element.isCanvasElement) {
            const canvasElement = element as CanvasElement;
            if (canvasElement.availableConnections != null) {
                // for elements that support multiple "out" connectors
                canvasElement.availableConnections.forEach(({ childReference, type }, i) => {
                    // don't create end connectors for missing faults or loop next
                    if (type !== CONNECTOR_TYPE.FAULT && type !== CONNECTOR_TYPE.LOOP_NEXT) {
                        const connector = createNewConnector(
                            elements,
                            element.guid,
                            // @ts-ignore
                            generateGuid(element.guid, i),
                            type
                        );
                        if (childReference != null) {
                            connector.childSource = childReference;
                            connector.label = elements[childReference].label || null;
                        }
                        endConnectors.push(connector);
                    }
                });
            } else if (canvasElement.connectorCount === 0) {
                // for elements that support only one "out" connector
                endConnectors.push(
                    // @ts-ignore
                    createNewConnector(elements, element.guid, generateGuid(element.guid), CONNECTOR_TYPE.REGULAR)
                );
            }
        }
    });

    return endConnectors;
}

/**
 * Removes end elements and connectors from a Free Form Flow flow.
 * Needed to persist a flow converted from Auto Layout Canvas flow
 * until the back end has end element support.
 *
 * @param storeState - The store state for the flow
 * @param endConnectors - Optional array where the removed end connectors will be added to.
 *
 * @return The flow without any end elements or connectors
 */
export function removeEndElementsAndConnectorsTransform(
    storeState: StoreState,
    endConnectors?: FlowConnector[]
): StoreState {
    let { elements, connectors } = storeState;

    // remove the end connectors
    connectors = connectors.filter(connector => {
        const { source, target, childSource, type } = connector;
        if (elements[target].elementType === ELEMENT_TYPE.END_ELEMENT) {
            const sourceElement = elements[source] as CanvasElement;
            if (endConnectors != null) {
                endConnectors.push(connector);
            }

            // adjust the connector count
            sourceElement.connectorCount--;

            // adjust the available connections
            const availableConnections = sourceElement.availableConnections;
            if (availableConnections != null) {
                const availableConnection: AvailableConnection = { type };
                if (childSource != null) {
                    availableConnection.childReference = childSource;
                }
                availableConnections.push(availableConnection);
            }

            return false;
        }

        return true;
    });

    const canvasElements: Guid[] = [];

    // remove the end elements
    elements = Object.values(elements).reduce((elementsMap, element) => {
        if (element.elementType !== ELEMENT_TYPE.END_ELEMENT) {
            elementsMap[element.guid] = element;
            if (element.isCanvasElement) {
                canvasElements.push(element.guid);
                // TODO: clean this up

                // @ts-ignore
                if (element.availableConnections != null && element.availableConnections.length > 0) {
                    // @ts-ignore
                    if (element.availableConnections[0].type === CONNECTOR_TYPE.FAULT) {
                        // @ts-ignore
                        element.availableConnections.splice(0, 1);
                        // @ts-ignore
                        element.availableConnections.push({
                            type: CONNECTOR_TYPE.FAULT
                        });
                    }
                }
            }
        }
        return elementsMap;
    }, {});

    return { ...storeState, elements, connectors, canvasElements };
}

/**
 * Add end connectors and elements to a Free Form Canvas UI Model.
 * Needed before converting a Free Form flow without end nodes to Auto Layout.
 *
 * @param storeState - The Free Form UI Model
 * @param endConnectors - The end connectors information to use. If missing these will be generated.
 *
 * @return The Free Form UIModel with end elements and connnectors
 */
export function addEndElementsAndConnectorsTransform(
    storeState: StoreState,
    endConnectors?: FlowConnector[]
): StoreState {
    // generate the connectors if none are provided
    endConnectors = endConnectors || generateEndConnectors(storeState.elements);

    const endElements: FlowElements = {};

    // create the end elements from the end connectors
    endConnectors.forEach(endConnector => {
        const { target } = endConnector;

        if (!endElements[target]) {
            const endElement = createEndElement();
            endElement.guid = target;
            endElements[target] = endElement;
        }
    });

    return {
        ...storeState,
        elements: { ...storeState.elements, ...endElements },
        connectors: [...storeState.connectors, ...endConnectors],
        canvasElements: [...storeState.canvasElements, ...Object.values(endElements).map(endElement => endElement.guid)]
    };
}

export {
    convertToAutoLayoutCanvas,
    canConvertToAutoLayoutCanvas,
    consolidateEndConnectors
} from './freeFormToAutoLayout';
export { convertToFreeFormCanvas } from './autoLayoutToFreeForm';
