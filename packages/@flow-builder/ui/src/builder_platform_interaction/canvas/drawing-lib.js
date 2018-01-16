/**
 * @type {object} instance
 */
let instance = null;

/**
 * @return {object} jsPlumbInstance - singleton jsplumb instance
 */
export const getJSPlumbInstance = () => {
    if (instance === null) {
        instance = window.jsPlumb.getInstance({
            Connector: ['Flowchart', { gap: 2, stub: [10, 10], alwaysRespectStubs: true, cornerRadius: 5 }],
            Anchor: 'Continuous',
            Endpoint: 'Blank',
            PaintStyle: {
                strokeWidth: 2,
                stroke: '#61B7CF',
                joinstyle: 'round'
            },
            HoverPaintStyle: {
                strokeWidth: 3,
                stroke: '#216477'
            },
            ConnectionOverlays: [
                ['Arrow', {
                    location: 1,
                    visible:true,
                    width:15,
                    length:15,
                    id:'ARROW'
                }],
                ['Label', {
                    id: 'label',
                    visible: false
                }]
            ]
        });
    }
    return instance;
};

/**
 * Sets the container as the main area for all the jsplumb activity.
 * @param {string} container - class name to be used as the container for all nodes in jsplumb instance
 * @param {object} jsPlumbInstance - jsplumb instance
 */
export const setContainer = (container, jsPlumbInstance = instance) => {
    jsPlumbInstance.setContainer(container);
};

/**
 * Used to improve the performance of the canvas while loading all the data.
 * @param {boolean} val - Instructs jsPlumb whether to suspend drawing or not
 * @param {boolean} repaintAfterwards - Instructs jsPlumb to immediately perform full repaint or not
 * @param {object} jsPlumbInstance - jsplumb instance
 */
export const setSuspendDrawing = (val, repaintAfterwards, jsPlumbInstance = instance) => {
    jsPlumbInstance.setSuspendDrawing(val, repaintAfterwards);
};

/**
 * Sets all the nodes within the canvas to be draggable.
 * @param {String} nodeGuid - ID of the node
 * @param {object} jsPlumbInstance - jsplumb instance
 */
export const setDraggable = (nodeGuid, jsPlumbInstance = instance) => {
    jsPlumbInstance.draggable(nodeGuid);
};

/**
 * Makes the end-points of all the nodes a source point to start creating connectors from.
 * @param {String} nodeGuid - ID of the node
 * @param {Number} connections - Maximum number of connections a node can have
 * @param {object} jsPlumbInstance - jsplumb instance
 */
export const makeSource = (nodeGuid, connections, jsPlumbInstance = instance) => {
    jsPlumbInstance.makeSource(nodeGuid, {
        filter: '.end-point',
        allowLoopback: false,
        maxConnections: connections
    });
};

/**
 * Makes all the nodes a target region for the connectors to be dropped at.
 * @param {String} nodeGuid - ID of the node
 * @param {object} jsPlumbInstance - jsplumb instance
 */
export const makeTarget = (nodeGuid, jsPlumbInstance = instance) => {
    jsPlumbInstance.makeTarget(nodeGuid, {
        allowLoopback: false,
        maxConnections: -1
    });
};

/**
 * Sets all the existing connections while loading the flow in the canvas.
 * @param {String} sourceGuid - ID of the source node
 * @param {String} targetGuid - ID of the target node
 * @param {String} label - The label to display for the connector
 * @param {object} jsPlumbInstance - jsplumb instance
 */
export const setExistingConnections = (sourceGuid, targetGuid, label, jsPlumbInstance = instance) => {
    jsPlumbInstance.connect({source: sourceGuid, target: targetGuid, label});
};

/**
 * Sets up a new connection when a connector is dragged from a source and dropped at a target.
 * @param {function} connectionAdded - Function to dispatch an addConnection event to the editor
 * @param {object} jsPlumbInstance - jsplumb instance
 */
export const setNewConnection = (connectionAdded, jsPlumbInstance = instance) => {
    jsPlumbInstance.bind('connection', connectionAdded);
};
