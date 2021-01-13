import { flowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';

const flowExtensionLib = jest.requireActual('builder_platform_interaction/flowExtensionLib');

const applyDynamicTypeMappings = (parameters, dynamicTypeMappings) => {
    return flowExtensionLib.applyDynamicTypeMappings(parameters, dynamicTypeMappings);
};

const mockGetCachedExtensionImplementation = (extensionName, dynamicTypeMappings) => {
    const extensionDetails = flowExtensionDetails[extensionName];
    if (!extensionDetails) {
        return undefined;
    }
    const extension = flowExtensionLib.createExtensionDescription(extensionName, extensionDetails);
    return Object.assign({}, extension, {
        inputParameters: applyDynamicTypeMappings(extension.inputParameters, dynamicTypeMappings),
        outputParameters: applyDynamicTypeMappings(extension.outputParameters, dynamicTypeMappings)
    });
};

export const getCachedExtension = jest
    .fn()
    .mockImplementation((extensionName, dynamicTypeMappings) =>
        mockGetCachedExtensionImplementation(extensionName, dynamicTypeMappings)
    );

export const getAllCachedExtensionTypes = flowExtensionLib.getAllCachedExtensionTypes;
export const EXTENSION_TYPE_SOURCE = flowExtensionLib.EXTENSION_TYPE_SOURCE;
