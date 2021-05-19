import { LightningElement, track } from 'lwc';
import { classSet } from 'lightning/utils';

import { Store, generateGuid } from 'builder_platform_interaction/storeLib';
import { AddElementEvent, DeleteElementEvent } from 'builder_platform_interaction/events';
import {
    addElement,
    addElementFault,
    deleteElementFault,
    deleteElements,
    alcCreateConnection,
    selectionOnFixedCanvas,
    updateIsAutoLayoutCanvasProperty,
    updateElement,
    createGoToConnection,
    deleteGoToConnection,
    pasteOnFixedCanvas
} from 'builder_platform_interaction/actions';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForStore, getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

import { createStartElementForPropertyEditor, createEndElement } from 'builder_platform_interaction/elementFactory';

import { assertAutoLayoutState } from 'builder_platform_interaction/autoLayoutCanvas';

import elementsMetadataForScreenFlow from './metadata/elementsMetadataForScreenFlow';

import {
    convertRoundTrip,
    randomEvent,
    loadFreeFormTestCase,
    saveAsTestCase,
    loadTestCases,
    loadSaved,
    loadFlow,
    getTestCaseOptions,
    saveToLocalStorage,
    fetchFromLocalStorage,
    convertToFreeForm,
    showError,
    getPasteElementGuidMaps,
    getCopiedChildElements,
    getCopiedData
} from './utils';

let storeInstance;

/**
 * Returns a handler for the store proxy.
 * Asserts the auto-layout state and does a round trip conversion after each store event dispatch.
 *
 * @param component - The LWC builder component
 *
 */
function createProxyHandler(component) {
    return {
        get(target, prop) {
            if (prop === 'dispatch') {
                // dispatch proxy function
                return (event) => {
                    try {
                        target.dispatch(event);
                    } catch (e) {
                        component.stopTestMonkey('reducer exception', e);
                    }

                    const { elements } = target.getCurrentState();
                    if (Object.values(elements).length > 0 && component.runAssertions) {
                        // assert the state
                        try {
                            assertAutoLayoutState(elements);
                        } catch (e) {
                            component.stopTestMonkey('state assert failed', e);
                        }

                        // convert roundtrip
                        if (!convertRoundTrip(storeInstance)) {
                            component.stopTestMonkey();
                        }
                    }
                };
            }

            // delegate directly to the store anything other than dispatch
            return target[prop];
        }
    };
}

