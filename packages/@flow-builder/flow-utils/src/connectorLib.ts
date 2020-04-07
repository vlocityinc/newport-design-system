import {
    ConnectorRenderInfo,
    SvgInfo,
    ConnectorAddInfo,
    Geometry,
    LayoutConfig,
    Option,
    ConnectorVariant
} from './flowRendererUtils';
import { NodeModel, guid } from './model';
import { LayoutInfo } from './layout';
import ConnectorType from './ConnectorTypeEnum';

/**
 * 2D point coordinates
 */
interface Location {
    x: number;
    y: number;
}

interface ConnectorSource {
    node?: NodeModel;
    parent?: guid;
    childIndex?: number;
}

/**
 * Creates a 2D point
 *
 * @param x x-coord
 * @param y y-coord
 * @returns A Location instance for the point
 */
function getLocation(x: number, y: number): Location {
    return { x, y };
}

/**
 * Get the guid for a condition
 *
 * @param conditionOptions - The condition options
 * @param index - The condition index
 * @returns The condition value guid
 */
function getConditionValue(conditionOptions: Option[], index: number): guid | undefined {
    if (index < conditionOptions.length) {
        return conditionOptions[index].value;
    }
}

function getConnectorConfig(
    layoutConfig: LayoutConfig
): {
    strokeWidth: number;
    halfStrokeWidth: number;
    curveRadius: number;
} {
    const { curveRadius, strokeWidth } = layoutConfig.connector;

    return {
        strokeWidth,
        halfStrokeWidth: strokeWidth / 2,
        curveRadius
    };
}

/**
 * Creates an ConnectorAddInfo for a connector that supports adding
 *
 * @param geometry - The geometry for the button
 * @param menuOpened - Whether the add menu is opened
 * @param connectorSource - The connector source information
 * @returns A ConnectorAddInfo for the button
 */
function createAddInfo(geometry: Geometry, menuOpened: boolean, connectorSource: ConnectorSource): ConnectorAddInfo {
    const { node, parent, childIndex } = connectorSource;

    return Object.assign(
        {
            geometry,
            menuOpened
        },
        parent ? { parent, childIndex } : { prev: node!.guid, next: node!.next }
    );
}

/**
 * Creates a unique key for a connector
 *
 * @param prefix - a key prefix
 * @param connectorSource - The connector source information
 */
function connectorKey(prefix: string, connectorSource: ConnectorSource) {
    const { node, parent, childIndex } = connectorSource;

    const suffix = node ? `${node.guid}:${node.next}` : `${parent}:${childIndex}`;
    return `connector-${prefix}-${suffix}`;
}

/**
 * Creates an SvgInfo for a straight connector
 *
 * @param height - The connector height
 * @param svgHeight - The height of the svg
 * @param svgOffsetY - The y-offset of the svg
 * @param layoutConfig  - The layout config
 * @returns The SvgInfo for the connector
 */
function createStraightConnectorSvgInfo(
    height: number,
    svgMarginTop: number,
    svgMarginBottom: number,
    layoutConfig: LayoutConfig
): SvgInfo {
    const { strokeWidth, halfStrokeWidth } = getConnectorConfig(layoutConfig);

    if (svgMarginBottom < 0) {
        height += -svgMarginBottom;
    }

    const geometry = {
        x: -strokeWidth / 2,
        y: 0,
        w: strokeWidth,
        h: height
    };

    return {
        geometry,
        path: createPathForStraightConnector(
            getLocation(strokeWidth / 2, svgMarginTop),
            getLocation(halfStrokeWidth, height - svgMarginBottom)
        )
    };
}

/**
 * Creates a ConnectorRenderInfo for a connector that links a node to its next node
 *
 * @param connectorSource - The connector source information
 * @param connectorType - Type of the connector being created
 * @param offsetY - y offset of the connector relative to the source element
 * @param height - Height of the connector
 * @param menuOpened - True if the contextual menu is open
 * @param layoutConfig - The layout configuration
 * @param isEdgeBranch - If this connector is for a leftmost or rightmost branch
 * @param conditionInfo - The condition info, if node is a branch head node
 * @returns The ConnectorRenderInfo for the connector
 */
