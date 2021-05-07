import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { AddElementEvent, DeleteElementEvent } from 'builder_platform_interaction/events';
import {
    AlcCreateConnectionEvent,
    AddElementFaultEvent,
    DeleteElementFaultEvent
} from 'builder_platform_interaction/alcEvents';

import {
    convertToAutoLayoutCanvas,
    convertToFreeFormCanvas,
    removeEndElementsAndConnectorsTransform,
    addEndElementsAndConnectorsTransform
} from 'builder_platform_interaction/alcConversionUtils';
import { getTargetGuidsForBranchReconnect, findParentElement } from 'builder_platform_interaction/autoLayoutCanvas';

import { updateFlow } from 'builder_platform_interaction/actions';
const FAULT_INDEX = -1;

function randomIndex(arr, extraLength = 0) {
    const len = arr.length + extraLength;
    return Math.floor(Math.random() * len);
}

function normalizeElements(elements) {
    return Object.values(elements)
        .map(pick)
        .sort((e1, e2) => (e1.guid >= e2.guid ? 1 : -1));
}

export const showError = (message, exception) => {
    if (exception) {
        console.log(exception);
    }

    alert(message);
};

export const fetchFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('flow'));
};

export const saveToLocalStorage = (flow) => {
    localStorage.setItem('flow', JSON.stringify(flow));
};

export const getTestCaseOptions = (testCases) => {
    return testCases.map((testCase) => {
        return {
            label: testCase.split('/').pop(),
            value: testCase
        };
    });
};

export const loadFlow = (storeInstance, flow) => {
    storeInstance.dispatch(updateFlow(flow));
};

export const loadSaved = (storeInstance) => {
    const flow = JSON.parse(localStorage.getItem('flow'));

    if (flow) {
        loadFlow(storeInstance, flow);
    }
};

export const loadTestCases = async () => {
    const response = await fetch('/testcases');
    const json = await response.json();

    return json;
};

export const randomElement = (store, filter = () => true) => {
    const elements = Object.values(store.getCurrentState().elements)
        .filter((ele) => ele.isCanvasElement)
        .filter(filter);

    return elements[randomIndex(elements)];
};

/**
 * Calculates a random insertion point relative to an element. This will usually be just
 * after the specified element.
 *
 * @param element - The element used as the insertion point
 * @return an alcInsertAt object
 */
export const randomInsertAt = (element) => {
    const { next, prev, children, guid, elementType, parent, childIndex } = element;

    let alcInsertAt;

    if (elementType === ELEMENT_TYPE.END_ELEMENT) {
        // since we have an end element, we must insert before it
        if (prev) {
            alcInsertAt = {
                prev,
                next: guid
            };
        } else {
            // const parentElement = findParentElement(element);
            // if (parentElement.fault) {
            alcInsertAt = {
                parent,
                childIndex
            };
            // } else {
            //     alcInsertAt = {
            //         parent,
            //         childIndex
            //     };
            // }
        }
    } else if (children != null) {
        // if the elements has children, insert as a child
        const index = randomIndex(children, next != null ? 1 : 0);
        if (index === children.length) {
            alcInsertAt = {
                prev: guid,
                next
            };
        } else {
            alcInsertAt = {
                parent: guid,
                childIndex: Math.floor(Math.random() * children.length)
            };
        }
    } else {
        // the default: insert after the element
        alcInsertAt = {
            prev: guid,
            next
        };
    }

    return alcInsertAt;
};

// supported element types to add
const elementTypes = [
    ELEMENT_TYPE.ACTION_CALL,
    ELEMENT_TYPE.SCREEN,
    ELEMENT_TYPE.DECISION,
    ELEMENT_TYPE.WAIT,
    ELEMENT_TYPE.END_ELEMENT,
    ELEMENT_TYPE.LOOP
];

export const randomElementType = () => {
    return elementTypes[randomIndex(elementTypes)];
};

function pick(ele) {
    const { guid, prev, next, children, parent, childIndex, isTerminal } = ele;

    const res = { guid, prev, next, children, childIndex, isTerminal, parent };

    if (next == null) {
        delete res.next;
    }

    if (prev == null) {
        delete res.prev;
    }

    return res;
}

export const compareState = (prevState, nextState) => {
    prevState = normalizeElements(prevState.elements);
    nextState = normalizeElements(nextState.elements);

    for (let i = 0; i < prevState.length; i++) {
        if (JSON.stringify(prevState[i]) !== JSON.stringify(nextState[i])) {
            console.log(`
Expected:
${JSON.stringify(nextState[i], null, '    ')}
To be:
${JSON.stringify(prevState[i], null, '    ')}
           `);
            throw new Error('failed');
        }
    }
};

// Weighted array of possible actions.
// Each action can be assigned a weight to control its randomness, the higher the weight
// the most likely it will occur
const actions = [
    {
        type: 'Add',
        weight: 5
    },
    {
        type: 'Delete',
        weight: 2
    },
    {
        type: 'Add Fault',
        weight: 10
    }
].reduce((acc, curr) => {
    return [...acc, ...Array(curr.weight).fill(curr.type)];
}, []);

/**
 * @return a random action
 */
function randomAction() {
    return actions[randomIndex(actions)];
}

/**
 * @return a random deletion index
 */
function randomDeleteBranchIndex({ children }) {
    let index;

    if (children) {
        index = randomIndex(children, 1);
        index = children.length ? undefined : index;
    } else {
        index = undefined;
    }

    return index;
}

