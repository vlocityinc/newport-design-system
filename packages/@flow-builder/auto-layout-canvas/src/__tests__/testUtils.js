import { getDefaultLayoutConfig } from '../defaultLayoutConfig';
import { FAULT_INDEX, FOR_EACH_INDEX } from '../model';
import { areAllBranchesTerminals, hasGoToOnNext, isBranchingElement } from '../modelUtils';
import NodeType from '../NodeType';

const layoutConfig = getDefaultLayoutConfig();

const SCREEN_ELEMENT_TYPE = 'Screen';
const ACTION_ELEMENT_TYPE = 'Action';

const ROOT_ELEMENT_GUID = 'root';
const START_ELEMENT_GUID = 'start-guid';
const END_ELEMENT_GUID = 'end-guid';
const BRANCH_ELEMENT_GUID = 'branch-guid';
const LOOP_ELEMENT_GUID = 'loop-guid';
const SCREEN_ELEMENT_GUID = 'screen-guid';
const ACTION_ELEMENT_GUID = 'action-guid';
const GOTO_TARGET_GUID = 'goto-target-guid';
const GOTO_SOURCE_GUID = 'goto-source-guid';

const ROOT_ELEMENT = {
    guid: ROOT_ELEMENT_GUID,
    elementType: NodeType.ROOT,
    nodeType: NodeType.ROOT,
    children: [START_ELEMENT_GUID]
};
const START_ELEMENT = {
    guid: START_ELEMENT_GUID,
    label: START_ELEMENT_GUID,
    elementType: NodeType.START,
    nodeType: NodeType.START,
    parent: ROOT_ELEMENT_GUID,
    childIndex: 0,
    isTerminal: true,
    isCanvasElement: true,
    childReferences: [],
    config: {}
};

const END_ELEMENT = {
    guid: END_ELEMENT_GUID,
    label: END_ELEMENT_GUID,
    elementType: 'END_ELEMENT',
    nodeType: NodeType.END,
    isCanvasElement: true
};

const BRANCH_ELEMENT = {
    guid: BRANCH_ELEMENT_GUID,
    label: BRANCH_ELEMENT_GUID,
    elementType: NodeType.BRANCH,
    nodeType: NodeType.BRANCH,
    children: [null, null],
    defaultConnectorLabel: 'Default Connector Label',
    isCanvasElement: true,
    config: {}
};

const LOOP_ELEMENT = {
    guid: LOOP_ELEMENT_GUID,
    label: LOOP_ELEMENT_GUID,
    elementType: NodeType.LOOP,
    nodeType: NodeType.LOOP,
    children: [null],
    isCanvasElement: true,
    config: {}
};

const SCREEN_ELEMENT = {
    guid: SCREEN_ELEMENT_GUID,
    label: SCREEN_ELEMENT_GUID,
    elementType: SCREEN_ELEMENT_TYPE,
    nodeType: NodeType.DEFAULT,
    isCanvasElement: true,
    config: {}
};

const ACTION_ELEMENT = {
    guid: ACTION_ELEMENT_GUID,
    label: ACTION_ELEMENT_GUID,
    elementType: NodeType.DEFAULT,
    nodeType: NodeType.DEFAULT,
    isCanvasElement: true,
    config: {}
};

const GOTO_TARGET_ELEMENT = {
    guid: GOTO_TARGET_GUID,
    label: SCREEN_ELEMENT_GUID,
    elementType: SCREEN_ELEMENT_TYPE,
    nodeType: NodeType.DEFAULT,
    isCanvasElement: true,
    config: {}
};

const GOTO_SOURCE_ELEMENT = {
    guid: GOTO_SOURCE_GUID,
    label: SCREEN_ELEMENT_GUID,
    elementType: SCREEN_ELEMENT_TYPE,
    nodeType: NodeType.DEFAULT,
    isCanvasElement: true,
    config: {}
};

function getElementByType(type) {
    let element;

    switch (type) {
        case SCREEN_ELEMENT_GUID:
            element = SCREEN_ELEMENT;
            break;
        case ACTION_ELEMENT_GUID:
            element = ACTION_ELEMENT;
            break;
        case ROOT_ELEMENT_GUID:
            element = ROOT_ELEMENT;
            break;
        case START_ELEMENT_GUID:
            element = START_ELEMENT;
            break;
        case END_ELEMENT_GUID:
            element = END_ELEMENT;
            break;
        case BRANCH_ELEMENT_GUID:
            element = BRANCH_ELEMENT;
            break;
        case LOOP_ELEMENT_GUID:
            element = LOOP_ELEMENT;
            break;
        case GOTO_TARGET_GUID:
            element = GOTO_TARGET_ELEMENT;
            break;
        case GOTO_SOURCE_GUID:
            element = GOTO_SOURCE_ELEMENT;
            break;
        default:
            element = null;
    }

    return element != null ? deepCopy(element) : null;
}

const elementsMetadata = {
    [NodeType.ROOT]: {
        type: NodeType.ROOT,
        icon: 'standard:default'
    },
    [NodeType.START]: {
        type: NodeType.START,
        icon: 'standard:default'
    },
    [NodeType.BRANCH]: {
        type: NodeType.BRANCH,
        icon: 'standard:default'
    },
    [NodeType.LOOP]: {
        type: NodeType.LOOP,
        icon: 'standard:default'
    },
    END_ELEMENT: {
        type: NodeType.END,
        icon: 'standard:default'
    },
    [SCREEN_ELEMENT_TYPE]: {
        type: NodeType.DEFAULT,
        icon: 'standard:default'
    },
    [ACTION_ELEMENT_TYPE]: {
        type: NodeType.DEFAULT,
        icon: 'standard:default'
    },
    emailSimple: {
        type: NodeType.DEFAULT,
        icon: 'standard:default',
        label: 'Send Email'
    },
    emailAlert: {
        type: NodeType.DEFAULT,
        icon: 'standard:default',
        label: 'Email Alert'
    }
};

function deepCopy(element) {
    return JSON.parse(JSON.stringify(element));
}

function createDefaultElement(guid) {
    return createElementWithElementType(guid, NodeType.DEFAULT, NodeType.DEFAULT);
}

