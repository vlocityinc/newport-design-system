import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import startElementLabel from '@label/FlowBuilderCanvas.startElementLabel';
import faultConnectorLabel from '@label/FlowBuilderConnectorLabels.faultConnectorLabel';
import loopNextConnectorLabel from '@label/FlowBuilderConnectorLabels.loopNextConnectorLabel';
import loopEndConnectorLabel from '@label/FlowBuilderConnectorLabels.loopEndConnectorLabel';

export const CONNECTOR_TYPE = {
    REGULAR: 'REGULAR',
    FAULT: 'FAULT',
    DEFAULT: 'DEFAULT',
    START: 'START',
    LOOP_NEXT: 'LOOP_NEXT',
    LOOP_END: 'LOOP_END'
};

export const START_ELEMENT_X_Y = {
    x: 50,
    y: 50
};

/**
 * Helper method to get the minimum and maximum x and y coordinates of the flow
 * @param {Object} locations         Contains the minimum and maximum x and y coordinates of the flow
 * @param {Object} item              A given canvas element
 */
export const getFlowLocations = (locations, item) => {
    if (locations.minX === undefined || (item.locationX < locations.minX)) {
        locations.minX = item.locationX;
    }

    if (locations.minY === undefined || (item.locationY < locations.minY)) {
        locations.minY = item.locationY;
    }

    if (locations.maxX === undefined || (item.locationX > locations.maxX)) {
        locations.maxX = item.locationX;
    }

    if (locations.maxY === undefined || (item.locationY > locations.maxY)) {
        locations.maxY = item.locationY;
    }
};

/**
 * Method to get the width and height along with the minimum and maximum x and y coordinates of the entire flow
 * @param {Array} canvasElements      Canvas Elements
 * @return {Object} flowBounds        Contains flow bounds and flowWidth and flowHeight
 */
export const getFlowBounds = (canvasElements) => {
    // Getting the minimum and maximum coordinates of the flow along with flow width and height
    const flowBounds = {};

    canvasElements.forEach(element => {
        getFlowLocations(flowBounds, element);
    });

    // Spacing to add for icon width and height to get the correct flow width and height
    // TODO: Update it based on UX feedback
    const CANVAS_ELEMENT_WIDTH_SPACING = 48;
    const CANVAS_ELEMENT_HEIGHT_SPACING = 96;

    // Calculating width and height of the entire flow
    flowBounds.flowWidth = (flowBounds.maxX + CANVAS_ELEMENT_WIDTH_SPACING) - flowBounds.minX;
    flowBounds.flowHeight = (flowBounds.maxY + CANVAS_ELEMENT_HEIGHT_SPACING) - flowBounds.minY;

    return flowBounds;
};

/**
 * Method to get the maximum number of possible connections for a given canvas element
 *
 * @param {String} node                 canvas element object
 * @returns {Integer} maxConnections    maximum possible connections for the given canvas element
 */
export const getMaxConnections = node => {
    let maxConnections;

    if (node.elementType === ELEMENT_TYPE.DECISION) {
        // Decision element max connections depend on the number of outcomes
        maxConnections = node.outcomeReferences
            ? node.outcomeReferences.length + 1
            : 1;
    } else if (node.elementType === ELEMENT_TYPE.WAIT) {
        // Wait element max connections depend on the number of wait events
        maxConnections = node.waitEventReferences
            ? node.waitEventReferences.length + 2
            : 2;
    } else {
        maxConnections = getConfigForElementType(node.elementType).nodeConfig
            .maxConnections;
    }

    return maxConnections;
};

/**
 * Method to create the start element object
 *
 * @returns {Object} startElement   the start element object
 */
export const createStartElement = () => {
    const startElement = {};
    startElement.guid = generateGuid(ELEMENT_TYPE.START_ELEMENT);
    startElement.elementType = ELEMENT_TYPE.START_ELEMENT;
    startElement.label = startElementLabel;
    startElement.locationX = START_ELEMENT_X_Y.x;
    startElement.locationY = START_ELEMENT_X_Y.y;
    startElement.config = { isSelected: false };
    startElement.maxConnections = 1;
    startElement.connectorCount = 0;

    return startElement;
};

