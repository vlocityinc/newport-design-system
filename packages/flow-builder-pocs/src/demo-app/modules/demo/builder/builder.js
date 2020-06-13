import { LightningElement, track } from 'lwc';

import { Store } from 'builder_platform_interaction/storeLib';
import { AddElementEvent, DeleteElementEvent } from 'builder_platform_interaction/events';
import { addElement, addElementFault, deleteElementFault, updateFlow, deleteElements, flcCreateConnection, selectionOnFixedCanvas } from 'builder_platform_interaction/actions';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForStore, getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createStartElement, createEndElement } from 'builder_platform_interaction/elementFactory';

import elementsMetadataForScreenFlow from './metadata/elementsMetadataForScreenFlow';

let storeInstance;

function translateEventToAction(event) {
    const { type } = event;
    const { elementType, prev, next, parent, childIndex } = event.detail;

    let element;

    switch (type) {
        case AddElementEvent.EVENT_NAME:
            if (elementType === ELEMENT_TYPE.END_ELEMENT) {
                element = createEndElement({
                    prev,
                    next,
                    childIndex,
                    parent
                 });
            } else {
                element = getElementForStore(
                    getElementForPropertyEditor({
                        elementType,
                        isNewElement: true,
                        prev,
                        next,
                        childIndex,
                        parent
                    })
                );
                if (elementType === ELEMENT_TYPE.WAIT) {
                    element.canvasElement.children = [null, null, null];
                }
            }
            return element;
        case DeleteElementEvent.EVENT_NAME:
            return {
                selectedElements: event.detail.selectedElementGUID.map(guid => storeInstance.getCurrentState().elements[guid]),
                connectorsToDelete: [],
                elementType: event.detail.selectedElementType
            };
        default:
            return null;
    }
}

export default class Builder extends LightningElement {
    elementsMetadata = elementsMetadataForScreenFlow;

    @track
    isSelectionMode = false;

    constructor() {
        super();

        storeInstance = Store.getStore(reducer);
        this.createStartElement();

        this.handleLoad();
    }

    createStartElement() {
        storeInstance.dispatch(addElement(createStartElement()));
    }

    handleAddElement(addEvent) {
        const payload = translateEventToAction(addEvent);
        storeInstance.dispatch(addElement(payload));
    }

    handleDeleteElement(deleteEvent) {
        const payload = translateEventToAction(deleteEvent);
        storeInstance.dispatch(deleteElements(payload));
    }

    handleSave() {
        localStorage.setItem('flow', JSON.stringify(storeInstance.getCurrentState()));
    }

    handleLoad() {
        const flow = JSON.parse(localStorage.getItem('flow'));
        if (flow) {
            storeInstance.dispatch(updateFlow(flow));
        }
    }

    handleNew() {
        this.createStartElement();
    }

    handleToggleSelectionMode() {
        this.isSelectionMode = !this.isSelectionMode;
    }

    handleAddElementFault(event) {
        storeInstance.dispatch(addElementFault(event.detail.guid));
    }

    handleDeleteElementFault(event) {
        storeInstance.dispatch(deleteElementFault(event.detail.guid));
    }

    handleFlcCreateConnection = event => {
        const { sourceGuid, targetGuid } = event.detail;
        storeInstance.dispatch(flcCreateConnection({ sourceGuid, targetGuid }));
    };

    handleFlcSelection = event => {
        const { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids } = event.detail;
        const payload = {
            canvasElementGuidsToSelect,
            canvasElementGuidsToDeselect,
            selectableGuids
        };
        storeInstance.dispatch(selectionOnFixedCanvas(payload));
    };
}
