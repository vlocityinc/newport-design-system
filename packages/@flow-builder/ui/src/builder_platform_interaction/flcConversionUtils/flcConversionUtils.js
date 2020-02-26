import { ElementType } from 'builder_platform_interaction/flowUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { addElement } from 'builder_platform_interaction/actions';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';

// TODO: FLC Hack: Temp magic number to identify an flc flow
export const LOCATION_Y_FLC_FLOW = 500;

// TODO: FLC Hack: Magic number to support identifying merge elements
const LOCATION_X_MERGE_MARKER = 666;

const flcExtraProps = ['next', 'prev', 'children', 'parent', 'childIndex', 'isTerminal'];

export function isFixedLayoutCanvas(startElement) {
    return startElement.locationY === LOCATION_Y_FLC_FLOW;
}

/**
 * @return true if an elementType is root or end
 */
export function isRootOrEndElement({ elementType }) {
    return elementType === ELEMENT_TYPE.END_ELEMENT || elementType === ELEMENT_TYPE.ROOT_ELEMENT;
}

/**
 * Adds an element to the elements hash and optionally to the canvasElements array
 * @param {Object} element
 * @param {Object} elements
 * @param {*} canvasElements
 */
export function addElementToState(element, elements, canvasElements) {
    elements[element.guid] = element;
    if (canvasElements) {
        canvasElements.push(element.guid);
    }
}

/**
 * Updates the pointers of the elements pointed to by the element passed in
 * @param {*} state
 * @param {Object} element
 */
export function linkElement(state, element) {
    const { prev, next, guid } = element;

    if (prev) {
        state[prev] = { ...state[prev], next: guid };
    }

    if (next) {
        state[next] = { ...state[next], prev: guid };
    }

    state[element.guid] = element;
}

/**
 * Inserts an element as child of a parent element and updates pointers
 * @param {*} state
 * @param {Object} parentElement
 * @param {number} index
 * @param {Object} element
 */
export function linkBranch(state, parentElement, childIndex, element) {
    // existing child
    const child = parentElement.children[childIndex];

    parentElement.children[childIndex] = element.guid;
    element.parent = parentElement.guid;
    element.childIndex = childIndex;

    // make the existing child the follow the insert element
    if (child) {
        const childElement = state[child];

        element.next = child;
        element.isTerminal = childElement.isTerminal;
        linkElement(state, element);

        // remove branch head properties
        delete childElement.parent;
        delete childElement.childIndex;
        delete childElement.isTerminal;
    }
}

// find the last element along the pointer chain
export function findLastElement(element, state, pointer = 'next') {
    while (element[pointer]) {
        element = state[element[pointer]];
    }

    return element;
}

// find the first element along the pointer chain
export function findFirstElement(element, state) {
    return findLastElement(element, state, 'prev');
}

/**
 * @return true iff an element can have children
 */
export function supportsChildren({ elementType }) {
    return elementType === ELEMENT_TYPE.DECISION || elementType === ELEMENT_TYPE.WAIT;
}

function createConnector({ source, target, type = CONNECTOR_TYPE.REGULAR, childSource = null }) {
    return {
        guid: generateGuid(),
        source,
        target,
        type,
        label: '',
        childSource
    };
}

export function getElementFromActionPayload(payload) {
    return payload.screen || payload.canvasElement || payload;
}

function getChildReferencesKey(parentElement) {
    return getConfigForElementType(parentElement.elementType).childReferenceKey;
}

/**
 * Find the childSource at a given index for a parentElement
 * @param {Object} parentElement
 * @param {number} index
 */
export function findChildSource(parentElement, index) {
    const { singular, plural } = getChildReferencesKey(parentElement);
    return parentElement[plural][index - 1][singular];
}

/**
 * Find the index for a childSource guid
 * @param {Object} element
 * @param {*} guid
 */