function translateEventToAction(event) {
    const { type } = event;
    const { elementType, prev, next, parent, childIndex, alcInsertAt } = event.detail;

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
                    element.alcInsertAt = alcInsertAt;
                    storeInstance.dispatch(addElement(element));
                    const { elements } = storeInstance.getCurrentState();

                    canvasElement.maxConnections++;

                    const childElement = elements[canvasElement.childReferences[0].childReference];
                    const newChildElement = { ...childElement };
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
                        childElements: [childElement, newChildElement]
                    };

                    storeInstance.dispatch(updateElement(payload));
                    return null;
                }
            }

            if (element.screen) {
                element.screen.label = element.screen.guid;
            } else if (element.canvasElement) {
                element.canvasElement.label = element.canvasElement.guid;
            } else {
                element.label = element.guid;
            }
            return element;
        case DeleteElementEvent.EVENT_NAME:
            return {
                selectedElements: event.detail.selectedElementGUID.map(
                    (guid) => storeInstance.getCurrentState().elements[guid]
                ),
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
    runAssertions = false;

    @track
    flowsGenerated = 0;

    @track
    isSelectionMode = false;

    @track
    testMonkeyHandle;

    @track
    freeFormTestCases = [];

    @track
    selectedTestCase = '';

    get isRunningTestMonkey() {
        return !!this.testMonkeyHandle;
    }

    get testMonkeyLabel() {
        return this.testMonkeyHandle ? `Stop Test Monkey (${this.flowsGenerated})` : 'Start Test Monkey';
    }

    get freeFormTestCaseOptions() {
        return this.freeFormTestCases;
    }

    get testMonkeyClasses() {
        return classSet('test-monkey').add({ spin: this.testMonkeyHandle });
    }

    isPasteAvailable = false;

    constructor() {
        super();
        window.processEnv = 'prod';

        storeInstance = new Proxy(Store.getStore(reducer), createProxyHandler(this));

        storeInstance.subscribe(() => {
            if (this.undoRedoStackPointer === this.undoRedoStack.length - 1) {
                this.undoRedoStack.push(storeInstance.getCurrentState());
                this.undoRedoStackPointer++;
            }
        });

        this.init();
    }

    stopTestMonkey(message, e) {
        clearInterval(this.testMonkeyHandle);
        this.testMonkeyHandle = null;
        if (message) {
            showError(message, e);
        }
    }

    handleToggleRunAssertions() {
        this.runAssertions = !this.runAssertions;
    }

    handleAddElement(addEvent) {
        const payload = translateEventToAction(addEvent);
        const { alcInsertAt } = addEvent.detail;

        if (payload != null) {
            payload.alcInsertAt = alcInsertAt;
            storeInstance.dispatch(addElement(payload));
        }
    }

    async handleSaveAsTestCase() {
        const ffcFlow = convertToFreeForm(storeInstance.getCurrentState());
        await saveAsTestCase(ffcFlow);

        // reload test cases to refresh the menu
        this.loadTestCases();
    }

    handleDeleteElement(deleteEvent) {
        const payload = translateEventToAction(deleteEvent);
        storeInstance.dispatch(deleteElements(payload));
    }

    handleSave() {
        saveToLocalStorage(storeInstance.getCurrentState());
    }

    handleSelectMenuItem(event) {
        const { value } = event.detail;
        switch (value) {
            case 'new':
                this.handleNew();
                break;
            case 'load':
                loadSaved(storeInstance);
                break;
            case 'save':
                this.handleSave();
                break;
            case 'saveAsTestCase':
                this.handleSaveAsTestCase();
                break;
            case 'convertRoundtrip':
                this.handleConvertRoundTrip();
                break;
            case 'toggleSelectionMode':
                this.handleToggleSelectionMode();
                break;
            case 'copy':
                this.handleCopy();
            default:
        }
    }

    async init() {
        storeInstance.dispatch(updateIsAutoLayoutCanvasProperty(true));

        const flow = fetchFromLocalStorage();
        if (flow) {
            loadFlow(storeInstance, flow);
        } else {
            this.handleNew();
        }

        this.loadTestCases();
    }

    async loadTestCases() {
        const testCases = await loadTestCases();
        const { freeForm } = testCases;
        this.freeFormTestCases = getTestCaseOptions(freeForm);
    }

    async handleSelectTestCase(event) {
        this.selectedTestCase = event.detail.value;
        const flow = await loadFreeFormTestCase(this.selectedTestCase);
        loadFlow(storeInstance, flow);
    }

    handleNew() {
        loadFlow(storeInstance, {
            elements: {},
            canvasElements: [],
            connectors: [],
            peripheralData: {},
            properties: {}
        });

        storeInstance.dispatch(addElement(createStartElementForPropertyEditor({})));
    }

    handleTestMonkeyClick() {
        if (this.testMonkeyHandle) {
            this.stopTestMonkey();
        } else {
            this.flowsGenerated = 0;
            this.handleNew();
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.testMonkeyHandle = setInterval(() => {
                try {
                    const event = randomEvent(storeInstance);
                    if (event) {
                        this.template
                            .querySelector('builder_platform_interaction-alc-canvas-container')
                            .dispatchEvent(event);
                        this.flowsGenerated++;
                    }
                } catch (e) {
                    this.stopTestMonkey('Exception occured', e);
                }
            }, 50);
        }
    }

    handleUndo() {
        const undoRedoStackPointer = this.undoRedoStackPointer - 1;
        if (undoRedoStackPointer > 0) {
            this.undoRedoStackPointer--;
            loadFlow(storeInstance, this.undoRedoStack[undoRedoStackPointer]);
        }
    }

    handleRedo() {
        const undoRedoStackPointer = this.undoRedoStackPointer + 1;
        if (undoRedoStackPointer <= this.undoRedoStack.length - 1) {
            loadFlow(storeInstance, this.undoRedoStack[undoRedoStackPointer]);
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

    handleGoToCreation = (event) => {
        storeInstance.dispatch(createGoToConnection(event.detail));
    };

    handleGoToDeletion = (event) => {
        storeInstance.dispatch(deleteGoToConnection(event.detail));
    };

    handleAlcCreateConnection = (event) => {
        const { insertAt, targetGuid } = event.detail;
        storeInstance.dispatch(alcCreateConnection({ insertAt, targetGuid }));
    };

    handleAlcSelection = (event) => {
        if (event && event.detail) {
            const {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids,
                allowAllDisabledElements
            } = event.detail;
            const payload = {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids,
                allowAllDisabledElements
            };
            storeInstance.dispatch(selectionOnFixedCanvas(payload));

            this.topSelectedGuid = event.detail.topSelectedGuid;
            this.isCutCopyDisabled = !event.detail.topSelectedGuid;
        }
    };

    handleConvertRoundTrip() {
        const state = convertRoundTrip(storeInstance);
        if (state) {
            loadFlow(storeInstance, state);
        }
    }

    handleCopySingleElement(event) {
        const { elementGuid } = event.detail;
        const elements = storeInstance.getCurrentState().elements;
        const copiedElement = elements[elementGuid];

        this.cutOrCopiedCanvasElements = {
            [copiedElement.guid]: copiedElement
        };
        this.cutOrCopiedChildElements = getCopiedChildElements(elements, copiedElement);
        this.topCutOrCopiedGuid = elementGuid;
        this.bottomCutOrCopiedGuid = elementGuid;
        this.isPasteAvailable = true;
    }

    handlePasteOnCanvas(event) {
        const { prev, next, parent, childIndex } = event.detail;

        const { canvasElementGuidMap, childElementGuidMap } = getPasteElementGuidMaps(
            this.cutOrCopiedCanvasElements,
            this.cutOrCopiedChildElements
        );

        const payload = {
            canvasElementGuidMap,
            childElementGuidMap,
            cutOrCopiedCanvasElements: this.cutOrCopiedCanvasElements,
            cutOrCopiedChildElements: this.cutOrCopiedChildElements,
            topCutOrCopiedGuid: this.topCutOrCopiedGuid,
            bottomCutOrCopiedGuid: this.bottomCutOrCopiedGuid,
            prev,
            next,
            parent,
            childIndex
        };
        storeInstance.dispatch(pasteOnFixedCanvas(payload));
    }
    /**
     * Handles the copy event from the toolbar and updates the appropriate properties
     */
    handleCopy = () => {
        const elements = storeInstance.getCurrentState() && storeInstance.getCurrentState().elements;
        this.topCutOrCopiedGuid = this.topSelectedGuid;
        const { copiedCanvasElements, copiedChildElements, bottomCutOrCopiedGuid } = getCopiedData(
            elements,
            this.topCutOrCopiedGuid
        );
        this.cutOrCopiedCanvasElements = copiedCanvasElements;
        this.cutOrCopiedChildElements = copiedChildElements;
        this.bottomCutOrCopiedGuid = bottomCutOrCopiedGuid;

        this.isPasteAvailable = true;

        // Toggling out of the selection mode on Copy
        this.handleToggleSelectionMode();
    };
}
