import AlcConnector from 'builder_platform_interaction/alcConnector';
import AlcFlow from 'builder_platform_interaction/alcFlow';
import {
    ConnectionSource,
    ElementMetadata,
    findFirstElement,
    FlowModel,
    Geometry,
    getConnectionSourcesFromIncomingGoTo,
    getDefaultLayoutConfig,
    Guid,
    hasGoToOnNext,
    isBranchTerminal,
    isRoot,
    NodeModel,
    NodeType
} from 'builder_platform_interaction/autoLayoutCanvas';

const defaultConfig = getDefaultLayoutConfig();

const NODE_ICON_SIZE = defaultConfig.node.icon.w;

/**
 * Helper function to build a path to the node that needs to be focused. The path will consist of the
 * guid and branch index to follow for all the branching nodes leading up to the focus node.
 *
 * @param flowModel The flow model
 * @param guid - The node guid
 * @returns The complete focus path
 */
export const getNodePath = (flowModel: FlowModel, guid: Guid): ConnectionSource[] => {
    const nodePath: ConnectionSource[] = [];

    let parent = guid;
    let childIndex;

    do {
        const pathEntry = childIndex != null ? { guid: parent, childIndex } : { guid: parent };
        nodePath.unshift(pathEntry);

        const branchHead = findFirstElement(flowModel[parent], flowModel);
        ({ childIndex, parent } = branchHead);
    } while (!isRoot(parent));

    // The focus path is complete once we hit the Root element
    return nodePath;
};

/**
 * Helper method to get the minimum and maximum x and y coordinates of the flow
 *
 * @param elementsGeometry - Canvas elements
 * @returns minY, maxY, minX, and maxX of the canvas elements passed in. Accounts for the width and height of border elements.
 */
export const findMinMaxGeometry = (
    elementsGeometry: Geometry[]
): { minY: number; maxY: number; minX: number; maxX: number } => {
    return elementsGeometry.reduce(
        (prevMinMax, currentGeometry) => {
            return {
                minY: Math.min(prevMinMax.minY, currentGeometry.y),
                maxY: Math.max(prevMinMax.maxY, currentGeometry.y + currentGeometry.h),
                minX: Math.min(prevMinMax.minX, currentGeometry.x),
                maxX: Math.max(prevMinMax.maxX, currentGeometry.x + currentGeometry.w)
            };
        },
        {
            minX: elementsGeometry[0].x,
            minY: elementsGeometry[0].y,
            maxX: elementsGeometry[0].x,
            maxY: elementsGeometry[0].y
        }
    );
};

/**
 * Method to get the width and height along with the minimum x and y coordinates of the elements passed in. This gives the geometry of an object that encapsulates the elements passed in.
 *
 * @param elementsGeometry - Canvas Elements
 * @returns the width and height along with the minimum x and y coordinates of the elements passed in
 */
export const getBoundingBoxForElements = (elementsGeometry: Geometry[]): Geometry => {
    const { minY, maxY, minX, maxX } = findMinMaxGeometry(elementsGeometry);

    // Calculating width and height of the highlighted and clicked elements.
    const flowWidth = maxX - minX;
    const flowHeight = maxY - minY;

    return { w: flowWidth, h: flowHeight, y: minY, x: minX };
};

/**
 * Returns a Geometry object for a DOM element
 *
 * @param {Object} domElement - a DOM element
 * @returns The Geometry for the DOM element
 */
export const getDomElementGeometry = (domElement): Geometry => {
    const { left, right, top, bottom } = domElement.getBoundingClientRect();
    return { x: left, y: top, w: right - left, h: bottom - top };
};

/**
 * Find node actually returns a alcCompoundNode html element and we want to return the true alcNode geometry on canvas.
 *
 * @param element - Compound node html element that we want to sanatize
 * @param scale - current canvas scale
 * @returns - returns the true geometry (alcNode) of the alcCompoundNode.
 */
