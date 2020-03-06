import { ConnectorRenderInfo, getLayout, getBranchLayout } from './flowRendererUtils';
import { NodeModel, ParentNodeModel } from './model';
import { NodeLayoutMap } from './layout';
import ConnectorType from './ConnectorTypeEnum';

/**
 * Location interface for path locations
 */
interface Location {
    x: number;
    y: number;
}

/**
 * Creates the connector object to next element.
 *
 * @param node - The NodeModel of the source element
 * @param connectorType - Type of the connector being created
 * @param sourceX - locationX of the source element
 * @param sourceY - locationY of the source element
 * @param svgHeight - Height of the connector
 * @param offsetY - Offset in y-direction if any
 * @param isFault - True if connector type is False
 * @param menuOpened - True if the contextual menu is open
 */
export function createConnectorToNextNode(
    node: NodeModel,
    connectorType: ConnectorType,
    sourceX: number,
    sourceY: number,
    svgHeight: number,
    offsetY: number,
    isFault: boolean,
    menuOpened: boolean
): ConnectorRenderInfo {
    const key = `conn_${node.guid}_${node.next}`;
    return {
        key,
        connectorType,
        sourceX,
        sourceY,
        offsetY,
        sourceGuid: node.guid,
        targetGuid: node.next,
        svgHeight,
        canAddNode: true,
        shouldRender: true,
        isFault,
        menuOpened
    };
}

/**
 * Creates the connector object for connector between source node and it's child. (ex: Outcome connectors)
 * @param nodeLayoutMap - The NodeLayoutMap containing layout information for the nodes
 * @param node - The NodeModel of the source element
 * @param connectorType - Type of the connector being created
 * @param childIndex - Index of the child element
 * @param sourceX - locationX of the source element
 * @param sourceY - locationY of the source element
 * @param progress - Progress to track layout updation
 * @param menuOpened - True if the contextual menu is open
 * @param selectedChildGuid - Guid of the selected child reference (outcomes/wait events) for connector label
 * @param childReferences - Includes objects containing label, value pairs of all the associated child references as needed by the label-picker (combobox)
 */
export function createTopChildConnector(
    nodeLayoutMap: NodeLayoutMap,
    node: ParentNodeModel,
    connectorType: ConnectorType,
    childIndex: number,
    sourceX: number,
    sourceY: number,
    progress: number,
    menuOpened: boolean,
    selectedChildGuid: string,
    childReferences: Array<{ label: string; value: string }>
): ConnectorRenderInfo {
    const branchLayout = getBranchLayout(node.guid, childIndex, progress, nodeLayoutMap);

    const childNode = node.children[childIndex];
    const svgHeight =
        childNode != null
            ? getLayout(childNode, progress, nodeLayoutMap).y
            : getLayout(node.guid, progress, nodeLayoutMap).joinOffsetY;

    return {
        key: `tcconn_${node.guid}_${childIndex}`,
        connectorType,
        sourceX,
        sourceY,
        svgWidth: branchLayout.x,
        svgHeight,
        parent: node.guid,
        childIndex,
        canAddNode: true,
        shouldRender: true,
        isFault: false, // Replace with this to test Fault connector styling: branchLayout.x > 0 ? true : false
        offsetY: 0,
        menuOpened,
        selectedChildGuid, // Replace with this to test Fault connector styling: branchLayout.x > 0 ? '' : selectedChildGuid
        childReferences,
        sourceGuid: undefined,
        targetGuid: childNode
    };
}

/**
 * Creates the bottom piece of the connector that joins the child branch back to the main branch
 * @param nodeLayoutMap - The NodeLayoutMap containing layout information for the nodes
 * @param nonode - The NodeModel of the source elementde
 * @param connectorType - Type of the connector being created
 * @param childIndex - Index of the child element
 * @param sourceX - locationX of the source element
 * @param sourceY - locationY of the source element
 * @param progress - Progress to track layout updation
 */
export function createBottomChildConnector(
    nodeLayoutMap: NodeLayoutMap,
    node: NodeModel,
    connectorType: ConnectorType,
    childIndex: number,
    sourceX: number,
    sourceY: number,
    progress: number
): ConnectorRenderInfo {
    const branchLayout = getBranchLayout(node.guid, childIndex, progress, nodeLayoutMap);

    const svgHeight = 48;
    const offsetY = getLayout(node.guid, progress, nodeLayoutMap).joinOffsetY;

    return {
        key: `bcconnb_${node.guid}_${childIndex}`,
        connectorType,
        sourceX,
        sourceY,
        svgWidth: branchLayout.x,
        svgHeight,
        offsetY,
        parent: node.guid,
        childIndex,
        canAddNode: false,
        shouldRender: true,
        isFault: false
    };
}

export function getLocation(x: number, y: number): Location {
    return { x, y };
}

/**
 * Creates the path for a straight connector
 * @param startLocation - Start location of the connector
 * @param endLocation - End location of the connector
 */
export function getPathForStraightConnector(startLocation: Location, endLocation: Location) {
    return `M ${startLocation.x} ${startLocation.y} L ${endLocation.x},${endLocation.y}`;
}

/**
 * Creates the path for top-bent connectors
 * @param startLocation - Start location of the connector
 * @param curveStartLocation - Start location of the first curve
 * @param curveDirection - Direction of the fist curve
 * @param curveEndLocation - End location of the first curve
 * @param endLocation - End location of the connector
 */
export function getPathForTopBentConnector(
    startLocation: Location,
    curveStartLocation: Location,
    curveDirection: number,
    curveEndLocation: Location,
    endLocation: Location
) {
    return `M ${startLocation.x}, ${startLocation.y}
    L ${curveStartLocation.x}, ${curveStartLocation.y}
    A 16 16 0 0 ${curveDirection}, ${curveEndLocation.x}, ${curveEndLocation.y}
    L ${endLocation.x}, ${endLocation.y}`;
}

/**
 * Creates the path for bottom-bent connectors
 * @param startLocation - Start location of the connector
 * @param firstCurveStartLocation - Start location of the first curve
 * @param firstCurveDirection - Direction of the fist curve
 * @param firstCurveEndLocation - End location of the first curve
 * @param secondCurveStartLocation - Start location of the second curve
 * @param secondCurveDirection - Direction of the second curve
 * @param secondCurveEndLocation - End location of the second curve
 * @param endLocation - End location of the connector
 */
export function getPathForBottomBentConnector(
    startLocation: Location,
    firstCurveStartLocation: Location,
    firstCurveDirection: number,
    firstCurveEndLocation: Location,
    secondCurveStartLocation: Location,
    secondCurveDirection: number,
    secondCurveEndLocation: Location,
    endLocation: Location
) {
    return `M ${startLocation.x}, ${startLocation.y}
    L ${firstCurveStartLocation.x}, ${firstCurveStartLocation.y}
    A 16 16 0 0 ${firstCurveDirection}, ${firstCurveEndLocation.x}, ${firstCurveEndLocation.y}
    L ${secondCurveStartLocation.x}, ${secondCurveStartLocation.y}
    A 16 16 0 0 ${secondCurveDirection}, ${secondCurveEndLocation.x}, ${secondCurveEndLocation.y}
    L ${endLocation.x}, ${endLocation.y}`;
}
