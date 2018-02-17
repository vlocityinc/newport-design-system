import { createSelector } from 'builder_platform_interaction-store-lib';

const elementsSelector = (state) => state.elements;
const variablesSelector = (state) => state.variables;

/**
 * Transforms variable guids into a form that is usable by lightning-tree.
 * @param {Object} elements list of all the elements
 * @param {Object} variables list of variable guids
 * @return {Array} collection of lightning-tree items
 */
const getVariables = (elements, variables) => variables.reduce((acc, guid) => {
    const element = elements[guid];

    // The guid will be helpful when showing the details of a variable.
    const variable = {
        label: element.name,
        name: guid
    };
    acc.push(variable);

    return acc;
}, []);

/**
 * Combines non-canvas elements into their respective groupings in a form that is usable by
 * lightning-tree.
 * @param {Object} elements list of all the elements
 * @param {Object} variables list of variable guids
 * @returns {Array} collection of lightning-tree items
 */
const getResources = (elements, variables) => {
    // TODO: Use the label file for the resource group headers.
    // TODO: Need logic to loop through the groups and not include empty resource groups.
    const resources = [
        {
            label: "Variables",
            expanded: true,
            items: getVariables(elements, variables)
        }
    ];

    return resources;
};

export const resourcesSelector = createSelector([elementsSelector, variablesSelector], getResources);