import { LightningElement, track } from 'lwc';

import { Store, generateGuid } from 'builder_platform_interaction/storeLib';
import { AddElementEvent, DeleteElementEvent } from 'builder_platform_interaction/events';
import { addElement, addElementFault, deleteElementFault, updateFlow, deleteElements, flcCreateConnection, selectionOnFixedCanvas, updateIsAutoLayoutCanvasProperty,  updateFlowOnCanvasModeToggle, updateElement } from 'builder_platform_interaction/actions';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForStore, getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createStartElementForPropertyEditor, createEndElement } from 'builder_platform_interaction/elementFactory';

import {
    convertToAutoLayoutCanvas,
    convertToFreeFormCanvas,
    removeEndElementsAndConnectorsTransform,
    addEndElementsAndConnectorsTransform
} from 'builder_platform_interaction/flcConversionUtils';
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
                    const { canvasElement } = element;
                    storeInstance.dispatch(addElement(element));
                    const {elements} = storeInstance.getCurrentState();
                    canvasElement.children = [null, null, null];
                    canvasElement.maxConnections++;

                    const childElement = elements[canvasElement.childReferences[0].childReference];
                    const newChildElement = {...childElement};
                    newChildElement.guid = generateGuid();

                    const availableConnection = {
                        childReference: newChildElement.guid
                    };

                    canvasElement.availableConnections.splice(0, 0, availableConnection);
                    canvasElement.childReferences.splice(0, 0, availableConnection);
                    const payload = {
                        elementType: 'WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS',
                        canvasElement,
                        deletedChildElementGuids: [],
                        childElements: [childElement, newChildElement],
                        deletedBranchHeadGuids: []
                    };

                    storeInstance.dispatch(updateElement(payload));
                    return null;
                }
            }
            return element;
        case DeleteElementEvent.EVENT_NAME:
            return {
                selectedElements: event.detail.selectedElementGUID.map(guid => storeInstance.getCurrentState().elements[guid]),
                connectorsToDelete: [],
                elementType: event.detail.selectedElementType,
                childIndexToKeep: event.detail.childIndexToKeep
            };
        default:
            return null;
    }
}

export default class Builder extends LightningElement {
    elementsMetadata = elementsMetadataForScreenFlow;

    undoRedoStack = [];
    undoRedoStackPointer = -1;
    updateStack = true;

    @track
    isSelectionMode = false;

    constructor() {
        super();

        storeInstance = Store.getStore(reducer);
        storeInstance.subscribe(() => {
            if (this.undoRedoStackPointer === this.undoRedoStack.length - 1) {
                this.undoRedoStack.push(storeInstance.getCurrentState());
                this.undoRedoStackPointer++;
            }
        });
        this.createStartElement();

        this.handleLoad();
    }

    createStartElement() {
        storeInstance.dispatch(updateIsAutoLayoutCanvasProperty(true));
        storeInstance.dispatch(addElement(createStartElementForPropertyEditor({})));
    }

    handleAddElement(addEvent) {
        const payload = translateEventToAction(addEvent);
        if (payload != null) {
            storeInstance.dispatch(addElement(payload));
        }
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
        storeInstance.dispatch(updateFlow({elements: {}, canvasElements:[], connectors: [], peripheralData: {}, properties: {}}));
        this.createStartElement();
    }

    handleUndo() {
        const undoRedoStackPointer = this.undoRedoStackPointer - 1;
        if (undoRedoStackPointer > 0) {
            this.undoRedoStackPointer--;
            storeInstance.dispatch(updateFlow(this.undoRedoStack[undoRedoStackPointer]));
        }
    }

    handleRedo() {
         const undoRedoStackPointer = this.undoRedoStackPointer + 1;
        if (undoRedoStackPointer <= this.undoRedoStack.length - 1) {
           storeInstance.dispatch(updateFlow(this.undoRedoStack[undoRedoStackPointer]));
           this.undoRedoStackPointer++;
        }
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

    handleConvertRoundTrip = () => {
        try {
        const ffcState = removeEndElementsAndConnectorsTransform(convertToFreeFormCanvas(storeInstance.getCurrentState(), [0, 0]));
        const alcState = convertToAutoLayoutCanvas(addEndElementsAndConnectorsTransform(ffcState));

        storeInstance.dispatch(updateFlowOnCanvasModeToggle(alcState));

        } catch (e) {
            console.log(e);
            alert('conversion failed');
        }
    };
}