function createElementWithElementType(guid, elementType, nodeType) {
    return {
        guid,
        elementType,
        label: 'default',
        nodeType,
        config: {}
    };
}

function flowModelFromElements(elements) {
    return elements.reduce((acc, current) => {
        acc[current.guid] = current;
        return acc;
    }, {});
}

function createFlowRenderContext(custom) {
    const defaultFlowRenderContext = {
        interactionState: { menuInfo: {}, deletionPathInfo: {} },
        elementsMetadata,
        layoutConfig,
        progress: 1,
        nodeLayoutMap: {},
        isDeletingBranch: false,
        dynamicNodeDimensionMap: new Map()
    };

    return { ...defaultFlowRenderContext, ...custom };
}

function linkElements(elements) {
    let prevElement = null;

    return elements.map((element) => {
        const updatedElement = { ...element };
        if (prevElement) {
            prevElement.next = updatedElement.guid;
            updatedElement.prev = prevElement.guid;
        }
        prevElement = updatedElement;
        return updatedElement;
    });
}

function createFlow(rootBranchElements, addStartAndEnd = true) {
    const elementsMap = {};
    const rootElement = { ...ROOT_ELEMENT };
    elementsMap[rootElement.guid] = rootElement;
    rootBranchElements = addStartAndEnd
        ? [START_ELEMENT_GUID, ...rootBranchElements, END_ELEMENT_GUID]
        : rootBranchElements;
    createBranch(rootBranchElements, rootElement, 0, elementsMap, '');

    return elementsMap;
}

function createBranch(
    branch,
    parentElement = getElementByType(NodeType.ROOT),
    childIndex = 0,
    elementsMap = {},
    prefix
) {
    let prevElement = null;
    let nextElement = null;

    let hasEnd = false;
    let branchHead;

    branch.forEach((elementInfo) => {
        if (!hasEnd) {
            nextElement = createElement(elementInfo, elementsMap, prefix);
            if (prevElement == null) {
                nextElement.parent = parentElement.guid;
                nextElement.childIndex = childIndex;
                branchHead = nextElement;
                parentElement.children[childIndex] = branchHead.guid;
            } else {
                nextElement.prev = prevElement.guid;
                prevElement.next = nextElement.guid;
            }

            if (
                hasGoToOnNext(elementsMap, nextElement.guid) ||
                nextElement.nodeType === NodeType.END ||
                (isBranchingElement(nextElement) && areAllBranchesTerminals(nextElement, elementsMap))
            ) {
                hasEnd = true;
            }
            prevElement = nextElement;
        }
    });

    branchHead.isTerminal = hasEnd;

    return branchHead;
}

function createElement(elementInfo, elementsMap = {}, prefix) {
    let element;
    if (typeof elementInfo === 'string') {
        element = deepCopy(getElementByType(elementInfo)) || { guid: elementInfo, isCanvasElement: true };
        element.guid = `${prefix}${element.guid}`;
    } else {
        element = deepCopy(elementInfo);
        element.guid = `${prefix}${element.guid}`;

        if (elementInfo.children != null) {
            elementInfo.children.map((childBranch, i) => {
                if (childBranch == null) {
                    return null;
                }
                return createBranch(childBranch, element, i, elementsMap, `${prefix}${element.guid}:${i}-`);
            });
        }
    }

    elementsMap[element.guid] = element;

    return element;
}

function linkBranchOrFault(branchElement, headElement, childIndex) {
    branchElement.children[childIndex] = headElement.guid;
    return { ...headElement, parent: branchElement.guid, childIndex };
}

function getEmptyFlowContext() {
    const flowModel = createFlow([]);
    return createFlowRenderContext({ flowModel });
}

