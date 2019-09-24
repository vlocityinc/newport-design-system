import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import {
    getElementCategory,
    getResourceLabel,
    getResourceCategory
} from 'builder_platform_interaction/elementLabelLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { labelComparator } from 'builder_platform_interaction/sortLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import {
    canvasElementFilter,
    resourceFilter
} from 'builder_platform_interaction/filterLib';
import { escapeForRegExp } from 'builder_platform_interaction/commonUtils';

/**
 * Helper function to return the dataType associated with a screen field
 * @param {Object} screenFieldObject Screen field object
 * @returns dataType associated with a screen field
 */
const getScreenFieldDataType = (screenFieldObject = {}) => {
    return (
        screenFieldObject.dataType ||
        (screenFieldObject.type && screenFieldObject.type.type)
    );
};

/**
 * Transforms elements into a form that is usable by lightning-tree-grid. These
 * are grouped by element category so that they can more easily be placed into
 * sections.
 *
 * @param {Object}
 *            elements list of all the elements
 * @param {string}
 *            [searchRegex] the regular expression the item label need to match
 * @returns {Object} a mapping of element type to a list of
 *          lightning-tree-grid-items
 */
const mutateElements = (elements, searchRegex) =>
    Object.values(elements).reduce((mutatedElements, element) => {
        if (!searchRegex || searchRegex.test(element.name) || searchRegex.test(element.label) || searchRegex.test(element.description)) {
            const resourceElement = {
                elementType: element.elementType,
                guid: element.guid,
                label: element.name,
            };

            const category = getElementCategory(element);
            if (!mutatedElements[category]) {
                mutatedElements[category] = [];
            }
            mutatedElements[category].push(resourceElement);
        }
        return mutatedElements;
    }, {});

/**
 * Get the icon name for the element (considered as a resource)
 *
 * @param {Object} element the element
 * @returns {string|undefined} the icon name
 */
export const getResourceIconName = element => {
    if (element.elementType === ELEMENT_TYPE.SCREEN_FIELD) {
        const screenFieldDataType = getScreenFieldDataType(element);
        return screenFieldDataType
            ? getDataTypeIcons(screenFieldDataType, 'utility')
            : 'utility:connected_apps';
    } else if (element.dataType) {
        return getDataTypeIcons(element.dataType, 'utility');
    }
    return undefined;
};

const mutateResources = (elements, searchRegex) =>
    Object.values(elements).reduce((mutatedElements, element) => {
        const label = getResourceLabel(element);
        const description = element.description;
        if (!searchRegex || searchRegex.test(label) || searchRegex.test(description)) {
            const resourceElement = {
                elementType: element.elementType,
                guid: element.guid,
                label,
                iconName: getResourceIconName(element)
            };
            const category = getResourceCategory(element);
            if (!mutatedElements[category]) {
                mutatedElements[category] = [];
            }
            mutatedElements[category].push(resourceElement);
        }
        return mutatedElements;
    }, {});

const getElementSectionsFromElementMap = elementMap => {
    const elementSections = Object.keys(elementMap)
        .filter(elementType => {
            return (
                elementMap[elementType] && elementMap[elementType].length > 0
            );
        })
        .map(category => {
            const section = {
                guid: generateGuid(),
                label: category,
                _children: elementMap[category].sort(labelComparator)
            };
            return section;
        });

    elementSections.sort(labelComparator);
    return elementSections;
};

const getSearchRegExp = searchString => {
    return searchString
        ? new RegExp(escapeForRegExp(searchString), 'i')
        : undefined;
};

/**
 * Combines elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 *
 * @param {Object}
 *            elements list of all the elements
 * @param {string}
 *            [searchString] the search string if any
 * @returns {Array} collection of lightning-tree-grid items
 */
export const getElementSections = (elements, searchString) => {
    if (!elements || Object.keys(elements).length === 0) {
        return [];
    }
    const filteredElements = Object.values(elements).filter(
        canvasElementFilter()
    );
    const searchRegExp = getSearchRegExp(searchString);
    const elementMap = mutateElements(filteredElements, searchRegExp);
    return getElementSectionsFromElementMap(elementMap);
};

/**
 * Combines elements (considered as resources) into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 *
 * @param {Object[]}
 *            elements list of all the elements
 * @param {string}
 *            [searchString] the search string if any
 * @returns {Array} collection of lightning-tree-grid items
 */
export const getResourceSections = (elements, searchString) => {
    if (!elements || Object.keys(elements).length === 0) {
        return [];
    }
    const filteredElements = Object.values(elements).filter(resourceFilter());
    const searchRegExp = getSearchRegExp(searchString);
    const resourceMap = mutateResources(filteredElements, searchRegExp);
    return getElementSectionsFromElementMap(resourceMap);
};