function removeEmptyFaults(elements) {
    elements = { ...elements };
    Object.values(elements).forEach((element) => {
        const fault = element.fault;
        if (fault && elements[fault].elementType === ELEMENT_TYPE.END_ELEMENT) {
            delete element.fault;
            delete elements[fault];
        }
    });

    return elements;
}

export const convertToAutoLayout = (ffcState) => {
    return convertToAutoLayoutCanvas(addEndElementsAndConnectorsTransform(ffcState));
};
/**
 * Does a round trip alc -> ffc -> alc conversion and asserts the alc pointers are the same
 */
export const convertRoundTrip = (storeInstance) => {
    const currentState = storeInstance.getCurrentState();

    const elements = { ...currentState.elements };

    Object.values(elements).forEach((ele) => {
        elements[ele.guid] = { ...ele };
    });

    try {
        const prevState = { elements: removeEmptyFaults(elements) };
        const endConnectors = [];

        const ffcState = removeEndElementsAndConnectorsTransform(
            convertToFreeFormCanvas(prevState, [0, 0]),
            endConnectors
        );

        const nextState = convertToAutoLayoutCanvas(addEndElementsAndConnectorsTransform(ffcState, endConnectors), {
            shouldConsolidateEndConnectors: false,
            noEmptyFaults: true
        });

        compareState(prevState, nextState);
        return nextState;
    } catch (e) {
        showError('convert round trip failed', e);
        return null;
    }
};

function randomDeleteOrReconnectEvent(storeInstance) {
    const { elements } = storeInstance.getCurrentState();

    const elementFilter = (ele) => ele.elementType !== ELEMENT_TYPE.START_ELEMENT;
    const element = randomElement(storeInstance, elementFilter);

    if (element.elementType === ELEMENT_TYPE.END_ELEMENT) {
        // if we are deleting the end element we need to reconnect

        const sourceGuid = element.guid;
        const parentElement = findParentElement(element, elements);
        if (parentElement.elementType === ELEMENT_TYPE.ROOT_ELEMENT || parentElement.fault) {
            // can't delete the bottom most end element, or reconnect a fault
            return null;
        }

        const selectableGuids = getTargetGuidsForBranchReconnect(storeInstance.getCurrentState().elements, sourceGuid);

        if (selectableGuids.length === 0) {
            return null;
        }
        const targetGuid = selectableGuids[randomIndex(selectableGuids)];

        const { prev, childIndex, parent } = element;
        const insertAt = parent ? { parent, childIndex } : { prev };
        return new AlcCreateConnectionEvent(insertAt, targetGuid);
    }
    const deleteIndex = randomDeleteBranchIndex(element);
    return new DeleteElementEvent([element.guid], element.elementType, deleteIndex);
}

function getChildAt(elements, parent, childIndex) {
    if (childIndex === FAULT_INDEX) {
        return elements[parent].fault;
    }
    return elements[parent].children[childIndex];
}

function isInLoop(elements, alcInsertAt) {
    const { parent, prev } = alcInsertAt;
    let parentElement = elements[parent] || elements[prev];

    while (parentElement != null) {
        if (parentElement.elementType === ELEMENT_TYPE.LOOP) {
            return true;
        }
        parentElement = findParentElement(parentElement, elements);
    }

    return false;
}
function randomAddEvent(storeInstance) {
    const { elements } = storeInstance.getCurrentState();

    const alcInsertAt = randomInsertAt(randomElement(storeInstance));
    const detail = {
        elementType: randomElementType(),
        locationX: 0,
        locationY: 0,
        alcInsertAt
    };

    if (detail.elementType === ELEMENT_TYPE.END_ELEMENT) {
        if (isInLoop(elements, alcInsertAt)) {
            return null;
        }
        const { next, parent, childIndex } = alcInsertAt;
        if (next != null) {
            return null;
        } else if (parent && getChildAt(elements, parent, childIndex) != null) {
            return null;
        }
    }
    return new AddElementEvent(detail);
}

function randomAddDeleteFaultEvent(storeInstance) {
    const element = randomElement(storeInstance, (ele) => ele.elementType === ELEMENT_TYPE.ACTION_CALL);
    if (element) {
        if (element && !element.fault) {
            return new AddElementFaultEvent(element.guid);
        }

        return new DeleteElementFaultEvent(element.guid);
    }
    return null;
}
/**
 * Returnn a random event to fire on the builder
 * @param storeInstance - The store
 * @return a random event
 */
export const randomEvent = (storeInstance) => {
    const action = randomAction();

    switch (action) {
        case 'Add':
            return randomAddEvent(storeInstance);
        case 'Delete':
            return randomDeleteOrReconnectEvent(storeInstance);
        case 'Add Fault':
            return randomAddDeleteFaultEvent(storeInstance);
        default:
            return null;
    }
};

export const convertToFreeForm = (flow) => {
    return removeEndElementsAndConnectorsTransform(convertToFreeFormCanvas(flow, [0, 0]), []);
};

export const saveAsTestCase = async (flow) => {
    const res = await fetch('/testcases', {
        method: 'post',
        body: JSON.stringify(flow, null, '   '),
        headers: { 'Content-Type': 'application/json' }
    });

    return res.file;
};

export const loadFreeFormTestCase = async (file) => {
    try {
        const response = await fetch(file);
        const flow = await response.json();
        return convertToAutoLayout(flow);
    } catch (e) {
        showError('failed to load test case');
    }
};

export const loadAutoLayoutTestCase = async (file) => {
    const response = await fetch(file);
    const flow = await response.json();

    const canvasElements = Object.values(flow.elements)
        .filter((ele) => ele.isCanvasElement)
        .map((ele) => ele.guid);

    return { ...flow, canvasElements };
};
