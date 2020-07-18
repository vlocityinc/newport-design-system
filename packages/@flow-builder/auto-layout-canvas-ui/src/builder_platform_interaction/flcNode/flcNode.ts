// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import { EditElementEvent, SelectNodeEvent } from 'builder_platform_interaction/events';
import { FlcSelectDeselectNodeEvent } from 'builder_platform_interaction/flcEvents';
import { classSet } from 'lightning/utils';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from './flcNodeLabels';

enum ConditionOptions {
    DEFAULT_PATH = 'DEFAULT_PATH',
    NO_PATH = 'NO_PATH'
}

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
    @api
    isReconnecting;

    get conditionOptionsForNode() {
        let conditionOptionsForNode;
        if (this.nodeInfo.conditionOptions) {
            conditionOptionsForNode = [
                ...this.nodeInfo.conditionOptions,
                {
                    label: this.nodeInfo.defaultConnectorLabel,
                    value: ConditionOptions.DEFAULT_PATH
                },
                {
                    label: this.labels.deleteAllPathsComboboxLabel,
                    value: ConditionOptions.NO_PATH
                }
            ];
        }
        return conditionOptionsForNode;
    }

    get rotateIconClass() {
        return this.nodeInfo.metadata.iconShape === ICON_SHAPE.DIAMOND
            ? 'rotated-icon-radius slds-icon-standard-decision'
            : '';
    }

    get svgClass() {
        let classes = '';
        if (this.nodeInfo.metadata.iconBackgroundColor) {
            classes = this.nodeInfo.metadata.iconBackgroundColor;
        }

        if (this.nodeInfo.metadata.iconShape === ICON_SHAPE.CIRCLE) {
            classes = `${classes} slds-icon__container_circle`;
        } else if (this.nodeInfo.metadata.iconShape === ICON_SHAPE.DIAMOND) {
            classes = `${classes} rotate-icon-svg`;
        }

        return classes;
    }

    get iconSize() {
        return this.nodeInfo.metadata.iconSize || 'large';
    }

    get showCheckboxInSelectionMode() {
        const { type } = this.nodeInfo.metadata;
        const isValidType =
            (this.isReconnecting && type === ElementType.END) ||
            ![ElementType.START, ElementType.END, ElementType.ROOT].includes(type);

        return this.isSelectionMode && isValidType;
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

    get showElementType() {
        return this.nodeInfo.metadata.type !== ElementType.END;
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
        const { type } = this.nodeInfo.metadata;
        if (!this.isSelectionMode && type !== ElementType.END) {
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
