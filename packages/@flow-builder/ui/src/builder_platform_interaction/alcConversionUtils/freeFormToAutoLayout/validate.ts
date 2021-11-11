import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ConversionInfo, ConversionInfos, EdgeType, setGoTosOnNonMergeElement, isMerge } from './dfs';

type FlowCheckType =
    | 'orphan' /* if a node that is unreachable from the start node */
    | 'reachedCount' /* if a node was reached an unexpected number of times */
    | 'unsupportedElement' /* if an unsupported element was found in the flow */
    | 'scheduledPaths' /* scheduled path issue */
    | 'gotoInLoop' /* if a back edge goto was found in a loop */
    | 'crossBoundary' /* if a cross boundary goto was found */
    | 'branchMergeNesting' /* if an invalid [branchingGuid - mergingGuid] matching was found */
    | 'loopNextAndEndTheSame'; /* if a loop's next and end connectors point to the same element */

const unsupportedElementTypes = [ELEMENT_TYPE.STEP] as string[];

/**
 * @param type The Flow Check type
 */
function failFlowCheck(type: FlowCheckType) {
    throw new Error(type);
}

/**
 * Evaluate if an outgoing connector is a "goto" and set the relevant property
 *
 * @param conversionInfos - The conversion infos
 * @param out - An outgoing connector connector
 * @param edgeType - The edge type for the outgoing connector
 */
function checkOutgoingEdgeForGoTo(conversionInfos: ConversionInfos, out: UI.Connector, edgeType: EdgeType) {
    const { source, target, type } = out;
    const sourceNode = conversionInfos[source];
    const targetNode = conversionInfos[target];
    const executionContext = sourceNode.executionContext!;

    if (edgeType === 'forward' || edgeType === 'cross') {
        if (sourceNode.executionContext !== targetNode.executionContext) {
            // a cross boundary edge is a goto
            out.isGoTo = true;
        }
        if (
            sourceNode.executionContext === targetNode.executionContext &&
            (type === CONNECTOR_TYPE.FAULT || type === CONNECTOR_TYPE.LOOP_NEXT)
        ) {
            // A cross/forward fault or loop next connector between 2 nodes in the same context is a goto
            out.isGoTo = true;
        }
    } else if (edgeType === 'back') {
        // when an outgoing loop connector has the same loop as a target
        const isDegenerateLoop =
            sourceNode.isLoop && targetNode.isLoop && sourceNode.elementGuid === targetNode.elementGuid;

        // the edge is a goto if it does not come from inside a loop and point back to the loop header
        if (
            executionContext.type !== 'loop' ||
            target !== executionContext.id ||
            out.type === CONNECTOR_TYPE.LOOP_NEXT
        ) {
            if (!isDegenerateLoop) {
                out.isGoTo = true;
            }
        }
    }
}

/**
 * Evaluate the element's outgoing edges for "gotos"
 *
 * @param conversionInfos - The conversion infos
 * @param elementInfo - The element
 */
function checkOutgoingEdgesForGoTos(conversionInfos: ConversionInfos, elementInfo: ConversionInfo) {
    const { edgeTypes, faultEdgeType, outs, fault } = elementInfo;

    for (let i = 0; i < outs.length; i++) {
        checkOutgoingEdgeForGoTo(conversionInfos, outs[i], edgeTypes![i]);
    }

    if (fault) {
        checkOutgoingEdgeForGoTo(conversionInfos, fault, faultEdgeType!);
    }
}

/**
 * Validates the conversion infos
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @throws An error when the flow can't be converted
 */
export function validateConversionInfos(elements: UI.Elements, conversionInfos: ConversionInfos) {
    const flowElements = Object.values(elements);

    for (const element of flowElements) {
        const { guid, elementType } = element;

        const elementInfo = conversionInfos[guid];

        if (unsupportedElementTypes.includes(elementType!)) {
            failFlowCheck('unsupportedElement');
        }

        if (elementInfo != null) {
            const { reachedCount, ins, dfsStart, branchingGuid, elementGuid } = elementInfo;

            checkOutgoingEdgesForGoTos(conversionInfos, elementInfo);
            const expectedReachedCount = ins.length;

            if (reachedCount !== expectedReachedCount) {
                // The number of times a node was reached by dfs should be the equal to the
                // count of inbound connectors for that node
                failFlowCheck('reachedCount');
            } else if (dfsStart == null) {
                // if a not doesn't have a dfsStart value, then it hasn't been visited and is considered an orphan
                failFlowCheck('orphan');
            } else if (branchingGuid != null && conversionInfos[branchingGuid].mergeGuid !== elementGuid) {
                // set go tos on element if an invalid branching interval is encountered
                setGoTosOnNonMergeElement(conversionInfos, elementInfo);
                elementInfo.branchingGuid = null;
            }
        }
    }

    // Do a final check of all elements initially evaluated to be merge elements, taking into account any go tos that were set
    for (const element of flowElements) {
        const elementInfo = conversionInfos[element.guid];

        if (elementInfo != null) {
            const { branchingGuid } = elementInfo;
            if (branchingGuid != null && !isMerge(conversionInfos, elementInfo)) {
                elementInfo.branchingGuid = null;
                conversionInfos[branchingGuid].mergeGuid = null;
            }
        }
    }

    // Check all loops that have multiple loop back connectors and make sure go tos are set correctly
    flowElements
        .filter((element) => element.elementType === ELEMENT_TYPE.LOOP)
        .forEach((loopElement) => {
            const { elementGuid, ins, outs, dfsEnd } = conversionInfos[loopElement.guid];
            const nonGoToLoopBackConnectors = ins?.filter(
                (inConnector) => !inConnector.isGoTo && conversionInfos[inConnector.source].dfsEnd! < dfsEnd!
            );
            if (nonGoToLoopBackConnectors?.length > 1) {
                let loopBackElement, currentElement, nextElementGuid;
                const loopNextConnector = outs.find((outConnector) => outConnector.type === CONNECTOR_TYPE.LOOP_NEXT);
                let nextElement = conversionInfos[loopNextConnector!.target];
                // Traverse through the loop interval and determine if we have a linear enclosed loop
                while (nextElement && !nextElement.isEnd) {
                    if (nextElement.isBranching && !nextElement.isLoop && !nextElement.mergeGuid) {
                        break;
                    }

                    if (nextElement.mergeGuid) {
                        nextElementGuid = nextElement.mergeGuid;
                    } else if (nextElement.isLoop) {
                        if (nextElement.elementGuid === elementGuid) {
                            loopBackElement = currentElement;
                            break;
                        } else {
                            const loopEndConnector = nextElement.outs.find(
                                (outConnector) => outConnector.type === CONNECTOR_TYPE.LOOP_END
                            );
                            nextElementGuid = loopEndConnector!.target;
                        }
                    } else {
                        nextElementGuid = nextElement.outs[0].target;
                    }

                    currentElement = nextElement;
                    nextElement = conversionInfos[nextElementGuid];
                }

                // If we have a linear enclosed loop, then mark all incoming loop backs besides that of the final loop element as go tos
                if (loopBackElement) {
                    nonGoToLoopBackConnectors.forEach((connector) => {
                        if (connector.source !== loopBackElement.elementGuid) {
                            connector.isGoTo = true;
                        }
                    });
                }
            }
        });
}
