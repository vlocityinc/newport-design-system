import { classSet } from 'lightning/utils';
import { getStyleFromGeometry } from 'builder_platform_interaction/flowUtils';

const CLASS_MENU_OPENED = 'menu-opened';
const CLASS_IS_NEW = 'is-new';

/**
 * Utils functions providing the data needed to render flc components
 */

/**
 * Get the data needed to render a flcConnector component
 *
 * @param {ConnectorRenderInfo} connectorInfo - Info about a connector
 * @returns {Object} The flcConnector component data
 */
export function getFlcConnectorData(connectorInfo) {
    const { key, geometry } = connectorInfo;

    return {
        key,
        connectorInfo,
        style: getStyleFromGeometry(geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a flcFlow component
 *
 * @param {FlowRenderInfo} flowInfo - Info about a flow
 * @returns {Object} The flcFlow component data
 */
export function getFlcFlowData(flowInfo) {
    const { key, geometry } = flowInfo;

    return {
        key,
        flowInfo,
        style: getStyleFromGeometry(geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a flcCompoundNode component
 *
 * @param {NodeRenderInfo} nodeInfo - Info about a node
 * @returns {Object} The flcCompoundNode component data
 */
export function getFlcCompoundNodeData(nodeInfo) {
    const { key, geometry } = nodeInfo;

    const className = classSet({ [CLASS_IS_NEW]: nodeInfo.isNew });

    return {
        key,
        nodeInfo,
        style: getStyleFromGeometry(geometry),
        className
    };
}

/**
 * Get the data needed to render a flcNode component
 *
 * @param {NodeRenderInfo} nodeInfo - Info about a node
 * @returns {Object} The flcNode component data
 */
export function getFlcNodeData(nodeInfo) {
    const { key, menuOpened, isNew } = nodeInfo;

    const className = classSet({
        [CLASS_MENU_OPENED]: menuOpened,
        [CLASS_IS_NEW]: isNew
    }).toString();

    return {
        key,
        nodeInfo,
        className,
        style: ''
    };
}
