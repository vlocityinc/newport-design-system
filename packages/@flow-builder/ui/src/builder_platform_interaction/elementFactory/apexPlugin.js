import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    createAvailableConnection,
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

export function createApexPlugin(apexPlugin = {}) {
    const newApexPlugin = baseCanvasElement(apexPlugin);
    const { apexClass = '' } = apexPlugin;
    let { inputParameters = [], outputParameters = [], availableConnections = getDefaultAvailableConnections() } = apexPlugin;
    inputParameters = inputParameters.map(inputParameter => createInputParameter(inputParameter));
    outputParameters = outputParameters.map(outputParameter => createOutputParameter(outputParameter));
    availableConnections = availableConnections.map(availableConnection => createAvailableConnection(availableConnection));
    const apexPluginObject = Object.assign(newApexPlugin, {
        apexClass,
        inputParameters,
        outputParameters,
        availableConnections,
        maxConnections,
        elementType,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
    });

    return apexPluginObject;
}

export function createDuplicateApexPlugin(apexPlugin, newGuid) {
    const newApexPlugin = createApexPlugin(apexPlugin);
    const duplicateApexPlugin = duplicateCanvasElement(newApexPlugin, newGuid);

    return duplicateApexPlugin;
}

export function createApexPluginWithConnectors(apexPlugin) {
    const newApexPlugin = createApexPlugin(apexPlugin);

    const connectors = createConnectorObjects(
        apexPlugin,
        newApexPlugin.guid
    );
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const apexPluginObject = Object.assign(newApexPlugin, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([apexPluginObject], connectors);
}

export function createApexPluginMetadataObject(apexPlugin, config) {
    if (!apexPlugin) {
        throw new Error('apexPlugin is not defined');
    }

    const apexPluginMetadata = baseCanvasElementMetadataObject(apexPlugin, config);
    const { apexClass } = apexPlugin;
    let { inputParameters = [], outputParameters = [] } = apexPlugin;
    inputParameters = inputParameters.map(inputParameter => createInputParameterMetadataObject(inputParameter));
    outputParameters = outputParameters.map(outputParameter => createOutputParameterMetadataObject(outputParameter));

    return Object.assign(apexPluginMetadata, {
        apexClass,
        inputParameters,
        outputParameters
    });
}
