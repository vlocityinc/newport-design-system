// @ts-nocheck
import { Rule, Result } from 'analyzer_framework/api';
import { ELEMENT_TYPE, METADATA_KEY } from 'builder_platform_interaction/flowMetadata';
import recordCreate from '@salesforce/label/FlowBuilderLeftPanelElements.createDataOperationLabel';
import recordUpdate from '@salesforce/label/FlowBuilderLeftPanelElements.updateDataOperationLabel';
import recordDelete from '@salesforce/label/FlowBuilderLeftPanelElements.deleteDataOperationLabel';
import recordLookup from '@salesforce/label/FlowBuilderLeftPanelElements.lookupDataOperationLabel';

const DML_TYPES = new Map([
    [ELEMENT_TYPE.RECORD_LOOKUP, recordLookup],
    [ELEMENT_TYPE.RECORD_CREATE, recordCreate],
    [ELEMENT_TYPE.RECORD_UPDATE, recordUpdate],
    [ELEMENT_TYPE.RECORD_DELETE, recordDelete]
]);

const DML_ARRAYS = new Map([
    [ELEMENT_TYPE.RECORD_LOOKUP, METADATA_KEY.RECORD_LOOKUPS],
    [ELEMENT_TYPE.RECORD_CREATE, METADATA_KEY.RECORD_CREATES],
    [ELEMENT_TYPE.RECORD_UPDATE, METADATA_KEY.RECORD_UPDATES],
    [ELEMENT_TYPE.RECORD_DELETE, METADATA_KEY.RECORD_DELETES]
]);

export class NoDMLInLoop extends Rule {
    invoke(context) {
        const flow = context.getData();
        if (flow.loops && flow.loops.length > 0) {
            const dmlsWithTips = new Set();
            flow.loops.forEach((loopElement) => {
                const { isClosed, dmls } = this.getDmlsInLoop(
                    loopElement,
                    flow.consumerProperties.connectorTargets,
                    flow
                );
                if (isClosed) {
                    dmls.forEach((dml) => {
                        if (!dmlsWithTips.has(dml.element.id)) {
                            context.report(new Result([dml.element], [dml.type, dml.element.label]));
                            dmlsWithTips.add(dml.element.id);
                        }
                    });
                }
            });
        }
    }

    getDmlsInLoop(loop, connectorTargets, flow) {
        const visited = {};
        return this.getDmlsInPath(loop, loop.name, connectorTargets, visited, flow);
    }

    getDmlsInPath(loop, element, connectorTargets, visited, flow) {
        let dmls = [];
        let isClosed = false;
        if (connectorTargets[element]) {
            for (const nextTarget of connectorTargets[element].next) {
                // Skip the no more values connector for the loop
                const isParentLoopNoMoreValueConnector =
                    element === loop.name &&
                    loop.noMoreValuesConnector &&
                    loop.noMoreValuesConnector.targetReference === nextTarget;
                if (!isParentLoopNoMoreValueConnector) {
                    if (nextTarget === loop.name) {
                        isClosed = true;
                    } else if (connectorTargets[nextTarget] && !visited[nextTarget]) {
                        if (connectorTargets[nextTarget].type && DML_TYPES.has(connectorTargets[nextTarget].type)) {
                            const dmlElement = this.findDMLElement(flow, connectorTargets[nextTarget].type, nextTarget);
                            dmls.push({
                                type: DML_TYPES.get(connectorTargets[nextTarget].type),
                                element: dmlElement
                            });
                        }
                        visited[nextTarget] = true;
                        const childValues = this.getDmlsInPath(loop, nextTarget, connectorTargets, visited, flow);
                        const isChildClosed = childValues.isClosed;
                        const childDmls = childValues.dmls;
                        isClosed = isClosed || isChildClosed;
                        dmls = dmls.concat(childDmls);
                    }
                }
            }
        }
        return { isClosed, dmls };
    }

    findDMLElement(flow, dmlType, dmlId) {
        const dmlArrayName = DML_ARRAYS.get(dmlType);
        const dmlArray = flow[dmlArrayName];
        if (dmlArray) {
            for (const dml of dmlArray) {
                if (dml.id === dmlId) {
                    return dml;
                }
            }
        }
        return null;
    }
}
