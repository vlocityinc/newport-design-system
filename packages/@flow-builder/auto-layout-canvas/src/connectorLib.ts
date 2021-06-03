import {
    ConnectorRenderInfo,
    LayoutConfig,
    ConnectorVariant,
    ConnectorConnectionInfo,
    getConnectorConfig
} from './flowRendererUtils';

import { Guid } from './model';
import ConnectorType from './ConnectorTypeEnum';
import ConnectorLabelType from './ConnectorLabelTypeEnum';
import {
    createSvgPath,
    Offset,
    createOffsetLocation,
    SvgPathParams,
    SvgInfo,
    createSvgInfo,
    Geometry
} from './svgUtils';

/**
 * Creates an SvgInfo for a straight connector
 *
 * @param height - The connector height
 * @param svgMarginTop - The top margin
 * @param svgMarginBottom - The bottom margin
 * @param layoutConfig  - The layout config
 * @returns The SvgInfo for the connector
 */
function createStraightConnectorSvgInfo(
    height: number,
    svgMarginTop: number,
    svgMarginBottom: number,
    layoutConfig: LayoutConfig
): SvgInfo {
    const { strokeWidth } = layoutConfig.connector;

    if (svgMarginBottom < 0) {
        height += -svgMarginBottom;
    }

    const geometry = {
        x: -strokeWidth / 2,
        y: 0,
        w: strokeWidth,
        h: height
    };

    const { path, endLocation } = createSvgPath({
        start: createOffsetLocation({ x: 0, y: svgMarginTop }, [strokeWidth / 2, 0]),
        offsets: [[0, height - svgMarginBottom - svgMarginTop]]
    });

    return {
        geometry,
        path,
        endLocation
    };
}

/**
 * Creates an SvgInfo for a GoTo connector
 *
 * @param height - The connector height
 * @param svgMarginTop - The top margin
 * @param svgMarginBottom - The bottom margin
 * @param layoutConfig  - The layout config
 * @returns The SvgInfo for the connector
 */
function createGoToConnectorSvgInfo(
    height: number,
    svgMarginTop: number,
    svgMarginBottom: number,
    layoutConfig: LayoutConfig
): SvgInfo {
    const { strokeWidth, curveRadius } = layoutConfig.connector;
    const { w, h } = layoutConfig.grid;

    if (svgMarginBottom < 0) {
        height += -svgMarginBottom;
    }

    const geometry = {
        x: -strokeWidth / 2,
        y: 0,
        w,
        h: height
    };

    const { path, endLocation } = createSvgPath({
        start: createOffsetLocation({ x: 0, y: svgMarginTop }, [strokeWidth / 2, 0]),
        offsets: [
            [0, height - svgMarginBottom - svgMarginTop - h],
            [curveRadius, curveRadius],
            [w / 4 - 2 * curveRadius, 0]
        ]
    });

    return {
        geometry,
        path,
        endLocation
    };
}

/**
 * Creates a ConnectorRenderInfo for a connector (regular or goTo) that links a node to its next node.
 *
 * @param connectionInfo - The connector connection info
 * @param connectorType - Type of the connector being created
 * @param connectorLabelType - Type of Connector Label
 * @param offsetY - y offset of the connector relative to the source element
 * @param height - Height of the connector
 * @param menuOpened - True if the contextual menu is open
 * @param layoutConfig - The layout configuration
 * @param isFault - Whether this is part of a fault connector
 * @param variants - The variants for the connector
 * @param isBranchGettingDeleted - True if the current branch is getting deleted
 * @param addOffset - offset to add
 * @param labelOffset - offset label
 * @param connectorBadgeLabel - The label of the standard branch connector. Undefined for Default and Fault Connector
 * @param isHighlighted - Whether this connector is highlighted
 * @param goToTargetLabel - label for gotTo
 * @returns The ConnectorRenderInfo for the connector
 */
