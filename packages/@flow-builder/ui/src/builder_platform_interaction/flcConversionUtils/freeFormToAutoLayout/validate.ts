import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ConversionInfo, ConversionInfos, EdgeType } from './dfs';

type FlowCheckType =
    | 'orphan' /* if a node that is unreachable from the start node */
    | 'reachedCount' /* if a node was reached an unexpected number of times */
    | 'unsupportedElement' /* if an unsupported element was found in the flow */
    | 'timeTriggers' /* time trigger issue */
    | 'endInLoop' /* if an end was found in a loop */
    | 'backEdge' /* if a back edge goto was found */
    | 'crossBoundary' /* if a cross boundrary goto was found */
    | 'branchMergeNesting' /* if an invalid [branchingGuid - mergingGuid] matching was found */
    | 'loopNextAndEndTheSame'; /* if a loop's next and end connectors point to the same element */

const unsupportedElementTypes = [ELEMENT_TYPE.STEP] as string[];

function failFlowCheck(type: FlowCheckType) {
    throw new Error(type);
}

/**
 * Validates that an outgoing connector is not some kind of "goto"
 *
 * @param conversionInfos - The conversion infos
 * @param out - An outgoing connector connector
 * @param edgeType - The edge type for the outgoing connector
 * @throw An error if the edge is invalid
 */
function validateEdge(conversionInfos: ConversionInfos, out: UI.Connector, edgeType: EdgeType) {
    const { source, target } = out;
    const sourceNode = conversionInfos[source];
    const targetNode = conversionInfos[target];
    const executionContext = sourceNode.executionContext!;

    if (edgeType === 'forward' || edgeType === 'cross') {
        if (sourceNode.executionContext !== targetNode.executionContext) {
            // you can only cross a boundary by following 'tree' edges
            failFlowCheck('crossBoundary');
        }
    } else if (edgeType === 'back') {
        // when an outgoing loop connector has the same loop as a target
        const isDegenerateLoop =
            sourceNode.isLoop && targetNode.isLoop && sourceNode.elementGuid === targetNode.elementGuid;

        // the only valid back edges are those that come from inside a loop and point back to the loop header
        if (executionContext.type !== 'loop' || target !== executionContext.id) {
            if (!isDegenerateLoop) {
                failFlowCheck('backEdge');
            }
        }
    }
}

/**
 * Validates the element's outgoing edges
 *
 * @param conversionInfos - The conversion infos
 * @param elementInfo - The element
 * @throw An error when an invalid edge is encountered
 */
function validateEdgeTypes(conversionInfos: ConversionInfos, elementInfo: ConversionInfo) {
    const { edgeTypes, faultEdgeType, outs, fault } = elementInfo;

    for (let i = 0; i < outs.length; i++) {
        validateEdge(conversionInfos, outs[i], edgeTypes![i]);
    }

    if (fault) {
        validateEdge(conversionInfos, fault, faultEdgeType!);
    }
}

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
                mergeGuid,
                branchingGuid,
                elementGuid,
                isLoop,
                outs
            } = elementInfo;

            validateEdgeTypes(conversionInfos, elementInfo);
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
            } else if (mergeGuid != null && conversionInfos[mergeGuid].branchingGuid !== elementGuid) {
                // validates a branching interval when a mergeGuid is encountered
                failFlowCheck('branchMergeNesting');
            } else if (branchingGuid != null && conversionInfos[branchingGuid].mergeGuid !== elementGuid) {
                // validates a branching interval when a mergeGuid is encountered
                failFlowCheck('branchMergeNesting');
            }
        }
    }
}
