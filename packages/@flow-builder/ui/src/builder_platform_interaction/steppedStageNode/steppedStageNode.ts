import { LightningElement, api } from 'lwc';
import { NodeResizeEvent } from 'builder_platform_interaction/flcEvents';
import { AddElementEvent, DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { SteppedStageItem } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { NodeRenderInfo } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './steppedStageNodeLabels';
import { format } from 'builder_platform_interaction/commonUtils';

export default class SteppedStageNode extends LightningElement {
    labels = LABELS;

    private _node?: NodeRenderInfo;
    private items: SteppedStageItem[] = [];

    private itemsHeader?: string;

    private width?: number;
    private height?: number;

    @api
    isSelectionMode?: boolean;

    @api
    get node() {
        return this._node;
    }

    set node(node) {
        this._node = node;

        // Refresh SteppedStageItem if needed
        if (node && node.metadata.dynamicNodeComponentSelector) {
            this.items = node.metadata.dynamicNodeComponentSelector(node.guid);

            this.itemsHeader =
                this.items.length === 1
                    ? this.labels.steppedStageItemHeaderSingular
                    : format(this.labels.steppedStageItemHeaderPlural, this.items.length);
        }
    }

    /**
     * Fires a NodeResizeEvent if the dimensions change after rendering
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

    /**
     * Adding SteppedStageItem directly from canvas
     * @param event
     */
    handleAddItem(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const addItemEvent = new AddElementEvent({
            elementType: ELEMENT_TYPE.STEPPED_STAGE_ITEM,
            parent: this.node && this.node.guid
        });
        this.dispatchEvent(addItemEvent);
    }

    /**
     * Open property editor for child element directly from canvas
     * @param event
     */
    handleOpenItemPropertyEditor(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const target: HTMLElement = event.currentTarget as HTMLElement;
        if (!this.isSelectionMode) {
            this.dispatchEvent(new EditElementEvent(target && target.dataset.itemGuid));
        }
    }

    /**
     * Deleting SteppedStageItem directly from canvas
     * @param event
     */
    handleDeleteItem(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        event.stopPropagation();
        const target: HTMLElement = event.currentTarget as HTMLElement;
        if (!this.isSelectionMode && target.dataset.itemGuid) {
            this.dispatchEvent(
                new DeleteElementEvent(
                    [target.dataset.itemGuid],
                    ELEMENT_TYPE.STEPPED_STAGE_ITEM,
                    undefined,
                    this.node && this.node.guid
                )
            );
        }
    }
}
