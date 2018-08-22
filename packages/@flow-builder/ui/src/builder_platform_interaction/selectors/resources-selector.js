import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { createSelector, generateGuid } from 'builder_platform_interaction-store-lib';
import { getDataTypeIcons } from 'builder_platform_interaction-data-type-lib';

const SECTION_PREFIX = 'RESOURCES_PALETTE_SECTION';

const elementsSelector = (state) => state.elements;

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
 * Transforms elements into a form that is usable by lightning-tree-grid. These are
 * grouped by element type so that they can more easily be placed into sections.
 * @param {Object} elements list of all the elements
 * @returns {Object} a mapping of element type to a list of lightning-tree-grid-items
 */
const getElements = (elements) => Object.values(elements).reduce((acc, element) => {
    // Ignore the Start Element
    if (element.elementType === ELEMENT_TYPE.START_ELEMENT) {
        return acc;
    }

    const resourceElement = {
        elementType: element.elementType,
        guid: element.guid,
        label: element.name
    };

    // Adding utility icons for resource manager
    // TODO: Figure out a better way to recognise elements that do need an icon based on the dataType
    const dataTypeIconElements = [ELEMENT_TYPE.VARIABLE, ELEMENT_TYPE.CONSTANT, ELEMENT_TYPE.FORMULA];
    if (element.dataType && dataTypeIconElements.includes(element.elementType)) {
        resourceElement.iconName = getDataTypeIcons(element.dataType, 'utility');
    }

    if (!acc[element.elementType]) {
        acc[element.elementType] = [];
    }
    acc[element.elementType].push(resourceElement);

    return acc;
}, {});

/**
 * Combines elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 * @param {Object} elements list of all the elements
 * @param {Boolean} returnCanvasElements if true, return only canvas elements, else, return only non-canvas elements
 * @returns {Array} collection of lightning-tree-grid items
 */
const getResourceSections = (elements, returnCanvasElements) => {
    let resourceSections = [];

    if (elements && Object.keys(elements).length > 0) {
        const elementMap = getElements(elements);
        resourceSections = Object.keys(elementMap)
            .filter(elementType => {
                const isCanvasElement = getConfigForElementType(elementType).canvasElement === true;
                return (
                    isCanvasElement === returnCanvasElements &&
                    elementMap[elementType] &&
                    elementMap[elementType].length > 0
                );
            })
            .map(elementType => {
                const section = createSection(
                    elementType,
                    elementMap[elementType].sort(compareItems)
                );
                return section;
            });
    }

    return resourceSections;
};

/**
 * Combines canvas elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 * @param {Object} elements list of all the elements
 * @returns {Array} collection of lightning-tree-grid items for canvas elements
 */
const getCanvasElementsSections = (elements) => {
    const canvasElementsSections = getResourceSections(elements, true);

    return canvasElementsSections;
};

/**
 * Combines non-canvas elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 * @param {Object} elements list of all the elements
 * @returns {Array} collection of lightning-tree-grid items for non-canvas elements
 */
const getNonCanvasElementsSections = (elements) => {
    const nonCanvasElementsSections = getResourceSections(elements, false);

    return nonCanvasElementsSections;
};

export const canvasElementsSectionsSelector = createSelector([elementsSelector], getCanvasElementsSections);

export const nonCanvasElementsSectionsSelector = createSelector([elementsSelector], getNonCanvasElementsSections);