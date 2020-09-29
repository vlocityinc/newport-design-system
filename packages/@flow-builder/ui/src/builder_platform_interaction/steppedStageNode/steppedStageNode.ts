import { LightningElement, api, track } from 'lwc';
import { NodeResizeEvent } from 'builder_platform_interaction/flcEvents';

export default class SteppedStageNode extends LightningElement {
    @api node;

    @track
    steps: string[] = ['Step 1'];

    width?: number;
    height?: number;

    /**
     *
     */
    renderedCallback() {
        const node: HTMLElement = this.template.querySelector('div');

        if (node) {
            const rect: DOMRect = node.getBoundingClientRect();

            // Only fire the event if the height or width have changed
            if (rect.width !== this.width || rect.height !== this.height) {
                this.width = rect.width;
                this.height = rect.height;
                const event = new NodeResizeEvent(this.node.guid, this.width, this.height);
                this.dispatchEvent(event);
            }
        }
    }

    handleAddStep(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.steps.push('Step ' + (this.steps.length + 1));
    }
}
