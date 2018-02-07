/**
 * @type {object} instance
 */
let instance = null;

/** Wrapper class for drawing library (currently jsplumb) **/
class DrawingLib {
    constructor() {
        if (instance === null) {
            instance = window.jsPlumb.getInstance({
                Container: 'innerCanvas',
                Connector: ['Flowchart', { gap: 4, stub: [10, 10], alwaysRespectStubs: true, cornerRadius: 12 }],
                Anchor: 'Continuous',
                Endpoint: 'Blank',
                PaintStyle: {
                    strokeWidth: 2,
                    stroke: '#919297',
                    joinstyle: 'round'
                },
                HoverPaintStyle: {
                    strokeWidth: 2,
                    stroke: '#1589ee'
                },
                ConnectionOverlays: [
                    ['PlainArrow', {
                        location: -1,
                        visible:true,
                        width:14,
                        length:8,
                        id:'ARROW'
                    }],
                    ['Label', {
                        id: 'label',
                        visible: false
                    }]
                ]
            });
        }
    }

    /**
     * Sets the container as the main area for all the jsplumb activity.
     * @param {String} container - class name to be used as the container for all nodes in jsplumb instance
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
     * Sets all the nodes within the canvas to be draggable.
     * @param {Object} nodeElement - The node element
     * @param {Object} config - Configuration for the nodeElement we are setting as draggable
     */
    setDraggable = (nodeElement, config) => {
        instance.draggable(nodeElement, config);
    };

    /**
     * Checks if the given iconSection is a source or not.
     * @param {String} nodeId - The node id
     * @returns {Boolean} Indicating if the iconSection is a source or not
     */
    isSource = (nodeId) => {
        return instance.isSource(nodeId);
    };

    /**
     * Makes the end-points of all the nodes a source point to start creating connectors from.
     * @param {String} nodeId - The node id
     * @param {Number} connections - Maximum number of connections a node can have
     */
    makeSource = (nodeId, connections) => {
        instance.makeSource(nodeId, {
            filter: '.end-point',
            allowLoopback: false,
            maxConnections: connections
        });
    };

    /**
     * Checks if the given iconSection is a target or not.
     * @param {String} nodeId - The node id
     * @returns {Boolean} Indicating if the iconSection is a source or not
     */
    isTarget = (nodeId) => {
        return instance.isTarget(nodeId);
    };

    /**
     * Makes all the nodes a target region for the connectors to be dropped at.
     * @param {String} nodeId - The node id
     */
    makeTarget = (nodeId) => {
        instance.makeTarget(nodeId, {
            allowLoopback: false,
            maxConnections: -1,
            dropOptions: {hoverClass: 'targetHover'}
        });
    };

    /**
     * Sets all the existing connections while loading the flow in the canvas.
     * @param {String} sourceGuid - ID of the source node
     * @param {String} targetGuid - ID of the target node
     * @param {String} label - The label to display for the connector
     */
    setExistingConnections = (sourceGuid, targetGuid, label) => {
        instance.connect({source: sourceGuid, target: targetGuid, label});
    };

    /**
     * Sets up a new connection when a connector is dragged from a source and dropped at a target.
     * @param {Function} connectionAdded - Function to dispatch an addConnection event to the editor
     */
    setNewConnection = (connectionAdded) => {
        instance.bind('beforeDrop', connectionAdded);
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
     * TODO: Need to update it to delete associated connectors as well
     * @param {String} nodeId - The node id
     */
    removeNodeFromLib = (nodeId) => {
        instance.removeFromDragSelection(document.getElementById(nodeId).parentElement);
        instance.unmakeSource(nodeId);
        delete instance.sourceEndpointDefinitions[nodeId];
        instance.unmakeSource(nodeId);
    };
}

/** Export of the singleton instance of library **/
export const drawingLibInstance = new DrawingLib();
