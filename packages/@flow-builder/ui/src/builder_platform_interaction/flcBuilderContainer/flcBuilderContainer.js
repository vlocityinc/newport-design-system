import { LightningElement, api, track } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import { selectionOnFixedCanvas } from 'builder_platform_interaction/actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

let storeInstance;

/**
 * Flow Builder container for the FLC builder
 *
 * Configures to the FLC Builder with the Flow Builder elements metadata and
 * listens to the store, passing on the updated state when there are updates.
 */
export default class FlcBuilderContainer extends LightningElement {
    @api
    elementsMetadata;

    @track
    flowModel = null;

    rootElement = null;

    @api
    isSelectionMode;

    handleSelectionOnFixedCanvas = event => {
        if (event && event.detail) {
            const payload = {
                canvasElementGuidsToSelect: event.detail.canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect: event.detail.canvasElementGuidsToDeselect,
                selectableGuids: event.detail.selectableGuids
            };
            storeInstance.dispatch(selectionOnFixedCanvas(payload));
        }
    };

    renderedCallback() {
        if (!storeInstance) {
            storeInstance = Store.getStore();
            storeInstance.subscribe(this.mapCanvasStateToStore);
            this.mapCanvasStateToStore();
        }
    }

    mapCanvasStateToStore = () => {
        const storeState = storeInstance.getCurrentState();
        const { elements } = storeState;

        this.rootElement =
            this.rootElement || Object.values(elements).find(ele => ele.elementType === ELEMENT_TYPE.ROOT_ELEMENT);

        if (this.rootElement && this.elementsMetadata) {
            this.flowModel = storeState.elements;
        }
    };
}
