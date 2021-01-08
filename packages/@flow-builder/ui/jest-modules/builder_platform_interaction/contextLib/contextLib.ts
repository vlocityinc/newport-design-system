const contextLib = jest.requireActual('builder_platform_interaction/contextLib');

export const orgHasFlowScreenSections = jest.fn().mockReturnValue(true);
export const orgHasFlowBuilderAutomaticFields = jest.fn().mockReturnValue(true);
export const getOrgId = contextLib.getOrgId;
