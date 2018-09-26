import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createCalloutInputParameter, createCalloutInputParameterMetadataObject } from './calloutInputParameter';
import { createCalloutOutputParameter, createCalloutOutputParameterMetadataObject } from './calloutOutputParameter';
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
    const { apexClass = '', availableConnections = getDefaultAvailableConnections() } = apexPlugin;
    let { inputParameters = [], outputParameters = [] } = apexPlugin;
    inputParameters = inputParameters.map(inputParameter => createCalloutInputParameter(inputParameter));
    outputParameters = outputParameters.map(outputParameter => createCalloutOutputParameter(outputParameter));

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
    inputParameters = inputParameters.map(inputParameter => createCalloutInputParameterMetadataObject(inputParameter));
    outputParameters = outputParameters.map(outputParameter => createCalloutOutputParameterMetadataObject(outputParameter));

    return Object.assign(apexPluginMetadata, {
        apexClass,
        inputParameters,
        outputParameters
    });
}
