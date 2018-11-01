import { CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";

const CONNECTOR_OVERLAY = {
    ARROW: ['PlainArrow', {
        location: -1,
        width: 14,
        length: 8,
        id: '__arrow'
    }],
    LABEL: '__label'
};

/**
 * @type {object} instance
 */
let instance = null;

let connectionDecorator = null;

/** Wrapper class for drawing library (currently jsplumb) **/
class DrawingLib {
    constructor() {
        if (instance === null) {
            instance = window.jsPlumb.getInstance({
                Container: 'innerCanvas',
                Connector: ['Flowchart', { gap: 7, stub: [10, 10], alwaysRespectStubs: true, cornerRadius: 12 }],
                Anchor: 'Continuous',
                Endpoint: 'Blank',
                PaintStyle: {
                    strokeWidth: 2,
                    stroke: '#919297',
                    outlineStroke: 'transparent',
                    outlineWidth: 5,
                    joinstyle: 'round'
                },
                HoverPaintStyle: {
                    strokeWidth: 2,
                    stroke: '#1589ee'
                }
            });
        }
    }

    connectorStyles = {
        faultConnector: {
            strokeWidth: 2,
            stroke: '#c23934',
            dashstyle: '4 6'
        },
        deselectedConnector: {
            strokeWidth: 2,
            stroke: '#919297'
        },
        selectedConnector: {
            strokeWidth: 3,
            stroke: '#0070d2'
        },
        selectedFaultConnector: {
            strokeWidth: 3,
            stroke: '#870500'
        },
        hoverConnector: {
            stroke: '#1589ee'
        },
        hoverFaultConnector: {
            stroke: '#a61a14'
        }
    } ;

    /**
     * Sets the container as the main area for all the jsPlumb activity.
     * @param {String|Object} container - id of the element or the whole element where the jsPlumb instance should live
     */
    setContainer = (container) => {
        instance.setContainer(container);
    };

    /**
     * Gets the container where jsPlumb has been initialised.
     * @returns {Object} The HTML container where jsPlumb is set
     */
    getContainer = () => {
        return instance.getContainer();
    };

    /**
     * Used to improve the performance of the canvas while loading all the data.
     * @param {boolean} val - Instructs jsPlumb whether to suspend drawing or not
     * @param {boolean} repaintAfterwards - Instructs jsPlumb to immediately perform full repaint or not
     */
    setSuspendDrawing = (val, repaintAfterwards) => {
        instance.setSuspendDrawing(val, repaintAfterwards);
    };

    /**
     * Updates the zoom level of the jsPlumb container to draw connections based on the new zoom level.
     * @param {Integer} zoomValue - Zoom level for the container
     */
    setZoom = (zoomValue) => {
        instance.setZoom(zoomValue);
    };

    /**
     * Sets all the nodes within the canvas to be draggable.
     * @param {Object} nodeElement - The node element
     * @param {Object} config - Configuration for the nodeElement we are setting as draggable
     */
    setDraggable = (nodeElement, config) => {
        instance.draggable(nodeElement, config);
    };

    /**
     * Checks if the given iconSection is a source or not.
     * @param {String} canvasElementContainer - The canvas element container
     * @returns {Boolean} Indicating if the iconSection is a source or not
     */
    isSource = (canvasElementContainer) => {
        return instance.isSource(canvasElementContainer);
    };

    /**
     * Makes the end-points of all the nodes a source point to start creating connectors from.
     * @param {String} canvasElementContainer - The canvas element container
     */
    makeSource = (canvasElementContainer) => {
        instance.makeSource(canvasElementContainer, {
            filter: '.end-point',
            endpoint: 'Dot',
            endpointStyle: {},
            allowLoopback: false,
            maxConnections: -1,
        });
    };

    /**
     * Checks if the given iconSection is a target or not.
     * @param {String} canvasElementContainer - The canvas element container
     * @returns {Boolean} Indicating if the iconSection is a source or not
     */
    isTarget = (canvasElementContainer) => {
        return instance.isTarget(canvasElementContainer);
    };

    /**
     * Makes all the nodes a target region for the connectors to be dropped at.
     * @param {String} canvasElementContainer - The canvas element container
     */
    makeTarget = (canvasElementContainer) => {
        instance.makeTarget(canvasElementContainer, {
            allowLoopback: false,
            maxConnections: -1,
            dropOptions: {hoverClass: 'targetHover'},
        });
    };

    /**
     * Sets all the existing connections while loading the flow in the canvas. If a connection is already set
     * then it doesn't do anything.
     * @param {String} sourceGuid - ID of the source node
     * @param {String} targetGuid - ID of the target node
     * @param {String} label - The label to display for the connector
     * @param {String} connectorGuid - ID of the connector
     * @param {String} connectorType - Type of connector
     * @return {Object} connection - jsPlumb's connector instance
     */
    setExistingConnections = (sourceGuid, targetGuid, label, connectorGuid, connectorType) => {
        const connectionInstance = {source: sourceGuid, target: targetGuid, detachable: false};

        if (connectionDecorator) {
            connectionDecorator(connectionInstance, connectorType);
        }

        const connection = instance.connect(connectionInstance);
        if (!connection) {
            // guard in case we're editing a flow with unsupported elements
            return null;
        }

        if (label) {
            if (connectorType === CONNECTOR_TYPE.FAULT) {
                connection.setPaintStyle(this.connectorStyles.faultConnector);
                connection.setHoverPaintStyle(this.connectorStyles.hoverFaultConnector);
                connection.addOverlay(['Label', {id: CONNECTOR_OVERLAY.LABEL, label, cssClass: 'fault-label'}]);
            } else {
                connection.addOverlay(['Label', {id: CONNECTOR_OVERLAY.LABEL, label}]);
            }
        }

        connection.id = connectorGuid;
        connection.addOverlay(CONNECTOR_OVERLAY.ARROW);

        return connection;
    };

    /**
     * Sets up a new connection when a connector is dragged from a source and dropped at a target.
     * @param {Function} connectionAdded - Function to dispatch an addConnection event to the editor
     */
    setNewConnection = (connectionAdded) => {
        instance.bind('beforeDrop', connectionAdded);
    };

    /**
     * Notifies when a connections is clicked.
     * @param {Function} connectionClicked - Function to mark the node as selected
     */
    clickConnection = (connectionClicked) => {
        instance.bind('click', connectionClicked);
    };

    /**
     * Helper method to set the paint styles and labels of the connectors when selected or deselected.
     * @param {Object} connection - The connector that has been selected/deselected
     * @param {Object} paintStyle - Paint style of the selected/deselected connector
     * @param {Object} hoverPaintStyle - Hover paint style of the selected/deselected connector
     * @param {String} cssClass - css class that needs to be added
     */
    setPaintStyleAndLabel = (connection, paintStyle, hoverPaintStyle, cssClass) => {
        connection.setPaintStyle(paintStyle);
        connection.setHoverPaintStyle(hoverPaintStyle);
        const labelOverlay = connection.getOverlay(CONNECTOR_OVERLAY.LABEL);
        if (labelOverlay && labelOverlay.label) {
            connection.removeOverlay(CONNECTOR_OVERLAY.LABEL);
            connection.addOverlay(['Label', {id: CONNECTOR_OVERLAY.LABEL, label: labelOverlay.label, cssClass}]);
        }
    };

    /**
     * Sets up the paint style of the connector when it's selected.
     * @param {Object} connection - The connector that has been selected
     * @param {String} connectorType - Type of connector
     */
    selectConnector = (connection, connectorType) => {
        let cssClass;
        let paintStyle;
        const hoverPaintStyle = {};
        if (connectorType === CONNECTOR_TYPE.FAULT) {
            paintStyle = this.connectorStyles.selectedFaultConnector;
            cssClass = 'fault-label-selected';
        } else {
            paintStyle = this.connectorStyles.selectedConnector;
            cssClass = 'label-selected';
        }
        connection.addClass('connector-selected');
        this.setPaintStyleAndLabel(connection, paintStyle, hoverPaintStyle, cssClass);
    };

    /**
     * Sets up the paint style of the connector when it's deselected.
     * @param {Object} connection - The connector that has been deselected
     * @param {String} connectorType - Type of connector
     */
    deselectConnector = (connection, connectorType) => {
        let cssClass;
        let paintStyle;
        let hoverPaintStyle;
        if (connectorType === CONNECTOR_TYPE.FAULT) {
            paintStyle = this.connectorStyles.faultConnector;
            hoverPaintStyle = this.connectorStyles.hoverFaultConnector;
            cssClass = 'fault-label';
        } else {
            paintStyle = this.connectorStyles.deselectedConnector;
            hoverPaintStyle = this.connectorStyles.hoverConnector;
            cssClass = '';
        }
        connection.removeClass('connector-selected');
        this.setPaintStyleAndLabel(connection, paintStyle, hoverPaintStyle, cssClass);
    };

    /**
     * Add the given element to the drag selection.
     * @param {Object} nodeElement - The passed element
     */
    addToDragSelection = (nodeElement) => {
        instance.addToDragSelection(nodeElement);
    };

    /**
     * Removes the given element from the drag selection.
     * @param {Object} nodeElement - The passed element
     */
    removeFromDragSelection = (nodeElement) => {
        instance.removeFromDragSelection(nodeElement);
    };

    /**
     * Removes the node from jsPlumb's instance but not from the dom.
     * @param {String} nodeId - The node id
     */
    removeNodeFromLib = (nodeId) => {
        // eslint-disable-next-line lwc/no-document-query
        const canvasElementContainer = document.getElementById(nodeId);
        if (canvasElementContainer) {
            instance.removeFromDragSelection(canvasElementContainer);
            instance.unmakeSource(nodeId);
            delete instance.sourceEndpointDefinitions[nodeId];
            instance.unmakeTarget(nodeId);
            instance.destroyDraggable(nodeId);
            instance.destroyDroppable(nodeId);
        }
    };

    /**
     * Removes the connector from jsPlumb's instance
     * @param {Object} connector - jsPlumb connector instance
     */
    removeConnectorFromLib = (connector) => {
        instance.deleteConnection(connector);
    }
}

export { CONNECTOR_OVERLAY };
/** Export of the singleton instance of library **/
export const drawingLibInstance = new DrawingLib();

/**
 * Sets up a decorator to configure new connections when they're created
 * @param {Function} decorator - Function to configure a connector.
 *                               Accepts (connector, connectorType) and can modify the connector
 */
export function setConnectionDecorator(decorator) {
    connectionDecorator = decorator;
}
