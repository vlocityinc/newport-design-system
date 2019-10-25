import * as extensions from "mock/flowExtensionsData";

const mockGetCachedExtensionImplementation = extensionName => {
  switch (extensionName) {
    case extensions.mockFlowRuntimeEmailFlowExtensionDescription.name:
      return extensions.mockFlowRuntimeEmailFlowExtensionDescription;
    case extensions.mockLightningCompWithAccountOutputFlowExtensionDescription
      .name:
      return extensions.mockLightningCompWithAccountOutputFlowExtensionDescription;
    case extensions
      .mockLightningCompWithoutSObjectOutputFlowExtensionDescription.name:
      return extensions.mockLightningCompWithoutSObjectOutputFlowExtensionDescription;
    default:
      return undefined;
  }
};

export const getCachedExtension = jest
  .fn()
  .mockImplementation(extensionName =>
    mockGetCachedExtensionImplementation(extensionName)
  );
