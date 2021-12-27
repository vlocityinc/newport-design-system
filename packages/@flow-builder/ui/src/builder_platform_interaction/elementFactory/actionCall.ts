// @ts-nocheck
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE, getFlowDataType } from 'builder_platform_interaction/dataTypeLib';
import { ACTION_TYPE, CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getParametersForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import {
    automaticOutputHandlingSupport,
    baseCanvasElementsArrayToMap,
    baseCanvasElementWithFault,
    createAvailableConnection,
    duplicateCanvasElement
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { createDataTypeMappingsMetadataObject, createDynamicTypeMappings } from './dynamicTypeMapping';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';

const maxConnections = 2;
export const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];
const getSystemGeneratedOutputParameter = (actionName, actionType, dataTypeMappings) => {
    const parameters = getParametersForInvocableAction({
        actionName,
        actionType,
        dataTypeMappings
    });
    return parameters
        ? parameters.find((param) => param.isOutput === true && param.isSystemGeneratedOutput === true)
        : undefined;
};

const maxOccursToIsCollection = (maxOccurs) => {
    return maxOccurs > 1 ? true : false;
};

/**
 * @param actionCall
 * @param elementType
 */
export function createActionCall(actionCall = {}, elementType = ELEMENT_TYPE.ACTION_CALL) {
    const newActionCall = baseCanvasElementWithFault(actionCall);
    const { actionType = '', actionName = '', flowTransactionModel, actionIsStandard } = actionCall;
    let {
        dataTypeMappings = [],
        inputParameters = [],
        outputParameters = [],
        availableConnections = getDefaultAvailableConnections(),
        storeOutputAutomatically = true
    } = actionCall;
    let dataType;
    dataTypeMappings = createDynamicTypeMappings(dataTypeMappings);
    inputParameters = inputParameters.map((inputParameter) => createInputParameter(inputParameter));
    let isSystemGeneratedOutput;
    let subtype;
    let isCollection;
    let apexClass;
    if (storeOutputAutomatically) {
        dataType = FLOW_DATA_TYPE.ACTION_OUTPUT.value;
        outputParameters = [];
        const systemGeneratedOutputParameter = getSystemGeneratedOutputParameter(
            actionName,
            actionType,
            dataTypeMappings
        );
        if (systemGeneratedOutputParameter) {
            ({ isSystemGeneratedOutput, dataType, sobjectType: subtype, apexClass } = systemGeneratedOutputParameter);
            isCollection = maxOccursToIsCollection(systemGeneratedOutputParameter.maxOccurs);
            dataType = !dataType ? FLOW_DATA_TYPE.ACTION_OUTPUT.value : getFlowDataType(dataType);
        }
    } else {
        dataType = FLOW_DATA_TYPE.BOOLEAN.value;
        outputParameters = outputParameters.map((outputParameter) => createOutputParameter(outputParameter));
        storeOutputAutomatically = false;
    }
    availableConnections = availableConnections.map((availableConnection) =>
        createAvailableConnection(availableConnection)
    );

    const actionCallObject = Object.assign(newActionCall, {
        actionType,
        actionName,
        actionIsStandard,
        dataTypeMappings,
        inputParameters,
        outputParameters,
        availableConnections,
        maxConnections,
        elementType,
        dataType,
        storeOutputAutomatically,
        isSystemGeneratedOutput,
        subtype,
        isCollection,
        apexClass,
        flowTransactionModel
    });

    return actionCallObject;
}

/**
 * @param actionCall
 * @param newGuid
 * @param newName
 */
export function createDuplicateActionCall(actionCall, newGuid, newName) {
    const newActionCall = createActionCall(actionCall);
    Object.assign(newActionCall, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateActionCall = duplicateCanvasElement(newActionCall, newGuid, newName);

    return duplicateActionCall;
}

/**
 * @param actionCall
 * @param elementType
 */
export function createActionCallWithConnectors(actionCall, elementType) {
    const newActionCall = createActionCall(actionCall, elementType);

    const connectors = createConnectorObjects(actionCall, newActionCall.guid);
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const actionCallObject = Object.assign(newActionCall, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([actionCallObject], connectors);
}

/**
 * @param actionCall
 * @param config
 */
export function createActionCallMetadataObject(actionCall, config) {
    if (!actionCall) {
        throw new Error('actionCall is not defined');
    }

    const actionCallMetadata = baseCanvasElementMetadataObject(actionCall, config);

    const { actionType, actionName, flowTransactionModel } = actionCall;
    let { inputParameters = [], outputParameters = [], dataTypeMappings = [], storeOutputAutomatically } = actionCall;
    inputParameters = inputParameters.map((inputParameter) => createInputParameterMetadataObject(inputParameter));
    if (storeOutputAutomatically && automaticOutputHandlingSupport()) {
        outputParameters = [];
    } else if (storeOutputAutomatically && !automaticOutputHandlingSupport()) {
        // In this case the user changed the processtype of the flow by one that does not support the automatic output handling
        // So we need to remove the storeOutputAutomatically property.
        outputParameters = [];
        storeOutputAutomatically = undefined;
    } else {
        outputParameters = outputParameters.map((outputParameter) =>
            createOutputParameterMetadataObject(outputParameter)
        );
    }
    dataTypeMappings = createDataTypeMappingsMetadataObject(dataTypeMappings);

    return Object.assign(
        actionCallMetadata,
        {
            actionType,
            actionName,
            inputParameters,
            outputParameters,
            dataTypeMappings,
            flowTransactionModel
        },
        storeOutputAutomatically !== undefined ? { storeOutputAutomatically } : {}
    );
}

/**
 * This function is called by flowToUiTranslator for convert action call metadata into correct shape and element type.
 * It used action type property of action call to identify element type
 *
 * @param {Object} actionCall action call metadata object
 * @returns {Object} element in shape expected by store
 */
export function createActionCallForStore(actionCall) {
    const actionType = actionCall.actionType;
    switch (actionType) {
        case ACTION_TYPE.EMAIL_ALERT:
            return createActionCallWithConnectors(actionCall, ELEMENT_TYPE.EMAIL_ALERT);
        case ACTION_TYPE.APEX:
            return createActionCallWithConnectors(actionCall, ELEMENT_TYPE.APEX_CALL);
        default:
            return createActionCallWithConnectors(actionCall);
    }
}
