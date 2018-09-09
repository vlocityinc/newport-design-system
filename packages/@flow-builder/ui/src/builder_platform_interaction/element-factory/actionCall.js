import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction-flow-metadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/base-element';
import { baseCanvasElementMetadataObject } from './base/base-metadata';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction-connector-utils';

const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export function createActionCall(actionCall = {}, elementType = ELEMENT_TYPE.ACTION_CALL) {
    const newActionCall = baseCanvasElement(actionCall);
    const { actionType = '', actionName = '', availableConnections = getDefaultAvailableConnections() } = actionCall;
    let { inputParameters = [], outputParameters = [] } = actionCall;
    inputParameters = inputParameters.map(inputParameter => createInputParameter(inputParameter));
    outputParameters = outputParameters.map(outputParameter => createOutputParameter(outputParameter));

    const actionCallObject = Object.assign(newActionCall, {
        actionType,
        actionName,
        inputParameters,
        outputParameters,
        availableConnections,
        maxConnections,
        elementType
    });

    return actionCallObject;
}

export function createActionCallWithConnectors(actionCall, elementType) {
    const newActionCall = createActionCall(actionCall, elementType);

    const connectors = createConnectorObjects(
        actionCall,
        newActionCall.guid
    );
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const actionCallObject = Object.assign(newActionCall, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([actionCallObject], connectors);
}

export function createActionCallMetadataObject(actionCall, config) {
    if (!actionCall) {
        throw new Error('actionCall is not defined');
    }

    const actionCallMetadata = baseCanvasElementMetadataObject(actionCall, config);
    const { actionType, actionName } = actionCall;
    let { inputParameters = [], outputParameters = [] } = actionCall;
    inputParameters = inputParameters.map(inputParameter => createInputParameterMetadataObject(inputParameter));
    outputParameters = outputParameters.map(outputParameter => createOutputParameterMetadataObject(outputParameter));

    return Object.assign(actionCallMetadata, {
        actionType,
        actionName,
        inputParameters,
        outputParameters
    });
}