/**
 * Method to create a connector object in the shape required by the store
 *
 * @param {String} source           guid of the source canvas element
 * @param {String} childSource      (optional) guid of the child element, if one exists, that the connector is associated with (ex. outcomes and wait events)
 * @param {String} target           guid of the target canvas element
 * @param {String} label            (optional) label of the connector if one exists (ex. on default connectors)
 * @param {String} type             type of the connector (ex. fault or default)
 *
 * @returns {Object} connector       connector object
 */
export const createConnectorObject = (source, childSource, target, label, type) => {
    const connector = {};
    connector.guid = generateGuid('CONNECTOR');
    connector.source = source;
    // Tracks the guid of the child element that this connector is associated with (like an outcome or wait event)
    connector.childSource = childSource;
    connector.target = target;
    connector.label = label;
    connector.type = type;
    connector.config = {
        isSelected: false
    };

    return connector;
};

/**
 * Method to remove connector from list of available connections on a given node
 *
 * @param {String} node           canvas element object
 * @param {String} connector      connector to remove from list of available connections on node
 */
export const removeFromAvailableConnections = (node, connector) => {
    if (node.availableConnections) {
        node.availableConnections = node.availableConnections.filter(connection => {
            // Keep in the list of available connections if the connection type does not match the connector type,
            // OR if the connection is for a child reference (example, outcomes) and the child reference does not match the connector child source
            return connection.type !== connector.type || (connection.childReference && connection.childReference !== connector.childSource);
        });
    }
};

/**
 * Method to create connector objects for a given element
 *
 * @param {String} node           element object
 * @param {String} parentId       (optional) guid of parent element if one exists (ex. decision id for an outcome element)
 *
 * @returns {Array} connectors    array of connector objects for the given canvas element
 */
export const createConnectorObjects = (node, parentId) => {
    const connectors = [];

    // Create regular connectors if they exist on the element
    if (node.connector && node.connector.targetReference) {
        const source = parentId ? parentId : node.guid;
        const childSource = parentId ? node.guid : null;
        const label = parentId ? node.label : null;

        const connector = createConnectorObject(
            source,
            childSource,
            node.connector.targetReference,
            label,
            CONNECTOR_TYPE.REGULAR
        );
        connectors.push(connector);
        delete node.connector;
    } else if (node.connectors) {
        // Step elements have an array of connectors
        node.connectors.forEach(nodeconnector => {
            if (nodeconnector.targetReference) {
                const connector = createConnectorObject(
                    node.guid,
                    null,
                    nodeconnector.targetReference,
                    null,
                    CONNECTOR_TYPE.REGULAR
                );
                connectors.push(connector);
            }
        });
        delete node.connectors;
    }

    // Create next value connector (if the current node is of type loop)
    if (node.nextValueConnector && node.nextValueConnector.targetReference) {
        const nextValueConnector = createConnectorObject(
            node.guid,
            null,
            node.nextValueConnector.targetReference,
            loopNextConnectorLabel,
            CONNECTOR_TYPE.LOOP_NEXT
        );
        connectors.push(nextValueConnector);
        delete node.nextValueConnector;
    }

    // Create no more values aka end of loop connector (if the current node is of type loop)
    if (node.noMoreValuesConnector && node.noMoreValuesConnector.targetReference) {
        const noMoreValuesConnector = createConnectorObject(
            node.guid,
            null,
            node.noMoreValuesConnector.targetReference,
            loopEndConnectorLabel,
            CONNECTOR_TYPE.LOOP_END
        );
        connectors.push(noMoreValuesConnector);
        delete node.noMoreValuesConnector;
    }

    // Create fault connector if one exists
    if (node.faultConnector && node.faultConnector.targetReference) {
        const faultConnector = createConnectorObject(
            node.guid,
            null,
            node.faultConnector.targetReference,
            faultConnectorLabel,
            CONNECTOR_TYPE.FAULT
        );
        connectors.push(faultConnector);
        delete node.faultConnector;
    }

    // Create default connector if one exists
    if (node.defaultConnector && node.defaultConnector.targetReference) {
        const defaultConnector = createConnectorObject(
            node.guid,
            null,
            node.defaultConnector.targetReference,
            node.defaultConnectorLabel,
            CONNECTOR_TYPE.DEFAULT
        );
        connectors.push(defaultConnector);
        delete node.defaultConnector;
    }

    return connectors;
};

