// @ts-nocheck
import { Rule, Result } from 'analyzer_framework/api';

export class UnclosedLoop extends Rule {
    invoke(context) {
        const flow = context.getData();
        if (flow.loops && flow.loops.length > 0) {
            flow.loops.forEach(loopElement => {
                if (!this.hasLoop(loopElement, flow.consumerProperties.connectorTargets)) {
                    context.report(new Result([loopElement], [loopElement.label]));
                }
            });
        }
    }

    hasLoop(loop, connectorTargets) {
        return this.isConnected(loop.name, loop, connectorTargets, {});
    }

    isConnected(element, loop, connectorTargets, visited) {
        if (connectorTargets[element]) {
            for (const nextTarget of connectorTargets[element].next) {
                // Skip the no more values connector for the loop
                const isParentLoopNoMoreValueConnector =
                    element === loop.name &&
                    loop.noMoreValuesConnector &&
                    loop.noMoreValuesConnector.targetReference === nextTarget;
                if (!isParentLoopNoMoreValueConnector) {
                    if (nextTarget === loop.name) {
                        return true;
                    } else if (nextTarget && connectorTargets[nextTarget] && !visited[nextTarget]) {
                        visited[nextTarget] = true;
                        if (this.isConnected(nextTarget, loop, connectorTargets, visited)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}
