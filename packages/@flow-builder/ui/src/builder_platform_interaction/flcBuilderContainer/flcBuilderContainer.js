// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { getFlcElementType } from 'builder_platform_interaction/flcBuilderUtils';
import { reorderConnectors } from 'builder_platform_interaction/actions';
import { ClosePropertyEditorEvent } from 'builder_platform_interaction/events';

function augmentElementsMetadata(elementsMetadata) {
    const startElement = getConfigForElementType(ELEMENT_TYPE.START_ELEMENT);
    const endElement = getConfigForElementType(ELEMENT_TYPE.END_ELEMENT);

    elementsMetadata = elementsMetadata.map(metadata => ({
        ...metadata,
        type: getFlcElementType(metadata.elementType)
    }));

    return elementsMetadata.concat([
        {
            section: null,
            icon: '',
            label: '',
            elementType: ELEMENT_TYPE.ROOT_ELEMENT,
            value: ELEMENT_TYPE.ROOT_ELEMENT,
            type: getFlcElementType(ELEMENT_TYPE.ROOT_ELEMENT),
            canHaveFaultConnector: false
        },
        {
            section: endElement.nodeConfig.section,
            icon: endElement.nodeConfig.iconName,
            description: endElement.nodeConfig.description,
            label: endElement.labels.singular,
            value: ELEMENT_TYPE.END_ELEMENT,
            elementType: ELEMENT_TYPE.END_ELEMENT,
            type: getFlcElementType(ELEMENT_TYPE.END_ELEMENT),
            canHaveFaultConnector: false
        },
        {
            section: null,
            icon: startElement.nodeConfig.iconName,
            label: startElement.labels.singular,
            value: ELEMENT_TYPE.START_ELEMENT,
            elementType: ELEMENT_TYPE.START_ELEMENT,
            type: getFlcElementType(ELEMENT_TYPE.START_ELEMENT),
            canHaveFaultConnector: false
        }
    ]);
}

let storeInstance;

/**
 * Flow Builder container for the FLC builder
 *
 * Configures to the FLC Builder with the Flow Builder elements metadata and
 * listens to the store, passing on the updated state when there are updates.
 */
export default class FlcBuilderContainer extends LightningElement {
    _elementsMetadata;

    @api
    set elementsMetadata(elementsMetadata) {
        if (elementsMetadata != null) {
            this._elementsMetadata = augmentElementsMetadata(elementsMetadata);
            this.mapCanvasStateToStore();
        }
    }

    get elementsMetadata() {
        return this._elementsMetadata;
    }

    @api
    isPasteAvailable;

    @api
    isSelectionMode;

    @track
    flowModel = null;

    rootElement = null;

    renderedCallback() {
        if (!storeInstance) {
            storeInstance = Store.getStore();
            storeInstance.subscribe(this.mapCanvasStateToStore);
            this.mapCanvasStateToStore();
        }
    }

    mapCanvasStateToStore = () => {
        if (storeInstance != null) {
            const storeState = storeInstance.getCurrentState();
            const { elements } = storeState;

            this.rootElement =
                this.rootElement || Object.values(elements).find(ele => ele.elementType === ELEMENT_TYPE.ROOT_ELEMENT);

            if (this.rootElement && this.elementsMetadata) {
                this.flowModel = storeState.elements;
            }
        }
    };

    handleConnectorReordering = event => {
        const { parentElementGuid, oldChildReferenceGuid, newChildReferenceGuid } = event.detail;
        const payload = {
            parentElementGuid,
            oldChildReferenceGuid,
            newChildReferenceGuid
        };
        storeInstance.dispatch(reorderConnectors(payload));
    };

    handleFlcBuilderClick = event => {
        event.stopPropagation();
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    };
}
