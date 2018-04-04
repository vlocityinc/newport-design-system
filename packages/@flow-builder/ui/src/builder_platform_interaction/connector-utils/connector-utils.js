import {
    ELEMENT_TYPE,
    getConfigForElementType
} from 'builder_platform_interaction-element-config';
import { generateGuid } from 'builder_platform_interaction-store-lib';

export const CONNECTOR_TYPE = {
    REGULAR: 'REGULAR',
    FAULT: 'FAULT',
    DEFAULT: 'DEFAULT'
};

/**
 * Method to get the minimum and maximum x and y coordinates
 *
 * @param {Array} canvasElements      Canvas Elements
 * @param {Object} elements            Flow Elements
 * @returns {Object} locations         Contains the minimum and maximum x and y coordinates of the flow
 */
export const getMinAndMaxLocations = (canvasElements, elements) => {
    const locations = {};

    canvasElements.forEach(key => {
        if (elements[key]) {
            if (!locations.minX || (elements[key].locationX < locations.minX)) {
                locations.minX = elements[key].locationX;
            }

            if (!locations.minY || (elements[key].locationY < locations.minY)) {
                locations.minY = elements[key].locationY;
            }

            if (!locations.maxX || (elements[key].locationX > locations.maxX)) {
                locations.maxX = elements[key].locationX;
            }

            if (!locations.maxY || (elements[key].locationY > locations.maxY)) {
                locations.maxY = elements[key].locationY;
            }
        }
    });

    return locations;
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

    // Create fault connector if one exists
    if (node.faultConnector && node.faultConnector.targetReference) {
        const faultConnector = createConnectorObject(
            node.guid,
            null,
            node.faultConnector.targetReference,
            CONNECTOR_TYPE.FAULT,
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

    // TODO: Add logic for connectors on the Loop element once we have final UI designs

    return connectors;
};

/**
 * Method to create connector objects for a given canvas element and set the connection properties on the element
 *
 * @param {String} nodeId         guid of the canvas element
 * @param {Objects} elements      collection of all elements in the store mapped by guid
 *
 * @returns {Array} connectors    array of connector objects for the given canvas element
 */
export const createConnectorsAndConnectionProperties = (nodeId, elements) => {
    const node = elements[nodeId];
    const connectors = [];
    const elementType = node.elementType;

    // Create connector objects for the canvas element
    connectors.push(...createConnectorObjects(node));

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

    // Set connection properties on the canvas element
    node.connectorCount = connectors.length;
    node.maxConnections = getMaxConnections(node);

    return connectors;
};

/**
 * Method to set connector properties on all the elements in the store in the flow metadata shape (when translating before save)
 *
 * @param {String} connectors     collection of connector objects to set
 * @param {Objects} elements      collection of all elements in the store mapped by guid
 */
export const setConnectorsOnElements = (connectors, elements) => {
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

            default:
                break;
        }

        // TODO: Add logic for connectors on the Loop element once we have final UI designs
    });
};
