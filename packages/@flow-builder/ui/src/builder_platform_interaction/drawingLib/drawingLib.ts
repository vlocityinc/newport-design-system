// @ts-nocheck
import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';

const CONNECTOR_OVERLAY = {
    ARROW: [
        'PlainArrow',
        {
            location: -1,
            width: 14,
            length: 8,
            id: '__arrow'
        }
    ],
    LABEL: '__label'
};

/**
 * @type {object} instance
 */
let drawingLibInstance = null;

/** Wrapper class for drawing library (currently jsplumb) **/
class DrawingLib {
    private instance = null;

    constructor() {
        this.instance = window.jsPlumb.getInstance({
            Container: 'innerCanvas',
            Connector: [
                'Flowchart',
                {
                    gap: 7,
                    stub: [10, 10],
                    alwaysRespectStubs: true,
                    cornerRadius: 12
                }
            ],
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
        },
        highlightedConnector: {
            strokeWidth: 5,
            stroke: '#FFB75D',
            dashstyle: '0'
        }
    };

    /**
     * Sets the container as the main area for all the jsPlumb activity.
     * @param {String|Object} container - id of the element or the whole element where the jsPlumb instance should live
     */
    setContainer = container => {
        this.instance.setContainer(container);
    };

    /**
     * Gets the container where jsPlumb has been initialised.
     * @returns {Object} The HTML container where jsPlumb is set
     */
    getContainer = () => {
        return this.instance.getContainer();
    };

    /**
     * Used to improve the performance of the canvas while loading all the data.
     * @param {boolean} val - Instructs jsPlumb whether to suspend drawing or not
     * @param {boolean} repaintAfterwards - Instructs jsPlumb to immediately perform full repaint or not
     */
    setSuspendDrawing = (val, repaintAfterwards) => {
        this.instance.setSuspendDrawing(val, repaintAfterwards);
    };

    /**
     * Updates the zoom level of the jsPlumb container to draw connections based on the new zoom level.
     * @param {Integer} zoomValue - Zoom level for the container
     */
    setZoom = zoomValue => {
        this.instance.setZoom(zoomValue);
    };

    /**
     * Sets all the nodes within the canvas to be draggable.
     * @param {Object} nodeElement - The node element
     * @param {Object} config - Configuration for the nodeElement we are setting as draggable
     */
    setDraggable = (nodeElement, config) => {
        this.instance.draggable(nodeElement, config);
    };

    /**
     * Checks if the given iconSection is a source or not.
     * @param {String} canvasElementContainer - The canvas element container
     * @returns {Boolean} Indicating if the iconSection is a source or not
     */
    isSource = canvasElementContainer => {
        return this.instance.isSource(canvasElementContainer);
    };

    /**
     * Makes the end-points of all the nodes a source point to start creating connectors from.
     * @param {String} canvasElementContainer - The canvas element container
     */
    makeSource = canvasElementContainer => {
        this.instance.makeSource(canvasElementContainer, {
            filter: '.end-point',
            endpoint: 'Dot',
            endpointStyle: {},
            allowLoopback: false,
            maxConnections: -1
        });
    };

    /**
     * Checks if the given iconSection is a target or not.
     * @param {String} canvasElementContainer - The canvas element container
     * @returns {Boolean} Indicating if the iconSection is a source or not
     */
    isTarget = canvasElementContainer => {
        return this.instance.isTarget(canvasElementContainer);
    };

    /**
     * Makes all the nodes a target region for the connectors to be dropped at.
     * @param {String} canvasElementContainer - The canvas element container
     */
    makeTarget = canvasElementContainer => {
        this.instance.makeTarget(canvasElementContainer, {
            allowLoopback: false,
            maxConnections: -1,
            dropOptions: { hoverClass: 'targetHover' }
        });
    };

    /**
     * Sets the title attribute on the given element
     * @param {Object} element Label Overlay object associated with the connector
     * @param {String} title Text to be displayed on hovering over the connector label. Same as the label itself
     */
    setTitleAttribute = (element = {}, title = '') => {
        if (element) {
            element.setAttribute('title', title);
        }
    };

    /**
     * Sets the title on connector label overlay
     * @param {Object} connection Connector object
     * @param {String} title Text to be displayed on hovering over the connector label. Same as the label itself
     */
    setLabelOverlayTitle = (connection = {}, title = '') => {
        const labelOverlay = connection.getOverlay(CONNECTOR_OVERLAY.LABEL);
        if (labelOverlay) {
            const labelOverlayElement = labelOverlay.getElement();
            this.setTitleAttribute(labelOverlayElement, title);
        }
    };

    /**
     * Sets all the existing connections while loading the flow in the canvas. If a connection is already set
     * then it doesn't do anything.
     * @param {Object} sourceContainer - ID of the source node
     * @param {Object} targetContainer - ID of the target node
     * @param {String} label - The label to display for the connector
     * @param {String} connectorGuid - ID of the connector
     * @param {String} connectorType - Type of connector
     * @return {Object} connection - jsPlumb's connector instance
     */
    setExistingConnections = (sourceContainer, targetContainer, label, connectorGuid, connectorType) => {
        const connectionInstance = {
            source: sourceContainer,
            target: targetContainer,
            detachable: false
        };

        const connection = this.instance.connect(connectionInstance);
        if (!connection) {
            // guard in case we're editing a flow with unsupported elements
            return null;
        }

        if (label) {
            if (connectorType === CONNECTOR_TYPE.FAULT) {
                connection.setPaintStyle(this.connectorStyles.faultConnector);
                connection.setHoverPaintStyle(this.connectorStyles.hoverFaultConnector);
                connection.addOverlay([
                    'Label',
                    {
                        id: CONNECTOR_OVERLAY.LABEL,
                        label,
                        cssClass: 'fault-label'
                    }
                ]);
            } else {
                connection.addOverlay(['Label', { id: CONNECTOR_OVERLAY.LABEL, label }]);
            }

            this.setLabelOverlayTitle(connection, label);
        }

        connection.id = connectorGuid;
        connection.addOverlay(CONNECTOR_OVERLAY.ARROW);

        return connection;
    };

    /**
     * Sets up a new connection when a connector is dragged from a source and dropped at a target.
     * @param {Function} connectionAdded - Function to dispatch an addConnection event to the editor
     */
    setNewConnection = connectionAdded => {
        this.instance.bind('beforeDrop', connectionAdded);
    };

    /**
     * Notifies when a connections is clicked.
     * @param {Function} connectionClicked - Function to mark the node as selected
     */
    clickConnection = connectionClicked => {
        this.instance.bind('click', connectionClicked);
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
            connection.addOverlay([
                'Label',
                {
                    id: CONNECTOR_OVERLAY.LABEL,
                    label: labelOverlay.label,
                    cssClass
                }
            ]);

            this.setLabelOverlayTitle(connection, labelOverlay.label);
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
     * Sets up the paint style of the connector when it's highlighted.
     * @param connection - The connector that has been highlighted
     * @param connectorType - Type of connector
     */
    highlightConnector = (connection: object, connectorType: string) => {
        const cssClass = connectorType === CONNECTOR_TYPE.FAULT ? 'fault-label-highlighted' : 'label-highlighted';
        connection.addClass('connector-highlighted');
        this.setPaintStyleAndLabel(connection, this.connectorStyles.highlightedConnector, {}, cssClass);
    };

    /**
     * Sets up the paint style of the connector when it's not highlighted.
     * @param connection - The connector that has been de-highlighted
     * @param connectorType - Type of connector
     */
    dehighlightConnector = (connection: object, connectorType: string) => {
        connection.removeClass('connector-highlighted');
        this.deselectConnector(connection, connectorType);
    };

    /**
     * Add the given element to the drag selection.
     * @param {Object} nodeElement - The passed element
     */
    addToDragSelection = nodeElement => {
        this.instance.addToDragSelection(nodeElement);
    };

    /**
     * Removes the given element from the drag selection.
     * @param {Object} nodeElement - The passed element
     */
    removeFromDragSelection = nodeElement => {
        this.instance.removeFromDragSelection(nodeElement);
    };

    /**
     * Removes the node from jsPlumb's instance but not from the dom.
     * @param {String} nodeId - The node id
     * @param {Object} canvasElementContainer - Parent (Container) div of the canvas element
     */
    removeNodeFromLib = (nodeId, canvasElementContainer) => {
        if (!canvasElementContainer) {
            throw new Error('canvasElementContainer is not defined. It must be defined.');
        }

        this.instance.removeFromDragSelection(canvasElementContainer);
        this.instance.unmakeSource(canvasElementContainer);
        delete this.instance.sourceEndpointDefinitions[nodeId];
        this.instance.unmakeTarget(canvasElementContainer);
        delete this.instance.targetEndpointDefinitions[nodeId];
        this.instance.destroyDraggable(canvasElementContainer);
        this.instance.destroyDroppable(canvasElementContainer);
        this.instance.unmanage(nodeId);
    };

    /**
     * Removes the connector from jsPlumb's instance
     * @param {Object} connector - jsPlumb connector instance
     */
    removeConnectorFromLib = connector => {
        if (!connector) {
            throw new Error('connector is not defined. It must be defined.');
        }

        this.instance.deleteConnection(connector);
    };

    /**
     * Revalidate specific element
     * @param {Object} canvasElementContainer - The canvas element container
     */
    revalidate = canvasElementContainer => {
        this.instance.revalidate(canvasElementContainer);
    };
}

export { CONNECTOR_OVERLAY };

/** Export of the singleton instance of library **/
export const getDrawingLibInstance = () => {
    if (drawingLibInstance == null) {
        drawingLibInstance = new DrawingLib();
    }

    return drawingLibInstance;
};

export const clearDrawingLibInstance = () => {
    if (drawingLibInstance != null) {
        window.jsPlumb.reset();
        drawingLibInstance = null;
    }
};
