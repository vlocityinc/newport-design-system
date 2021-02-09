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

export const isExtensionAttributeGlobalConstant = (screenFieldInput) => {
    return flowExtensionLib.isExtensionAttributeGlobalConstant(screenFieldInput);
};

export const isExtensionAttributeLiteral = (inputAttribute) => {
    return flowExtensionLib.isExtensionAttributeLiteral(inputAttribute);
};

export const createExtensionDescription = (data, name) => {
    return flowExtensionLib.createExtensionDescription(data, name);
};

export const mockGetCachedExtensionsImplementation = (extensions) => {
    const extensionDetails = {};
    for (const extension of extensions) {
        if (flowExtensionDetails[extension]) {
            extensionDetails[extension] = flowExtensionDetails[extension];
        }
    }
    const extensionDescriptionCache = {};
    for (const extension of extensions) {
        if (extensionDetails[extension]) {
            extensionDescriptionCache[extension] = createExtensionDescription(extension, extensionDetails[extension]);
        }
    }
    const cachedDescriptors: any[] = [];
    for (const ext of extensions) {
        if (extensionDetails[ext]) {
            cachedDescriptors.push(extensionDescriptionCache[ext]);
        }
    }
    return cachedDescriptors;
};

export const getCachedExtensions = jest
    .fn()
    .mockImplementation((extensions) => mockGetCachedExtensionsImplementation(extensions));

export const getCachedExtensionType = jest.fn().mockImplementation((extensionName) => {
    const TEST_EXTENSION_TYPES = {
        'c:fakeAuraCmp': 'aura',
        'c:fakeLwc': 'lwc',
        'flowruntime:lookup': 'lwc'
    };
    const values = {
        extensionType: TEST_EXTENSION_TYPES[extensionName],
        fieldType: 'ComponentInstance',
        name: extensionName
    };
    return values;
});

export const mockGetRequiredParametersForExtensionImpl = jest.fn().mockImplementation((extensionName) => {
    const cachedDescriptors: any = mockGetCachedExtensionsImplementation([extensionName]);
    if (cachedDescriptors && cachedDescriptors.length === 1) {
        const descriptor = cachedDescriptors[0];
        const requiredParams: any = [];
        for (const inputParam of descriptor.inputParameters) {
            if (inputParam.isRequired === true) {
                requiredParams.push(inputParam);
            }
        }
        return requiredParams;
    }
    return null;
});

export const getRequiredParametersForExtension = jest
    .fn()
    .mockImplementation((extensionName) => mockGetRequiredParametersForExtensionImpl(extensionName));

export const mockGetExtensionAttributeTypeImpl = jest.fn().mockImplementation((extensionName, attributeName) => {
    const cachedDescriptors: any = mockGetCachedExtensionsImplementation([extensionName]);
    if (cachedDescriptors && cachedDescriptors.length === 1) {
        const descriptor = cachedDescriptors[0];
        const inputParam = descriptor.inputParameters.find((inputParam) => inputParam.apiName === attributeName);
        if (inputParam) {
            return inputParam.dataType;
        }
    }
    return null;
});

export const getExtensionAttributeType = jest
    .fn()
    .mockImplementation((extensionName, attributeName) =>
        mockGetExtensionAttributeTypeImpl(extensionName, attributeName)
    );
