export const banner = `
// *******************************************************************************************************************
// ATTENTION!
// THIS IS A GENERATED FILE FROM https://git.soma.salesforce.com/automation-platform/ui-interaction-builder-components
// If you would like to contribute, please follow the steps outlined in the git repo. Any changes made to this
// file in p4 will be automatically overwritten.
// *******************************************************************************************************************
`;

const EXTERNALS = [
    'o11y/client',
    'instrumentation/service',
    'builder_framework/command',
    'aura',
    'force/onboardingManagerLib'
];

export const external = (id) => {
    return EXTERNALS.includes(id) || id.startsWith('@salesforce/label');
};
