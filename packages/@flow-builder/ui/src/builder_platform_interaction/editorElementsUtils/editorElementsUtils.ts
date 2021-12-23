// @ts-nocheck
import { getConfigForElement, getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE, ACTION_TYPE_TO_ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { isOrchestrator } from 'builder_platform_interaction/processTypeLib';

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
    palette.headers.reduce((acc, { headerLabel, headerItems, headerFreeformVisibility }) => {
        try {
            if (headerLabel && headerItems) {
                headerItems.forEach((headerItem) => {
                    const filteredElements = elements.filter((el) => {
                        if (
                            headerItem.type === 'element' ||
                            (headerItem.type === 'shortcut' && headerItem.shortcutEnumType === 'element')
                        ) {
                            return headerItem.name === el.elementType || headerItem.shortcutEnumName === el.elementType;
                        }
                        if (
                            headerItem.type === 'elementSubtype' ||
                            (headerItem.type === 'shortcut' && headerItem.shortcutEnumType === 'elementSubtype')
                        ) {
                            return headerItem.name === el.name || headerItem.shortcutEnumName === el.name;
                        }

                        return false;
                    });

                    if (
                        headerItem.type === 'action' ||
                        (headerItem.type === 'shortcut' && headerItem.shortcutEnumType === 'action')
                    ) {
                        const item = {
                            elementType: ELEMENT_TYPE.ACTION_CALL,
                            actionLabel: headerItem.actionLabel ?? headerItem.shortcutLabel,
                            actionType: headerItem.name ?? headerItem.shortcutEnumName,
                            actionName: headerItem.name ?? headerItem.shortcutEnumName,
                            actionIsStandard: headerItem.actionIsStandard,
                            description: headerItem.actionDescription ?? headerItem.shortcutDescription
                        };
                        filteredElements.push(item);
                    }

                    if (filteredElements.length > 0) {
                        filteredElements.forEach((element) => {
                            const elementType = element.elementType;
                            const elementSubtype = element.isElementSubtype ? element.name : null;
                            const getElementTypeByActionType = ACTION_TYPE_TO_ELEMENT_TYPE[headerItem.shortcutEnumName];
                            const configDetails =
                                element.actionType && !element.actionIsStandard && getElementTypeByActionType
                                    ? getConfigForElementType(getElementTypeByActionType)
                                    : getConfigForElement(element);
                            const { nodeConfig, labels, canHaveFaultConnector } = configDetails;
                            const label =
                                element.actionLabel || headerItem.shortcutLabel || (labels && labels.leftPanel);
                            const actionType = element.actionType;
                            const actionName = element.actionName;
                            const actionIsStandard = element.actionIsStandard;
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
                                headerItem.shortcutDescription ||
                                (isOrchestrator(getProcessType())
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
                                actionIsStandard,
                                canHaveFaultConnector,
                                iconShape,
                                iconSize,
                                dynamicNodeComponent,
                                dynamicNodeComponentSelector,
                                freeformVisible: headerFreeformVisibility
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
