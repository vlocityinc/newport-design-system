import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';

// Types of graph edges as defined here:
// https://courses.csail.mit.edu/6.006/fall11/rec/rec14.pdf
export type EdgeType = 'tree' | 'back' | 'forward' | 'cross';

type ExecutionContextType = 'loop' | 'fault' | 'root' | 'branch';

/**
 *  An execution context for flow elements. Each element of the flow is associated
 *  with a single execution context.
 *
 *  In the following a loop element is an element having elementType LOOP and a faulting element is an
 *  element that has a fault connector.
 *
 *  The default ExecutionContext is of type 'root'. All elements of the flow with be associated
 *  with this context unless a loop or faulting element is encountered. When either one of these are encountered
 *  a new execution context associated with the loop or faulting element will be generated, and the subsequent elements
 *  will have that context (until the loop is exited, or until another loop or faulting element is encountered).
 *
 *  Thus an element will have the execution context of the immediate loop or faulting element that dominates it, or
 *  the 'root' context if none do.
 */
type ExecutionContext = Readonly<{
    type: ExecutionContextType;
    // the guid of the immediate loop/faulting element dominating element
    id?: string;
}>;

/**
 * Transient data structure associated with each canvas element while the conversion is
 * being performed
 */
export interface ConversionInfo {
    // the guid of the conversion info element
    readonly elementGuid: UI.Guid;

    // incoming connectors
    readonly ins: UI.Connector[];

    // outgoing connectors (except fault)
    readonly outs: UI.Connector[];

    // if the element is branching (ie decision, wait)
    readonly isBranching: boolean;

    // if the element is the loop element
    readonly isLoop: boolean;

    // if the element is an end element
    readonly isEnd: boolean;

    // the edge types of the out connectors
    edgeTypes?: EdgeType[];

    // the edge type of the fault connector
    faultEdgeType?: EdgeType;

    // fault connector
    fault?: UI.Connector;

    // the DFS end order for the element, or null if not yet visited
    dfsStart: number | null;

    // the DFS start order for the element, or null if it is still being visited
    dfsEnd: number | null;

    // number of times an element has been reached by the DFS
    reachedCount: number;

    // For a "merge" element, the guid of the branching element that immediately dominates it
    branchingGuid: UI.Guid | null;

    // For a branching element, the guid of the "merge" element that is immediately dominated by it (if any)
    mergeGuid: UI.Guid | null;

    // the element's execution context
    executionContext: ExecutionContext | null;

    // the element's index in topological sorted order
    topologicalSortIndex?: number | null;
}

export type ConversionInfos = Readonly<Record<string, ConversionInfo>>;

/**
 * The context for the dfs traversal
 */
interface DfsContext {
    // map of guid -> ConversionInfo for the canvas elements
    readonly conversionInfos: Readonly<ConversionInfos>;

    // the current execution context
    executionContext: ExecutionContext;

    // the running dfs "timestamp" used for dfsStart and dfsEnd
    timestamp: number;

    // the elements sorted topologically
    topologicalSort: ConversionInfo[];
}

/**
 * Creates a new ExecutionContext
 *
 * @param type - The ExecutionContextType
 * @param id - The loop or the faulting element's guid
 *
 * @return an execution context
 */
function newExecutionContext(type: ExecutionContextType, id?: string) {
    return { type, id };
}

/**
 * Returns the type of the edge that connects the source to the target
 *
 * @param source - The source node
 * @param target - The target node
 * @return The edge type
 */
function getEdgeType(source: ConversionInfo, target: ConversionInfo): EdgeType {
    if (target.dfsStart == null) {
        return 'tree';
    } else if (target.dfsEnd == null) {
        return 'back';
    } else if (source.dfsStart! < target.dfsStart) {
        return 'forward';
    }
    return 'cross';
}

/**
 * Processes an outgoing connector of an node being visited
 *
 * @param ctx - The dfs context
 * @param node - The node being visited
 * @param out - An outgoing connector of the node
 *
 * @return - The edge type for the outgoing connector
 */
