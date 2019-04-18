import { getConfigForElementType } from "builder_platform_interaction/elementConfig";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

/**
 * Sort element types from service side based on the custom ordering list
 * @param {Array} unsortedElementTypes unsorted element type list
 *
 * @returns {Array} sorted element type list based on custom ordering
 */
function sortElementTypes(unsortedElementTypes = []) {
    const elementOrderedList = [ELEMENT_TYPE.SCREEN,  ELEMENT_TYPE.ACTION_CALL, ELEMENT_TYPE.SUBFLOW, ELEMENT_TYPE.ASSIGNMENT, ELEMENT_TYPE.DECISION,
        ELEMENT_TYPE.WAIT, ELEMENT_TYPE.LOOP, ELEMENT_TYPE.RECORD_CREATE, ELEMENT_TYPE.RECORD_UPDATE, ELEMENT_TYPE.RECORD_LOOKUP, ELEMENT_TYPE.RECORD_DELETE, ELEMENT_TYPE.APEX_PLUGIN_CALL];
    return [...unsortedElementTypes].sort((firstElementType, secondElementType) => elementOrderedList.indexOf(firstElementType.elementType) - elementOrderedList.indexOf(secondElementType.elementType));
}

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
const mutateElements = (elements) => elements.reduce((acc, { elementType }) => {
    const { nodeConfig, labels } = getConfigForElementType(elementType);
    const { iconName, dragImageSrc, iconBackgroundColor, section, description } = nodeConfig;
    const { leftPanel: label } = labels;

    if (section) {
        if (!acc[section]) {
            acc[section] = [];
        }
        const item = {
            guid: generateGuid(),
            iconName,
            dragImageSrc,
            iconBackgroundColor,
            label,
            description,
            elementType
        };
        acc[section].push(item);
    }
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

    elements = sortElementTypes(elements);
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

