import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { AddElementEvent, DeleteElementEvent } from 'builder_platform_interaction/events';
import {
    AddElementFaultEvent,
    DeleteElementFaultEvent,
    GoToPathEvent,
    CreateGoToConnectionEvent,
    DeleteGoToConnectionEvent
} from 'builder_platform_interaction/alcEvents';

import {
    convertToAutoLayoutCanvas,
    convertToFreeFormCanvas,
    removeEndElementsAndConnectorsTransform,
    addEndElementsAndConnectorsTransform
} from 'builder_platform_interaction/alcConversionUtils';
import {
    findParentElement,
    hasGoToOnNext,
    getChild,
    getTargetGuidsForReconnection,
    isEndedBranchMergeable,
    hasGoTo
} from 'builder_platform_interaction/autoLayoutCanvas';

import { updateFlow } from 'builder_platform_interaction/actions';

import { generateGuid } from 'builder_platform_interaction/storeLib';

import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';

const FAULT_INDEX = -1;

/**
 * Returns an array of valid target guids to reconnect a branch element to
 *
 * @param elements - The flow model
 * @param sourceGuid - The guid of a branch element
 * @returns An array of valid target guids
 */
// TODO NEED TO REMOVE BEFORE MERGE WITH MAIN
function getTargetGuidsForBranchReconnect(elements, sourceGuid) {
    const { parent, childIndex } = findFirstElement(elements[sourceGuid], elements);
    const branchingElement = resolveParent(elements, parent);

    // if the branching element has a next element, then that is the only valid target guid
    if (branchingElement.next != null) {
        return [branchingElement.next];
    }

    // otherwise all the other branches must terminals
    if (!areAllBranchesTerminals(branchingElement, elements)) {
        return [];
    }

    // and any element on those branches is a valid target
    return branchingElement.children.reduce((acc, child, index) => {
        // only elements on other branches can be targets
        if (child != null && index !== childIndex) {
            const branchElements = new AlcList(elements, child).map((element) => element.guid);
            return acc.concat(branchElements);
        }

        return acc;
    }, []);
}

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
 * @return an random ConnectionSource
 */