/**
 * Method to create connector objects for a given canvas element and set the connection properties on the element
 *
 * @param {String} nodeId         guid of the canvas element
 * @param {Objects} elements      collection of all elements in the store mapped by guid
 * @param {String} startNodeId    guid of the element that the start element connects to
 *
 * @returns {Array} connectors    array of connector objects for the given canvas element
 */
export const createConnectorsAndConnectionProperties = (nodeId, elements, startNodeId) => {
    const node = elements[nodeId];
    const connectors = [];
    const elementType = node.elementType;

    // Create connector objects for the canvas element
    if (elementType === ELEMENT_TYPE.START_ELEMENT) {
        if (startNodeId) {
            const startElementConnector = createConnectorObject(node.guid, null, startNodeId, null, CONNECTOR_TYPE.START);
            connectors.push(startElementConnector);
        }
    } else {
        connectors.push(...createConnectorObjects(node));
    }

    // Create connector objects for any child elements of the canvas element (ex. outcomes on a decision)
    let childReferences = [];
    if (elementType === ELEMENT_TYPE.DECISION) {
        childReferences = node.outcomeReferences.map(outcomeReference => {
            return outcomeReference.outcomeReference;
        });
    } else if (elementType === ELEMENT_TYPE.WAIT) {
        childReferences = node.waitEventReferences.map(waitEventReference => {
            return waitEventReference.waitEventReference;
        });
    }

    childReferences.forEach(childReference => {
        const childElement = elements[childReference];
        connectors.push(...createConnectorObjects(childElement, node.guid));
    });


    for (let i = 0; i < connectors.length; i++) {
        removeFromAvailableConnections(node, connectors[i]);
    }

    // Set connection properties on the canvas element
    node.connectorCount = connectors.length;
    node.maxConnections = getMaxConnections(node);

    return connectors;
};

/**
 * Method to set connector properties on all the elements in the store in the flow metadata shape (when translating before save)
 * This method will also return the guid of the canvas element marked as the start element if one exists.
 *
 * @param {String} connectors           collection of connector objects to set
 * @param {Objects} elements            collection of all elements in the store mapped by guid
 *
 * @return {String} startElementId      guid of the canvas element marked as the start element
 */
export const setConnectorsOnElements = (connectors, elements) => {
    let startElementId;

    connectors.forEach(connector => {
        const element = connector.childSource
            ? elements[connector.childSource]
            : elements[connector.source];

        switch (connector.type) {
            case CONNECTOR_TYPE.REGULAR: {
                const elementConnector = { targetReference: connector.target };
                if (element.elementType === ELEMENT_TYPE.STEP) {
                    // Step elements have an array of regular connectors
                    element.connectors = element.connectors || [];
                    element.connectors.push(elementConnector);
                } else {
                    element.connector = elementConnector;
                }
                break;
            }

            case CONNECTOR_TYPE.LOOP_NEXT: {
                element.nextValueConnector = { targetReference: connector.target };
                break;
            }

            case CONNECTOR_TYPE.LOOP_END: {
                element.noMoreValuesConnector = { targetReference: connector.target };
                break;
            }

            case CONNECTOR_TYPE.FAULT: {
                element.faultConnector = { targetReference: connector.target };
                break;
            }

            case CONNECTOR_TYPE.DEFAULT: {
                element.defaultConnector = {
                    targetReference: connector.target
                };
                element.defaultConnectorLabel = connector.label;
                break;
            }

            case CONNECTOR_TYPE.START: {
                startElementId = connector.target;
                break;
            }

            default:
                break;
        }
    });

    return startElementId;
};
