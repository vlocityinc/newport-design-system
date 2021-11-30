import { LightningElement, track } from 'lwc';
import { classSet } from 'lightning/utils';

import { Store, generateGuid, deepCopy } from 'builder_platform_interaction/storeLib';
import { AddElementEvent, DeleteElementEvent } from 'builder_platform_interaction/events';
import {
    addElement,
    addElementFault,
    deleteElementFault,
    deleteElements,
    selectionOnFixedCanvas,
    updateIsAutoLayoutCanvasProperty,
    updateElement,
    createGoToConnection,
    deleteGoToConnection,
    pasteOnFixedCanvas
} from 'builder_platform_interaction/actions';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForStore, getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

import { createStartElementForPropertyEditor, createEndElement } from 'builder_platform_interaction/elementFactory';

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

const selectors = {
    canvasContainer: 'builder_platform_interaction-alc-canvas-container'
};

const palette = {
    headers: [
        {
            headerLabel: 'Interaction',
            headerAutolayoutVisibility: true,
            headerItems: [
                { name: 'Screen', type: 'element' },
                { name: 'ActionCall', type: 'element' },
                { name: 'Subflow', type: 'element' }
            ],
            headerFreeformVisibility: true
        },
        {
            headerLabel: 'Logic',
            headerAutolayoutVisibility: true,
            headerItems: [
                { name: 'Assignment', type: 'element' },
                { name: 'Decision', type: 'element' },
                { name: 'Loop', type: 'element' },
                { name: 'SortCollectionProcessor', type: 'elementSubtype' }
            ],
            headerFreeformVisibility: true
        },
        {
            headerLabel: 'Data',
            headerAutolayoutVisibility: true,
            headerItems: [
                { name: 'RecordCreate', type: 'element' },
                { name: 'RecordUpdate', type: 'element' },
                { name: 'RecordQuery', type: 'element' },
                { name: 'RecordDelete', type: 'element' },
                { name: 'RecordRollback', type: 'element' }
            ],
            headerFreeformVisibility: true
        }
    ]
};

const toolboxElements = [
    {
        isElementSubtype: false,
        name: 'Assignment',
        attributes: null,
        classification: 'Node',
        elementType: 'Assignment'
    },
    {
        isElementSubtype: false,
        name: 'Decision',
        attributes: null,
        classification: 'Node',
        elementType: 'Decision'
    },
    { isElementSubtype: false, name: 'Loop', attributes: null, classification: 'Node', elementType: 'Loop' },
    {
        isElementSubtype: false,
        name: 'RecordCreate',
        attributes: [
            {
                name: 'isCollection',
                source: 'Inferred',
                type: 'Boolean',
                value: { values: [false], constraint: 'thisValue' }
            },
            {
                name: 'dataType',
                source: 'Inferred',
                type: 'FlowDataType',
                value: { values: ['Boolean'], constraint: 'thisValue' }
            }
        ],
        classification: 'Node',
        elementType: 'RecordCreate'
    },
    {
        isElementSubtype: false,
        name: 'RecordLookup',
        attributes: [
            {
                name: 'isCollection',
                source: 'UserDefined',
                type: 'Boolean',
                value: { values: [true, false], constraint: 'oneOf' }
            },
            {
                name: 'dataType',
                source: 'UserDefined',
                type: 'FlowDataType',
                value: { values: ['Boolean', 'SObject'], constraint: 'oneOf' }
            }
        ],
        classification: 'Node',
        elementType: 'RecordQuery'
    },
    {
        isElementSubtype: false,
        name: 'RecordUpdate',
        attributes: [
            {
                name: 'isCollection',
                source: 'Inferred',
                type: 'Boolean',
                value: { values: [false], constraint: 'thisValue' }
            },
            {
                name: 'dataType',
                source: 'Inferred',
                type: 'FlowDataType',
                value: { values: ['Boolean'], constraint: 'thisValue' }
            }
        ],
        classification: 'Node',
        elementType: 'RecordUpdate'
    },
    {
        isElementSubtype: false,
        name: 'RecordDelete',
        attributes: [
            {
                name: 'isCollection',
                source: 'Inferred',
                type: 'Boolean',
                value: { values: [false], constraint: 'thisValue' }
            },
            {
                name: 'dataType',
                source: 'Inferred',
                type: 'FlowDataType',
                value: { values: ['Boolean'], constraint: 'thisValue' }
            }
        ],
        classification: 'Node',
        elementType: 'RecordDelete'
    },
    {
        isElementSubtype: false,
        name: 'ApexPlugin',
        attributes: [
            {
                name: 'isCollection',
                source: 'Inferred',
                type: 'Boolean',
                value: { values: [false], constraint: 'thisValue' }
            },
            {
                name: 'dataType',
                source: 'Inferred',
                type: 'FlowDataType',
                value: { values: ['Boolean'], constraint: 'thisValue' }
            }
        ],
        classification: 'Node',
        elementType: 'ApexPlugin'
    },
    {
        isElementSubtype: false,
        name: 'ActionCall',
        attributes: [
            {
                name: 'isCollection',
                source: 'Inferred',
                type: 'Boolean',
                value: { values: [false], constraint: 'thisValue' }
            },
            {
                name: 'dataType',
                source: 'Inferred',
                type: 'FlowDataType',
                value: { values: ['Boolean'], constraint: 'thisValue' }
            }
        ],
        classification: 'Node',
        elementType: 'ActionCall'
    },
    {
        isElementSubtype: false,
        name: 'SubFlow',
        attributes: null,
        classification: 'Node',
        elementType: 'Subflow'
    },
    {
        isElementSubtype: false,
        name: 'Screen',
        attributes: null,
        classification: 'Node',
        elementType: 'Screen'
    },
    { isElementSubtype: false, name: 'Step', attributes: null, classification: 'Node', elementType: 'Step' },
    {
        isElementSubtype: false,
        name: 'Start',
        attributes: null,
        classification: 'Node',
        elementType: 'Start'
    },
    {
        isElementSubtype: false,
        name: 'CollectionProcessor',
        attributes: null,
        classification: 'Node',
        elementType: 'CollectionProcessor'
    },
    {
        isElementSubtype: false,
        name: 'RecordRollback',
        attributes: null,
        classification: 'Node',
        elementType: 'RecordRollback'
    },
    {
        labelEdit: 'Edit Collection Sort',
        isElementSubtype: true,
        color: 'background-orange',
        name: 'SortCollectionProcessor',
        icon: 'standard:sort',
        description: 'Sort items in a collection.',
        label: 'Collection Sort',
        labelNew: 'New Collection Sort',
        classification: 'Node',
        elementType: 'CollectionProcessor',
        labelPlural: 'Collection Sorts',
        configComponent: 'builder_platform_interaction:sortEditor'
    }
];

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
                        console.log(JSON.parse(JSON.stringify(storeInstance.getCurrentState())));
                    } catch (e) {
                        component.stopTestMonkey('reducer exception', e);
                    }

                    const { elements } = target.getCurrentState();
                    if (Object.values(elements).length > 0) {
                        if (component.runAssertions) {
                            // convert roundtrip
                            if (!convertRoundTrip(storeInstance)) {
                                component.stopTestMonkey();
                            }
                        }
                    }
                };
            }

            // delegate directly to the store anything other than dispatch
            return target[prop];
        }
    };
}

