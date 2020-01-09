import * as extensions from "mock/flowExtensionsData";

const flowExtensionLib = require.requireActual(
  "builder_platform_interaction/flowExtensionLib"
);

const applyDynamicTypeMappings = (parameters, dynamicTypeMappings) => {
  return flowExtensionLib.applyDynamicTypeMappings(
    parameters,
    dynamicTypeMappings
  );
};

const mockGetCachedExtensionImplementation = (
  extensionName,
  dynamicTypeMappings
) => {
  switch (extensionName) {
    case extensions.mockLightningCompWithGenericTypesFlowExtensionDescription
      .name:
      // Run the actual function for <c:lookup/>
      return Object.assign(
        {},
        extensions.mockLightningCompWithGenericTypesFlowExtensionDescription,
        {
          inputParameters: applyDynamicTypeMappings(
            extensions.mockLightningCompWithGenericTypesFlowExtensionDescription
              .inputParameters,
            dynamicTypeMappings
          ),
          outputParameters: applyDynamicTypeMappings(
            extensions.mockLightningCompWithGenericTypesFlowExtensionDescription
              .outputParameters,
            dynamicTypeMappings
          )
        }
      );
    case extensions.mockFlowRuntimeEmailFlowExtensionDescription.name:
      return extensions.mockFlowRuntimeEmailFlowExtensionDescription;
    case extensions.mockLightningCompWithAccountOutputFlowExtensionDescription
      .name:
      return extensions.mockLightningCompWithAccountOutputFlowExtensionDescription;
    case extensions
      .mockLightningCompWithoutSObjectOutputFlowExtensionDescription.name:
      return extensions.mockLightningCompWithoutSObjectOutputFlowExtensionDescription;
    case extensions
      .mockLightningCompWithSObjectCollectionOutputFlowExtensionDescription
      .name:
      return extensions.mockLightningCompWithSObjectCollectionOutputFlowExtensionDescription;
    default:
      return undefined;
  }
};

export const getCachedExtension = jest
  .fn()
  .mockImplementation((extensionName, dynamicTypeMappings) =>
    mockGetCachedExtensionImplementation(extensionName, dynamicTypeMappings)
  );
