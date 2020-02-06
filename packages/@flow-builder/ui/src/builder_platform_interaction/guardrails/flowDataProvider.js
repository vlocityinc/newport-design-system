import { ContextDataProvider } from 'analyzer_framework/api';
// import { Flow } from './flow';

/**
 * Provides the Flow data used by Guardrails engine to execute rules against.
 */
export class FlowDataProvider extends ContextDataProvider {
    constructor() {
        super();
        this.flow = undefined;
    }

    updateFlow() {
        // TODO update in data provider impl story
        // this.flow = new Flow(flow);
    }

    provide() {
        // return [this.flow];
        return [];
    }
}
