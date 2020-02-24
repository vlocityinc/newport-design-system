import { Rule, Result } from 'analyzer_framework/api';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
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

export class NoDMLInLoop extends Rule {
    invoke(context) {
        const flow = context.getData();
        if (flow.loops && flow.loops.length > 0) {
            flow.loops.forEach(loopElement => {
                const dmls = this.hasDml(loopElement, flow.consumerProperties.connectorTargets);
                dmls.forEach(dmlLabel => {
                    context.report(new Result(loopElement, [loopElement.label, dmlLabel]));
                });
            });
        }
    }

    hasDml(loop, connectorTargets) {
        let nextTarget = connectorTargets[loop.name];
        const dmlTypeLabels = [];
        const visited = {};
        while (nextTarget && !visited[nextTarget.next] && nextTarget.next !== loop.name) {
            visited[nextTarget.next] = true;

            nextTarget = connectorTargets[nextTarget.next];
            if (nextTarget && DML_TYPES.has(nextTarget.type)) {
                dmlTypeLabels.push(DML_TYPES.get(nextTarget.type));
            }
        }

        if (!nextTarget || nextTarget.next !== loop.name) {
            // not a closed loop
            return [];
        }
        return dmlTypeLabels;
    }
}
