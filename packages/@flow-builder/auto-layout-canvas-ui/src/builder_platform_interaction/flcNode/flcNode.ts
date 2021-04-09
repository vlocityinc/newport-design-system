// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { EditElementEvent, SelectNodeEvent } from 'builder_platform_interaction/events';
import { FlcSelectDeselectNodeEvent } from 'builder_platform_interaction/flcEvents';
import { classSet } from 'lightning/utils';
import { ICON_SHAPE, AutoLayoutCanvasMode } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from './flcNodeLabels';

enum ConditionOptions {
    DEFAULT_PATH = 'DEFAULT_PATH',
    NO_PATH = 'NO_PATH'
}

/**
 * Autolayout Canvas Node Component
 */
export default class FlcNode extends LightningElement {
    _nodeInfo;

    private dynamicNodeConstructor: Function;
    private dynamicNodeData: any;

    @api
    get nodeInfo() {
        return this._nodeInfo;
    }

    /**
     * For dynamic node components, call their dynamicNodeComponentSelector
     * with the node guid.  This guarantees that the data refreshes on any
     * change to the node.
     */
    set nodeInfo(nodeInfo) {
        this._nodeInfo = nodeInfo;

        if (nodeInfo && nodeInfo.metadata.dynamicNodeComponent) {
            if (nodeInfo.metadata.dynamicNodeComponentSelector) {
                this.dynamicNodeData = nodeInfo.metadata.dynamicNodeComponentSelector(nodeInfo.guid);
            }

            this.processDynamicNodeComponent(nodeInfo.metadata.dynamicNodeComponent);
        }
    }

    @api
    canvasMode!: AutoLayoutCanvasMode;

    get labels() {
        return LABELS;
    }

    @api
    isCanvasReady;

    get isDefaultMode() {
        return this.canvasMode === AutoLayoutCanvasMode.DEFAULT;
    }

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
            (this.canvasMode === AutoLayoutCanvasMode.RECONNECTION && type === NodeType.END) ||
            ![NodeType.START, NodeType.END, NodeType.ROOT].includes(type);

        return this.canvasMode !== AutoLayoutCanvasMode.DEFAULT && isValidType;
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

    get iconContainerClasses() {
        return classSet('icon-container')
            .add({
                'menu-opened': this.nodeInfo.menuOpened
            })
            .toString();
    }

    get nodeLabel() {
        let label = this.nodeInfo.label;
        // Start has a dynamic label that is set in the metadata.
        if (!label && this.nodeInfo.metadata.type === NodeType.START) {
            label = this.nodeInfo.metadata.description;
        }
        return label;
    }

    get ariaLabel() {
        // Use description in metadata as label for element whose label is not set (start node for example)
        const label = this.nodeInfo.label ? this.nodeInfo.label : this.nodeInfo.metadata.description;
        return `[${this.nodeInfo.metadata.elementType}] ${label}`;
    }

    get showElementType() {
        return this.nodeInfo.metadata.type !== NodeType.END;
    }

    get hasIncomingGoto() {
        return this.nodeInfo.node && this.nodeInfo.node.incomingGoTo && this.nodeInfo.node.incomingGoTo.length > 0;
    }

    /**
     * Import the constructor and update the component params
     *
     * Note: all of this needs to happen in a single tick, otherwise the component
     * constructor and params could be out of sync (old constructor with new params
     * or new constructor with old params)
     */
    // eslint-disable-next-line @lwc/lwc/no-async-await
    async processDynamicNodeComponent(comp: string): Promise<void> {
        // TODD: include node attributeInfo

        if (comp) {
            // eslint-disable-next-line lwc-core/no-dynamic-import, lwc-core/no-dynamic-import-identifier
            const module = await import(comp);

            this.dynamicNodeConstructor = module.default;
        }
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
        if (this.canvasMode === AutoLayoutCanvasMode.DEFAULT && type !== NodeType.END) {
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
        const { type } = this.nodeInfo.metadata;
        if (type !== NodeType.START && type !== NodeType.END && this.canvasMode === AutoLayoutCanvasMode.DEFAULT) {
            this.dispatchEvent(new EditElementEvent(this.nodeInfo.guid));
        }
    }

    /**
     * Handles the click on the selection checkbox and dispatches an event to toggle
     * the selected state of the node.
     *
     * @param {object} event - click event fired when clicking on the selection checkbox
     */
    handleSelectionCheckboxClick = (event) => {
        event.stopPropagation();
        const toggleNodeSelectionEvent = new FlcSelectDeselectNodeEvent(
            this.nodeInfo.guid,
            this.nodeInfo.config.isSelected
        );
        this.dispatchEvent(toggleNodeSelectionEvent);
    };

    @api
    focus() {
        this.template.querySelector('builder_platform_interaction-flc-button-menu').focus();
    }
}