function getSimpleFlowContext() {
    const flowModel = createFlow([SCREEN_ELEMENT_GUID]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithEmptyDecisionContext() {
    const flowModel = createFlow([BRANCH_ELEMENT_GUID]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithEmptyLoopContext() {
    const flowModel = createFlow([LOOP_ELEMENT_GUID]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithHighlightedLoopBranches() {
    const loopElement = {
        ...LOOP_ELEMENT,
        config: {
            highlightInfo: { highlightNext: true, highlightLoopBack: true, branchIndexesToHighlight: [FOR_EACH_INDEX] }
        }
    };

    const flowModel = createFlow([loopElement]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithHighlightedFaultBranch() {
    let faultBranchHeadElement = createElementWithElementType(
        'fault-branch-head-guid-one',
        'END_ELEMENT',
        NodeType.END
    );
    const actionElement = {
        ...ACTION_ELEMENT,
        guid: 'action-element-one',
        fault: faultBranchHeadElement.guid,
        config: { highlightInfo: { branchIndexesToHighlight: [FAULT_INDEX] } }
    };
    faultBranchHeadElement = {
        ...faultBranchHeadElement,
        parent: actionElement.guid,
        childIndex: -1
    };
    const elements = linkElements([START_ELEMENT, actionElement, END_ELEMENT]);
    elements.push(faultBranchHeadElement);

    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithEmptyDeciisionWith3BranchesContext() {
    const branchElement = { ...BRANCH_ELEMENT, children: [null, null, null] };

    const flowModel = createFlow([branchElement]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithDecisionWithEndedLeftBranchContext() {
    const leftBranchHead = createElementWithElementType('branch-left-head-guid', 'END_ELEMENT', NodeType.END);
    return getFlowWithDecisionWithOneElementOnLeftBranchContext(leftBranchHead);
}

function getFlowWithScheduledPathsContext() {
    const flowModel = getFlowWithNonTerminalImmediateBranch();
    const interactionState = {
        menuInfo: {
            key: 'start-guid',
            type: 0,

            geometry: {
                w: 300,
                h: 221,
                x: 0,
                y: 0
            }
        }
    };
    return createFlowRenderContext({ flowModel, interactionState });
}

function getFlowWithOnlyImmediateScheduledPathContext(parentNodeMenuOpened = false) {
    const flowModel = getFlowWithOnlyImmediateBranch();
    if (parentNodeMenuOpened) {
        const interactionState = {
            menuInfo: {
                key: 'start-guid',
                type: 0,

                geometry: {
                    w: 300,
                    h: 221,
                    x: 0,
                    y: 0
                }
            }
        };
        return createFlowRenderContext({ flowModel, interactionState });
    }
    return createFlowRenderContext({ flowModel });
}

function getFlowWithDecisionWithOneElementOnLeftBranchContext(leftBranchHead) {
    leftBranchHead = leftBranchHead || createDefaultElement('branch-left-head-guid');
    const branchElement = { ...BRANCH_ELEMENT, children: [null, null] };
    leftBranchHead = linkBranchOrFault(branchElement, leftBranchHead, 0);
    const elements = linkElements([START_ELEMENT, branchElement, END_ELEMENT]);
    elements.push(leftBranchHead);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    const interactionState = {
        menuInfo: {},
        deletionPathInfo: {
            childIndexToKeep: 1,
            elementGuidToDelete: BRANCH_ELEMENT_GUID,
            shouldDeleteBeyondMergingPoint: false,
            operationType: 'delete'
        }
    };
    return createFlowRenderContext({ flowModel, interactionState });
}

function getFlowWithHighlightedDecisionBranch() {
    const branchElement = {
        ...BRANCH_ELEMENT,
        config: { highlightInfo: { branchIndexesToHighlight: [1] } }
    };

    const flowModel = createFlow([branchElement]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithHighlightedAndMergedDecisionBranch() {
    const branchElement = {
        ...BRANCH_ELEMENT,
        config: {
            highlightInfo: { branchIndexesToHighlight: [1], mergeBranchIndexesToHighlight: [1], highlightNext: true }
        }
    };

    const flowModel = createFlow([branchElement]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithNonTerminalImmediateBranch() {
    const flow = createFlow([
        { ...SCREEN_ELEMENT, guid: 'screen1-guid' },
        { ...SCREEN_ELEMENT, guid: 'screen2-guid' }
    ]);
    flow[START_ELEMENT_GUID].childReferences = [
        {
            childReference: 'scheduledPath1'
        }
    ];
    flow[START_ELEMENT_GUID].children = ['screen1-guid', null];
    flow[START_ELEMENT_GUID].next = 'screen2-guid';
    flow[START_ELEMENT_GUID].shouldSupportScheduledPaths = true;
    flow['screen2-guid'].prev = START_ELEMENT_GUID;
    flow['screen2-guid'].next = END_ELEMENT_GUID;
    flow[END_ELEMENT_GUID].prev = 'screen2-guid';
    flow['screen1-guid'].parent = START_ELEMENT_GUID;
    flow['screen1-guid'].prev = null;
    flow['screen1-guid'].isTerminal = false;
    flow['screen1-guid'].childIndex = 0;
    flow['screen1-guid'].next = null;

    return flow;
}

function getFlowWithOnlyImmediateBranch() {
    const flow = createFlow([{ ...SCREEN_ELEMENT, guid: 'screen1-guid' }]);
    flow[START_ELEMENT_GUID].childReferences = [];
    flow[START_ELEMENT_GUID].availableConnections = [
        {
            type: 'IMMEDIATE'
        }
    ];
    flow[START_ELEMENT_GUID].next = 'screen1-guid';
    flow[START_ELEMENT_GUID].shouldSupportScheduledPaths = true;
    flow['screen1-guid'].prev = START_ELEMENT_GUID;
    flow['screen1-guid'].next = END_ELEMENT_GUID;
    flow[END_ELEMENT_GUID].prev = 'screen1-guid';

    return flow;
}

function getFlowWithTerminalImmediateBranch() {
    // create elements
    const start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    start.children = ['screen1-guid', null, null];
    start.childReferences = [
        {
            childReference: 'scheduledPath1'
        },
        {
            childReference: 'scheduledPath2'
        }
    ];
    start.shouldSupportScheduledPaths = true;
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    screen1.isTerminal = true;
    screen1 = linkBranchOrFault(start, screen1, 0);
    const screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    const end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    const end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);
    start.next = 'screen2-guid';
    screen2.prev = START_ELEMENT_GUID;
    screen2.next = 'end2-guid';
    end2.prev = 'screen2-guid';
    screen1.prev = null;
    screen1.next = 'end1-guid';
    end1.prev = 'screen1-guid';
    const elements = [start, screen1, screen2, end1, end2];

    // create flowModel
    const flow = flowModelFromElements(elements);
    return flow;
}

function getFlowWithBranchNodeInImmediateBranch() {
    // create elements
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    const outcome1 = createElementWithElementType('outcome1-guid', 'OUTCOME', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    const end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);

    // configure node properties and make connections
    start = {
        ...start,
        childReferences: [
            {
                childReference: 'scheduledPath1'
            },
            {
                childReference: 'scheduledPath2'
            }
        ],
        children: ['screen1-guid', null, null],
        next: 'screen2-guid',
        shouldSupportScheduledPaths: true
    };

    screen1 = {
        ...screen1,
        next: 'decision1-guid',
        prev: null,
        parent: 'start-guid',
        isTerminal: false,
        childIndex: 0
    };

    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'outcome1-guid' }],
        availableConnections: [
            {
                childReference: 'outcome1-guid',
                type: 'REGULAR'
            },
            {
                type: 'DEFAULT'
            }
        ],
        children: ['end1-guid', null],
        prev: 'screen1-guid',
        next: null
    };

    screen2 = {
        ...screen2,
        prev: 'start-guid',
        next: 'end2-guid'
    };

    end1 = {
        ...end1,
        parent: 'decision1-guid',
        childIndex: 0,
        prev: null,
        isTerminal: true
    };

    end2.prev = 'screen2-guid';

    // create flowModel
    const elements = [start, screen1, screen2, decision1, outcome1, end1, end2];
    return flowModelFromElements(elements);
}

function getFlowWithTwoFaults() {
    let faultBranchHeadElementOne = createElementWithElementType(
        'fault-branch-head-guid-one',
        'END_ELEMENT',
        NodeType.END
    );
    const actionElementOne = {
        ...ACTION_ELEMENT,
        guid: 'action-element-one',
        fault: faultBranchHeadElementOne.guid
    };
    faultBranchHeadElementOne = {
        ...faultBranchHeadElementOne,
        parent: actionElementOne.guid,
        childIndex: -1
    };
    let faultBranchHeadElementTwo = createElementWithElementType(
        'fault-branch-head-guid-two',
        'END_ELEMENT',
        NodeType.END
    );
    const actionElementTwo = {
        ...ACTION_ELEMENT,
        guid: 'action-element-two',
        fault: faultBranchHeadElementTwo.guid
    };
    faultBranchHeadElementTwo = {
        ...faultBranchHeadElementTwo,
        parent: actionElementTwo.guid,
        childIndex: -1
    };
    const elements = linkElements([START_ELEMENT, actionElementOne, actionElementTwo, END_ELEMENT]);
    elements.push(faultBranchHeadElementOne, faultBranchHeadElementTwo);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    const interactionState = {
        menuInfo: {
            key: 'action-element-one',
            type: 0,

            geometry: {
                w: 300,
                h: 221,
                x: 0,
                y: 0
            }
        }
    };
    return createFlowRenderContext({ flowModel, interactionState });
}

function getComplicatedFlow() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen3 = createElementWithElementType('screen3-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision3 = createElementWithElementType('decision3-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision4 = createElementWithElementType('decision4-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    const outcome1 = createElementWithElementType('outcome1-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome2 = createElementWithElementType('outcome2-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome3 = createElementWithElementType('outcome3-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome4 = createElementWithElementType('outcome4-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome5 = createElementWithElementType('outcome5-guid', 'OUTCOME', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);
    let end3 = createElementWithElementType('end3-guid', 'END_ELEMENT', NodeType.END);
    let end4 = createElementWithElementType('end4-guid', 'END_ELEMENT', NodeType.END);
    let end5 = createElementWithElementType('end5-guid', 'END_ELEMENT', NodeType.END);
    let end6 = createElementWithElementType('end6-guid', 'END_ELEMENT', NodeType.END);
    const actionElement = {
        ...ACTION_ELEMENT,
        guid: 'action1-guid',
        fault: 'screen3-guid',
        childIndex: 1,
        next: 'end5-guid',
        prev: null,
        parent: 'decision4-guid'
    };
    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        next: 'decision1-guid',
        parent: 'root'
    };
    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'outcome1-guid' }, { childReference: 'outcome2-guid' }],
        children: ['decision2-guid', null, null],
        prev: 'start-guid',
        next: 'screen1-guid'
    };
    decision2 = {
        ...decision2,
        childIndex: 0,
        childReferences: [{ childReference: 'outcome3-guid' }],
        children: ['end1-guid', 'end2-guid'],
        prev: null,
        next: null,
        isTerminal: true,
        parent: 'decision1-guid'
    };
    decision3 = {
        ...decision3,
        childReferences: [{ childReference: 'outcome4-guid' }],
        children: ['decision4-guid', 'action1-guid'],
        prev: 'screen1-guid',
        next: null
    };
    decision4 = {
        ...decision4,
        childIndex: 0,
        childReferences: [{ childReference: 'outcome5-guid' }],
        children: ['screen2-guid', 'end3-guid'],
        prev: null,
        next: null,
        isTerminal: true,
        parent: 'decision3-guid'
    };
    screen1 = {
        ...screen1,
        next: 'decision3-guid',
        prev: 'decision1-guid'
    };
    screen2 = {
        ...screen2,
        next: 'end4-guid',
        prev: 'decision1-guid',
        isTerminal: true,
        parent: 'decision4-guid'
    };
    screen3 = {
        ...screen3,
        next: 'end6-guid',
        prev: null,
        isTerminal: true,
        childIndex: -1,
        parent: 'action1-guid'
    };
    end1 = { ...end1, parent: 'decision2-guid' };
    end2 = { ...end2, parent: 'decision2-guid' };
    end3 = { ...end3, parent: 'decision4-guid' };
    end4 = { ...end4, prev: 'screen2-guid' };
    end5 = { ...end5, prev: 'action1-guid' };
    end6 = { ...end6, prev: 'screen3-guid' };

    const interactionState = {
        menuInfo: {},
        deletionPathInfo: {
            childIndexToKeep: 0,
            elementGuidToDelete: 'decision1-guid',
            shouldDeleteBeyondMergingPoint: true,
            operationType: 'delete'
        }
    };
    const elements = [
        root,
        start,
        decision1,
        decision2,
        decision3,
        decision4,
        screen1,
        screen2,
        screen3,
        actionElement,
        outcome1,
        outcome2,
        outcome3,
        outcome4,
        outcome5,
        end1,
        end2,
        end3,
        end4,
        end5,
        end6
    ];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel, interactionState });
}

function getFlowWithNestedDescisionWhichEndsWithAScreen() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    const outcome1 = createElementWithElementType('outcome1-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome2 = createElementWithElementType('outcome2-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome3 = createElementWithElementType('outcome3-guid', 'OUTCOME', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);
    let end3 = createElementWithElementType('end3-guid', 'END_ELEMENT', NodeType.END);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        next: 'decision1-guid',
        parent: 'root'
    };
    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'outcome1-guid' }],
        children: ['decision2-guid', 'end3-guid'],
        prev: 'start-guid',
        next: null
    };
    decision2 = {
        ...decision2,
        childIndex: 0,
        childReferences: [{ childReference: 'outcome3-guid' }, { childReference: 'outcome4-guid' }],
        children: ['end1-guid', null, null],
        prev: null,
        next: 'screen1-guid',
        parent: 'decision1-guid',
        isTerminal: true
    };
    screen1 = {
        ...screen1,
        next: 'end2-guid',
        prev: 'decision2-guid'
    };

    end1 = { ...end1, parent: 'decision2-guid', childIndex: 0, isTerminal: true };
    end2 = { ...end2, prev: 'screen1-guid' };
    end3 = { ...end3, parent: 'decision1-guid', childIndex: 1, isTerminal: true };

    const interactionState = {
        menuInfo: {},
        deletionPathInfo: {
            childIndexToKeep: 0,
            elementGuidToDelete: 'decision2-guid',
            shouldDeleteBeyondMergingPoint: true,
            operationType: 'cut'
        }
    };
    const elements = [root, start, decision1, decision2, screen1, outcome1, outcome2, outcome3, end1, end2, end3];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel, interactionState });
}

function getFlowWith3levelNestedDescisionWhichEndsWithAScreen() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen3 = createElementWithElementType('screen3-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision3 = createElementWithElementType('decision3-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    const outcome1 = createElementWithElementType('outcome1-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome2 = createElementWithElementType('outcome2-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome3 = createElementWithElementType('outcome3-guid', 'OUTCOME', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        next: 'decision1-guid',
        parent: 'root'
    };
    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'outcome1-guid' }],
        children: ['decision2-guid', null],
        prev: 'start-guid',
        next: 'end2-guid'
    };
    decision2 = {
        ...decision2,
        childIndex: 0,
        childReferences: [{ childReference: 'outcome2-guid' }, { childReference: 'outcome3-guid' }],
        children: ['end1-guid', null, null],
        prev: null,
        next: 'screen1-guid',
        parent: 'decision1-guid',
        isTerminal: false
    };
    screen1 = {
        ...screen1,
        next: 'decision3-guid',
        prev: 'decision2-guid'
    };
    decision3 = {
        ...decision3,
        childReferences: [{ childReference: 'outcome4-guid' }],
        children: ['screen2-guid', null],
        prev: 'screen1-guid',
        next: null
    };
    screen2 = {
        ...screen2,
        next: 'screen3-guid',
        parent: 'decision3-guid',
        prev: null,
        childIndex: 0,
        isTerminal: false
    };

    screen3 = {
        ...screen3,
        next: null,
        prev: 'screen2-guid'
    };

    end1 = { ...end1, parent: 'decision2-guid', childIndex: 0, isTerminal: true };
    end2 = { ...end2, prev: 'decision1-guid', next: null };

    const interactionState = {
        menuInfo: {},
        deletionPathInfo: {
            childIndexToKeep: 0,
            elementGuidToDelete: 'decision2-guid',
            shouldDeleteBeyondMergingPoint: true,
            operationType: 'cut'
        }
    };
    const elements = [
        root,
        start,
        decision1,
        decision2,
        decision3,
        screen1,
        screen2,
        screen3,
        outcome1,
        outcome2,
        outcome3,
        end1,
        end2
    ];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel, interactionState });
}