function processConnector(ctx: DfsContext, node: ConversionInfo, out: UI.Connector): EdgeType {
    const { target } = out;

    // update an element's reachCount when we reach it
    const targetElement = ctx.conversionInfos[target];
    targetElement.reachedCount++;

    // update the execution context when we follow an edge
    const { executionContext } = ctx;
    ctx.executionContext = getNextExecutionContext(ctx, out);

    const edgeType = getEdgeType(node, targetElement);

    // only visit nodes that have not been visited yet
    if (edgeType === 'tree') {
        visitNode(ctx, target);
    }

    // restore the previous execution context
    ctx.executionContext = executionContext;

    return edgeType;
}

/**
 * Returns the next execution context that is entered by following an outgoing connector
 *
 * @param ctx - The dfs context
 * @param out - An outgoing connector for a node
 * @return - The execution context that is entered by following the outgoing connector
 */
function getNextExecutionContext(ctx: DfsContext, out: UI.Connector) {
    const { type, source } = out;

    let execCtxType;

    switch (type) {
        case CONNECTOR_TYPE.LOOP_NEXT:
            execCtxType = 'loop';
            break;
        case CONNECTOR_TYPE.FAULT:
            execCtxType = 'fault';
            break;
        default:
            execCtxType = null;
    }

    // if we are entering a loop or fault create a new execution context
    return execCtxType ? newExecutionContext(execCtxType, source) : ctx.executionContext;
}

/**
 * Just before visiting an element, set its dfs start and execution context
 *
 * @param ctx - The dfs context
 * @param elementInfo - The elementInfo
 */
function visitNodeStart(ctx: DfsContext, elementInfo: ConversionInfo) {
    const { executionContext } = ctx;
    const dfsStart = ctx.timestamp++;
    Object.assign(elementInfo, { dfsStart, executionContext });
}

/**
 * After visiting an element is complete, set the element's dfs end, and prepend it to topologicalSort.
 *
 * @param ctx - The dfs context
 * @param elementInfo - The element info
 */
function visitNodeEnd(ctx: DfsContext, elementInfo: ConversionInfo) {
    const dfsEnd = ctx.timestamp++;
    ctx.topologicalSort = [elementInfo, ...ctx.topologicalSort];
    Object.assign(elementInfo, { dfsEnd });
}

/**
 * Processes the outgoing connectors of an element
 *
 * @param ctx - The dfs context
 * @param elementInfo - The element info
 */
function processConnectors(ctx: DfsContext, elementInfo: ConversionInfo) {
    const { outs, fault } = elementInfo;

    // need to process the fault first so that the following elements are
    // created under a fault context
    if (fault) {
        elementInfo.faultEdgeType = processConnector(ctx, elementInfo, fault);
    }

    elementInfo.edgeTypes = outs.map((out) => processConnector(ctx, elementInfo, out));
}

/**
 * Visits a node in the free form flow
 *
 * @param ctx - The dfs context
 * @param nodeGuid - The guid of the node to visit
 */
function visitNode(ctx: DfsContext, nodeGuid: UI.Guid) {
    const { conversionInfos } = ctx;
    const elementInfo = conversionInfos[nodeGuid];

    visitNodeStart(ctx, elementInfo);

    processConnectors(ctx, elementInfo);

    visitNodeEnd(ctx, elementInfo);
}

/**
 * Checks if a node is an ancestor of a set of nodes wholly contained by a dfs interval
 *
 * @param node - A node
 * @param interval - A dfs interval
 * @return true if a node is an ancestor of any node contained in the interval, false otherwise
 */
function isDfsAncestor(node: ConversionInfo, interval: [number, number]) {
    const [start, end] = interval;
    return node.dfsStart! <= start && node.dfsEnd! >= end;
}

/**
 * Finds the "branching" node that corresponds the a "merge" node. The branching node
 * is the node that immidiately dominates the merge node.
 *
 * @param ctx - The dfs context
 * @param mergeNode - A merge node
 *
 * @return The "branching" node for the given "merge" node (or null if none is found)
 */