export const randomConnectionSource = (element) => {
    const { next, prev, children, guid, elementType, parent, childIndex } = element;

    let alcConnectionSource;

    if (elementType === ELEMENT_TYPE.END_ELEMENT) {
        // since we have an end element, we must insert before it
        if (prev) {
            alcConnectionSource = {
                guid: prev
            };
        } else {
            // const parentElement = findParentElement(element);
            // if (parentElement.fault) {
            alcConnectionSource = {
                guid: parent,
                childIndex
            };
            // } else {
            //     alcConnectionSource = {
            //         parent,
            //         childIndex
            //     };
            // }
        }
    } else if (children != null) {
        // if the elements has children, insert as a child
        const index = randomIndex(children, next != null ? 1 : 0);
        if (index === children.length) {
            alcConnectionSource = {
                guid
            };
        } else {
            alcConnectionSource = {
                guid,
                childIndex: Math.floor(Math.random() * children.length)
            };
        }
    } else {
        // the default: insert after the element
        alcConnectionSource = {
            guid
        };
    }

    return alcConnectionSource;
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
    },
    {
        type: 'Add GoTo',
        weight: 5
    },
    {
        type: 'Delete GoTo',
        weight: 2
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
        const source = childIndex != null ? { guid: parent, childIndex } : { guid: prev };
        return new GoToPathEvent(source);
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

function isInLoop(elements, alcConnectionSource) {
    const { guid } = alcConnectionSource;
    let parentElement = elements[guid];

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

    const alcConnectionSource = randomConnectionSource(randomElement(storeInstance));
    const detail = {
        elementType: randomElementType(),
        locationX: 0,
        locationY: 0,
        alcConnectionSource
    };

    if (detail.elementType === ELEMENT_TYPE.END_ELEMENT) {
        if (isInLoop(elements, alcConnectionSource)) {
            return null;
        }
        const { guid, childIndex } = alcConnectionSource;
        if (childIndex == null) {
            return null;
        } else if (guid && getChildAt(elements, guid, childIndex) != null) {
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

function getAlcMenuData(elements, prev, childIndex, parent) {
    const targetGuid = childIndex != null ? getChild(elements[parent], childIndex) : elements[prev].next;
    const targetElement = targetGuid != null ? elements[targetGuid] : null;

    let isTargetEnd = false;
    let next = null;
    if (targetElement != null && childIndex == null) {
        next = targetElement.guid;
        const isNextGoTo = prev && elements[prev].next && hasGoToOnNext(elements, prev);
        if (!isNextGoTo) {
            isTargetEnd = targetElement.elementType === ELEMENT_TYPE.END_ELEMENT;
        }
    }

    const hasEndElement = targetGuid == null;
    const canAddGoTo = isTargetEnd || hasEndElement;
    return { canAddGoTo, next };
}

function randomAddGoToEvent(storeInstance) {
    const { elements } = storeInstance.getCurrentState();
    const alcConnectionSource = randomConnectionSource(randomElement(storeInstance));
    const { prev, childIndex, parent } =
        alcConnectionSource.childIndex != null
            ? { prev: null, childIndex: alcConnectionSource.childIndex, parent: alcConnectionSource.guid }
            : { prev: alcConnectionSource.guid, childIndex: alcConnectionSource.childIndex, parent: null };

    // TODO remove this check after W-9655375 and W-8544827
    const elementType = prev ? elements[prev].elementType : null;
    if (
        elementType === ELEMENT_TYPE.WAIT ||
        elementType === ELEMENT_TYPE.DECISION ||
        isInLoop(elements, alcConnectionSource)
    ) {
        return null;
    }

    const source = { guid: prev || parent, childIndex };
    const { canAddGoTo, next } = getAlcMenuData(elements, prev, childIndex, parent);
    const canMergeEndedBranch = isEndedBranchMergeable(elements, source);

    if (canAddGoTo) {
        const { goToableGuids } = getTargetGuidsForReconnection(elements, source, next, canMergeEndedBranch);
        if (goToableGuids.length > 0) {
            const randomGoToGuid = goToableGuids[randomIndex(goToableGuids)];
            return new CreateGoToConnectionEvent({ guid: alcConnectionSource.guid, childIndex }, randomGoToGuid, false);
        }
    }
    return null;
}

function randomDeleteGoToEvent(storeInstance) {
    const { elements } = storeInstance.getCurrentState();
    const elementFilter = (ele) => ele.elementType !== ELEMENT_TYPE.END_ELEMENT;
    const alcConnectionSource = randomConnectionSource(randomElement(storeInstance, elementFilter));
    if (hasGoTo(elements, alcConnectionSource)) {
        return new DeleteGoToConnectionEvent(alcConnectionSource);
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
        case 'Add GoTo':
            return randomAddGoToEvent(storeInstance);
        case 'Delete GoTo':
            return randomDeleteGoToEvent(storeInstance);
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

/**
 * Function to recurse through the screen field references and getting all the nested screen fields to cut or copy
 * @param {Object} elementsInStore - State of the elements in store
 * @param {Object []} fieldReferencesArray - Array containing field reference objects like: {childReference: 'fieldGuid'}
 * @returns nestedChildElementsToCutOrCopy - Object containing all the nested screen field to cut or copy
 */
const getNestedChildElementsToCutOrCopy = (elementsInStore, fieldReferencesArray) => {
    let nestedChildElementsToCutOrCopy = {};
    if (fieldReferencesArray && fieldReferencesArray.length > 0) {
        for (let i = 0; i < fieldReferencesArray.length; i++) {
            const childReference = fieldReferencesArray[i].childReference;
            nestedChildElementsToCutOrCopy[childReference] = elementsInStore[childReference];
            if (nestedChildElementsToCutOrCopy[childReference].childReferences) {
                nestedChildElementsToCutOrCopy = {
                    ...nestedChildElementsToCutOrCopy,
                    ...getNestedChildElementsToCutOrCopy(
                        elementsInStore,
                        nestedChildElementsToCutOrCopy[childReference].childReferences
                    )
                };
            }
        }
    }

    return nestedChildElementsToCutOrCopy;
};

/**
 * Checks if the canvas element being duplicated can have any child elements associated with it or not. Only Decision,
 * Screen and wait (Pause) element can have child elements.
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @returns {Boolean} - Returns true if canvas element is Decision, Screen or Wait
 */
const hasChildElements = (canvasElement) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    return canvasElement.elementType && getConfigForElementType(canvasElement.elementType).areChildElementsSupported;
};

/**
 * Function to create a guid -> new guid map
 *
 * @param {Object} elements - Object containing element objects for which the maps needs to be created
 */
const createGuidMap = (elements) => {
    return Object.keys(elements).reduce((acc, guid) => {
        acc[guid] = generateGuid();
        return acc;
    }, {});
};

/**
 * Function to get the guid -> pasted guid maps for canvas elements and child elements (like outcome, screen fields etc.)
 * @param {Object} cutOrCopiedCanvasElements - Contains all the cut or copied Canvas Elements
 * @param {Object} cutOrCopiedChildElements - contains all the cut or copied Child Elements
 * @returns {Object} - Contains canvasElementGuidMap and childElementGuidMap
 */
export const getPasteElementGuidMaps = (cutOrCopiedCanvasElements, cutOrCopiedChildElements) => {
    return {
        canvasElementGuidMap: createGuidMap(cutOrCopiedCanvasElements),
        childElementGuidMap: createGuidMap(cutOrCopiedChildElements)
    };
};

/**
 * Function to get all the copied child elements
 *
 * @param {Object} elementsInStore - State of the elements in store
 * @param {Object} copiedElement - The copied element
 * @returns copiedChildElements containing all the copied child elements
 */
export const getCopiedChildElements = (elementsInStore, copiedElement) => {
    let copiedChildElements = {};
    if (hasChildElements(copiedElement)) {
        const childReferenceArray = copiedElement.childReferences;

        for (let j = 0; j < childReferenceArray.length; j++) {
            const childReference = childReferenceArray[j].childReference;
            copiedChildElements[childReference] = elementsInStore[childReference];

            // In case of screens we need to look for the nested screen fields too
            if (copiedChildElements[childReference].childReferences) {
                copiedChildElements = {
                    ...copiedChildElements,
                    ...getNestedChildElementsToCutOrCopy(
                        elementsInStore,
                        copiedChildElements[childReference].childReferences
                    )
                };
            }
        }
    }

    return copiedChildElements;
};

/**
 * Helper function to get the bottom most cut or copied guid
 *
 * @param {Object} elementsInStore - State of the elements in store
 * @param {String} topCutOrCopiedGuid - Guid of the top-most cut or copied element
 * @returns {String} - Guid of the bottom most cut or copied element
 */
const getBottomCutOrCopiedGuid = (elementsInStore, topCutOrCopiedGuid) => {
    const topCutOrCopiedElement = elementsInStore[topCutOrCopiedGuid];
    let bottomCutOrCopiedElement = topCutOrCopiedElement;

    // Traversing down the selected elements vertical chain to get the bottom-most selected element guid
    while (bottomCutOrCopiedElement) {
        if (
            elementsInStore[bottomCutOrCopiedElement.next] &&
            elementsInStore[bottomCutOrCopiedElement.next].config &&
            elementsInStore[bottomCutOrCopiedElement.next].config.isSelected &&
            !hasGoToOnNext(elementsInStore, bottomCutOrCopiedElement.guid)
        ) {
            bottomCutOrCopiedElement = elementsInStore[bottomCutOrCopiedElement.next];
        } else {
            break;
        }
    }

    return bottomCutOrCopiedElement.guid;
};

/**
 * Function to get all the copied data
 *
 * @param {Object} elementsInStore - State of the elements in store
 * @param {String} topCopiedGuid - Guid of the top copied element
 * @returns {Object} - Contains copiedCanvasElements, copiedChildElements and bottomCutOrCopiedGuid
 */
export const getCopiedData = (elementsInStore, topCopiedGuid) => {
    const copiedCanvasElements = {};
    let copiedChildElements = {};

    // Calculating the copiedCanvasElements and copiedChildElements objects
    for (let i = 0; i < Object.values(elementsInStore).length; i++) {
        const canvasElement = Object.values(elementsInStore)[i];
        if (canvasElement.config && canvasElement.config.isSelected) {
            copiedCanvasElements[canvasElement.guid] = canvasElement;
            copiedChildElements = {
                ...copiedChildElements,
                ...getCopiedChildElements(elementsInStore, canvasElement)
            };
        }
    }

    // Getting the guid of the bottom most selected element
    const bottomCutOrCopiedGuid = getBottomCutOrCopiedGuid(elementsInStore, topCopiedGuid);

    return { copiedCanvasElements, copiedChildElements, bottomCutOrCopiedGuid };
};