function createConnectorToNextNode(
    connectorSource: ConnectorSource,
    connectorType: ConnectorType,
    offsetY: number,
    height: number,
    menuOpened: boolean,
    layoutConfig: LayoutConfig,
    variant?: ConnectorVariant,
    conditionOptions?: Option[]
): ConnectorRenderInfo {
    const { strokeWidth } = getConnectorConfig(layoutConfig);

    const { addOffset, labelOffset } = layoutConfig.connector.types[connectorType]!;
    const branchLabelGeometry = { y: labelOffset };
    const connectorConfig = layoutConfig.connector.types[connectorType]!;
    let { svgMarginTop = 0, svgMarginBottom = 0 } = connectorConfig;

    if (variant != null && connectorConfig.variants) {
        const variantConfig = connectorConfig.variants![variant]!;
        svgMarginTop = variantConfig.svgMarginTop != null ? variantConfig.svgMarginTop : svgMarginTop;
        svgMarginBottom = variantConfig.svgMarginBottom != null ? variantConfig.svgMarginBottom : svgMarginBottom;
    }

    const geometry = { x: 0, y: offsetY, w: strokeWidth, h: height };

    return {
        key: connectorKey('next', connectorSource),
        geometry,
        addInfo: createAddInfo({ y: addOffset }, menuOpened, connectorSource),
        svgInfo: createStraightConnectorSvgInfo(height, svgMarginTop, svgMarginBottom, layoutConfig),
        branchLabelGeometry,
        connectorType,
        conditionOptions,
        conditionValue: conditionOptions ? getConditionValue(conditionOptions, connectorSource.childIndex!) : undefined
    };
}

/**
 * Gets the params needed to draw an svg for a left branch connector
 *
 * @param width - Width of the svg
 * @param height - Height of the svg
 * @param layoutConfig - The config for the layout
 * @returns The params for the branch svg path
 */
function getBranchLeftPathParams(width: number, height: number, layoutConfig: LayoutConfig): any {
    const { halfStrokeWidth, curveRadius } = getConnectorConfig(layoutConfig);

    const startLocation = getLocation(-width, halfStrokeWidth);
    const curveStartLocation = getLocation(curveRadius + halfStrokeWidth, halfStrokeWidth);
    const curveDirection = 0;
    const curveEndLocation = getLocation(halfStrokeWidth, curveRadius + halfStrokeWidth);
    const endLocation = getLocation(halfStrokeWidth, height + halfStrokeWidth);

    return {
        startLocation,
        curveStartLocation,
        curveDirection,
        curveEndLocation,
        endLocation,
        curveRadius
    };
}

/**
 * Gets the params needed to draw an svg for a right branch connector
 *
 * @param width - Width of the svg
 * @param height - Height of the svg
 * @param layoutConfig - The config for the layout
 * @returns The params for the branch svg path
 */
function getBranchRightPathParams(width: number, height: number, layoutConfig: LayoutConfig): any {
    const { halfStrokeWidth, curveRadius } = getConnectorConfig(layoutConfig);

    const startLocation = getLocation(0, halfStrokeWidth);
    const curveStartLocation = getLocation(width - (curveRadius + halfStrokeWidth), halfStrokeWidth);
    const curveDirection = 1;
    const curveEndLocation = getLocation(width - halfStrokeWidth, curveRadius + halfStrokeWidth);
    const endLocation = getLocation(width - halfStrokeWidth, height + halfStrokeWidth);

    return {
        startLocation,
        curveStartLocation,
        curveDirection,
        curveEndLocation,
        endLocation,
        curveRadius
    };
}