function findBranchingNode(ctx: DfsContext, mergeNode: ConversionInfo): ConversionInfo | null {
    const { topologicalSort, conversionInfos } = ctx;

    let minStart;
    let maxEnd;

    // go through all the inbound connectors of the merge node and calculate the
    // smallest [dfsStart, dfsEnd] interval that contains all the merge source nodes
    for (const inConnector of mergeNode.ins) {
        const { source } = inConnector;
        const { dfsStart, dfsEnd } = conversionInfos[source];
        minStart = minStart == null ? dfsStart : Math.min(minStart, dfsStart!);
        maxEnd = maxEnd == null ? dfsStart : Math.max(maxEnd, dfsEnd!);
    }

    let branchingCandidate: ConversionInfo | null = null;

    // The branching node is the immediate common ancestor of the set of inbound source nodes of the merge node.
    // We can find it by going thru the nodes in topo order remembering a node that is an ancestor.
    // The last node found will be the immediate ancestor.
    for (const node of topologicalSort) {
        if (isDfsAncestor(node, [minStart, maxEnd])) {
            branchingCandidate = node;
        }
    }

    return branchingCandidate;
}

const peek = (stack) => {
    return stack.length > 0 ? stack[stack.length - 1] : undefined;
};

/**
 * Converts incoming cross and forward connectors of an element to go tos
 *
 * @param conversionInfos - conversion infos of all elements
 * @param elementInfo - element info
 */
function setIncomingCrossForwardConnectorsAsGoTos(conversionInfos: ConversionInfos, elementInfo: ConversionInfo) {
    const { ins, elementGuid } = elementInfo;

    const sources = ins.map((inConnector) => inConnector.source);
    for (const source of sources) {
        const { outs, edgeTypes } = conversionInfos[source];
        for (let i = 0; i < outs.length; i++) {
            if (outs[i].target === elementGuid) {
                outs[i].isGoTo = ['forward', 'cross'].includes(edgeTypes![i]);
            }
        }
    }
}

/**
 * Evaluates the incoming edges of a non-merge element and sets go tos as needed
 *
 * @param conversionInfos - conversion infos of all elements
 * @param elementInfo - element info
 */
export function setGoTosOnNonMergeElement(conversionInfos: ConversionInfos, elementInfo: ConversionInfo) {
    // Check for existing gotos on incoming connectors (for previously saved autolayout flows), and if they are valid.
    // There should be only one incoming connector that is not a go to.
    const { ins } = elementInfo;
    const incomingGoTos = ins.filter((inConnector) => inConnector.isGoTo);
    if (incomingGoTos.length !== ins.length - 1) {
        // If not set correctly, set all cross and forward edges as go tos
        setIncomingCrossForwardConnectorsAsGoTos(conversionInfos, elementInfo);
    }
}

/**
 * Verifies that all branching intervals are properly nested.
 *
 * @param ctx - The dfs context
 * @throws An error if not properly nested
 */
function checkIntervals(ctx: DfsContext) {
    const { conversionInfos, topologicalSort } = ctx;

    const intervalStack: [number, number][] = [];

    for (let i = 0; i < topologicalSort.length; i++) {
        const { mergeGuid, outs, ins, dfsEnd } = topologicalSort[i];

        let currentInterval;

        // remove all the intervals that are terminating
        while ((currentInterval = peek(intervalStack))) {
            if (i >= currentInterval[1]) {
                intervalStack.pop();
            } else {
                break;
            }
        }

        // when entering a loop, create an interval that encloses all the loop elements
        const isFirstLoopElement = ins.length === 1 && ins[0].type === CONNECTOR_TYPE.LOOP_NEXT;
        if (isFirstLoopElement) {
            const loopElement = conversionInfos[ins[0].source];

            // get all the topo orders of the loop elements that loop back to the loop header
            const topoOrders = loopElement.ins.map((conn) => {
                const { source, type } = conn;
                const sourceElement = conversionInfos[source];
                if (sourceElement.dfsEnd! <= dfsEnd! && type !== CONNECTOR_TYPE.LOOP_END) {
                    return sourceElement.topologicalSortIndex!;
                }
                return 0;
            });

            // get the max topo order to span all of them
            const topologicalSortIndex = Math.max(...topoOrders);

            if (topologicalSortIndex > i) {
                currentInterval = [i, topologicalSortIndex!];

                intervalStack.push(currentInterval);
            }
        }

        // Create a new interval and check that it's topologically nested
        if (mergeGuid) {
            const { topologicalSortIndex } = conversionInfos[mergeGuid];
            let hasGoTo = false;

            if (currentInterval) {
                const [, end] = currentInterval;

                if (topologicalSortIndex! > end) {
                    // If we get here, we have a goTo connector situation in a nested branch
                    hasGoTo = true;
                    setGoTosOnNonMergeElement(conversionInfos, conversionInfos[mergeGuid]);

                    // Clean up the merge / branching guid properties since this is not really a merge element anymore
                    conversionInfos[mergeGuid].branchingGuid = null;
                    topologicalSort[i].mergeGuid = null;
                }
            }

            if (!hasGoTo) {
                currentInterval = [i, topologicalSortIndex!];
                intervalStack.push(currentInterval);
            }
        }

        // Topologically nested branching intervals is a necessary but not sufficient condition for nested branches.
        // We must also check that any element inside the intervals has targets that are either inside all the innermost interval,
        // or outside the outermost interval.
        if (currentInterval) {
            const innermostInterval = currentInterval;

            for (let j = 0; j < outs.length; j++) {
                const out = outs[j];
                const edgeType = conversionInfos[out.source].edgeTypes![j];
                const targetTopoSortIndex = conversionInfos[out.target].topologicalSortIndex!;

                // if we loop back, check that we are not inside a branching interval
                if (targetTopoSortIndex < i) {
                    let intervalsCount = 0;

                    for (let j = intervalStack.length - 1; j >= 0; j--) {
                        const [start] = intervalStack[j];

                        // check we are inside the loop
                        if (start > targetTopoSortIndex) {
                            intervalsCount++;
                        } else {
                            break;
                        }
                    }

                    // the loop interval is always present, so must be > 1
                    if (intervalsCount > 1) {
                        throw new Error('loop back while in branching interval');
                    }
                }

                if (targetTopoSortIndex > innermostInterval[1] && edgeType !== 'tree') {
                    out.isGoTo = true;
                }
            }
        }
    }
}

