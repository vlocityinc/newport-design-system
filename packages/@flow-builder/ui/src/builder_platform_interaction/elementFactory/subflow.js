import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    duplicateCanvasElement,
    automaticOutputHandlingSupport
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
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const elementType = ELEMENT_TYPE.SUBFLOW;
const maxConnections = 1;

export function createSubflow(subflow = {}) {
    const newSubflow = baseCanvasElement(subflow);
    const { flowName = '' } = subflow;
    let {
        inputAssignments = [],
        outputAssignments = [],
        storeOutputAutomatically = outputAssignments.length === 0
    } = subflow;
    let dataType;
    inputAssignments = inputAssignments.map(inputParameter =>
        createInputParameter(inputParameter)
    );

    if (storeOutputAutomatically) {
        outputAssignments = [];
        dataType = FLOW_DATA_TYPE.ACTION_OUTPUT.value;
    } else {
        outputAssignments = outputAssignments.map(outputParameter =>
            createOutputParameter(outputParameter)
        );
        storeOutputAutomatically = false;
    }

    const subflowObject = Object.assign(newSubflow, {
        flowName,
        inputAssignments,
        outputAssignments,
        maxConnections,
        elementType,
        storeOutputAutomatically,
        dataType
    });

    return subflowObject;
}

export function createDuplicateSubflow(subflow, newGuid, newName) {
    const newSubflow = createSubflow(subflow);
    const duplicateSubflow = duplicateCanvasElement(
        newSubflow,
        newGuid,
        newName
    );

    return duplicateSubflow;
}

export function createSubflowWithConnectors(subflow) {
    const newSubflow = createSubflow(subflow);

    const connectors = createConnectorObjects(subflow, newSubflow.guid);

    const connectorCount = connectors ? connectors.length : 0;

    const subflowObject = Object.assign(newSubflow, {
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
    let {
        inputAssignments = [],
        outputAssignments = [],
        storeOutputAutomatically
    } = subflow;
    inputAssignments = inputAssignments.map(inputParameter =>
        createInputParameterMetadataObject(inputParameter)
    );

    if (storeOutputAutomatically && automaticOutputHandlingSupport()) {
        outputAssignments = [];
    } else if (storeOutputAutomatically && !automaticOutputHandlingSupport()) {
        // In this case the user changed the processtype of the flow by one that does not support the automatic output handling
        // So we need to remove the storeOutputAutomatically property.
        outputAssignments = [];
        storeOutputAutomatically = undefined;
    } else {
        outputAssignments = outputAssignments.map(outputParameter =>
            createOutputParameterMetadataObject(outputParameter)
        );
    }

    return Object.assign(
        subflowMetadata,
        {
            flowName,
            inputAssignments,
            outputAssignments
        },
        storeOutputAutomatically !== undefined
            ? { storeOutputAutomatically }
            : {}
    );
}
