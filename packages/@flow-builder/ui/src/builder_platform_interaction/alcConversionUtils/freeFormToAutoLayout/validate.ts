import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ConversionInfo, ConversionInfos, EdgeType, setGoTosOnNonMergeElement } from './dfs';

type FlowCheckType =
    | 'orphan' /* if a node that is unreachable from the start node */
    | 'reachedCount' /* if a node was reached an unexpected number of times */
    | 'unsupportedElement' /* if an unsupported element was found in the flow */
    | 'scheduledPaths' /* scheduled path issue */
    | 'endInLoop' /* if an end was found in a loop */
    | 'gotoInLoop' /* if a back edge goto was found in a loop */
    | 'crossBoundary' /* if a cross boundrary goto was found */
    | 'branchMergeNesting' /* if an invalid [branchingGuid - mergingGuid] matching was found */
    | 'loopNextAndEndTheSame'; /* if a loop's next and end connectors point to the same element */

const unsupportedElementTypes = [ELEMENT_TYPE.STEP] as string[];

/**
 * @param type
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
    const { source, target } = out;
    const sourceNode = conversionInfos[source];
    const targetNode = conversionInfos[target];
    const executionContext = sourceNode.executionContext!;

    if (edgeType === 'forward' || edgeType === 'cross') {
        if (sourceNode.executionContext !== targetNode.executionContext) {
            if (sourceNode.executionContext!.type === 'loop') {
                failFlowCheck('gotoInLoop');
            }
            // a cross boundary edge is a goto
            out.isGoTo = true;
        }
    } else if (edgeType === 'back') {
        // when an outgoing loop connector has the same loop as a target
        const isDegenerateLoop =
            sourceNode.isLoop && targetNode.isLoop && sourceNode.elementGuid === targetNode.elementGuid;

        // the edge is a goto if it does not come from inside a loop and point back to the loop header
        if (executionContext.type !== 'loop' || target !== executionContext.id) {
            if (!isDegenerateLoop) {
                if (executionContext.type === 'loop') {
                    failFlowCheck('gotoInLoop');
                }
                out.isGoTo = true;
            }
        }
    }
}

/**
 * Evalute the element's outgoing edges for "gotos"
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
 * @param outs
 */
function areLoopNextAndEndTheSame(outs: UI.Connector[]) {
    return outs.length === 2 && outs[0].target === outs[1].target;
}
/**
 * Validates the conversion infos
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @throw An error when the flow can't be converted
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
            const {
                reachedCount,
                ins,
                dfsStart,
                executionContext,
                branchingGuid,
                elementGuid,
                isLoop,
                outs
            } = elementInfo;

            checkOutgoingEdgesForGoTos(conversionInfos, elementInfo);
            const expectedReachedCount = ins.length;

            if (isLoop && areLoopNextAndEndTheSame(outs)) {
                failFlowCheck('loopNextAndEndTheSame');
            } else if (reachedCount !== expectedReachedCount) {
                // The number of times a node was reached by dfs should be the equal to the
                // count of inbound connectors for that node
                failFlowCheck('reachedCount');
            } else if (dfsStart == null) {
                // if a not doesn't have a dfsStart value, then it hasn't been visited and is considered an orphan
                failFlowCheck('orphan');
            } else if (elementType === ELEMENT_TYPE.END_ELEMENT && executionContext!.type === 'loop') {
                // we currently disallow end elements inside a loop
                failFlowCheck('endInLoop');
            } else if (branchingGuid != null && conversionInfos[branchingGuid].mergeGuid !== elementGuid) {
                // set go tos on element if an invalid branching interval is encountered
                setGoTosOnNonMergeElement(conversionInfos, elementInfo);
                elementInfo.branchingGuid = null;
            }
        }
    }
}
