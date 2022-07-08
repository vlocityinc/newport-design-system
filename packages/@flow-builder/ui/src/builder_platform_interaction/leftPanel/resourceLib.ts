// @ts-nocheck
import {
    ConnectionSource,
    createConnectionSourceRef,
    getConnectionSourcesFromIncomingGoTo,
    getMergingBranches,
    getSuffixForGoToConnection,
    GOTO_CONNECTION_SUFFIX,
    IncomingGoTosMetadata,
    isBranchingElement,
    NodeModel,
    NodeType
} from 'builder_platform_interaction/autoLayoutCanvas';
import { escapeForRegExp } from 'builder_platform_interaction/commonUtils';
import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { getConfigForElement } from 'builder_platform_interaction/elementConfig';
import {
    getElementCategory,
    getResourceCategory,
    getResourceLabel
} from 'builder_platform_interaction/elementLabelLib';
import { canvasElementFilter, resourceFilter } from 'builder_platform_interaction/filterLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { labelComparator } from 'builder_platform_interaction/sortLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { LABELS } from './leftPanelLabels';

/**
 * Helper function to return the dataType associated with a screen field
 *
 * @param {Object} screenFieldObject Screen field object
 * @returns dataType associated with a screen field
 */
const getScreenFieldDataType = (screenFieldObject = {}) => {
    return screenFieldObject.dataType || (screenFieldObject.type && screenFieldObject.type.type);
};

/**
 * Transforms elements into a form that is usable by lightning-tree-grid. These
 * are grouped by element category so that they can more easily be placed into
 * sections.
 *
 * @param {Object} elements list of all the elements
 * @param {string} [searchRegex] the regular expression the item label need to match
 * @returns {Object} a mapping of element type to a list of
 *          lightning-tree-grid-items
 */
