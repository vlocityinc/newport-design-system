import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE, RESOURCE_TYPES } from 'builder_platform_interaction-flow-metadata';
import { createSelector, generateGuid } from 'builder_platform_interaction-store-lib';

const SECTION_PREFIX = 'RESOURCES_PALETTE_SECTION';

const elementsSelector = (state) => state.elements;
const canvasElementsSelector = (state) => state.canvasElements;
const nonCanvasElementsSelector = (state) => state.resources;

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

const getResourceElements = (elements, resourceElements) => resourceElements.reduce((acc, guid) => {
    const element = elements[guid];
    const config = getConfigForElementType(element.elementType);

    const resourceElement = {
        elementType: element.elementType,
        guid,
        iconName: config.nodeConfig.iconName,
        label: element.name
    };
    if (!acc[element.elementType]) {
        acc[element.elementType] = [];
    }
    acc[element.elementType].push(resourceElement);

    return acc;
}, {});

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

const getCanvasElementsSections = (elements, canvasElements) => {
    const canvasElementsSections = [];
    // TODO: Incremented by 1 as we are not showing the Start Elements as part of Canvas Elements Group.
    if (canvasElements && canvasElements.length > 1) {
        const canvasElementMap = getCanvasElements(elements, canvasElements);
        for (const elementType in canvasElementMap) {
            if (canvasElementMap.hasOwnProperty(elementType)) {
                const items = canvasElementMap[elementType];
                if (items && items.length > 0) {
                    const section = createSection(elementType, items.sort(compareItems));
                    canvasElementsSections.push(section);
                }
            }
        }
    }

    return canvasElementsSections;
};

const getNonCanvasElementsSections = (elements, nonCanvasElements) => {
    const nonCanvasElementsSections = [];
    if (nonCanvasElements && nonCanvasElements.length > 0) {
        const resourceElementMap = getResourceElements(elements, nonCanvasElements);
        const elementTypes = RESOURCE_TYPES;
        const length = elementTypes.length;
        for (let i = 0; i < length; i++) {
            const elementType = elementTypes[i];
            const items = resourceElementMap[elementType];
            if (items && items.length > 0) {
                const section = createSection(elementType, items.sort(compareItems));
                nonCanvasElementsSections.push(section);
            }
        }
    }

    return nonCanvasElementsSections;
};

export const canvasElementsSectionsSelector = createSelector([elementsSelector, canvasElementsSelector], getCanvasElementsSections);

export const nonCanvasElementsSectionsSelector = createSelector([elementsSelector, nonCanvasElementsSelector], getNonCanvasElementsSections);