/**
 * Checks if a node is a "merge" node.
 * A merge node is a node that has more than one inbound, non-loop back, connector
 *
 * @param ctx - The dfs context
 * @param node - A node
 * @return - True if the node is a "merge" node, false otherwise
 */
function isMerge(ctx: DfsContext, node: ConversionInfo) {
    const { ins, isLoop } = node;

    // if not a loop, check to see if we have more than one inbound connector
    if (!isLoop) {
        return ins.length > 1;
    }

    // the count of connectors that loop back (eg back edges)
    let loopBackConnectorCount = 0;

    for (const inConnector of ins) {
        const { source } = inConnector;
        const sourceNode = ctx.conversionInfos[source];

        // check if we have a back edge
        if (sourceNode.dfsEnd! <= node.dfsEnd!) {
            loopBackConnectorCount++;
        }
    }

    return ins.length - loopBackConnectorCount > 1;
}

/**
 * Computes the branching intervals.
 *
 * For each "merge" node, find its correspoding "branching" node and
 * link them by setting their corresponding mergeGuid and branchingGuid properties.
 *
 * @param ctx - The dfs context
 */
function computeBranchingIntervals(ctx: DfsContext) {
    const { topologicalSort } = ctx;

    for (let i = 0; i < topologicalSort.length; i++) {
        const node = topologicalSort[i];

        // assign each node its topological sort index
        node.topologicalSortIndex = i;

        if (isMerge(ctx, node)) {
            const branchingNode = findBranchingNode(ctx, node);

            if (branchingNode != null) {
                branchingNode.mergeGuid = node.elementGuid;
                node.branchingGuid = branchingNode.elementGuid;
            } else {
                node.branchingGuid = null;
            }
        }
    }
}

/**
 * Performs a dfs traversal a free form flow canvas graph
 *
 * After the traversal is done, the ConversionInfos will have branching and merging information, reachability
 * information, and an execution context. This information is then used to validate the free form canvas can
 * be converted to auto-layout, and to perform the conversion.
 *
 * @param conversionInfos - The conversion infos
 * @param startGuid - The start node guid
 */
export function dfs(conversionInfos: Readonly<ConversionInfos>, startGuid: UI.Guid) {
    const ctx: DfsContext = {
        conversionInfos,
        timestamp: 0,
        executionContext: newExecutionContext('root'),
        topologicalSort: []
    };

    visitNode(ctx, startGuid);
    computeBranchingIntervals(ctx);
    checkIntervals(ctx);
}
