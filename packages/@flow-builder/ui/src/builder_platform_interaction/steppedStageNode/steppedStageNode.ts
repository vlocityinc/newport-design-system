import { LightningElement, api, track } from 'lwc';
import { NodeResizeEvent } from 'builder_platform_interaction/flcEvents';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { SteppedStageItem } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { NodeRenderInfo } from 'builder_platform_interaction/autoLayoutCanvas';

export default class SteppedStageNode extends LightningElement {
    private _node?: NodeRenderInfo;

    @api
    get node() {
        return this._node;
    }

    set node(node) {
        this._node = node;

        // Refresh SteppedStageItem if needed
        if (node && node.metadata.dynamicNodeComponentSelector) {
            this.steps = node.metadata.dynamicNodeComponentSelector(node.guid).steps;
        }
    }

    @track
    steps: SteppedStageItem[] = [];

    width?: number;
    height?: number;

    /**
     *
     */
    renderedCallback() {
        const node: HTMLElement = this.template.querySelector('div');

        if (node && this.node) {
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

    handleAddStep(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const addStepEvent = new AddElementEvent({
            elementType: ELEMENT_TYPE.STEPPED_STAGE_ITEM,
            parent: this.node?.guid
        });
        this.dispatchEvent(addStepEvent);
    }
}
