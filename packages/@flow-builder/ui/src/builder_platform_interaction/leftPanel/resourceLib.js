import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import {
    getElementCategory,
    getResourceLabel,
    getResourceCategory
} from 'builder_platform_interaction/elementLabelLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { labelComparator } from 'builder_platform_interaction/sortLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';

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
 * @returns {Object} a mapping of element type to a list of
 *          lightning-tree-grid-items
 */
const mutateElements = elements =>
    Object.values(elements).reduce((acc, element) => {
        const resourceElement = {
            elementType: element.elementType,
            guid: element.guid,
            label: element.name
        };

        const category = getElementCategory(element);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(resourceElement);

        return acc;
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

const mutateResources = elements =>
    Object.values(elements).reduce((acc, element) => {
        const resourceElement = {
            elementType: element.elementType,
            guid: element.guid,
            label: getResourceLabel(element)
        };

        resourceElement.iconName = getResourceIconName(element);

        const category = getResourceCategory(element);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(resourceElement);

        return acc;
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
                _children: elementMap[category]
            };
            return section;
        });

    elementSections.sort(labelComparator);
    return elementSections;
};

/**
 * Combines elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 *
 * @param {Object}
 *            elements list of all the elements
 * @param {Function}
 *            filter function to use for resource filtering
 * @param {Function}
 *            sort function to use for resource ordering
 * @returns {Array} collection of lightning-tree-grid items
 */
export const getElementSections = (elements, filter, sort) => {
    if (!elements || Object.keys(elements).length === 0) {
        return [];
    }
    const filteredElements = Object.values(elements)
        .filter(filter)
        .sort(sort);
    const elementMap = mutateElements(filteredElements);
    return getElementSectionsFromElementMap(elementMap);
};

/**
 * Combines elements (considered as resources) into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 *
 * @param {Object[]}
 *            elements list of all the elements
 * @param {Function}
 *            filter function to use for resource filtering
 * @param {Function}
 *            sort function to use for resource ordering
 * @returns {Array} collection of lightning-tree-grid items
 */
export const getResourceSections = (elements, filter, sort) => {
    if (!elements || Object.keys(elements).length === 0) {
        return [];
    }
    const filteredElements = Object.values(elements)
        .filter(filter)
        .sort(sort);
    const resourceMap = mutateResources(filteredElements);
    return getElementSectionsFromElementMap(resourceMap);
};
