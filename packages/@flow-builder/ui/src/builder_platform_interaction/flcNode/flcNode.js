import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { EditElementEvent, FlcSelectDeselectNodeEvent } from 'builder_platform_interaction/events';
import { isSystemElement, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

/**
 * Fixed Layout Canvas Node Component
 */
export default class FlcNode extends LightningElement {
    @api
    nodeInfo;

    @api
    isSelectionMode;

    get computedClassName() {
        return classSet('node')
            .add({ 'menu-opened': this.nodeInfo.menuOpened })
            .add({ 'is-new': this.nodeInfo.isNew })
            .toString();
    }

    get showCheckboxInSelectionMode() {
        return this.isSelectionMode && !isSystemElement(this.nodeInfo.metadata.value);
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
        return this.nodeInfo.metadata.value === ELEMENT_TYPE.START_ELEMENT ||
            this.nodeInfo.metadata.value === ELEMENT_TYPE.END_ELEMENT ||
            this.nodeInfo.metadata.value === ELEMENT_TYPE.ASSIGNMENT ||
            this.nodeInfo.metadata.value === ELEMENT_TYPE.SCREEN
            ? 'slds-is-absolute text-container'
            : 'slds-is-absolute text-container shifted-text-container';
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
