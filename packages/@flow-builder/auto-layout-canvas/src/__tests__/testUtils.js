import { areAllBranchesTerminals, isBranchingElement } from '../modelUtils';
import NodeType from '../NodeType';
import { getDefaultLayoutConfig } from '../defaultLayoutConfig';

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
    isTerminal: true
};

const END_ELEMENT = {
    guid: END_ELEMENT_GUID,
    label: END_ELEMENT_GUID,
    elementType: 'END_ELEMENT',
    nodeType: NodeType.END
};

const BRANCH_ELEMENT = {
    guid: BRANCH_ELEMENT_GUID,
    label: BRANCH_ELEMENT_GUID,
    elementType: NodeType.BRANCH,
    nodeType: NodeType.BRANCH,
    children: [null, null],
    defaultConnectorLabel: 'Default Connector Label'
};

const LOOP_ELEMENT = {
    guid: LOOP_ELEMENT_GUID,
    label: LOOP_ELEMENT_GUID,
    elementType: NodeType.LOOP,
    nodeType: NodeType.LOOP,
    children: [null]
};

const SCREEN_ELEMENT = {
    guid: SCREEN_ELEMENT_GUID,
    label: SCREEN_ELEMENT_GUID,
    elementType: SCREEN_ELEMENT_TYPE,
    nodeType: NodeType.DEFAULT
};

const ACTION_ELEMENT = {
    guid: ACTION_ELEMENT_GUID,
    label: ACTION_ELEMENT_GUID,
    elementType: NodeType.DEFAULT,
    nodeType: NodeType.DEFAULT
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
        nodeType
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
        if (prevElement) {
            prevElement.next = element.guid;
            element.prev = prevElement.guid;
        }
        prevElement = element;
        return element;
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
        element = deepCopy(getElementByType(elementInfo)) || { guid: elementInfo };
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

function getFlowWithEmptyDeciisionWith3BranchesContext() {
    const branchElement = { ...BRANCH_ELEMENT, children: [null, null, null] };

    const flowModel = createFlow([branchElement]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithDecisionWithEndedLeftBranchContext() {
    const leftBranchHead = createElementWithElementType('branch-left-head-guid', 'END_ELEMENT', NodeType.END);
    return getFlowWithDecisionWithOneElementOnLeftBranchContext(leftBranchHead);
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
            elementGuidToDelete: BRANCH_ELEMENT_GUID
        }
    };
    return createFlowRenderContext({ flowModel, interactionState });
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
    faultBranchHeadElementOne = { ...faultBranchHeadElementOne, parent: actionElementOne.guid, childIndex: -1 };
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
    faultBranchHeadElementTwo = { ...faultBranchHeadElementTwo, parent: actionElementTwo.guid, childIndex: -1 };
    const elements = linkElements([START_ELEMENT, actionElementOne, actionElementTwo, END_ELEMENT]);
    elements.push(faultBranchHeadElementOne, faultBranchHeadElementTwo);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    return createFlowRenderContext({ flowModel });
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
    LOOP_ELEMENT,
    SCREEN_ELEMENT_GUID,
    createDefaultElement,
    flowModelFromElements,
    createFlowRenderContext,
    linkElements,
    linkBranchOrFault,
    getEmptyFlowContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithDecisionWithOneElementOnLeftBranchContext,
    getFlowWithEmptyLoopContext,
    getSimpleFlowContext,
    getFlowWithDecisionWithEndedLeftBranchContext,
    getFlowWithTwoFaults,
    getFlowWithDynamicNodeComponent,
    createFlow
};