function getFlowForCutPaste() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen3 = createElementWithElementType('screen3-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen4 = createElementWithElementType('screen4-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    const outcome1 = createElementWithElementType('outcome1-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome2 = createElementWithElementType('outcome2-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome3 = createElementWithElementType('outcome3-guid', 'OUTCOME', NodeType.DEFAULT);
    const outcome4 = createElementWithElementType('outcome4-guid', 'OUTCOME', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        next: 'decision1-guid',
        parent: 'root',
        isTerminal: true,
        childIndex: 0
    };

    screen1 = {
        ...screen1,
        next: 'decision1-guid',
        prev: 'start-guid'
    };

    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'outcome1-guid' }, { childReference: 'outcome2-guid' }],
        children: ['decision2-guid', null, 'screen2-guid'],
        prev: 'screen1-guid',
        next: 'screen4-guid'
    };

    decision2 = {
        ...decision2,
        childIndex: 0,
        childReferences: [{ childReference: 'outcome3-guid' }, { childReference: 'outcome4-guid' }],
        children: ['end1-guid', null, null],
        prev: null,
        next: 'screen3-guid',
        parent: 'decision1-guid',
        isTerminal: false
    };

    screen2 = {
        ...screen2,
        childIndex: 2,
        isTerminal: false,
        parent: 'decision1-guid',
        next: null,
        prev: null
    };

    screen3 = {
        ...screen3,
        next: null,
        prev: 'decision2-guid'
    };

    screen4 = {
        ...screen4,
        next: 'end2-guid',
        prev: 'decision1-guid'
    };

    end1 = { ...end1, parent: 'decision2-guid', childIndex: 0, isTerminal: true };
    end2 = { ...end2, prev: 'screen4-guid', next: null };

    const interactionState = {
        menuInfo: {},
        deletionPathInfo: {
            childIndexToKeep: 0,
            elementGuidToDelete: 'decision2-guid',
            shouldDeleteBeyondMergingPoint: true,
            operationType: 'cut'
        }
    };
    const elements = [
        root,
        start,
        decision1,
        decision2,
        screen1,
        screen2,
        screen3,
        screen4,
        outcome1,
        outcome2,
        outcome3,
        outcome4,
        end1,
        end2
    ];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel, interactionState });
}

