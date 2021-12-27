import {
    BranchHeadNodeModel,
    ConnectionSource,
    FAULT_INDEX,
    FlowModel,
    GoToSourceRef,
    NodeModel,
    ParentNodeModel
} from './model';
import {
    createGoToSourceRef,
    findLastElement,
    getBranchIndexForGoToConnection,
    getChild,
    hasChildren,
    hasGoToOnBranchHead,
    hasGoToOnNext,
    isEndOrAllTerminalBranchingElement,
    parseGoToSourceRef,
    resolveChild,
    resolveNode,
    resolveParent
} from './modelUtils';
import NodeType from './NodeType';

/**
 * Utils to do assertions in development to ensure that the auto layout canvas data model is in a consistant state.
 */

enum NodeEnv {
    DEVELOPMENT = 'development'
}

/**
 * @param assertCallback - Assert Function callback
 */
export function assertInDev(assertCallback: Function) {
    // eslint-disable-next-line
    const processEnv = (window as any)['processEnv'];

    if (processEnv && processEnv.NODE_ENV === NodeEnv.DEVELOPMENT) {
        assertCallback();
    }
}

/**
 * @param state - The state of elements in the store
 * @param branchHead - The branch head node model
 */
function assertBranchHead(state: FlowModel, branchHead: BranchHeadNodeModel) {
    const { guid, prev, parent, childIndex } = branchHead;

    if (prev != null) {
        throw new Error(`invalid prev for branch head ${guid}: ${prev}`);
    }
    if (state[parent] == null) {
        throw new Error(`invalid parent for branch head ${guid}: ${parent}`);
    }

    if (childIndex == null) {
        throw new Error(`invalid childIndex for branch head ${guid}: ${childIndex}`);
    } else if (childIndex === FAULT_INDEX) {
        if (resolveParent(state, parent).fault == null) {
            throw new Error(`invalid branch head fault ${guid}:`);
        }
    } else {
        if (childIndex < 0 || childIndex > resolveParent(state, parent).children.length - 1) {
            throw new Error(`invalid branch head childIndex ${guid}: ${childIndex}`);
        }

        if ((state[parent!] as ParentNodeModel).children[childIndex!] !== guid) {
            throw new Error(`invalid parent:childIndex link for branch head ${guid}: ${parent}:${childIndex}`);
        }
    }

    if (branchHead.isTerminal == null) {
        throw new Error(`invalid branch head isTerminal ${branchHead.isTerminal}:`);
    } else {
        const isTerminal = isEndOrAllTerminalBranchingElement(state, findLastElement(branchHead, state));

        if (isTerminal !== branchHead.isTerminal) {
            throw new Error(`Invalid isTerminal value for ${guid}: ${isTerminal}`);
        }
    }
}

/**
 * @param elements - The state of elements in the store
 * @param element - The element
 */
function assertNonBranchHead(elements: FlowModel, element: NodeModel) {
    const { guid, prev, next, parent, childIndex, isTerminal } = element as BranchHeadNodeModel;

    if (parent != null) {
        throw new Error(`invalid parent attribute for non branch head ${guid}: ${parent}`);
    }

    if (childIndex != null) {
        throw new Error(`invalid childIndex attribute for non branch head ${guid}: ${childIndex}`);
    }

    if (isTerminal != null) {
        throw new Error(`invalid isTerminal attribute for non branch head ${guid}: ${isTerminal}`);
    }

    if (prev != null && elements[prev].next !== guid) {
        throw new Error(`invalid prev link for non branch head ${guid}: ${prev}`);
    }

    if (next != null) {
        if (hasGoToOnNext(elements, guid)) {
            assertGoToConnectorFromSource(elements, { guid });
        } else if (elements[next].prev !== guid) {
            throw new Error(`invalid next link for non branch head ${guid}: ${next}`);
        }
    }
}

/**
 * @param elements - The state of elements in the store
 * @param source - The connection source
 */
function assertGoToConnectorFromSource(elements: FlowModel, source: ConnectionSource) {
    const sourceRef = createGoToSourceRef(elements, source);

    const sourceElement = resolveNode(elements, source.guid);
    const target = source.childIndex == null ? sourceElement.next! : getChild(sourceElement, source.childIndex);

    if (!elements[target!].incomingGoTo?.includes(sourceRef)) {
        throw new Error(`invalid goto, sourceRef is not included in target ${sourceRef}: ${target}`);
    }
}

/**
 * @param elements - The state of elements in the store
 * @param incomingGoTos - The incomming gotos
 */
function assertIncomingGoTos(elements: FlowModel, incomingGoTos: GoToSourceRef[]) {
    for (const sourceRef of incomingGoTos) {
        const { sourceGuid: guid, suffix } = parseGoToSourceRef(sourceRef);
        const childIndex = suffix ? getBranchIndexForGoToConnection(elements, guid, suffix) : null;
        assertGoToConnectorFromSource(elements, { guid, childIndex });
    }
}

/**
 * @param elements - The state of elements in the store
 * @param element - The element
 */
function assertElement(elements: FlowModel, element: NodeModel) {
    const { guid, children, incomingGoTo } = element as ParentNodeModel;

    if (incomingGoTo != null) {
        assertIncomingGoTos(elements, incomingGoTo);
    }

    if (!!children !== hasChildren(element)) {
        throw new Error(`invalid children property for element ${guid}: ${children}`);
    }
}

/**
 * @param elements - The state of elements in the store
 * @param parent - The parent element
 * @param childIndex - The child index
 */
function assertAutoLayoutStateForBranch(elements: FlowModel, parent: ParentNodeModel, childIndex: number) {
    if (hasGoToOnBranchHead(elements, parent.guid, childIndex)) {
        assertGoToConnectorFromSource(elements, { guid: parent.guid, childIndex });
        return;
    }

    const branchHead = resolveChild(elements, parent, childIndex);

    if (branchHead != null) {
        let element: NodeModel | null = branchHead;
        assertBranchHead(elements, branchHead);

        while (element != null) {
            assertElement(elements, element);
            if (element !== branchHead) {
                assertNonBranchHead(elements, element);
            }
            if (element.fault != null) {
                assertAutoLayoutStateForBranch(elements, element as ParentNodeModel, FAULT_INDEX);
            }
            if (hasChildren(element)) {
                const children = (element as ParentNodeModel).children;

                for (let i = 0; i < children.length; i++) {
                    assertAutoLayoutStateForBranch(elements, element as ParentNodeModel, i);
                }
            }
            if (hasGoToOnNext(elements, element.guid)) {
                break;
            }
            element = element.next != null ? elements[element.next] : null;
        }
    }
}

/**
 * Asserts that all 'isTerminal' are set correctly for all the branches of a flow.
 * Used for tests and in dev.
 *
 * @param elements - The flow elements
 * @throws Error if an invalid isTerminal is found
 */
export function assertAutoLayoutState(elements: FlowModel) {
    if (!elements[NodeType.ROOT]) {
        return;
    }

    const rootElement = resolveParent(elements, NodeType.ROOT);
    if (rootElement != null) {
        assertAutoLayoutStateForBranch(elements, rootElement, 0);
    }
}
