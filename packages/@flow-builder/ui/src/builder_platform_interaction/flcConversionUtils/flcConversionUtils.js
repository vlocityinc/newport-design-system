import { ElementType } from 'builder_platform_interaction/flowUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { addElement, addConnector, deleteElements } from 'builder_platform_interaction/actions';

function isRootOrEndElement({ elementType }) {
    return elementType === ELEMENT_TYPE.END_ELEMENT || elementType === ELEMENT_TYPE.ROOT_ELEMENT;
}

function supportsChildren({ elementType }) {
    return elementType === ELEMENT_TYPE.DECISION;
}

function createConnector(source, target, type = CONNECTOR_TYPE.REGULAR, childSource = null) {
    return {
        guid: generateGuid(),
        source,
        target,
        type,
        label: '',
        childSource,
        config: {
            isSelected: false
        }
    };
}

export function addConnectorsForNewElement(storeInstance, { next, prev, guid, parent, childIndex }) {
    const { elements, connectors } = storeInstance.getCurrentState();

    if (prev) {
        const prevElement = elements[prev];
        if (prevElement.children) {
            // This is a merge element, so we need to reconnect all merging elements

            // first remove all incoming connections that are not from the splitting element
            const connectorsToDelete = Object.values(connectors).filter(
                conn => conn.next === guid && conn.prev !== prevElement.guid
            );

            if (connectorsToDelete.length > 0) {
                deleteElements({
                    selectedElements: [],
                    connectorsToDelete,
                    elementType: null
                });
            }

            // now add connections to the tips of all the branches that are not end nodes, and thus are
            // merging into join element
            prevElement.children.forEach(child => {
                let childElement = elements[child];

                while (childElement && childElement.next) {
                    childElement = elements[childElement.next];
                }

                if (childElement.elementType !== ELEMENT_TYPE.END_ELEMENT) {
                    storeInstance.dispatch(addConnector(createConnector(childElement.guid, guid)));
                }

                storeInstance.dispatch(addConnector(createConnector(childElement.guid, guid)));
            });
        } else {
            storeInstance.dispatch(addConnector(createConnector(prev, guid)));
        }
    }

    if (next && elements[next].elementType !== ELEMENT_TYPE.END_ELEMENT) {
        storeInstance.dispatch(addConnector(createConnector(guid, next)));
    }

    if (parent) {
        // TODO_FLC: fix hardcoding reference position
        if (childIndex === 0) {
            storeInstance.dispatch(addConnector(createConnector(parent, guid, CONNECTOR_TYPE.DEFAULT)));
        } else {
            const { outcomeReferences } = elements[parent];
            const childSource = outcomeReferences[childIndex - 1].outcomeReference;
            storeInstance.dispatch(addConnector(createConnector(parent, guid, CONNECTOR_TYPE.REGULAR, childSource)));
        }
    }
}

function createElementHelper(elementType, guid) {
    return {
        elementType,
        guid,
        label: elementType,
        value: elementType,
        text: elementType,
        name: elementType,
        prev: null,
        next: null
    };
}

export const createRootElement = startElementGuid => {
    return {
        ...createElementHelper(ELEMENT_TYPE.ROOT_ELEMENT, ElementType.ROOT),
        children: [startElementGuid]
    };
};

export const createEndElement = prev => {
    return {
        ...createElementHelper(ELEMENT_TYPE.END_ELEMENT, generateGuid()),
        prev
    };
};

// function prettyPrint(storeState) {
//     const { printLabel, elements, canvasElements, connectors } = storeState;
//     let res = canvasElements.map(guid => {
//         const { label, next, prev, children } = elements[guid];
//         let nextLabel = next ? elements[next] : null;
//         let prevLabel = prev ? elements[prev] : null;

//         nextLabel = nextLabel ? nextLabel.label || nextLabel.guid : next;
//         prevLabel = prevLabel ? prevLabel.label || prevLabel.guid : prev;

//         return `${label}: next: ${nextLabel}, prev: ${prevLabel}, children: ${children}`;
//     });

//     res = res.concat(
//         connectors.map(({ source, target }) => {
//             return `source: ${elements[source].label}, target: ${elements[target].label}`;
//         })
//     );

//     console.log(printLabel);
//     console.log(res.join('\n'));
//     console.log(JSON.parse(JSON.stringify([canvasElements.map(guid => elements[guid]), connectors])));
// }

/**
 * Augments the FFC UI model with extra properties needed by the FLC
 */