const mutateElements = (elements, searchRegex) =>
    Object.values(elements).reduce((mutatedElements, element) => {
        if (
            !searchRegex ||
            searchRegex.test(element.name) ||
            searchRegex.test(element.label) ||
            searchRegex.test(element.description)
        ) {
            const resourceElement = {
                elementType: element.elementType,
                guid: element.guid,
                label: element.name,
                description: element.name
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
export const getResourceIconName = (element) => {
    const { elementType, dataType, storeOutputAutomatically } = element;
    if (elementType === ELEMENT_TYPE.SCREEN_FIELD) {
        const screenFieldDataType = getScreenFieldDataType(element);
        if (screenFieldDataType) {
            return getDataTypeIcons(screenFieldDataType, 'utility');
        }
        const screenFieldType = element.type;
        if (screenFieldType.name === 'Section') {
            return 'utility:display_text';
        }
        return 'utility:connected_apps';
    } else if (elementType === ELEMENT_TYPE.RECORD_CREATE && storeOutputAutomatically) {
        return getDataTypeIcons('String', 'utility');
    } else if (dataType) {
        return getDataTypeIcons(dataType, 'utility');
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
                iconName: getResourceIconName(element),
                description: label
            };
            const category = getResourceCategory(element);
            if (!mutatedElements[category]) {
                mutatedElements[category] = [];
            }
            mutatedElements[category].push(resourceElement);
        }
        return mutatedElements;
    }, {});

const getElementSectionsFromElementMap = (elementMap) => {
    const elementSections = Object.keys(elementMap)
        .filter((elementType) => {
            return elementMap[elementType] && elementMap[elementType].length > 0;
        })
        .map((category) => {
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

const getSearchRegExp = (searchString) => {
    return searchString ? new RegExp(escapeForRegExp(searchString), 'i') : undefined;
};

/**
 * Combines elements into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 *
 * @param {Object} elements list of all the elements
 * @param {string} [searchString] the search string if any
 * @returns {Array} collection of lightning-tree-grid items
 */
export const getElementSections = (elements, searchString) => {
    if (!elements || Object.keys(elements).length === 0) {
        return [];
    }
    const filteredElements = Object.values(elements).filter(canvasElementFilter());
    const searchRegExp = getSearchRegExp(searchString);
    const elementMap = mutateElements(filteredElements, searchRegExp);
    return getElementSectionsFromElementMap(elementMap);
};

/**
 * Combines elements (considered as resources) into their respective groupings in a form that is usable by
 * lightning-tree-grid.
 *
 * @param {Object[]} elements list of all the elements
 * @param {string} [searchString] the search string if any
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

/**
 * Finds the proper branch name for the Connection Source object and the Flow Model
 *
 * @param connectionSource - The Connection Source object
 * @param flowModel - The Flow Model
 * @returns The proper branch name for the object
 */
const getBranchLabel = (connectionSource: ConnectionSource, flowModel: FlowModel) => {
    const sourceGuid = connectionSource.guid;
    const sourceElement = flowModel[sourceGuid];
    const suffix = getSuffixForGoToConnection(flowModel, connectionSource);
    if (suffix === GOTO_CONNECTION_SUFFIX.FOR_EACH) {
        return LABELS.forEachBadgeLabel;
    } else if (suffix === GOTO_CONNECTION_SUFFIX.FAULT) {
        return LABELS.incomingGoToConnectionsWithFaultPath;
    } else if (sourceElement.nodeType === NodeType.LOOP) {
        // For a After Last branch, the suffix is node, and thus need to check if the nodeType is a Loop
        return LABELS.afterLastBadgeLabel;
    } else if (isBranchingElement(sourceElement)) {
        // For a branching element, we need to check if the suffix is a default/immediate branch, as the name of those
        // branches are stored in the defaultConnectorLabel
        if (suffix === GOTO_CONNECTION_SUFFIX.DEFAULT || suffix === GOTO_CONNECTION_SUFFIX.IMMEDIATE) {
            return sourceElement.defaultConnectorLabel;
        }
        // Otherwise, the suffix is the guid of the branch and thus the label will contain the name of the branch
        return flowModel[suffix].label;
    }
    // Simple elements do not have a branchLabel
    return null;
};

/**
 * Formats the goTo for the sourceElement
 *
 * @param sourceElement - The sourceElement that needs formatting
 * @param connectionSource - The ConnectionSource state for the sourceElement
 * @param flowModel - The flow model of the canvas
 * @returns The formatted version of a goTo for the sourceElement
 */
const formatGoToElements = (
    sourceElement: NodeModel,
    connectionSource: ConnectionSource,
    flowModel: FlowModel
): IncomingGoTosMetadata => {
    const { iconName, iconShape, iconBackgroundColor } = getConfigForElement(sourceElement).nodeConfig!;
    const { elementType, name, actionName } = sourceElement;
    const { childIndex } = connectionSource;
    return {
        guid: createConnectionSourceRef(connectionSource),
        childIndex,
        isCanvasElement: true,
        name: elementType === ELEMENT_TYPE.START_ELEMENT ? LABELS.startElementLabel : name,
        branchLabel: getBranchLabel(connectionSource, flowModel),
        actionName,
        iconName,
        iconShape,
        iconBackgroundColor
    };
};

/**
 * In the case that the GoTo is present at the merge point of a branching element, this method
 * recursively gets all the elements/branches that converge to the merge point
 *
 * @param sourceElement - The sourceElement that has the GoTo connector at its merge point
 * @param flowModel - The storeInstance state
 * @returns A list of the formatted GoTo connector elements/branches at the merge point
 */
const getMergePointNodeBranches = (sourceElement: NodeModel, flowModel: FlowModel): IncomingGoTosMetadata[] => {
    return getMergingBranches(flowModel, sourceElement).map((source) =>
        formatGoToElements(flowModel[source.guid], source, flowModel)
    );
};

/**
 * Creates an array of formatted incoming go to elements to pass to the usedByContent component
 *
 * @param targetElement - The element in which to get the list of incoming elements for
 * @param flowModel - The storeInstance state
 * @returns A list of formatted incoming element objects
 */
export const getIncomingGoTosInfo = (targetElement: NodeModel, flowModel: FlowModel): IncomingGoTosMetadata[] => {
    if (targetElement?.incomingGoTo == null) {
        return [];
    }
    const result = [];
    // Get the source elements for each incoming go to
    const connectionSources = getConnectionSourcesFromIncomingGoTo(flowModel, targetElement.guid);
    // Go through each element one by one and structure it to include all necessary elements for usedByContent
    for (const connectionSource of connectionSources) {
        const { guid, childIndex } = connectionSource;
        const sourceElement = flowModel[guid];
        // In the case that the go to connector is the merge point of a branching element
        if (childIndex == null && isBranchingElement(sourceElement)) {
            result.push(...getMergePointNodeBranches(sourceElement, flowModel));
        } else {
            result.push(formatGoToElements(sourceElement, connectionSource, flowModel));
        }
    }
    return result;
};