function getFlowWithDynamicNodeComponent() {
    const flowModel = createFlow([SCREEN_ELEMENT_GUID]);
    const context = createFlowRenderContext({ flowModel });

    context.dynamicNodeDimensionMap = new Map();

    context.dynamicNodeDimensionMap.set(SCREEN_ELEMENT_GUID, {
        w: 100,
        h: 200
    });

    return context;
}

function getFlowWhenGoingToPreviousElement(isNodeMenuOpen, isConnectorMenuOpen) {
    const flowModel = createFlow([GOTO_TARGET_GUID, GOTO_SOURCE_GUID]);
    delete flowModel[END_ELEMENT_GUID];
    flowModel[GOTO_TARGET_GUID].incomingGoTo = [GOTO_SOURCE_GUID];
    flowModel[GOTO_SOURCE_GUID].next = GOTO_TARGET_GUID;
    if (isNodeMenuOpen) {
        const interactionState = {
            menuInfo: {
                key: GOTO_SOURCE_GUID,
                type: 0,

                geometry: {
                    w: 300,
                    h: 221,
                    x: 0,
                    y: 0
                }
            }
        };
        return createFlowRenderContext({ flowModel, interactionState });
    }

    if (isConnectorMenuOpen) {
        const interactionState = {
            menuInfo: {
                key: GOTO_SOURCE_GUID,
                type: 1,

                geometry: {
                    w: 300,
                    h: 221,
                    x: 0,
                    y: 0
                }
            }
        };
        return createFlowRenderContext({ flowModel, interactionState });
    }

    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromParentFirstBranchToPreviousElement(
    isNodeMenuOpen,
    isConnectorMenuOpen,
    isBranchConnectorMenuOpen
) {
    const branchElement = { ...BRANCH_ELEMENT, children: [SCREEN_ELEMENT_GUID, null, null] };
    branchElement.childReferences = [
        {
            childReference: 'o1'
        },
        {
            childReference: 'o2'
        }
    ];

    const elements = linkElements([START_ELEMENT, SCREEN_ELEMENT, branchElement, END_ELEMENT]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    flowModel[SCREEN_ELEMENT_GUID].incomingGoTo = [
        `${branchElement.guid}:${branchElement.childReferences[0].childReference}`
    ];

    if (isNodeMenuOpen) {
        const interactionState = {
            menuInfo: {
                key: BRANCH_ELEMENT_GUID,
                type: 0,

                geometry: {
                    w: 300,
                    h: 221,
                    x: 0,
                    y: 0
                }
            }
        };
        return createFlowRenderContext({ flowModel, interactionState });
    }

    if (isConnectorMenuOpen) {
        const interactionState = {
            menuInfo: {
                key: BRANCH_ELEMENT_GUID,
                type: 1,

                geometry: {
                    w: 300,
                    h: 221,
                    x: 0,
                    y: 0
                }
            }
        };
        return createFlowRenderContext({ flowModel, interactionState });
    }

    if (isBranchConnectorMenuOpen) {
        const interactionState = {
            menuInfo: {
                key: `${BRANCH_ELEMENT_GUID}:0`,
                type: 1,

                geometry: {
                    w: 300,
                    h: 221,
                    x: 0,
                    y: 0
                }
            }
        };
        return createFlowRenderContext({ flowModel, interactionState });
    }

    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromParentDefaultBranchToPreviousElement() {
    const branchElement = { ...BRANCH_ELEMENT, children: [null, null, SCREEN_ELEMENT_GUID] };
    branchElement.childReferences = [
        {
            childReference: 'o1'
        },
        {
            childReference: 'o2'
        }
    ];

    const elements = linkElements([START_ELEMENT, SCREEN_ELEMENT, branchElement, END_ELEMENT]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    flowModel[SCREEN_ELEMENT_GUID].incomingGoTo = [`${branchElement.guid}:default`];
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromParentFaultBranchToPreviousElement() {
    const branchElement = { ...BRANCH_ELEMENT, children: [null, null, null], fault: SCREEN_ELEMENT_GUID };
    branchElement.childReferences = [
        {
            childReference: 'pauseConfig1'
        },
        {
            childReference: 'pauseConfig2'
        }
    ];

    const elements = linkElements([START_ELEMENT, SCREEN_ELEMENT, branchElement, END_ELEMENT]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    flowModel[SCREEN_ELEMENT_GUID].incomingGoTo = [`${branchElement.guid}:fault`];
    return createFlowRenderContext({ flowModel });
}

function getFlowWithGoToOnTheNestedBranchElement() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        parent: 'root',
        childIndex: 0,
        next: 'decision1-guid'
    };
    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'outcome1-guid' }],
        children: [null, 'decision2-guid'],
        prev: 'start-guid',
        next: 'end1-guid',
        incomingGoTo: ['decision2-guid:outcome2-guid']
    };
    decision2 = {
        ...decision2,
        childIndex: 1,
        parent: 'decision1-guid',
        childReferences: [{ childReference: 'outcome2-guid' }],
        children: ['decision1-guid', null],
        prev: null,
        next: null,
        isTerminal: false
    };
    end1 = { ...end1, prev: 'decision1-guid' };

    const elements = [root, start, decision1, decision2, end1];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithGoToOnTheMergePoint() {
    const branchElement = { ...BRANCH_ELEMENT, children: [SCREEN_ELEMENT_GUID, null, null, null] };
    branchElement.childReferences = [
        {
            childReference: 'o1'
        },
        {
            childReference: 'o2'
        },
        {
            childReference: 'o3'
        }
    ];

    const elements = linkElements([START_ELEMENT, SCREEN_ELEMENT, branchElement]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    flowModel[END_ELEMENT_GUID] = END_ELEMENT;
    flowModel[END_ELEMENT_GUID] = { ...END_ELEMENT, parent: BRANCH_ELEMENT_GUID, childIndex: 3, isTerminal: true };
    flowModel[BRANCH_ELEMENT_GUID].children = [SCREEN_ELEMENT_GUID, null, null, END_ELEMENT_GUID];
    flowModel[BRANCH_ELEMENT_GUID].next = SCREEN_ELEMENT_GUID;
    flowModel[SCREEN_ELEMENT_GUID].incomingGoTo = [
        `${branchElement.guid}:${branchElement.childReferences[0].childReference}`,
        branchElement.guid
    ];
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromMergePointToParent() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        parent: 'root',
        childIndex: 0,
        next: 'decision1-guid'
    };
    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'o1' }],
        children: ['screen1-guid', 'screen2-guid'],
        prev: 'start-guid',
        next: 'decision1-guid',
        incomingGoTo: ['decision1-guid']
    };
    screen1 = {
        ...screen1,
        parent: 'decision1-guid',
        childIndex: 0,
        next: null,
        isTerminal: false
    };
    screen2 = {
        ...screen2,
        parent: 'decision1-guid',
        childIndex: 1,
        next: null,
        isTerminal: false
    };

    const elements = [root, start, decision1, screen1, screen2];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithGoToFromAncestorToNestedElement() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        parent: 'root',
        childIndex: 0,
        next: 'decision1-guid'
    };
    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'o1' }],
        children: ['decision2-guid', null],
        prev: 'start-guid',
        next: 'decision2-guid'
    };
    decision2 = {
        ...decision2,
        childReferences: [{ childReference: 'o2' }],
        children: ['screen1-guid', 'screen2-guid'],
        parent: 'decision1-guid',
        childIndex: 0,
        next: null,
        isTerminal: false,
        incomingGoTo: ['decision1-guid']
    };
    screen1 = {
        ...screen1,
        parent: 'decision2-guid',
        childIndex: 0,
        next: null,
        isTerminal: false
    };
    screen2 = {
        ...screen2,
        parent: 'decision2-guid',
        childIndex: 1,
        next: null,
        isTerminal: false
    };

    const elements = [root, start, decision1, decision2, screen1, screen2];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromSiblingBranch() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [],
        parent: 'root',
        childIndex: 0,
        next: 'decision1-guid'
    };
    decision1 = {
        ...decision1,
        childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }],
        children: ['screen1-guid', 'end2-guid', 'screen1-guid'],
        prev: 'start-guid',
        next: null,
        incomingGoTo: []
    };
    screen1 = {
        ...screen1,
        parent: 'decision1-guid',
        childIndex: 0,
        next: 'end1-guid',
        isTerminal: true,
        incomingGoTo: ['decision1-guid:default']
    };
    end1 = {
        ...end1,
        prev: 'screen1-guid',
        next: null
    };
    end2 = {
        ...end2,
        prev: null,
        next: null,
        parent: 'decision1-guid',
        childIndex: 1,
        isTerminal: true
    };

    const elements = [root, start, decision1, screen1, end1, end2];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromImmediateToScheduledPathBranch() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [
            {
                childReference: 't1'
            },
            {
                childReference: 't2'
            }
        ],
        children: ['screen1-guid', 'end1-guid', 'screen1-guid'],
        parent: 'root',
        childIndex: 0,
        next: null,
        shouldSupportScheduledPaths: true
    };
    screen1 = {
        ...screen1,
        parent: 'start-guid',
        childIndex: 2,
        next: 'end2-guid',
        isTerminal: true,
        incomingGoTo: ['start-guid:immediate']
    };
    end1 = {
        ...end1,
        parent: 'start-guid',
        childIndex: 1,
        next: null,
        isTerminal: true
    };
    end2 = {
        ...end2,
        prev: 'screen1-guid',
        next: null
    };

    const elements = [root, start, screen1, end1, end2];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromScheduledPathToImmediateBranch() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [
            {
                childReference: 't1'
            },
            {
                childReference: 't2'
            }
        ],
        children: ['screen1-guid', null, 'screen1-guid'],
        parent: 'root',
        childIndex: 0,
        next: 'end1-guid',
        shouldSupportScheduledPaths: true
    };
    screen1 = {
        ...screen1,
        parent: 'start-guid',
        childIndex: 0,
        next: 'screen2-guid',
        isTerminal: false,
        incomingGoTo: ['start-guid:t2']
    };
    screen2 = {
        ...screen2,
        prev: 'screen1-guid',
        next: null
    };
    end1 = {
        ...end1,
        prev: 'start-guid',
        next: null
    };

    const elements = [root, start, screen1, screen2, end1];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithGoToOnImmediateBranchHead() {
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen1 = createElementWithElementType('screen1-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen2 = createElementWithElementType('screen2-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let screen3 = createElementWithElementType('screen3-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);

    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    start = {
        ...start,
        childReferences: [
            {
                childReference: 't1'
            },
            {
                childReference: 't2'
            }
        ],
        children: ['screen3-guid', null, 'screen1-guid'],
        parent: 'root',
        childIndex: 0,
        next: 'screen2-guid',
        shouldSupportScheduledPaths: true
    };
    screen1 = {
        ...screen1,
        parent: 'start-guid',
        childIndex: 2,
        next: null,
        isTerminal: false,
        incomingGoTo: ['screen3-guid']
    };
    screen2 = {
        ...screen2,
        prev: 'start-guid',
        next: 'screen3-guid',
        incomingGoTo: []
    };
    screen3 = {
        ...screen3,
        prev: 'screen2-guid',
        next: 'screen1-guid',
        incomingGoTo: ['start-guid:immediate']
    };

    const elements = [root, start, screen1, screen2, screen3];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingToLoopBranchHead() {
    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let loop = createElementWithElementType(LOOP_ELEMENT_GUID, 'LOOP_ELEMENT', NodeType.LOOP);
    let screen = createElementWithElementType('screen-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);

    start = {
        ...start,
        parent: 'root',
        childIndex: 0,
        next: 'loop-guid'
    };

    loop = {
        ...loop,
        prev: 'start-guid',
        next: 'screen-guid',
        children: ['screen-guid']
    };

    screen = {
        ...screen,
        parent: 'loop-guid',
        childIndex: FOR_EACH_INDEX,
        next: null,
        incomingGoTo: ['loop-guid']
    };

    const elements = [root, start, loop, screen];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenMergingToAncestorBranch() {
    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };

    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen = createElementWithElementType('screen-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);
    let end3 = createElementWithElementType('end3-guid', 'END_ELEMENT', NodeType.END);

    start = {
        ...start,
        parent: 'root',
        childIndex: 0,
        next: 'screen-guid'
    };

    decision1 = {
        ...decision1,
        prev: 'start-guid',
        next: null,
        children: ['decision2-guid', 'screen-guid'],
        childReferences: [{ childReference: 'o1' }]
    };

    decision2 = {
        ...decision2,
        parent: 'decision1-guid',
        next: null,
        children: ['end1-guid', 'end2-guid'],
        childReferences: [{ childReference: 'o2' }],
        isTerminal: true,
        childIndex: 0
    };

    end1 = {
        ...end1,
        parent: 'decision2-guid',
        childIndex: 0,
        next: null,
        isTerminal: true
    };

    end2 = {
        ...end2,
        parent: 'decision2-guid',
        childIndex: 1,
        next: null,
        isTerminal: true
    };

    screen = {
        ...screen,
        parent: 'decision1-guid',
        next: 'end3-guid',
        isCanvasElement: true,
        childIndex: 1,
        isTerminal: true
    };

    end3 = {
        ...end3,
        prev: 'screen-guid',
        next: null
    };

    const elements = [root, start, screen, decision1, decision2, end1, end2, end3];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithGoToOnFirstMergeableNonNullNext() {
    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen = createElementWithElementType('screen-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let decision1 = createElementWithElementType('decision1-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision2 = createElementWithElementType('decision2-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let decision3 = createElementWithElementType('decision3-guid', 'BRANCH_ELEMENT', NodeType.BRANCH);
    let end1 = createElementWithElementType('end1-guid', 'END_ELEMENT', NodeType.END);
    let end2 = createElementWithElementType('end2-guid', 'END_ELEMENT', NodeType.END);

    start = {
        ...start,
        parent: 'root',
        childIndex: 0,
        next: 'screen-guid'
    };

    screen = {
        ...screen,
        prev: 'start-guid',
        next: 'decision1-guid',
        incomingGoTo: ['decision3-guid:o4', 'decision1-guid'],
        isCanvasElement: true
    };

    decision1 = {
        ...decision1,
        prev: 'screen-guid',
        next: 'screen-guid',
        children: ['decision2-guid', null, null],
        childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }]
    };

    decision2 = {
        ...decision2,
        next: null,
        children: ['decision3-guid', 'end1-guid'],
        parent: 'decision1-guid',
        childIndex: 0,
        isTerminal: true,
        childReferences: [{ childReference: 'o3' }]
    };

    decision3 = {
        ...decision3,
        next: null,
        children: ['screen-guid', 'end2-guid'],
        parent: 'decision2-guid',
        childIndex: 0,
        isTerminal: true,
        childReferences: [{ childReference: 'o4' }]
    };

    end1 = {
        ...end1,
        parent: 'decision2-guid',
        childIndex: 1,
        next: null,
        isTerminal: true
    };

    end2 = {
        ...end2,
        parent: 'decision3-guid',
        childIndex: 1,
        next: null,
        isTerminal: true
    };

    const elements = [root, start, screen, decision1, decision2, decision3, end1, end2];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWhenGoingFromForEachBranch() {
    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let screen = createElementWithElementType('screen-guid', 'SCREEN_ELEMENT', NodeType.DEFAULT);
    let loop = createElementWithElementType('loop-guid', 'LOOP_ELEMENT', NodeType.LOOP);
    let end = createElementWithElementType('end-guid', 'END_ELEMENT', NodeType.END);

    start = {
        ...start,
        parent: 'root',
        childIndex: 0,
        next: 'screen-guid'
    };

    screen = {
        ...screen,
        prev: 'start-guid',
        next: 'loop-guid',
        incomingGoTo: ['loop-guid:forEach'],
        isCanvasElement: true
    };

    loop = {
        ...loop,
        prev: 'screen-guid',
        next: 'end-guid',
        children: ['screen-guid']
    };

    end = {
        ...end,
        prev: 'loop-guid',
        next: null
    };

    const elements = [root, start, screen, loop, end];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithPalettePromotedActions() {
    const root = {
        ...ROOT_ELEMENT,
        children: ['start-guid']
    };
    let start = createElementWithElementType('start-guid', 'START_ELEMENT', NodeType.START);
    let simpleAction = createElementWithElementType('simple-action-guid', 'ActionCall', NodeType.DEFAULT);
    let emailSimple = createElementWithElementType('email-simple-guid', 'ActionCall', NodeType.DEFAULT);
    let emailAlert = createElementWithElementType('email-alert-guid', 'ActionCall', NodeType.DEFAULT);
    let end = createElementWithElementType('end-guid', 'END_ELEMENT', NodeType.END);

    start = {
        ...start,
        parent: 'root',
        childIndex: 0,
        next: 'simple-action-guid'
    };

    simpleAction = {
        ...simpleAction,
        prev: 'start-guid',
        next: 'email-simple-guid',
        actionType: 'addMember'
    };

    emailSimple = {
        ...emailSimple,
        prev: 'simple-action-guid',
        next: 'email-alert-guid',
        actionType: 'emailSimple'
    };

    emailAlert = {
        ...emailAlert,
        prev: 'email-simple-guid',
        next: 'end-guid',
        actionType: 'emailAlert'
    };

    end = {
        ...end,
        prev: 'email-alert-guid',
        next: null
    };

    const elements = [root, start, simpleAction, emailSimple, emailAlert, end];
    const flowModel = flowModelFromElements(elements);
    return createFlowRenderContext({ flowModel });
}

export {
    ACTION_ELEMENT_GUID,
    BRANCH_ELEMENT_GUID,
    END_ELEMENT_GUID,
    START_ELEMENT_GUID,
    ROOT_ELEMENT,
    START_ELEMENT,
    END_ELEMENT,
    SCREEN_ELEMENT,
    BRANCH_ELEMENT,
    SCREEN_ELEMENT_GUID,
    LOOP_ELEMENT_GUID,
    LOOP_ELEMENT,
    createDefaultElement,
    deepCopy,
    flowModelFromElements,
    createFlowRenderContext,
    linkElements,
    linkBranchOrFault,
    getEmptyFlowContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithDecisionWithOneElementOnLeftBranchContext,
    getFlowWithNonTerminalImmediateBranch,
    getFlowWithEmptyLoopContext,
    getSimpleFlowContext,
    getFlowWithDecisionWithEndedLeftBranchContext,
    getFlowWithTwoFaults,
    getFlowWithDynamicNodeComponent,
    getFlowWhenGoingToPreviousElement,
    getFlowWhenGoingFromParentFirstBranchToPreviousElement,
    getFlowWhenGoingFromParentDefaultBranchToPreviousElement,
    getFlowWhenGoingFromParentFaultBranchToPreviousElement,
    getFlowWithGoToOnTheNestedBranchElement,
    getFlowWithTerminalImmediateBranch,
    getFlowWithBranchNodeInImmediateBranch,
    getFlowWithScheduledPathsContext,
    getFlowWithOnlyImmediateScheduledPathContext,
    getFlowWithHighlightedLoopBranches,
    getFlowWithHighlightedDecisionBranch,
    getFlowWithHighlightedAndMergedDecisionBranch,
    getFlowWithHighlightedFaultBranch,
    getComplicatedFlow,
    getFlowWithNestedDescisionWhichEndsWithAScreen,
    createFlow,
    getFlowWithGoToOnTheMergePoint,
    getFlowWhenGoingFromMergePointToParent,
    getFlowWhenGoingFromSiblingBranch,
    getFlowWhenGoingFromImmediateToScheduledPathBranch,
    getFlowWhenGoingFromScheduledPathToImmediateBranch,
    getFlowWithGoToOnImmediateBranchHead,
    getFlowWithGoToFromAncestorToNestedElement,
    getFlowWhenGoingToLoopBranchHead,
    getFlowWhenMergingToAncestorBranch,
    getFlowWithGoToOnFirstMergeableNonNullNext,
    getFlowWhenGoingFromForEachBranch,
    getFlowWithPalettePromotedActions,
    getFlowWith3levelNestedDescisionWhichEndsWithAScreen,
    getFlowForCutPaste
};