export function toFlc(storeConnectors, storeElements, canvasElementGuids) {
    storeConnectors.forEach(connector => {
        const { source, target } = connector;
        const sourceElement = storeElements[source];
        const targetElement = storeElements[target];
        if (sourceElement.elementType === ELEMENT_TYPE.DECISION) {
            sourceElement.children = sourceElement.children || [];
            const childIndex = sourceElement.children.length;
            targetElement.childIndex = childIndex;
            targetElement.parent = source;
            sourceElement.children.push(target);
        } else {
            sourceElement.next = target;
        }
        if (targetElement.prev) {
            if (targetElement.prev !== 'merge') {
                targetElement.prev = 'merge';
            }
            sourceElement.next = target;
        } else if (!sourceElement.children) {
            targetElement.prev = source;
        }
    });

    const startElement = Object.values(storeElements).find(ele => ele.elementType === ELEMENT_TYPE.START_ELEMENT);
    canvasElementGuids.forEach(canvasElementGuid => {
        const canvasElement = storeElements[canvasElementGuid];
        const { next, guid } = canvasElement;
        if (!next && !isRootOrEndElement(canvasElement)) {
            const endElement = createEndElement(guid);
            storeElements[endElement.guid] = endElement;
            canvasElementGuids.push(endElement.guid);
            canvasElement.next = endElement.guid;
        }
    });

    canvasElementGuids.forEach(canvasElementGuid => {
        const canvasElement = storeElements[canvasElementGuid];
        const { next, guid } = canvasElement;
        if (!next && !isRootOrEndElement(canvasElement)) {
            const endElement = createEndElement(guid);
            storeElements[endElement.guid] = endElement;
            canvasElementGuids.push(endElement.guid);
            canvasElement.next = endElement.guid;
        }
    });

    // prettyPrint({
    //     printLabel: 'before fixFlcProperties',
    //     connectors: storeConnectors,
    //     elements: storeElements,
    //     canvasElements: canvasElementGuids
    // });
    fixFlcProperties(storeElements, startElement);
    // prettyPrint({
    //     printLabel: 'after fixFlcProperties',
    //     connectors: storeConnectors,
    //     elements: storeElements,
    //     canvasElements: canvasElementGuids
    // });

    const rootElement = createRootElement(startElement.guid);
    storeElements[rootElement.guid] = rootElement;
}

/**
 * Adds a root and end element for a new flow
 */
export function addRootAndEndElements(storeInstance, startElementGuid) {
    const endElement = createEndElement(startElementGuid);
    const rootElement = createRootElement(startElementGuid);

    storeInstance.dispatch(addElement(endElement));
    storeInstance.dispatch(addElement(rootElement));
}

/**
 * Removes End nodes and FLC element specific properties
 */
export function fromFlc(uiModel) {
    const { elements, connectors, canvasElements } = uiModel;
    const newConnectors = connectors.filter(connector => {
        return elements[connector.target].elementType !== ELEMENT_TYPE.END_ELEMENT;
    });

    const newCanvasElements = canvasElements.filter(guid => {
        return elements[guid].elementType !== ELEMENT_TYPE.END_ELEMENT;
    });

    const newElements = Object.values(elements).reduce((acc, element) => {
        if (!isRootOrEndElement(element)) {
            // delete extra flc properties
            const newElement = { ...element };
            delete newElement.next;
            delete newElement.prev;
            delete newElement.children;
            delete newElement.parent;
            delete newElement.childIndex;

            acc[newElement.guid] = newElement;
        }

        return acc;
    }, {});

    return { ...uiModel, elements: newElements, connectors: newConnectors, canvasElements: newCanvasElements };
}

function fixFlcPropertiesHelper(elements, element, visited) {
    element.children.forEach(child => fixFlcProperties(elements, elements[child], element, visited));
}

function fixFlcProperties(elements, element, header, visited = {}) {
    // temporary marker to indentify an element that has more than one element pointing to it
    const MERGE_MARKER = 'merge';

    // check that we have an element and it hasn't been visited
    let prevElement;

    while (element && !visited[element.guid]) {
        visited[element.guid] = true;

        if (element.prev === MERGE_MARKER) {
            element.prev = prevElement.guid;
        }

        if (supportsChildren(element)) {
            element.children = element.children || [];
            fixFlcPropertiesHelper(elements, element, visited);

            const nextElement = elements[element.next];
            if (nextElement) {
                nextElement.prev = element.guid;
            }

            // if we have 2 children then they must both reconnect
            if (element.children.length <= 2) {
                element.children.forEach(child => {
                    let childElement = elements[child];

                    while (childElement && childElement.next) {
                        const nextChildElement = elements[childElement.next];
                        if (nextChildElement.elementType === ELEMENT_TYPE.END_ELEMENT) {
                            break;
                        }
                        childElement = nextChildElement;
                    }

                    // set the last child's next to null so that it reconnects
                    if (childElement) {
                        childElement.next = null;
                    }
                });
            }
        }

        prevElement = element;
        element = elements[element.next];
        if (element && element.prev === MERGE_MARKER) {
            prevElement.next = null;

            header.next = element.guid;
            element = null;
        }
    }
}