/**
 * Create an SvgInfo for a branch connector
 *
 * @param width - Connector width
 * @param height - Connector height
 * @param connectorType - Left or right branch ConnectorType
 * @param layoutConfig  - The layout config
 * @returns an SvgInfo for the connector
 */
function getBranchSvgInfo(
    width: number,
    height: number,
    connectorType: ConnectorType,
    layoutConfig: LayoutConfig
): SvgInfo {
    const { halfStrokeWidth } = getConnectorConfig(layoutConfig);

    const pathParams =
        connectorType === ConnectorType.BRANCH_LEFT
            ? getBranchLeftPathParams(width, height, layoutConfig)
            : getBranchRightPathParams(width, height, layoutConfig);

    return {
        geometry: {
            x: connectorType === ConnectorType.BRANCH_LEFT ? -halfStrokeWidth : halfStrokeWidth,
            y: -halfStrokeWidth,
            w: Math.abs(width),
            h: height + halfStrokeWidth
        },
        path: createPathForBranchConnector(pathParams)
    };
}

/**
 * Creates a ConnectorRenderInfo for a branch connector.
 * This is the connector that joins a parent node to its outermost branch
 *
 * @param parent - The parent guid
 * @param childIndex - The child branch index
 * @param branchLayout - The layout info for the branch
 * @param layoutConfig - The config for the layout
 */
function createBranchConnector(
    parent: guid,
    childIndex: number,
    branchLayout: LayoutInfo,
    layoutConfig: LayoutConfig
): ConnectorRenderInfo {
    const height = layoutConfig.grid.h;
    const connectorType = branchLayout.x < 0 ? ConnectorType.BRANCH_LEFT : ConnectorType.BRANCH_RIGHT;

    const geometry = {
        x: connectorType === ConnectorType.BRANCH_LEFT ? branchLayout.x : 0,
        y: 0,
        w: Math.abs(branchLayout.x),
        h: height
    };

    const svgInfo = getBranchSvgInfo(branchLayout.x, height, connectorType, layoutConfig);

    return {
        key: connectorKey('branch', { parent, childIndex }),
        connectorType,
        geometry,
        svgInfo
    };
}

/**
 * Creates a ConnectorRenderInfo for a merge connector.
 * This is the connector that joins an outermost merging branch back to its parent
 *
 * @param parent - The parent guid
 * @param childIndex - The child branch index
 * @param branchLayout  - The LayoutInfo for the branch
 * @param joinOffsetY - The join offset of the branch relative to the parent
 * @param layoutConfig  - The layout config
 */
function createMergeConnector(
    parent: guid,
    childIndex: number,
    branchLayout: LayoutInfo,
    joinOffsetY: number,
    layoutConfig: LayoutConfig
): ConnectorRenderInfo {
    const height = layoutConfig.grid.h * 2;

    const connectorType = branchLayout.x < 0 ? ConnectorType.MERGE_LEFT : ConnectorType.MERGE_RIGHT;

    const geometry = {
        x: connectorType === ConnectorType.MERGE_LEFT ? branchLayout.x : 0,
        y: joinOffsetY - height / 2,
        w: Math.abs(branchLayout.x),
        h: height
    };

    return {
        key: connectorKey('merge', { parent, childIndex }),
        geometry,
        svgInfo: createMergeSvgInfo(Math.abs(branchLayout.x), height, connectorType, layoutConfig),
        connectorType
    };
}

/**
 * Creates an svg path for a straight connectors
 *
 * @param startLocation - Start location of the connector
 * @param endLocation - End location of the connector
 * @returns An svg path for the connector
 */
function createPathForStraightConnector(startLocation: Location, endLocation: Location) {
    return `M ${startLocation.x} ${startLocation.y} L ${endLocation.x},${endLocation.y}`;
}

/**
 * Creates an svg path for a branch connector
 *
 * @param startLocation - Start location of the connector
 * @param curveStartLocation - Start location of the first curve
 * @param curveDirection - Direction of the fist curve
 * @param curveEndLocation - End location of the first curve
 * @param endLocation - End location of the connector
 * @returns An svg path for the conector
 */
