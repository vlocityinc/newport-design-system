import { LightningElement, api } from 'lwc';
import { ElementType } from 'builder_platform_interaction/flowUtils';
import { EditElementEvent, FlcSelectDeselectNodeEvent } from 'builder_platform_interaction/events';

/**
 * Autolayout Canvas Node Component
 */
export default class FlcNode extends LightningElement {
    @api
    nodeInfo;

    @api
    isSelectionMode;

    get conditionOptionsForNode() {
        let conditionOptionsForNode;
        if (this.nodeInfo.conditionOptions) {
            conditionOptionsForNode = [
                ...this.nodeInfo.conditionOptions,
                {
                    label: this.nodeInfo.defaultConnectorLabel,
                    value: 'DEFAULT_PATH'
                },
                {
                    label: 'None: Delete All Outcomes',
                    value: 'NO_PATH'
                }
            ];
        }
        return conditionOptionsForNode;
    }

    get showCheckboxInSelectionMode() {
        const { type } = this.nodeInfo.metadata;
        return this.isSelectionMode && ![ElementType.START, ElementType.END, ElementType.ROOT].includes(type);
    }

    get shouldDisableCheckbox() {
        return this.nodeInfo && this.nodeInfo.config && !this.nodeInfo.config.canSelect;
    }

    get checkboxIconName() {
        return this.nodeInfo.config && this.nodeInfo.config.isSelected ? 'utility:check' : 'utility:add';
    }

    get checkboxVariant() {
        return this.nodeInfo.config && this.nodeInfo.config.isSelected ? 'brand' : 'border-filled';
    }

    get textContainerClasses() {
        return this.nodeInfo.metadata.type === ElementType.BRANCH
            ? 'slds-is-absolute text-container shifted-text-container'
            : 'slds-is-absolute text-container';
    }

    handleOnDblClick(event) {
        event.stopPropagation();
        if (!this.isSelectionMode) {
            this.dispatchEvent(new EditElementEvent(this.nodeInfo.guid));
        }
    }

    handleSelectionCheckboxClick = event => {
        event.stopPropagation();
        const nodeSelectionEvent = new FlcSelectDeselectNodeEvent(this.nodeInfo.guid, this.nodeInfo.config.isSelected);
        this.dispatchEvent(nodeSelectionEvent);
    };
}
