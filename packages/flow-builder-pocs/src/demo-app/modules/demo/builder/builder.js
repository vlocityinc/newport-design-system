import { LightningElement } from 'lwc';

import { Store, generateGuid } from 'builder_platform_interaction/storeLib';

import { AddElementEvent } from 'builder_platform_interaction/events';
import { addElement, updateFlow } from 'builder_platform_interaction/actions';
import { reducer } from 'builder_platform_interaction/reducers';

import { addRootAndEndElements } from 'builder_platform_interaction/flcConversionUtils';
import { getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const createStartElement = storeInstance => {
    const elementType = ELEMENT_TYPE.START_ELEMENT;

    const startElement =  {
        elementType,
        guid: generateGuid(),
        label: elementType,
        value: elementType,
        text: elementType,
        name: elementType,
        prev: null,
        next: null
    };

    storeInstance.dispatch(addElement(startElement));
    return startElement;
};

function translateEventToAction(event) {
    const { type } = event;
    const { elementType, prev, next, parent, childIndex } = event.detail;

    let element;
    let canvasElement;

    switch (type) {
        case AddElementEvent.EVENT_NAME:
            if (elementType !== ELEMENT_TYPE.END_ELEMENT) {
                element = getElementForStore({
                    elementType,
                    fields: [],
                    outcomes: []
                });
            } else {
                element = {
                    canvasElement: {
                        guid: generateGuid(),
                        name: '',
                        description: '',
                        label: '',
                        locationX: 0,
                        locationY: 0,
                        isCanvasElement: true,
                        connectorCount: 0,
                        config: { isSelected: false, isHighlighted: false },
                        defaultConnectorLabel: 'dummy label',
                        outcomeReferences: [],
                        elementType: ELEMENT_TYPE.END_ELEMENT,
                        maxConnections: 0,
                        availableConnections: [{ type: 'DEFAULT' }],
                        children: []
                    },
                    deletedChildElementGuids: [],
                    childElements: [],
                    elementType: ELEMENT_TYPE.END_ELEMENT
                };
            }

            canvasElement = element.canvasElement || element.screen;

            if (!parent) {
                canvasElement.next = next;
                canvasElement.prev = prev;
            } else {
                canvasElement.prev = null;
                canvasElement.next = null;
                canvasElement.parent = parent;
                canvasElement.childIndex = childIndex;
            }

            if (elementType === 'Decision') {
                canvasElement.maxConnections = 2;
                canvasElement.children = [];
            }

            return element;

        // case ToggleElementEvent.EVENT_NAME:
        //     return {
        //         type: ActionTypeEnum.TOGGLE_NODE.value,
        //         node: guid
        //     };
        default:
            return null;
    }
}

let storeInstance;

export default class Builder extends LightningElement {
    constructor() {
        super();

        storeInstance = Store.getStore(reducer);
        const startElement = createStartElement(storeInstance);
        addRootAndEndElements(storeInstance, startElement.guid);

        this.handleLoad();
    }

    handleAddElement(addEvent) {
        const payload = translateEventToAction(addEvent);
        storeInstance.dispatch(addElement(payload));
    }

    handleDeleteElement(deleteEvent) {
        const { selectedElementType, selectedElementGUID } = deleteEvent.detail;

        // TODO: FIX THIS

        // getElementsToBeDeleted(storeInstance, {
        //     selectedElementGUID,
        //     selectedElementType
        // });
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
        createStartElement(storeInstance);
    }
}
