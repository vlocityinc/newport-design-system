import { classSet } from 'lightning/utils';

/**
 * Util functions for flc components
 */

const CLASS_MENU_OPENED = 'menu-opened';
const CLASS_IS_NEW = 'is-new';

function getCssStyle(cssEntries) {
    return Object.entries(cssEntries)
        .map(entry => `${entry[0]}: ${entry[1]}px`)
        .join(';');
}

/**
 * Returns a css style string for a Geometry object
 *
 * @param {Object} - A geometry object
 * @returns A css style string for the geometry
 */
function getStyleFromGeometry({ x, y, w, h }) {
    return getCssStyle({
        left: x,
        top: y,
        width: w,
        height: h
    });
}

/**
 * Get the data needed to render a flcConnector component
 *
 * @param {ConnectorRenderInfo} connectorInfo - Info about a connector
 * @returns {Object} The flcConnector component data
 */
function getFlcConnectorData(connectorInfo) {
    return {
        key: connectorKey(connectorInfo),
        connectorInfo,
        style: getStyleFromGeometry(connectorInfo.geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a flcFlow component
 *
 * @param {FlowRenderInfo} flowInfo - Info about a flow
 * @param {NodeRenderInfo} parentNodeInfo - The flow's parent node info
 * @param {number} childIndex - The flow's childIndex
 * @returns {Object} The flcFlow component data
 */
function getFlcFlowData(flowInfo, parentNodeInfo, childIndex) {
    return {
        key: `flow-${parentNodeInfo.guid}-${childIndex}`,
        flowInfo,
        style: getStyleFromGeometry(flowInfo.geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a flcCompoundNode component
 *
 * @param {NodeRenderInfo} nodeInfo - Info about a node
 * @returns {Object} The flcCompoundNode component data
 */
function getFlcCompoundNodeData(nodeInfo) {
    const { geometry, guid } = nodeInfo;
    const className = classSet({ [CLASS_IS_NEW]: nodeInfo.isNew });

    const faultFlow = nodeInfo.faultFlow ? getFlcFlowData(nodeInfo.faultFlow, nodeInfo, -1) : null;

    return {
        key: guid,
        nodeInfo,
        style: getStyleFromGeometry(geometry),
        className,
        faultFlow
    };
}

/**
 * Get the data needed to render a flcNode component
 *
 * @param {NodeRenderInfo} nodeInfo - Info about a node
 * @returns {Object} The flcNode component data
 */
function getFlcNodeData(nodeInfo) {
    const { guid, menuOpened } = nodeInfo;

    const className = classSet({
        [CLASS_MENU_OPENED]: menuOpened
    }).toString();

    return {
        key: guid,
        nodeInfo,
        className,
        style: ''
    };
}

/**
 * Creates a unique key for a connector
 *
 * @param {String} prefix - a key prefix
 * @param {ConnectorRenderInfo} connectorInfo- The connector render info
 * @returns a string key
 */
function connectorKey(connectorInfo) {
    const { connectionInfo, type } = connectorInfo;
    const { prev, next, parent, childIndex } = connectionInfo;
    const suffix = prev ? `${prev}:${next}` : `${parent}:${childIndex}`;
    return `connector-${type}-${suffix}`;
}

export {
    connectorKey,
    getStyleFromGeometry,
    getFlcNodeData,
    getFlcCompoundNodeData,
    getFlcFlowData,
    getFlcConnectorData
};
