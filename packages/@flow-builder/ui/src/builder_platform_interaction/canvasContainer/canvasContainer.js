import { LightningElement, api, track } from 'lwc';
import {
    isEmptyArray,
    getNodesFromStore,
    getConnectorsFromStore,
    updateStoreOnSelection,
    hasOneAvailableConnection,
    createConnectorWhenOneConnectionAvailable,
    shouldCreateStartConnection,
    addConnection,
    openConnectorSelectionModal,
    shouldOpenConnectorSelectionModal,
    calculateDeletedNodeIdsAndCleanUpDrawingLibInstance
} from './canvasContainerUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    deselectOnCanvas,
    marqueeSelectOnCanvas,
    updateCanvasElementLocation
} from 'builder_platform_interaction/actions';
import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';

/** Private singleton variables */
let storeInstance;

export default class CanvasContainer extends LightningElement {
    /** tracked variables */
    @track nodes = [];
    @track connectors = [];

    /** Component lifecycle hooks */
    connectedCallback() {
        storeInstance = Store.getStore();
        storeInstance.subscribe(this.mapCanvasStateToStore);
        // Calling this function to initialize the nodes and connectors.
        this.mapCanvasStateToStore();
    }

    /** Public functions */
    get shouldCreateCanvas() {
        return !isEmptyArray(this.nodes);
    }

    /**
     * Calls the panElementToViewIfNeeded public function living in the canvas
     *
     * @param {String} canvasElementGuid - guid of the canvas element that needs to be highlighted
     */
    @api panElementToView = (canvasElementGuid = '') => {
        const canvas = this.template.querySelector(
            'builder_platform_interaction-canvas'
        );
        if (canvas && canvas.panElementToViewIfNeeded) {
            canvas.panElementToViewIfNeeded(canvasElementGuid);
        }
    };

    /** handler functions */

    /**
     * Handles the node click event and dispatches an action to select the clicked node and deselect everything else on
     * the canvas when multi-select is off. If multi-select is off, then dispatches an action to toggle the current
     * state of the clicked node.
     *
     * @param {object} event - node clicked event coming from node.js
     */
    handleCanvasElementSelection = event => {
        if (event && event.detail) {
            const payload = {
                guid: event.detail.canvasElementGUID
            };
            updateStoreOnSelection(
                storeInstance,
                payload,
                event.detail.isMultiSelectKeyPressed
            );
        }
    };

    /**
     * Handles the connector click event and dispatches an action to select the clicked connector and deselect everything else on
     * the canvas when multi-select is off. If multi-select is off, then dispatches an action to toggle the current
     * state of the clicked connector.
     *
     * @param {object} event - connection clicked event coming from canvas.js
     */
    handleConnectorSelection = event => {
        if (event && event.detail) {
            const payload = {
                guid: event.detail.connectorGUID
            };
            updateStoreOnSelection(
                storeInstance,
                payload,
                event.detail.isMultiSelectKeyPressed
            );
        }
    };

    /**
     * Handles the drag node stop event and dispatches an action to update the location of the node.
     *
     * @param {object} event - node stop event coming from node.js
     */
    handleCanvasElementMove = event => {
        if (event && event.detail) {
            const payload = {
                guid: event.detail.canvasElementGUID,
                elementType: event.detail.elementType,
                locationX: event.detail.locationX,
                locationY: event.detail.locationY
            };
            storeInstance.dispatch(updateCanvasElementLocation(payload));
        }
    };

    /**
     * Handles the canvas mouse up event and dispatches an action to deselect all selected nodes and connectors.
     */
    handleElementDeselection = () => {
        storeInstance.dispatch(deselectOnCanvas);
    };

    handleAddConnector = event => {
        if (event && event.detail) {
            const { sourceGuid, targetGuid } = event.detail;
            if (sourceGuid && targetGuid) {
                if (shouldCreateStartConnection(storeInstance, sourceGuid)) {
                    addConnection(storeInstance, sourceGuid, targetGuid)(
                        CONNECTOR_TYPE.START
                    );
                    return;
                }
                if (
                    shouldOpenConnectorSelectionModal(storeInstance, sourceGuid)
                ) {
                    const mode = event.type;
                    openConnectorSelectionModal(
                        storeInstance,
                        sourceGuid,
                        targetGuid,
                        mode
                    );
                    return;
                }
                if (hasOneAvailableConnection(storeInstance, sourceGuid)) {
                    createConnectorWhenOneConnectionAvailable(
                        storeInstance,
                        sourceGuid,
                        targetGuid
                    );
                    return;
                }
                addConnection(storeInstance, sourceGuid, targetGuid)(
                    CONNECTOR_TYPE.REGULAR
                );
            }
        }
    };

    /**
     * Handles the marquee select event and dispatches an action to update the selection state of the canvas elements && connectors.
     *
     * @param {object} event - marquee select event coming from canvas.js
     */
    handleMarqueeSelection = event => {
        if (event && event.detail) {
            const payload = {
                canvasElementGuidsToSelect:
                    event.detail.canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect:
                    event.detail.canvasElementGuidsToDeselect,
                connectorGuidsToSelect: event.detail.connectorGuidsToSelect,
                connectorGuidsToDeselect: event.detail.connectorGuidsToDeselect
            };
            storeInstance.dispatch(marqueeSelectOnCanvas(payload));
        }
    };

    /** Private functions */
    mapCanvasStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        const updatedCanvasElementsFromStore = getNodesFromStore(currentState);
        const canvasTemplate = this.template.querySelector(
            'builder_platform_interaction-canvas'
        );
        calculateDeletedNodeIdsAndCleanUpDrawingLibInstance(
            this.nodes,
            updatedCanvasElementsFromStore,
            canvasTemplate
        );
        this.nodes = updatedCanvasElementsFromStore;
        this.connectors = getConnectorsFromStore(currentState);
    };
}
