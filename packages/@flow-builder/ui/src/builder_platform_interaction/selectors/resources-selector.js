import { ELEMENT_TYPE, getConfigForElementType } from 'builder_platform_interaction-element-config';
import { createSelector, generateGuid } from 'builder_platform_interaction-store-lib';

const SECTION_PREFIX = 'RESOURCES_PALETTE_SECTION';

const elementsSelector = (state) => state.elements;
const canvasElementsSelector = (state) => state.canvasElements;
const variablesSelector = (state) => state.variables;

/**
 * A case-insensitive comparison function used to sort arrays of palette items by label.
 * @param {Object} a first item to compare
 * @param {Object} b second item to compare
 * @returns {Number} negative if a comes before b, positive if a comes after b, 0 when equal
 */
function compareItems(a, b) {
    return a.label.toUpperCase().localeCompare(b.label.toUpperCase());
}

/**
 * Creates a section that is usable by lightning-tree-grid.
 * @param {String} elementType element type for the section
 * @param {Array} items collection of lightning-tree-grid items
 * @returns {Object} a lightning-tree-grid item representing a section
 */
function createSection(elementType, items) {
    const config = getConfigForElementType(elementType);
    // TODO: The uncategorized label should not be necessary once everything is defined properly in
    // the element-config file.
    const label = (config.labels && config.labels.plural) ? config.labels.plural : 'Uncategorized';
    const section = {
        guid: generateGuid(SECTION_PREFIX),
        label,
        _children: items
    };
    return section;
}

/**
 * Transforms variable guids into a form that is usable by lightning-tree-grid.
 * @param {Object} elements list of all the elements
 * @param {Array} variables list of variable guids
 * @returns {Array} collection of lightning-tree-grid items
 */
const getVariables = (elements, variables) => variables.reduce((acc, guid) => {
    const element = elements[guid];
    const config = getConfigForElementType(ELEMENT_TYPE.VARIABLE);

    const variable = {
        elementType: element.elementType,
        guid,
        iconName: config.nodeConfig.iconName,
        label: element.name
    };
    acc.push(variable);

    return acc;
}, []);

/**
 * Transforms canvas element guids into a form that is usable by lightning-tree-grid. These are
 * grouped by element type so that they can more easily be placed into sections.
 * @param {Object} elements list of all the elements
 * @param {Array} canvasElements list of canvas element guids
 * @returns {Object} a mapping of element type to a list of lightning-tree-grid-items
 */
const getCanvasElements = (elements, canvasElements) => canvasElements.reduce((acc, guid) => {
    const element = elements[guid];

    if (element.elementType === ELEMENT_TYPE.START_ELEMENT) {
        return acc;
    }

    const canvasElement = {
        elementType: element.elementType,
        guid,
        label: element.name
    };

    if (!acc[element.elementType]) {
        acc[element.elementType] = [];
    }
    acc[element.elementType].push(canvasElement);

    return acc;
}, {});

/**
 * Combines non-canvas elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 * @param {Object} elements list of all the elements
 * @param {Array} variables list of variable guids
 * @param {Array} canvasElements list of canvasElement guids
 * @returns {Array} collection of lightning-tree-grid items
 */
const getResources = (elements, variables, canvasElements) => {
    const resources = [];

    // TODO: Determine the proper order to sort the sections in.
    if (variables && variables.length > 0) {
        const items = getVariables(elements, variables);
        if (items && items.length > 0) {
            const variablesSection = createSection(ELEMENT_TYPE.VARIABLE, items.sort(compareItems));
            resources.push(variablesSection);
        }
    }

    if (canvasElements && canvasElements.length > 0) {
        const canvasElementMap = getCanvasElements(elements, canvasElements);
        for (const elementType in canvasElementMap) {
            if (canvasElementMap.hasOwnProperty(elementType)) {
                const items = canvasElementMap[elementType];
                if (items && items.length > 0) {
                    const section = createSection(elementType, items.sort(compareItems));
                    resources.push(section);
                }
            }
        }
    }

    return resources;
};

export const resourcesSelector = createSelector([elementsSelector, variablesSelector, canvasElementsSelector], getResources);