function removeOutcome(parentGuid, childIndex) {
    const { elements } = storeInstance.getCurrentState();
    const canvasElement = deepCopy(elements[parentGuid]);
    canvasElement.maxConnections--;

    canvasElement.childReferences.splice(childIndex, 1);

    const payload = {
        elementType: 'WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS',
        canvasElement,
        deletedChildElementGuids: [],
        childElements: []
    };

    storeInstance.dispatch(updateElement(payload));
}

function addOutcome(elementGuid) {
    const { elements } = storeInstance.getCurrentState();
    const canvasElement = deepCopy(elements[elementGuid]);
    canvasElement.maxConnections++;

    const childElement = elements[canvasElement.childReferences[0].childReference];
    const newChildElement = { ...childElement };
    newChildElement.guid = generateGuid();

    elements[newChildElement.guid] = newChildElement;
    const availableConnection = {
        childReference: newChildElement.guid
    };

    canvasElement.childReferences = [availableConnection, ...canvasElement.childReferences];

    const payload = {
        elementType: 'WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS',
        canvasElement,
        deletedChildElementGuids: [],
        childElements: []
    };

    storeInstance.dispatch(updateElement(payload));
}

function translateEventToAction(event) {
    const { type } = event;
    const { elementType, prev, next, parent, childIndex, alcConnectionSource } = event.detail;

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
                        isNew: true,
                        prev,
                        next,
                        childIndex,
                        parent
                    })
                );

                if (elementType === ELEMENT_TYPE.WAIT) {
                    const { canvasElement } = element;
                    element.alcConnectionSource = alcConnectionSource;
                    element.canvasElement.label = element.canvasElement.name = element.canvasElement.guid;
                    storeInstance.dispatch(addElement(element));
                    addOutcome(canvasElement.guid);

                    return null;
                }
            }

            const node = element.screen || element.canvasElement || element;
            node.label = node.guid;
            node.name = node.label;

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
    dom = lwcUtils.createDomProxy(this, selectors);

    elementsMetadata = elementsMetadataForScreenFlow;

    undoRedoStack = [];
    undoRedoStackPointer = -1;
    updateStack = true;

    @track
    runAssertions = true;

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

    get toolboxElements() {
        return toolboxElements;
    }

    get palette() {
        return palette;
    }

    isPasteAvailable = false;

    constructor() {
        super();
        window.processEnv = { NODE_ENV: 'development' };

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
        const { alcConnectionSource, elementType } = addEvent.detail;

        if (payload != null) {
            payload.alcConnectionSource = alcConnectionSource;
            if (elementType === 'RecordDelete' && alcConnectionSource.childIndex) {
                removeOutcome(alcConnectionSource.guid, alcConnectionSource.childIndex);
            } else {
                storeInstance.dispatch(addElement(payload));
            }
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

    handleHighlightOnCanvas = (event) => {
        if (event && event.detail && event.detail.elementGuid) {
            const elementGuid = event.detail.elementGuid;
            this.dom.canvasContainer.focusOnNode(elementGuid);
        }
    };

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
                        this.dom.canvasContainer.dispatchEvent(event);
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
        const { source } = event.detail;

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
            source
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
    handleEditElement(event) {
        const guid = event.detail.canvasElementGUID;
        addOutcome(guid);
    }
}
