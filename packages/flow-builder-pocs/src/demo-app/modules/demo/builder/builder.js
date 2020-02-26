import { LightningElement } from 'lwc';

import { Store } from 'builder_platform_interaction/storeLib';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { addElement, updateFlow } from 'builder_platform_interaction/actions';
import { reducer } from 'builder_platform_interaction/reducers';
import { addRootAndEndElements } from 'builder_platform_interaction/flcConversionUtils';
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
            if (elementType !== ELEMENT_TYPE.END_ELEMENT) {
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
            } else {
                element = createEndElement({
                    prev,
                    next,
                    childIndex,
                    parent
                 });
            }
            return element;
        default:
            return null;
    }
}

export default class Builder extends LightningElement {
    elementsMetadata = elementsMetadataForScreenFlow;

    constructor() {
        super();

        storeInstance = Store.getStore(reducer);
        addRootAndEndElements(storeInstance, this.createStartElement().guid);

        this.handleLoad();

        //   console.log(collectionVariableSingularLabel);
    }

    createStartElement() {
        const startElement = createStartElement();
        storeInstance.dispatch(addElement(startElement));
        return startElement;
    }

    handleAddElement(addEvent) {
        const payload = translateEventToAction(addEvent);
        storeInstance.dispatch(addElement(payload));
    }

    handleDeleteElement(/* deleteEvent */) {}

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
}
