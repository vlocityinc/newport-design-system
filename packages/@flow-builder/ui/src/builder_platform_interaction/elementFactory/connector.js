import { generateGuid } from 'builder_platform_interaction/storeLib';
import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './elementFactoryLabels';

/**
 * Method to create a connector object in the shape required by the store
 *
 * @param {String} source           guid of the source canvas element
 * @param {String} childSource      (optional) guid of the child element, if one exists, that the connector is associated with (ex. outcomes and wait events)
 * @param {String} target           guid of the target canvas element
 * @param {String} label            (optional) label of the connector if one exists (ex. on default connectors)
 * @param {String} type             type of the connector (ex. fault or default)
 * @param {Boolean} isSelected      specify whether the connector is in a selected state
 *
 * @returns {Object} connector       connector object
 */
export const createConnector = (
    source,
    childSource,
    target,
    label,
    type,
    isSelected = false
) => {
    const guid = generateGuid();
    const config = {
        isSelected
    };

    const connector = Object.assign(
        {},
        { guid, source, childSource, target, label, type, config }
    );

    return connector;
};

/**
 * Method to create connector objects for a given flow metadata element
 *
 * @param {String} element        canvas element metadata object
 * @param {String} elementGuid    guid of the canvas element in the store
 * @param {String} parentGuid     (optional) guid of parent element if one exists (ex. decision id for an outcome element)
 *
 * @returns {Array} connectors    array of connector objects for the given canvas element
 */
export const createConnectorObjects = (element, elementGuid, parentGuid) => {
    const connectors = [];

    // Create regular connectors if they exist on the element
    if (element.connector && element.connector.targetReference) {
        const source = parentGuid ? parentGuid : elementGuid;
        const childSource = parentGuid ? elementGuid : null;
        const label = parentGuid ? element.label : null;

        const connector = createConnector(
            source,
            childSource,
            element.connector.targetReference,
            label,
            CONNECTOR_TYPE.REGULAR
        );
        connectors.push(connector);
    } else if (element.connectors) {
        // Step elements have an array of connectors
        element.connectors.forEach(elementconnector => {
            if (elementconnector.targetReference) {
                const connector = createConnector(
                    elementGuid,
                    null,
                    elementconnector.targetReference,
                    null,
                    CONNECTOR_TYPE.REGULAR
                );
                connectors.push(connector);
            }
        });
    }

    // Create next value connector (if the current element is of type loop)
    if (
        element.nextValueConnector &&
        element.nextValueConnector.targetReference
    ) {
        const nextValueConnector = createConnector(
            elementGuid,
            null,
            element.nextValueConnector.targetReference,
            LABELS.loopNextConnectorLabel,
            CONNECTOR_TYPE.LOOP_NEXT
        );
        connectors.push(nextValueConnector);
    }

    // Create no more values aka end of loop connector (if the current element is of type loop)
    if (
        element.noMoreValuesConnector &&
        element.noMoreValuesConnector.targetReference
    ) {
        const noMoreValuesConnector = createConnector(
            elementGuid,
            null,
            element.noMoreValuesConnector.targetReference,
            LABELS.loopEndConnectorLabel,
            CONNECTOR_TYPE.LOOP_END
        );
        connectors.push(noMoreValuesConnector);
    }

    // Create fault connector if one exists
    if (element.faultConnector && element.faultConnector.targetReference) {
        const faultConnector = createConnector(
            elementGuid,
            null,
            element.faultConnector.targetReference,
            LABELS.faultConnectorLabel,
            CONNECTOR_TYPE.FAULT
        );
        connectors.push(faultConnector);
    }

    // Create default connector if one exists
    if (element.defaultConnector && element.defaultConnector.targetReference) {
        const defaultConnector = createConnector(
            elementGuid,
            null,
            element.defaultConnector.targetReference,
            element.defaultConnectorLabel,
            CONNECTOR_TYPE.DEFAULT
        );
        connectors.push(defaultConnector);
    }

    return connectors;
};

export const createConnectorMetadataObject = connector => {
    return { targetReference: connector.target };
};

export const createConnectorMetadataObjects = (
    connectors,
    hasMultipleRegularConnectors,
    elementType
) => {
    let connectorMetadata;

    // TODO: Need to refactor the logic on changing datatype based on the elementType for Steps.( W-5478126 )
    if (elementType === ELEMENT_TYPE.STEP) {
        connectorMetadata = [];
        hasMultipleRegularConnectors = true;
    } else {
        connectorMetadata = {};
    }

    for (let i = 0; i < connectors.length; i++) {
        const connector = connectors[i];
        switch (connector.type) {
            case CONNECTOR_TYPE.REGULAR: {
                const connectorObject = createConnectorMetadataObject(
                    connector
                );
                if (hasMultipleRegularConnectors) {
                    const connectorObjects = connectorMetadata.connectors || [];
                    connectorObjects.push(connectorObject);
                    Object.assign(connectorMetadata, {
                        connectors: connectorObjects
                    });
                } else {
                    Object.assign(connectorMetadata, {
                        connector: connectorObject
                    });
                }
                break;
            }

            case CONNECTOR_TYPE.LOOP_NEXT: {
                const nextValueConnector = createConnectorMetadataObject(
                    connector
                );
                Object.assign(connectorMetadata, { nextValueConnector });
                break;
            }

            case CONNECTOR_TYPE.LOOP_END: {
                const noMoreValuesConnector = createConnectorMetadataObject(
                    connector
                );
                Object.assign(connectorMetadata, { noMoreValuesConnector });
                break;
            }

            case CONNECTOR_TYPE.FAULT: {
                const faultConnector = createConnectorMetadataObject(connector);
                Object.assign(connectorMetadata, { faultConnector });
                break;
            }

            case CONNECTOR_TYPE.DEFAULT: {
                const defaultConnectorLabel = connector.label;
                const defaultConnector = createConnectorMetadataObject(
                    connector
                );
                Object.assign(connectorMetadata, {
                    defaultConnector,
                    defaultConnectorLabel
                });
                break;
            }

            default:
                break;
        }
    }

    return connectorMetadata;
};

export const createStartElementConnector = (startNodeGuid, target) => {
    const startElementConnector = createConnector(
        startNodeGuid,
        null,
        target,
        null,
        CONNECTOR_TYPE.START
    );
    return [startElementConnector];
};