function createPathForBranchConnector({
    startLocation,
    curveStartLocation,
    curveDirection,
    curveEndLocation,
    endLocation,
    curveRadius
}: {
    startLocation: Location;
    curveStartLocation: Location;
    curveDirection: number;
    curveEndLocation: Location;
    endLocation: Location;
    curveRadius: number;
}): string {
    return `M ${startLocation.x}, ${startLocation.y}
    L ${curveStartLocation.x}, ${curveStartLocation.y}
    A ${curveRadius} ${curveRadius} 0 0 ${curveDirection}, ${curveEndLocation.x}, ${curveEndLocation.y}
    L ${endLocation.x}, ${endLocation.y}`;
}

/**
 * Creates the an svg path for a merge connector
 *
 * @param startLocation - Start location of the connector
 * @param firstCurveStartLocation - Start location of the first curve
 * @param firstCurveDirection - Direction of the fist curve
 * @param firstCurveEndLocation - End location of the first curve
 * @param secondCurveStartLocation - Start location of the second curve
 * @param secondCurveDirection - Direction of the second curve
 * @param secondCurveEndLocation - End location of the second curve
 * @param endLocation - End location of the connector
 */
function createPathForMergeConnector({
    startLocation,
    firstCurveStartLocation,
    firstCurveDirection,
    firstCurveEndLocation,
    secondCurveStartLocation,
    secondCurveDirection,
    secondCurveEndLocation,
    endLocation,
    curveRadius
}: {
    startLocation: Location;
    firstCurveStartLocation: Location;
    firstCurveDirection: number;
    firstCurveEndLocation: Location;
    secondCurveStartLocation: Location;
    secondCurveDirection: number;
    secondCurveEndLocation: Location;
    endLocation: Location;
    curveRadius: number;
}) {
    return `M ${startLocation.x}, ${startLocation.y}
    L ${firstCurveStartLocation.x}, ${firstCurveStartLocation.y}
    A ${curveRadius} ${curveRadius} 0 0 ${firstCurveDirection}, ${firstCurveEndLocation.x}, ${firstCurveEndLocation.y}
    L ${secondCurveStartLocation.x}, ${secondCurveStartLocation.y}
    A ${curveRadius} ${curveRadius} 0 0 ${secondCurveDirection}, ${secondCurveEndLocation.x}, ${secondCurveEndLocation.y}
    L ${endLocation.x}, ${endLocation.y}`;
}

/**
 * Create an SvgInfo for a merge connector
 *
 * @param width - Connector width
 * @param height - Connector height
 * @param connectorType - Left or right merge connector type
 * @param layoutConfig  - The layout config
 * @returns an SvgInfo for the connector
 */
function createMergeSvgInfo(
    width: number,
    height: number,
    connectorType: ConnectorType.MERGE_LEFT | ConnectorType.MERGE_RIGHT,
    layoutConfig: LayoutConfig
) {
    const { strokeWidth, halfStrokeWidth } = getConnectorConfig(layoutConfig);
    const svgWidth = width + strokeWidth;

    const pathParams =
        connectorType === ConnectorType.MERGE_LEFT
            ? getMergeLeftPathParams(svgWidth, height, layoutConfig)
            : getMergeRightPathParams(svgWidth, height, layoutConfig);

    return {
        geometry: {
            x: -halfStrokeWidth,
            y: 0,
            w: svgWidth,
            h: height
        },
        path: createPathForMergeConnector(pathParams)
    };
}

/**
 * Gets the params needed to draw an svg path for a left merge connector
 *
 * @param width - The connector width
 * @param height - The connector height
 * @param layoutConfig - The layout config
 * @returns The params for the merge svg path
 */
