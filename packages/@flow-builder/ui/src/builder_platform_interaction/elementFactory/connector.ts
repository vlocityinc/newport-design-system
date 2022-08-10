// @ts-nocheck
import { createConnectorObject } from 'builder_platform_interaction/connectorUtils';
import { CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './elementFactoryLabels';

/**
 * Method to create connector objects for a given flow metadata element
 *
 * @param {string} element        canvas element metadata object
 * @param {string} elementGuid    guid of the canvas element in the store
 * @param {string} parentGuid     (optional) guid of parent element if one exists (ex. decision id for an outcome element)
 * @param immediateConnector
 * @returns {Array} connectors    array of connector objects for the given canvas element
 */
export const createConnectorObjects = (element, elementGuid, parentGuid, immediateConnector = false) => {
    const connectors = [];

    // Create regular connectors if they exist on the element
    if (element.connector && element.connector.targetReference) {
        const source = parentGuid ? parentGuid : elementGuid;
        const childSource = parentGuid ? elementGuid : null;
        const label = immediateConnector ? LABELS.immediateConnectorLabel : parentGuid ? element.label : null;
        const connectorType = immediateConnector ? CONNECTOR_TYPE.IMMEDIATE : CONNECTOR_TYPE.REGULAR;

        const connector = createConnectorObject(
            source,
            childSource,
            element.connector.targetReference,
            label,
            connectorType,
            false,
            element.connector.isGoTo
        );
        connectors.push(connector);
    } else if (element.connectors) {
        // Step elements have an array of connectors
        element.connectors.forEach((elementconnector) => {
            if (elementconnector.targetReference) {
                const connector = createConnectorObject(
                    elementGuid,
                    null,
                    elementconnector.targetReference,
                    null,
                    CONNECTOR_TYPE.REGULAR,
                    false,
                    elementconnector.isGoTo
                );
                connectors.push(connector);
            }
        });
    }

    // Create next value connector (if the current element is of type loop)
    if (element.nextValueConnector && element.nextValueConnector.targetReference) {
        const nextValueConnector = createConnectorObject(
            elementGuid,
            null,
            element.nextValueConnector.targetReference,
            LABELS.loopNextConnectorLabel,
            CONNECTOR_TYPE.LOOP_NEXT,
            false,
            element.nextValueConnector.isGoTo
        );
        connectors.push(nextValueConnector);
    }

    // Create no more values aka end of loop connector (if the current element is of type loop)
    if (element.noMoreValuesConnector && element.noMoreValuesConnector.targetReference) {
        const noMoreValuesConnector = createConnectorObject(
            elementGuid,
            null,
            element.noMoreValuesConnector.targetReference,
            LABELS.loopEndConnectorLabel,
            CONNECTOR_TYPE.LOOP_END,
            false,
            element.noMoreValuesConnector.isGoTo
        );
        connectors.push(noMoreValuesConnector);
    }

    // Create fault connector if one exists
    if (element.faultConnector && element.faultConnector.targetReference) {
        const faultConnector = createConnectorObject(
            elementGuid,
            null,
            element.faultConnector.targetReference,
            LABELS.faultConnectorLabel,
            CONNECTOR_TYPE.FAULT,
            false,
            element.faultConnector.isGoTo
        );
        connectors.push(faultConnector);
    }

    // Create default connector if one exists
    if (element.defaultConnector && element.defaultConnector.targetReference) {
        const defaultConnector = createConnectorObject(
            elementGuid,
            null,
            element.defaultConnector.targetReference,
            element.defaultConnectorLabel,
            CONNECTOR_TYPE.DEFAULT,
            false,
            element.defaultConnector.isGoTo
        );
        connectors.push(defaultConnector);
    }
    return connectors;
};

export const createConnectorMetadataObject = (connector) => {
    return { targetReference: connector.target, isGoTo: connector.isGoTo };
};

/**
 * Method to create connector metadata objects
 *
 * @param connectors    array of connector objects for the given canvas element
 * @param hasMultipleRegularConnectors    indicates if multiple regular connectors are present for the element
 * @param elementType     (optional) guid of parent element if one exists (ex. decision id for an outcome element)
 * @param supportsBranching indicates if an element subtype supports branching in alc canvas
 * @returns connectorMetadata metadata object for connectors
 */
export const createConnectorMetadataObjects: Object = (
    connectors: Connector[],
    hasMultipleRegularConnectors: boolean,
    elementType?: string,
    supportsBranching: boolean
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
            case CONNECTOR_TYPE.REGULAR:
            case CONNECTOR_TYPE.IMMEDIATE: {
                const connectorObject = createConnectorMetadataObject(connector);
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
                const nextValueConnector = createConnectorMetadataObject(connector);
                Object.assign(connectorMetadata, { nextValueConnector });
                break;
            }

            case CONNECTOR_TYPE.LOOP_END: {
                const noMoreValuesConnector = createConnectorMetadataObject(connector);
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
                const defaultConnector = createConnectorMetadataObject(connector);
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
    const startElementConnector = createConnectorObject(startNodeGuid, null, target, null, CONNECTOR_TYPE.REGULAR);
    return [startElementConnector];
};
