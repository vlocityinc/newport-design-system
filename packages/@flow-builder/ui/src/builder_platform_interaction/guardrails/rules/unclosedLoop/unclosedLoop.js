import { Rule, Result } from 'analyzer_framework/api';

export class UnclosedLoop extends Rule {
    invoke(context) {
        const flow = context.getData();
        if (flow.loops && flow.loops.length > 0) {
            flow.loops.forEach(loopElement => {
                if (!this.hasLoop(loopElement, flow.consumerProperties.connectorTargets)) {
                    context.report(new Result(loopElement, [loopElement.label]));
                }
            });
        }
    }

    hasLoop(loop, connectorTargets) {
        let nextTarget = connectorTargets[loop.name];
        const visited = {};
        while (nextTarget && !visited[nextTarget.next]) {
            visited[nextTarget.next] = true;

            nextTarget = connectorTargets[nextTarget.next];
            if (nextTarget && nextTarget.next === loop.name) {
                return true;
            }
        }

        return false;
    }
}
