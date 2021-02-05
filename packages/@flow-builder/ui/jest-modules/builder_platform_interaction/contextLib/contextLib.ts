const contextLib = jest.requireActual('builder_platform_interaction/contextLib');

export const orgHasFlowScreenSections = jest.fn().mockReturnValue(true);
export const orgHasFlowBuilderAutomaticFields = jest.fn().mockReturnValue(true);
export const getOrgId = contextLib.getOrgId;
export const isTestMode = contextLib.isTestMode;

export const getPreferredExperience = jest.fn().mockImplementation(() => {
    return contextLib.CLASSIC_EXPERIENCE;
});