function createConnectorToNextNode(
    connectionInfo: ConnectorConnectionInfo,
    connectorType: ConnectorType,
    connectorLabelType: ConnectorLabelType,
    offsetY: number,
    height: number,
    menuOpened: boolean,
    layoutConfig: LayoutConfig,
    isFault: boolean,
    variants: ConnectorVariant[],
    isBranchGettingDeleted: boolean,
    addOffset: number | undefined,
    labelOffset: number | undefined,
    connectorBadgeLabel: string | undefined,
    isHighlighted: boolean,
    goToTargetLabel: string | undefined
): ConnectorRenderInfo {
    const { strokeWidth } = layoutConfig.connector;

    const { svgMarginTop = 0, svgMarginBottom = 0 } = getConnectorConfig(
        layoutConfig,
        connectorType,
        ...(variants || [])
    );

    const geometry = { x: 0, y: offsetY, w: strokeWidth, h: height };

    const connectorRenderInfo = {
        labelType: connectorLabelType,
        geometry,
        addInfo: addOffset != null ? { offsetY: addOffset, menuOpened } : undefined,
        connectionInfo,
        svgInfo:
            connectorType === ConnectorType.GO_TO
                ? createGoToConnectorSvgInfo(height, svgMarginTop, svgMarginBottom, layoutConfig)
                : createStraightConnectorSvgInfo(height, svgMarginTop, svgMarginBottom, layoutConfig),
        goToTargetLabel,
        labelOffsetY: labelOffset,
        type: connectorType,
        connectorBadgeLabel,
        isFault,
        toBeDeleted: isBranchGettingDeleted,
        isHighlighted
    };

    if (!connectorRenderInfo.connectorBadgeLabel) {
        delete connectorRenderInfo.connectorBadgeLabel;
    }

    return connectorRenderInfo;
}

/**
 * Returns the params needed to draw an svg for a left branch connector
 *
 * @param width - Width of the svg
 * @param height - Height of the svg
 * @param layoutConfig - The config for the layout
 * @returns The params for the branch svg path
 */
function getBranchLeftPathParams(width: number, height: number, layoutConfig: LayoutConfig): SvgPathParams {
    const { curveRadius } = layoutConfig.connector;

    return {
        start: { x: width, y: 0 },
        offsets: [
            [-width + curveRadius, 0],
            [-curveRadius, curveRadius],
            [0, height - curveRadius]
        ]
    };
}

/**
 * Returns the params needed to draw an svg for a right branch connector
 *
 * @param width - Width of the svg
 * @param height - Height of the svg
 * @param layoutConfig - The config for the layout
 * @returns The params for the branch svg path
 */
