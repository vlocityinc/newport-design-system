// @ts-nocheck
import { getConfigForElement } from 'builder_platform_interaction/elementConfig';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { getProcessType } from 'builder_platform_interaction/storeUtils';

const { logMetricsServiceErrorTransaction } = loggingUtils;
/**
 * Transforms elements into a form that is usable by lightning-tree-grid. These
 * are grouped by element category so that they can more easily be placed into
 * sections.
 *
 * @param {Object}
 *            elements list of all the elements
 * @param elements
 * @param palette
 * @returns {Object} a mapping of element type to a list of
 *          lightning-tree-grid-items
 */
const mutateElements = (elements, palette) =>
    palette.headers.reduce((acc, { headerLabel, headerItems }) => {
        try {
            if (headerLabel && headerItems) {
                headerItems.forEach((headerItem) => {
                    const filteredElements = elements.filter((el) => {
                        if (headerItem.type === 'element') {
                            return headerItem.name === el.elementType;
                        }
                        if (headerItem.type === 'elementSubtype') {
                            return headerItem.name === el.name;
                        }

                        return false;
                    });

                    if (headerItem.type === 'action') {
                        const item = {
                            elementType: ELEMENT_TYPE.ACTION_CALL,
                            actionLabel: headerItem.actionLabel,
                            actionType: headerItem.name,
                            actionName: headerItem.name,
                            description: headerItem.actionDescription
                        };
                        filteredElements.push(item);
                    }

                    if (filteredElements.length > 0) {
                        filteredElements.forEach((element) => {
                            const elementType = element.elementType;
                            const elementSubtype = element.isElementSubtype ? element.name : null;
                            const { nodeConfig, labels, canHaveFaultConnector } = getConfigForElement(element);
                            const label = element.actionLabel || (labels && labels.leftPanel);
                            const actionType = element.actionType;
                            const actionName = element.actionName;
                            const {
                                iconName,
                                dragImageSrc,
                                iconBackgroundColor,
                                iconShape,
                                iconSize,
                                dynamicNodeComponent,
                                dynamicNodeComponentSelector
                            } = nodeConfig;

                            // Favor using the description supplied by the element if it exists, otherwise
                            // fall back to the default description.
                            const description =
                                element.description ||
                                (getProcessType() === FLOW_PROCESS_TYPE.ORCHESTRATOR
                                    ? nodeConfig.orchestratorDescription || nodeConfig.description
                                    : nodeConfig.description);

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
                                elementSubtype,
                                actionType,
                                actionName,
                                canHaveFaultConnector,
                                iconShape,
                                iconSize,
                                dynamicNodeComponent,
                                dynamicNodeComponentSelector
                            };
                            acc[headerLabel].push(item);
                        });
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
 * @param elements
 * @param palette
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
