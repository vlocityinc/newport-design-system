import { LightningElement, api } from 'lwc';
import { ElementType } from 'builder_platform_interaction/flowUtils';
import { EditElementEvent, FlcSelectDeselectNodeEvent, SelectNodeEvent } from 'builder_platform_interaction/events';
import { classSet } from 'lightning/utils';
import { LABELS } from './flcNodeLabels';

/**
 * Autolayout Canvas Node Component
 */
export default class FlcNode extends LightningElement {
    @api
    nodeInfo;

    @api
    isSelectionMode;

    get labels() {
        return LABELS;
    }

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
                    label: this.labels.deleteAllPathsComboboxLabel,
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
        return this.nodeInfo && this.nodeInfo.config && !this.nodeInfo.config.isSelectable;
    }

    get checkboxIconName() {
        return this.nodeInfo.config && this.nodeInfo.config.isSelected ? 'utility:check' : 'utility:add';
    }

    get checkboxVariant() {
        return this.nodeInfo.config && this.nodeInfo.config.isSelected ? 'brand' : 'border-filled';
    }

    get textContainerClasses() {
        const shifted = (this.nodeInfo.flows || []).length > 0 || this.nodeInfo.faultFlow != null;
        const hidden = this.nodeInfo.menuOpened;
        return classSet('slds-is-absolute text-container').add({
            shifted,
            hidden
        });
    }

    /**
     * Handles the edit element event and fires SelectNodeEvent
     *
     * When 'single click updates the store' is implemented in the future,
     * this.nodeInfo.config.isSelected inside the event can be read
     * by handlers at different levels to learn about the historical selection
     * status even after the store is updated
     *
     * @param {object} event - clicked event coming from flcButtonMenu.js
     */
    handleButtonClick(event) {
        event.stopPropagation();
        if (!this.isSelectionMode) {
            const nodeSelectedEvent = new SelectNodeEvent(
                this.nodeInfo.guid,
                undefined,
                this.nodeInfo.config.isSelected
            );
            this.dispatchEvent(nodeSelectedEvent);
        }
    }

    /**
     * Handles double click on the node and dispatches the EditElementEvent
     *
     * @param {object} event - double click event fired on double clicking the node
     */
    handleOnDblClick(event) {
        event.stopPropagation();
        if (!this.isSelectionMode) {
            this.dispatchEvent(new EditElementEvent(this.nodeInfo.guid));
        }
    }

    /**
     * Handles the click on the selection checkbox and dispatches an event to toggle
     * the selected state of the node.
     *
     * @param {object} event - click event fired when clicking on the selection checkbox
     */
    handleSelectionCheckboxClick = event => {
        event.stopPropagation();
        const toggleNodeSelectionEvent = new FlcSelectDeselectNodeEvent(
            this.nodeInfo.guid,
            this.nodeInfo.config.isSelected
        );
        this.dispatchEvent(toggleNodeSelectionEvent);
    };
}