export function findConnectionIndex(parentElement, guid) {
    const { singular, plural } = getChildReferencesKey(parentElement);
    const index = parentElement[plural].findIndex(entry => entry[singular] === guid);

    return index === -1 ? 0 : index + 1;
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

/**
 * Creates a root element and links it with the start element
 * @param {*} startElementGuid
 */
export const createRootElement = startElementGuid => {
    return {
        ...createElementHelper(ELEMENT_TYPE.ROOT_ELEMENT, ElementType.ROOT),
        children: [startElementGuid]
    };
};

/**
 * Adds a null'ed children array to a parentElement
 * @param {Object} element
 */
export function initializeChildren(element) {
    const { childReferenceKey } = getConfigForElementType(element.elementType);
    // TODO: FLC find better way to determine child count (there could be more to account for faults)
    element.children = element.children || new Array(element[childReferenceKey.plural].length + 1).fill(null);
}

function findStartElement(elements) {
    return Object.values(elements).find(ele => ele.elementType === ELEMENT_TYPE.START_ELEMENT);
}

/**
 * Augments the FFC UI model with extra properties needed by the FLC
 */
export function convertToFlc(storeState) {
    const { connectors, elements } = storeState;
    connectors.forEach(connector => {
        const { source, target, childSource } = connector;
        const sourceElement = elements[source];
        const targetElement = elements[target];

        if (supportsChildren(sourceElement) && targetElement.locationX !== LOCATION_X_MERGE_MARKER) {
            initializeChildren(sourceElement);
            const childIndex = findConnectionIndex(sourceElement, childSource);
            linkBranch(elements, sourceElement, childIndex, targetElement);
        } else {
            targetElement.prev = source;
            sourceElement.next = target;
        }
    });

    const startElement = findStartElement(elements);
    fixFlcProperties(storeState, startElement);
    addElementToState(createRootElement(startElement.guid), elements);
}

/**
 * Adds a root and end element for a new flow
 */
export function addRootAndEndElements(storeInstance, startElementGuid) {
    const endElement = createEndElement({ prev: startElementGuid });
    const rootElement = createRootElement(startElementGuid);

    storeInstance.dispatch(addElement(endElement));
    storeInstance.dispatch(addElement(rootElement));
}

/**
 * Creates the connectors for the a parent's children elements until they merge back
 * @return whether any connector was created
 */
function createConnectorsForChildren(newElements, newConnectors, newCanvasElements, parentElement) {
    let createdConnector = false;

    parentElement.children.forEach((child, i) => {
        if (child) {
            const nextElement = newElements[child];

            // create the connector to the head of the branch
            if (nextElement && nextElement.elementType !== ELEMENT_TYPE.END_ELEMENT) {
                let type, childSource;

                if (i === 0) {
                    type = CONNECTOR_TYPE.DEFAULT;
                    childSource = null;
                } else {
                    type = CONNECTOR_TYPE.REGULAR;
                    childSource = findChildSource(parentElement, i);
                }
                newConnectors.push(
                    createConnector({
                        source: parentElement.guid,
                        target: nextElement.guid,
                        type,
                        childSource
                    })
                );
                createdConnector = true;
            }
        }

        // branch connectors for the child's successors until they merge back
        if (child != null) {
            convertToFfcHelper(newElements, newConnectors, newCanvasElements, newElements[child], parentElement);
        }
    });

    return createdConnector;
}

// creates the connector for an element and its successors
function convertToFfcHelper(newElements, newConnectors, newCanvasElements, element, parentElement) {
    let prevElement = null;
    let isChildless;

    while (element) {
        if (element.elementType !== ELEMENT_TYPE.END_ELEMENT) {
            const newElement = { ...element };

            const elementSupportsChildren = supportsChildren(element);
            if (elementSupportsChildren) {
                // Creates the connectors for the children
                // If not connector was created (because no children), then we need to
                // create a connector for the parent to its next element
                isChildless = !createConnectorsForChildren(newElements, newConnectors, newCanvasElements, element);
            } else {
                isChildless = false;
            }

            const nextElement = newElements[element.next];
            if (nextElement) {
                if (nextElement.elementType !== ELEMENT_TYPE.END_ELEMENT) {
                    if (elementSupportsChildren) {
                        nextElement.locationX = LOCATION_X_MERGE_MARKER;
                    }

                    // create a connector to the next element for non-branching elements,
                    // or childless branching elements
                    if (!elementSupportsChildren || isChildless) {
                        newConnectors.push(
                            createConnector({
                                source: element.guid,
                                target: element.next,
                                type: isChildless ? CONNECTOR_TYPE.DEFAULT : CONNECTOR_TYPE.REGULAR
                            })
                        );
                    }
                }
            } else if (parentElement) {
                // we are on a branch and don't have a next element, this means the parentElement's next
                // is where the flow execution continues to, so create a connector
                if (parentElement.next && newElements[parentElement.next].elementType !== ELEMENT_TYPE.END_ELEMENT) {
                    newConnectors.push(
                        createConnector({
                            source: element.guid,
                            target: parentElement.next
                        })
                    );
                }
            }

            // delete extra flc properties
            flcExtraProps.forEach(prop => delete newElement[prop]);

            addElementToState(newElement, newElements, newCanvasElements);
        }

        // the prevElement supports children, this means element is a merge element, so mark it so
        if (prevElement && supportsChildren(prevElement)) {
            element.locationX = LOCATION_X_MERGE_MARKER;
        }

        prevElement = element;
        element = newElements[element.next];
    }
}

/**
 * Removes End nodes and extra FLC element properties, and creates connectors
 * @param {Object} uiModel - a flc ui model
 * @return {Object} a ffc ui model
 */
export function convertToFfc(uiModel) {
    const { elements } = uiModel;

    const newConnectors = [];
    const newCanvasElements = [];

    // clone all elements
    let newElements = Object.values(elements).reduce((acc, element) => {
        acc[element.guid] = { ...element };
        return acc;
    }, {});

    const startElement = findStartElement(newElements);
    if (startElement) {
        startElement.locationY = LOCATION_Y_FLC_FLOW;

        convertToFfcHelper(newElements, newConnectors, newCanvasElements, startElement);

        // filter out root and end elements
        newElements = Object.values(newElements)
            .filter(element => !isRootOrEndElement(element))
            .reduce((acc, element) => {
                acc[element.guid] = element;
                return acc;
            }, {});
    }

    return { ...uiModel, elements: newElements, connectors: newConnectors, canvasElements: newCanvasElements };
}

function fixFlcPropertiesHelper(storeState, element, visited) {
    initializeChildren(element);
    element.children.forEach(child => fixFlcProperties(storeState, storeState.elements[child], element, visited));
}

// creates END elements and fixes merging branches pointers
function fixFlcProperties(storeState, element, parentElement, visited = {}) {
    const { elements, canvasElements } = storeState;
    let prevElement;
    const firstElement = element;

    // check that we have an element and it hasn't been visited
    while (element && !visited[element.guid]) {
        visited[element.guid] = true;

        // clear any magic numbers
        element.locationX = 0;

        if (supportsChildren(element)) {
            fixFlcPropertiesHelper(storeState, element, visited);
        }

        prevElement = element;
        element = elements[element.next];
        if (element && element.locationX === LOCATION_X_MERGE_MARKER) {
            // if we hit a merge marker, and have a parentElement, that means that prevElement is the last element of a branch
            if (parentElement) {
                prevElement.next = null;
                parentElement.next = element.guid;
                element.prev = parentElement.guid;

                // terminate the loop since we just hit the last branch element
                element = null;
            }
        } else if (!element) {
            const endElement = createEndElement({ prev: prevElement.guid });
            addElementToState(endElement, elements, canvasElements);
            linkElement(elements, endElement);

            // mark the branch as having an end element
            firstElement.isTerminal = true;
        }
    }
}

/**
 * Maps a flow ELEMENT_TYPE to an FLC ElementType
 */
export function getFlcElementType(elementType) {
    let type;

    switch (elementType) {
        case ELEMENT_TYPE.DECISION:
        case ELEMENT_TYPE.WAIT:
            type = ElementType.DECISION;
            break;
        case ELEMENT_TYPE.LOOP:
            type = ElementType.LOOP;
            break;
        case ELEMENT_TYPE.START_ELEMENT:
            type = ElementType.START;
            break;
        case ELEMENT_TYPE.END_ELEMENT:
            type = ElementType.END;
            break;
        case ELEMENT_TYPE.ROOT_ELEMENT:
            type = ElementType.ROOT;
            break;
        default:
            type = ElementType.DEFAULT;
    }

    return type;
}

/**
 * Stringify Store State for debugging
 * @param {*} storeState
 */
export function prettyPrintStoreState(storeState) {
    if (storeState) {
        const { elements, canvasElements, connectors } = storeState;

        // eslint-disable-next-line
        console.log(JSON.parse(JSON.stringify({ elements, connectors, canvasElements })));

        let res = (canvasElements || []).map(guid => {
            const { next, prev, children, parent, childIndex, elementType } = elements[guid];
            const label = elements[guid].label || guid;
            let nextLabel = next ? elements[next] : null;
            let prevLabel = prev ? elements[prev] : null;
            let parentLabel = parent ? elements[parent] : null;

            nextLabel = nextLabel ? nextLabel.label || nextLabel.guid : next;
            prevLabel = prevLabel ? prevLabel.label || prevLabel.guid : prev;
            parentLabel = parentLabel ? parentLabel.label || parentLabel.guid : parent;

            return `${label}: guid: ${guid} elementType: ${elementType} next: ${nextLabel}, prev: ${prevLabel}, children: ${children}, parent: ${parentLabel}, childIndex: ${childIndex}`;
        });

        res = res.concat(
            (connectors || []).map(
                ({ source, target }) => `source: ${elements[source].label}, target: ${elements[target].label}`
            )
        );

        // eslint-disable-next-line
        console.log(res.join('\n'));
    }
}
