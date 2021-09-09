// @ts-nocheck
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElementWithFault,
    baseCanvasElementsArrayToMap,
    createAvailableConnection,
    createPastedCanvasElement,
    duplicateCanvasElement
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const elementType = ELEMENT_TYPE.APEX_PLUGIN_CALL;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

/**
 * @param apexPlugin
 */
export function createApexPlugin(apexPlugin = {}) {
    const newApexPlugin = baseCanvasElementWithFault(apexPlugin);
    const { apexClass = '' } = apexPlugin;
    let {
        inputParameters = [],
        outputParameters = [],
        availableConnections = getDefaultAvailableConnections()
    } = apexPlugin;
    inputParameters = inputParameters.map((inputParameter) => createInputParameter(inputParameter));
    outputParameters = outputParameters.map((outputParameter) => createOutputParameter(outputParameter));
    availableConnections = availableConnections.map((availableConnection) =>
        createAvailableConnection(availableConnection)
    );
    const apexPluginObject = Object.assign(newApexPlugin, {
        apexClass,
        inputParameters,
        outputParameters,
        availableConnections,
        maxConnections,
        elementType,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value
    });

    return apexPluginObject;
}

/**
 * @param root0
 * @param root0.canvasElementToPaste
 * @param root0.newGuid
 * @param root0.newName
 * @param root0.canvasElementGuidMap
 * @param root0.topCutOrCopiedGuid
 * @param root0.bottomCutOrCopiedGuid
 * @param root0.prev
 * @param root0.next
 * @param root0.parent
 * @param root0.childIndex
 */
export function createPastedApexPlugin({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    source,
    next
}) {
    const { duplicatedElement } = createDuplicateApexPlugin(canvasElementToPaste, newGuid, newName);

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        source,
        next
    );

    return {
        pastedCanvasElement
    };
}

/**
 * @param apexPlugin
 * @param newGuid
 * @param newName
 */
export function createDuplicateApexPlugin(apexPlugin, newGuid, newName) {
    const newApexPlugin = createApexPlugin(apexPlugin);
    Object.assign(newApexPlugin, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateApexPlugin = duplicateCanvasElement(newApexPlugin, newGuid, newName);

    return duplicateApexPlugin;
}

/**
 * @param apexPlugin
 */
export function createApexPluginWithConnectors(apexPlugin) {
    const newApexPlugin = createApexPlugin(apexPlugin);

    const connectors = createConnectorObjects(apexPlugin, newApexPlugin.guid);
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const apexPluginObject = Object.assign(newApexPlugin, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([apexPluginObject], connectors);
}

/**
 * @param apexPlugin
 * @param config
 */
export function createApexPluginMetadataObject(apexPlugin, config) {
    if (!apexPlugin) {
        throw new Error('apexPlugin is not defined');
    }

    const apexPluginMetadata = baseCanvasElementMetadataObject(apexPlugin, config);
    const { apexClass } = apexPlugin;
    let { inputParameters = [], outputParameters = [] } = apexPlugin;
    inputParameters = inputParameters.map((inputParameter) => createInputParameterMetadataObject(inputParameter));
    outputParameters = outputParameters.map((outputParameter) => createOutputParameterMetadataObject(outputParameter));

    return Object.assign(apexPluginMetadata, {
        apexClass,
        inputParameters,
        outputParameters
    });
}
