import { LightningElement, track } from 'lwc';

import { Store } from 'builder_platform_interaction/storeLib';
import { ElementType } from 'builder_platform_interaction/flowUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { selectionOnFixedCanvas } from 'builder_platform_interaction/actions';

let storeInstance;

/**
 * Flow Builder container for the FLC builder
 *
 * Configures to the FLC Builder with the Flow Builder elements metadata and
 * listens to the store, passing on the updated state when there are updates.
 */
export default class FlcBuilderContainer extends LightningElement {
    @track
    flowModel = null;

    rootElement = null;

    // TODO: Remove this when integrating in core
    @track
    isSelectionMode = false;

    elementsMetadata = {
        [ELEMENT_TYPE.DECISION]: {
            type: ElementType.DECISION,
            icon: 'standard:decision',
            label: 'Decision',
            value: 'Decision'
        },
        [ELEMENT_TYPE.LOOP]: {
            type: ElementType.LOOP,
            icon: 'standard:loop',
            label: 'Loop',
            value: 'loop'
        },
        [ELEMENT_TYPE.SCREEN]: {
            type: ElementType.DEFAULT,
            icon: 'standard:screen',

            label: 'Screen',
            value: 'Screen'
        },
        [ELEMENT_TYPE.START_ELEMENT]: {
            type: ElementType.START,
            icon: 'standard:default',
            label: 'Start',
            value: 'START_ELEMENT'
        },
        [ELEMENT_TYPE.ROOT_ELEMENT]: {
            type: ElementType.ROOT,
            icon: 'standard:default'
        },
        [ELEMENT_TYPE.END_ELEMENT]: {
            type: ElementType.END,
            icon: 'standard:first_non_empty',
            label: 'End',
            value: ELEMENT_TYPE.END_ELEMENT
        }
    };

    // TODO: Remove this button when integrating in core
    handleSelectClick = event => {
        event.stopPropagation();
        this.isSelectionMode = !this.isSelectionMode;
    };

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

        if (this.rootElement) {
            this.flowModel = storeState.elements;
        }
    };
}
