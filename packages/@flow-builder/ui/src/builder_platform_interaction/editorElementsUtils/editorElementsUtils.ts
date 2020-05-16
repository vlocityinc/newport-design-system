// @ts-nocheck
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { logMetricsServiceErrorTransaction } from 'builder_platform_interaction/loggingUtils';

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
const mutateElements = (elements, palette) =>
    palette.headers.reduce((acc, { headerLabel, headerItems }) => {
        try {
            if (headerLabel && headerItems) {
                headerItems.forEach(headerItem => {
                    const element = elements.find(el => {
                        if (headerItem.type === 'element') {
                            return headerItem.name === el.elementType;
                        }
                        if (headerItem.type === 'action') {
                            return headerItem.name === el.type;
                        }

                        return false;
                    });
                    if (element) {
                        const elementType = element.elementType || ELEMENT_TYPE.ACTION_CALL;
                        const { nodeConfig, labels, canHaveFaultConnector } = getConfigForElementType(elementType);
                        const label = element.elementType ? labels && labels.leftPanel : element.label;
                        const actionType = element.elementType ? undefined : element.type;
                        const actionName = element.elementType ? undefined : element.name;
                        const { iconName, dragImageSrc, iconBackgroundColor, description } = nodeConfig;

                        if (!acc[headerLabel]) {
                            acc[headerLabel] = [];
                        }
                        const item = {
                            guid: generateGuid(),
                            iconName,
                            dragImageSrc,
                            iconBackgroundColor,
                            label,
                            description,
                            elementType,
                            actionType,
                            actionName,
                            canHaveFaultConnector
                        };
                        acc[headerLabel].push(item);
                    }
                });
            }
        } catch (e) {
            // if an element is invalid, just log it but don't stop the rest from loading
            logMetricsServiceErrorTransaction(JSON.stringify(e, Object.getOwnPropertyNames(e)));
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
export const getElementSections = (elements, palette) => {
    if (!elements || Object.keys(elements).length === 0) {
        return [];
    }

    const elementMap = mutateElements(elements, palette);
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
