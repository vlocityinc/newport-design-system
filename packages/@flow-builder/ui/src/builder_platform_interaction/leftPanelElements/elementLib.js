import { getConfigForElementType } from "builder_platform_interaction/elementConfig";
import { deepCopy, generateGuid } from "builder_platform_interaction/storeLib";

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
const mutateElements = (elements) => elements.reduce((acc, element) => {
    if (!acc[element.section]) {
        acc[element.section] = [];
    }

    const item = deepCopy(element);
    item.guid = generateGuid();
    item.iconName = getConfigForElementType(element.elementType).nodeConfig.iconName;
    delete item.section;
    acc[element.section].push(item);
    return acc;
}, {});

/**
 * Combines elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 *
 * @param {Object}
 *            elements list of all the elements
 * @returns {Array} collection of lightning-tree-grid items
 */
export const getElementSections = (elements) => {
    if (!elements || Object.keys(elements).length === 0) {
        return [];
    }

    const elementMap = mutateElements(elements);
    const elementSections = Object.keys(elementMap).reduce((acc, name) => {
        const section = {};
        section._children = elementMap[name];
        section.guid = generateGuid();
        section.label = name;
        acc.push(section);
        return acc;
    }, []);

    return elementSections;
};
