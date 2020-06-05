import ElementType from '../ElementType';
import { getDefaultLayoutConfig } from '../defaultLayoutConfig';

const layoutConfig = getDefaultLayoutConfig();

const ROOT_ELEMENT_GUID = 'root';
const START_ELEMENT_GUID = 'start-guid';
const END_ELEMENT_GUID = 'end-guid';
const BRANCH_ELEMENT_GUID = 'branch-guid';
const LOOP_ELEMENT_GUID = 'loop-guid';

const ROOT_ELEMENT = { guid: ROOT_ELEMENT_GUID, elementType: ElementType.ROOT, children: [START_ELEMENT_GUID] };
const START_ELEMENT = {
    guid: START_ELEMENT_GUID,
    elementType: ElementType.START,
    parent: ROOT_ELEMENT_GUID,
    childIndex: 0,
    next: END_ELEMENT_GUID
};

const END_ELEMENT = { guid: END_ELEMENT_GUID, elementType: ElementType.END, prev: START_ELEMENT_GUID };

const BRANCH_ELEMENT = {
    guid: BRANCH_ELEMENT_GUID,
    elementType: ElementType.BRANCH,
    children: [null, null],
    defaultConnectorLabel: 'Default Connector Label'
};

const LOOP_ELEMENT = {
    guid: LOOP_ELEMENT_GUID,
    elementType: ElementType.LOOP,
    children: [null]
};

const elementsMetadata = {
    [ElementType.ROOT]: {
        type: ElementType.ROOT,
        icon: 'standard:default'
    },
    [ElementType.START]: {
        type: ElementType.START,
        icon: 'standard:default'
    },
    [ElementType.BRANCH]: {
        type: ElementType.BRANCH,
        icon: 'standard:default'
    },
    [ElementType.LOOP]: {
        type: ElementType.LOOP,
        icon: 'standard:default'
    },
    [ElementType.END]: {
        type: ElementType.END,
        icon: 'standard:default'
    }
};

function createDefaultElement(guid) {
    return {
        guid,
        elementType: ElementType.DEFAULT
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
        isDeletingBranch: false
    };

    return { ...defaultFlowRenderContext, ...custom };
}

function linkElements(elements) {
    let prevElement = null;

    return elements.map(element => {
        if (prevElement) {
            prevElement.next = element.guid;
            element.prev = prevElement.guid;
        }
        prevElement = element;
        return element;
    });
}

function linkBranchOrFault(branchElement, headElement, childIndex) {
    branchElement.children[childIndex] = headElement.guid;
    return { ...headElement, parent: branchElement.guid, childIndex };
}

function getEmptyFlowContext() {
    const elements = linkElements([START_ELEMENT, END_ELEMENT]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithEmptyDecisionContext() {
    const elements = linkElements([START_ELEMENT, BRANCH_ELEMENT, END_ELEMENT]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithEmptyLoopContext() {
    const elements = linkElements([START_ELEMENT, LOOP_ELEMENT, END_ELEMENT]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithEmptyDeciisionWith3BranchesContext() {
    const branchElement = { ...BRANCH_ELEMENT, children: [null, null, null] };
    const elements = linkElements([START_ELEMENT, branchElement, END_ELEMENT]);
    const flowModel = flowModelFromElements([ROOT_ELEMENT, ...elements]);
    return createFlowRenderContext({ flowModel });
}

function getFlowWithDecisionWithOneElementOnLeftBranchContext() {
    let leftBranchHead = createDefaultElement('branch-left-head-guid');
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

export {
    ROOT_ELEMENT,
    START_ELEMENT,
    END_ELEMENT,
    BRANCH_ELEMENT,
    createDefaultElement,
    flowModelFromElements,
    createFlowRenderContext,
    linkElements,
    linkBranchOrFault,
    getEmptyFlowContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithDecisionWithOneElementOnLeftBranchContext,
    getFlowWithEmptyLoopContext
};