function getMergeLeftPathParams(width: number, height: number, layoutConfig: LayoutConfig) {
    const { halfStrokeWidth, curveRadius } = getConnectorConfig(layoutConfig);
    const curveOffsetY = (height - 2 * curveRadius) / 2;

    return {
        startLocation: getLocation(halfStrokeWidth, 0),
        firstCurveStartLocation: getLocation(halfStrokeWidth, curveOffsetY),
        firstCurveDirection: 0,
        firstCurveEndLocation: getLocation(halfStrokeWidth + curveRadius, curveOffsetY + curveRadius),
        secondCurveStartLocation: getLocation(width - curveRadius - halfStrokeWidth, curveOffsetY + curveRadius),
        secondCurveDirection: 1,
        secondCurveEndLocation: getLocation(width - halfStrokeWidth, curveOffsetY + 2 * curveRadius),
        endLocation: getLocation(width - halfStrokeWidth, height),
        curveRadius
    };
}

/**
 * Gets the params needed to draw an svg path for a right merge connector
 *
 * @param width - The connector width
 * @param height - The connector height
 * @param layoutConfig - The layout config
 * @returns The params for the merge svg path
 */
function getMergeRightPathParams(width: number, height: number, layoutConfig: LayoutConfig) {
    const { halfStrokeWidth, curveRadius } = getConnectorConfig(layoutConfig);
    const curveOffsetY = (height - 2 * curveRadius) / 2;

    return {
        startLocation: getLocation(width - halfStrokeWidth, 0),
        firstCurveStartLocation: getLocation(width - halfStrokeWidth, curveOffsetY),
        firstCurveDirection: 1,
        firstCurveEndLocation: getLocation(width - halfStrokeWidth - curveRadius, curveOffsetY + curveRadius),
        secondCurveStartLocation: getLocation(halfStrokeWidth + curveRadius, curveOffsetY + curveRadius),
        secondCurveDirection: 0,
        secondCurveEndLocation: getLocation(halfStrokeWidth, curveOffsetY + 2 * curveRadius),
        endLocation: getLocation(halfStrokeWidth, height),
        curveRadius
    };
}

/*
    getLeftLoopConnectorInfo() {
        const { sourceY, svgHeight } = this.connectorInfo;
        let { svgWidth } = this.connectorInfo;

        svgWidth += HALF_BASE_CONNECTOR_WIDTH;

        const offsetX = HALF_BASE_CONNECTOR_WIDTH;
        const offsetY = HALF_BASE_CONNECTOR_WIDTH;

        const path = `M${svgWidth},${offsetY} ${offsetX},${offsetY}  ${offsetX},${svgHeight +
            offsetY +
            0}  ${offsetX},${svgHeight + 0 + offsetY},${svgWidth},${svgHeight + 0 + offsetY}`;

        const style = getStyle({
            left: -HALF_BASE_CONNECTOR_WIDTH,
            top: sourceY - HALF_BASE_CONNECTOR_WIDTH
        });
        return {
            svgWidth,
            svgHeight: svgHeight + BASE_CONNECTOR_WIDTH,
            style,
            path,
            pathClass: this.getConnectorPathClassName()
        };
    }

    getRightLoopConnectorInfo() {
        const { sourceX, sourceY, svgHeight } = this.connectorInfo;
        let { svgWidth } = this.connectorInfo;

        svgWidth += HALF_BASE_CONNECTOR_WIDTH;
        const offsetX = HALF_BASE_CONNECTOR_WIDTH;
        const offsetY = HALF_BASE_CONNECTOR_WIDTH;

        const path = `M0,${offsetY} ${svgWidth - offsetX},${offsetY} ${svgWidth - offsetX},${svgHeight +
            offsetY} 0,${svgHeight + offsetY}`;

        const style = getStyle({
            left: sourceX,
            top: sourceY - HALF_BASE_CONNECTOR_WIDTH
        });

        return {
            svgWidth,
            svgHeight: svgHeight + BASE_CONNECTOR_WIDTH,
            style,
            path,
            pathClass: this.getConnectorPathClassName()
        };
    }
*/

export { createConnectorToNextNode, createMergeConnector, createBranchConnector };