export const getSanitizedNodeGeo = (element: HTMLElement, scale: number): Geometry => {
    const geo = getDomElementGeometry(element);
    const scaledIconsize = NODE_ICON_SIZE * scale;
    const halfIconSize = scaledIconsize / 2;
    return { x: geo.x - halfIconSize, y: geo.y - halfIconSize, w: scaledIconsize, h: scaledIconsize };
};

/**
 *
 * @param elementGuid - Element guid.
 * @param flowModel - The flow model.
 * @param alcFlow - Used to find alcCompound html element.
 * @returns alcCompoundNode html element.
 */
export const findNode = (elementGuid: string, flowModel: FlowModel, alcFlow: AlcFlow): HTMLElement => {
    const nodePath = getNodePath(flowModel, elementGuid);
    return alcFlow.findNode(nodePath);
};

/**
 *
 * @param source - Connection source of connector.
 * @param flowModel - The flow model.
 * @param alcFlow - Used to find alcConnector html element.
 * @returns alcConnector html element.
 */
export const findConnector = (source: ConnectionSource, flowModel: FlowModel, alcFlow: AlcFlow): AlcConnector => {
    const { guid, childIndex } = source;
    const nodePath = getNodePath(flowModel, guid);
    return alcFlow.findConnector(nodePath, childIndex!);
};

/**
 *
 * @param guid - Element guid.
 * @param flowModel - The flow model.
 * @param alcFlow - Used to find alcConnector html elements.
 * @returns the geometry of the incoming GoTos of the supplied guid.
 */
export const getGoToElementsGeometry = (guid: Guid, flowModel: FlowModel, alcFlow: AlcFlow): Geometry[] => {
    return getConnectionSourcesFromIncomingGoTo(flowModel, guid).map((connectionSource) =>
        getDomElementGeometry(findConnector(connectionSource, flowModel, alcFlow))
    );
};

/**
 *
 * @param flowModel - The flow model.
 * @param alcFlow - Used to find alcCompoundNode and alcConnector html elements.
 * @param scale - current canvas scale.
 * @returns the flow geometry of all nodes and GoTos.
 */
export const getNodeAndGoToGeometry = (flowModel: FlowModel, alcFlow: AlcFlow, scale: number) => {
    let toReturn = [] as Geometry[];
    Object.values(flowModel).forEach((item) => {
        if (item.isCanvasElement) {
            toReturn.push(getSanitizedNodeGeo(findNode(item.guid, flowModel, alcFlow), scale));
            if (item.incomingGoTo) {
                toReturn = toReturn.concat(getGoToElementsGeometry(item.guid, flowModel, alcFlow));
            }
        }
    });
    return toReturn;
};

/**
 * Helper function that converts this.canvasContext.elementsMetadata to map of elementType -> metaData
 *
 * @param elementsMetadata elementsMetadata array present in the canvasContext
 * @returns The elements metadata map
 */
export const convertToElementMetadataMap = (elementsMetadata: ElementMetadata[]) => {
    return elementsMetadata.reduce((acc, elementMetadata) => {
        acc[elementMetadata.actionName || elementMetadata.elementSubtype || elementMetadata.elementType] =
            elementMetadata;
        return acc;
    }, {});
};

/**
 * Helper to determine if we should cut/ delete past the merge point
 *
 * @param flowModel - The flow model.
 * @param selectedElement - Element clicked on to be cut or deleted
 * @param childIndexToKeep - The child index to keep
 * @param allowEndElement - Boolean to allow selectedElement's next if it's an end element
 * @returns true or false depending if we should cut/ delete past selectedElement's merge point
 */
export const shouldCutOrDeleteBeyondMergingPoint = (
    flowModel: FlowModel,
    selectedElement: NodeModel,
    childIndexToKeep?: number | null,
    allowEndElement = false
): boolean => {
    return !!(
        childIndexToKeep != null &&
        selectedElement.next &&
        isBranchTerminal(flowModel, selectedElement, childIndexToKeep) &&
        (allowEndElement || flowModel[selectedElement.next!].nodeType !== NodeType.END) &&
        !hasGoToOnNext(flowModel, selectedElement.guid)
    );
};
