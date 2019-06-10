import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE,
    ACTION_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    createAvailableConnection,
    duplicateCanvasElement
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import {
    createInputParameter,
    createInputParameterMetadataObject
} from './inputParameter';
import {
    createOutputParameter,
    createOutputParameterMetadataObject
} from './outputParameter';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const maxConnections = 2;
export const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export function createActionCall(
    actionCall = {},
    elementType = ELEMENT_TYPE.ACTION_CALL
) {
    const newActionCall = baseCanvasElement(actionCall);
    const { actionType = '', actionName = '' } = actionCall;
    let {
        inputParameters = [],
        outputParameters = [],
        availableConnections = getDefaultAvailableConnections()
    } = actionCall;
    inputParameters = inputParameters.map(inputParameter =>
        createInputParameter(inputParameter)
    );
    outputParameters = outputParameters.map(outputParameter =>
        createOutputParameter(outputParameter)
    );
    availableConnections = availableConnections.map(availableConnection =>
        createAvailableConnection(availableConnection)
    );

    const actionCallObject = Object.assign(newActionCall, {
        actionType,
        actionName,
        inputParameters,
        outputParameters,
        availableConnections,
        maxConnections,
        elementType,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value
    });

    return actionCallObject;
}

export function createDuplicateActionCall(actionCall, newGuid, newName) {
    const newActionCall = createActionCall(actionCall);
    Object.assign(newActionCall, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateActionCall = duplicateCanvasElement(
        newActionCall,
        newGuid,
        newName
    );

    return duplicateActionCall;
}

export function createActionCallWithConnectors(actionCall, elementType) {
    const newActionCall = createActionCall(actionCall, elementType);

    const connectors = createConnectorObjects(actionCall, newActionCall.guid);
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(
        defaultAvailableConnections,
        connectors
    );
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

    const actionCallMetadata = baseCanvasElementMetadataObject(
        actionCall,
        config
    );
    const { actionType, actionName } = actionCall;
    let { inputParameters = [], outputParameters = [] } = actionCall;
    inputParameters = inputParameters.map(inputParameter =>
        createInputParameterMetadataObject(inputParameter)
    );
    outputParameters = outputParameters.map(outputParameter =>
        createOutputParameterMetadataObject(outputParameter)
    );

    return Object.assign(actionCallMetadata, {
        actionType,
        actionName,
        inputParameters,
        outputParameters
    });
}

/**
 * This function is called by flowToUiTranslator for convert action call metadata into correct shape and element type.
 * It used action type property of action call to identify element type
 * @param {Object} actionCall action call metadata object
 * @return {Object} element in shape expected by store
 */
export function createActionCallForStore(actionCall) {
    const actionType = actionCall.actionType;
    switch (actionType) {
        case ACTION_TYPE.EMAIL_ALERT:
            return createActionCallWithConnectors(
                actionCall,
                ELEMENT_TYPE.EMAIL_ALERT
            );
        case ACTION_TYPE.APEX:
            return createActionCallWithConnectors(
                actionCall,
                ELEMENT_TYPE.APEX_CALL
            );
        default:
            return createActionCallWithConnectors(actionCall);
    }
}
