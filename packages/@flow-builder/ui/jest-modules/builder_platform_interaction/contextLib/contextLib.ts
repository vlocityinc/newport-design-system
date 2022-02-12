const contextLib = jest.requireActual('builder_platform_interaction/contextLib');

export const orgHasFlowScreenSections = jest.fn().mockReturnValue(true);
export const orgHasFlowBuilderAutomaticFields = jest.fn().mockReturnValue(true);
export const orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(false);
export const getPreferredExperience = jest.fn().mockReturnValue(contextLib.CLASSIC_EXPERIENCE);
export const getOrgId = contextLib.getOrgId;
export const isTestMode = contextLib.isTestMode;
