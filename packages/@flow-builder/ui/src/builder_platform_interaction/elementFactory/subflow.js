import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from "./base/baseElement";
import { baseCanvasElementMetadataObject } from "./base/baseMetadata";
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from "builder_platform_interaction/connectorUtils";

const elementType = ELEMENT_TYPE.SUBFLOW;
const maxConnections = 1;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    }
];

export function createSubflow(subflow = {}) {
    const newSubflow = baseCanvasElement(subflow);
    const { flowName = '', availableConnections = getDefaultAvailableConnections() } = subflow;
    let { inputAssignments = [], outputAssignments = [] } = subflow;
    inputAssignments = inputAssignments.map(inputParameter => createInputParameter(inputParameter));
    outputAssignments = outputAssignments.map(outputParameter => createOutputParameter(outputParameter));

    const subflowObject = Object.assign(newSubflow, {
        flowName,
        inputAssignments,
        outputAssignments,
        availableConnections,
        maxConnections,
        elementType,
    });

    return subflowObject;
}

export function createSubflowWithConnectors(subflow) {
    const newSubflow = createSubflow(subflow);

    const connectors = createConnectorObjects(
        subflow,
        newSubflow.guid
    );
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const subflowObject = Object.assign(newSubflow, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([subflowObject], connectors);
}

export function createSubflowMetadataObject(subflow, config) {
    if (!subflow) {
        throw new Error('subflow is not defined');
    }

    const subflowMetadata = baseCanvasElementMetadataObject(subflow, config);
    const { flowName } = subflow;
    let { inputAssignments = [], outputAssignments = [] } = subflow;
    inputAssignments = inputAssignments.map(inputParameter => createInputParameterMetadataObject(inputParameter));
    outputAssignments = inputAssignments.map(outputParameter => createOutputParameterMetadataObject(outputParameter));

    return Object.assign(subflowMetadata, {
        flowName,
        inputAssignments,
        outputAssignments
    });
}