function getBranchRightPathParams(width: number, height: number, layoutConfig: LayoutConfig): SvgPathParams {
    const { curveRadius } = layoutConfig.connector;

    return {
        start: { x: 0, y: 0 },
        offsets: [
            [width - curveRadius, 0],
            [curveRadius, curveRadius],
            [0, height - curveRadius]
        ]
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
    connectorType: ConnectorType.BRANCH_LEFT | ConnectorType.BRANCH_RIGHT,
    layoutConfig: LayoutConfig
): SvgInfo {
    const { strokeWidth } = layoutConfig.connector;
    const isLeft = connectorType === ConnectorType.BRANCH_LEFT;
    const startOffset: Offset = [strokeWidth / 2, strokeWidth / 2];

    const svgPathParams = isLeft
        ? getBranchLeftPathParams(width, height, layoutConfig)
        : getBranchRightPathParams(width, height, layoutConfig);

    return createSvgInfo(svgPathParams, startOffset);
}

/**
 * Creates a ConnectorRenderInfo for a branch connector.
 * This is the connector that joins a parent node to its outermost branch
 *
 * @param parent - The parent guid
 * @param childIndex - The child branch index
 * @param geometry - The geometry for the connector
 * @param connectorType - The branch type: left or right
 * @param layoutConfig - The config for the layout
 * @param isFault - Whether this is part of a fault connector
 * @param toBeDeleted - True if the connector is going to get deleted
 * @param isHighlighted - Whether this connector is highlighted
 * @returns a ConnectorRenderInfo for the branch connector
 */
function createBranchConnector(
    parent: Guid,
    childIndex: number,
    geometry: Geometry,
    connectorType: ConnectorType.BRANCH_LEFT | ConnectorType.BRANCH_RIGHT,
    layoutConfig: LayoutConfig,
    isFault: boolean,
    toBeDeleted: boolean,
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { w, h } = geometry;
    const svgInfo = getBranchSvgInfo(w, h, connectorType, layoutConfig);

    return {
        type: connectorType,
        labelType: ConnectorLabelType.NONE,
        geometry,
        svgInfo,
        isFault,
        connectionInfo: {
            parent,
            childIndex
        },
        toBeDeleted,
        isHighlighted
    };
}

/**
 * Creates a ConnectorRenderInfo for a merge connector.
 * This is the connector that joins an outermost merging branch back to its parent
 *
 * @param parent - The parent guid
 * @param childIndex - The child branch index
 * @param geometry - The geometry for the connector
 * @param connectorType - The merge type: left or right
 * @param layoutConfig  - The layout config
 * @param isFault - Whether this is part of a fault connector
 * @param toBeDeleted - True if the connector is going to get deleted
 * @param isHighlighted - True if the connector is highlighted
 * @returns a ConnectorRenderInfo for the merge connector
 */
function createMergeConnector(
    parent: Guid,
    childIndex: number,
    geometry: Geometry,
    connectorType: ConnectorType.MERGE_LEFT | ConnectorType.MERGE_RIGHT,
    layoutConfig: LayoutConfig,
    isFault: boolean,
    toBeDeleted: boolean,
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { w, h } = geometry;
    return {
        geometry,
        svgInfo: createMergeSvgInfo(w, h, connectorType, layoutConfig),
        type: connectorType,
        labelType: ConnectorLabelType.NONE,
        isFault,
        connectionInfo: {
            parent,
            childIndex
        },
        toBeDeleted,
        isHighlighted
    };
}

/**
 * Creates a ConnectorRenderInfo for a loop after connector.
 * This is the connector that joins the loop element to the first element following a loop
 *
 * @param parent - The parent guid
 * @param geometry - The geometry for the connector
 * @param layoutConfig - The config for the layout
 * @param isFault - Whether this is part of a fault connector
 * @param toBeDeleted - True if the connector is going to get deleted
 * @param labelOffsetY - Label offset Y
 * @param labelOffsetX - Label offset X
 * @param isHighlighted - Whether this connector is highlighted
 * @returns a ConnectorRenderInfo for the loop connector
 */
function createLoopAfterLastConnector(
    parent: Guid,
    geometry: Geometry,
    layoutConfig: LayoutConfig,
    isFault: boolean,
    toBeDeleted: boolean,
    labelOffsetY: number,
    labelOffsetX: number,
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { w, h } = geometry;
    const connectorType = ConnectorType.LOOP_AFTER_LAST;

    return {
        labelType: ConnectorLabelType.LOOP_AFTER_LAST,
        geometry,
        svgInfo: createLoopSvgInfo(w, h, connectorType, layoutConfig),
        type: connectorType,
        connectionInfo: {
            parent
        },
        isFault,
        labelOffsetY,
        labelOffsetX,
        toBeDeleted,
        isHighlighted
    };
}

/**
 * Creates a ConnectorRenderInfo for a loop back connector.
 * This is the connector that the last element of a loop back to the loop element
 *
 * @param parent - The parent guid
 * @param geometry - The geometry for the connector
 * @param layoutConfig - The config for the layout
 * @param isFault - Whether this is part of a fault connector
 * @param toBeDeleted - True if the connector is going to get deleted
 * @param isHighlighted - Whether this connector is highlighted
 * @returns a ConnectorRenderInfo for the loop connector
 */
function createLoopBackConnector(
    parent: Guid,
    geometry: Geometry,
    layoutConfig: LayoutConfig,
    isFault: boolean,
    toBeDeleted: boolean,
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { w, h } = geometry;
    const connectorType = ConnectorType.LOOP_BACK;

    return {
        geometry,
        svgInfo: createLoopSvgInfo(w, h, connectorType, layoutConfig),
        connectionInfo: {
            parent
        },
        type: connectorType,
        labelType: ConnectorLabelType.NONE,
        isFault,
        toBeDeleted,
        isHighlighted
    };
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
): SvgInfo {
    const { strokeWidth } = layoutConfig.connector;
    const offset: Offset = [strokeWidth / 2, 0];

    const svgPathParams =
        connectorType === ConnectorType.MERGE_LEFT
            ? getMergeLeftPathParams(width, height, layoutConfig)
            : getMergeRightPathParams(width, height, layoutConfig);

    return createSvgInfo(svgPathParams, offset);
}

/**
 * Create an SvgInfo for a loop connector
 *
 * @param width - Connector width
 * @param height - Connector height
 * @param connectorType - Left or right merge connector type
 * @param layoutConfig  - The layout config
 * @returns an SvgInfo for the connector
 */
function createLoopSvgInfo(
    width: number,
    height: number,
    connectorType: ConnectorType.LOOP_BACK | ConnectorType.LOOP_AFTER_LAST,
    layoutConfig: LayoutConfig
): SvgInfo {
    const { strokeWidth } = layoutConfig.connector;
    const offset: Offset = [strokeWidth / 2, strokeWidth / 2];

    const svgPathParams =
        connectorType === ConnectorType.LOOP_BACK
            ? getLoopBackPathParams(width, height, layoutConfig)
            : getLoopAfterLastPathParams(width, height, layoutConfig);

    return createSvgInfo(svgPathParams, offset);
}

/**
 * Returns the params needed to draw an svg path for a left merge connector
 *
 * @param width - The connector width
 * @param height - The connector height
 * @param layoutConfig - The layout config
 * @returns The params for the merge svg path
 */
function getMergeLeftPathParams(width: number, height: number, layoutConfig: LayoutConfig): SvgPathParams {
    const { curveRadius } = layoutConfig.connector;

    const curveOffsetY = (height - 2 * curveRadius) / 2;

    return {
        start: { x: 0, y: 0 },
        offsets: [
            [0, curveOffsetY],
            [curveRadius, curveRadius],
            [width - 2 * curveRadius, 0],
            [curveRadius, curveRadius],
            [0, curveOffsetY]
        ]
    };
}

/**
 * Returns the params needed to draw an svg path for a right merge connector
 *
 * @param width - The connector width
 * @param height - The connector height
 * @param layoutConfig - The layout config
 * @returns The params for the merge svg path
 */
function getMergeRightPathParams(width: number, height: number, layoutConfig: LayoutConfig): SvgPathParams {
    const { curveRadius } = layoutConfig.connector;

    const curveOffsetY = (height - 2 * curveRadius) / 2;

    return {
        start: { x: width, y: 0 },
        offsets: [
            [0, curveOffsetY],
            [-curveRadius, curveRadius],
            [-(width - 2 * curveRadius), 0],
            [-curveRadius, curveRadius],
            [0, curveOffsetY]
        ]
    };
}

/**
 * Returns the params needed to draw an svg path for a loop back connector
 *
 * @param width - The connector width
 * @param height - The connector height
 * @param layoutConfig - The layout config
 * @returns The params for the loop back svg path
 */
function getLoopBackPathParams(width: number, height: number, layoutConfig: LayoutConfig): SvgPathParams {
    const { curveRadius } = layoutConfig.connector;
    const offsetY = height - layoutConfig.grid.h * 2;
    const preRadiusHeight = layoutConfig.grid.h - curveRadius;
    return {
        start: { x: width, y: 0 },
        offsets: [
            [-(width - curveRadius), 0],
            [-curveRadius, curveRadius],
            [0, offsetY - preRadiusHeight],
            [curveRadius, curveRadius],
            [width - curveRadius * 2, 0],
            [curveRadius, -curveRadius],
            [0, -preRadiusHeight]
        ]
    };
}

/**
 * Returns the params needed to draw an svg path for a loop after connector
 *
 * @param width - The connector width
 * @param height - The connector height
 * @param layoutConfig - The layout config
 * @returns The params for the loop after svg path
 */
function getLoopAfterLastPathParams(width: number, height: number, layoutConfig: LayoutConfig): SvgPathParams {
    const { curveRadius } = layoutConfig.connector;
    const preRadiusHeight = layoutConfig.grid.h - curveRadius;

    return {
        start: { x: 0, y: 0 },
        offsets: [
            [width - curveRadius, 0],
            [curveRadius, curveRadius],
            [0, height - layoutConfig.grid.h - preRadiusHeight],
            [-curveRadius, curveRadius],
            [-(width - curveRadius * 2), 0],
            [-curveRadius, curveRadius],
            [0, preRadiusHeight]
        ]
    };
}

export {
    createConnectorToNextNode,
    createMergeConnector,
    createBranchConnector,
    createLoopAfterLastConnector,
    createLoopBackConnector
};
