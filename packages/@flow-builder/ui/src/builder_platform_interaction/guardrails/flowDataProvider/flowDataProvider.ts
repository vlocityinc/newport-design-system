// @ts-nocheck
import { ContextDataProvider } from 'analyzer_framework/api';
import { Flow } from './flow';

/**
 * Provides the Flow data used by Guardrails engine to execute rules against.
 */
export class FlowDataProvider extends ContextDataProvider {
    constructor() {
        super();
        this.model = undefined;
    }

    updateFlow(model) {
        if (typeof model !== 'undefined' && model !== null && Object.keys(model).length !== 0) {
            this.model = model;
        } else {
            throw new Error('Model cannot be undefined, null or empty');
        }
    }

    provide() {
        const flow = new Flow(this.model);
        return [flow];
    }
}
