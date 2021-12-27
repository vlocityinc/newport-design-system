// @ts-nocheck
import { isRecordTriggeredFlow, startElementDescription } from 'builder_platform_interaction/alcCanvasUtils';
import { clamp } from 'builder_platform_interaction/clampLib';
import { getPropertyOrDefaultToTrue } from 'builder_platform_interaction/commonUtils';
import { isTestMode } from 'builder_platform_interaction/contextLib';
import { getDrawingLibInstance } from 'builder_platform_interaction/drawingLib';
import { getConfigForElement, ICON_SHAPE } from 'builder_platform_interaction/elementConfig';
import { shouldSupportScheduledPaths } from 'builder_platform_interaction/elementFactory';
import {
    DeleteElementEvent,
    DragNodeEvent,
    DragNodeStopEvent,
    EditElementEvent,
    NodeMouseDownEvent,
    SelectNodeEvent
} from 'builder_platform_interaction/events';
import { ELEMENT_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { commonUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { api, LightningElement, track } from 'lwc';
import nodeElement from './node.html';
import { LABELS } from './nodeLabels';
import startNode from './startNode.html';

const { format } = commonUtils;
const { logInteraction } = loggingUtils;

/**
 * Node component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

const { NONE, SCHEDULED, SCHEDULED_JOURNEY, PLATFORM_EVENT } = FLOW_TRIGGER_TYPE;

export default class Node extends LightningElement {
    @api
    node = {
        config: {}
    };

    @api
    disableDelete = false;

    @api
    disableDrag = false;

    @api
    disableAddConnectors = false;

    @api
    disableMultiSelect = false;

    @track
    endPointStyle = '';

    currentStartNodeHeight = null;

    currentNodeLabel = null;

    get labels() {
        return LABELS;
    }

    getNodeConfig() {
        return getConfigForElement(this.node).nodeConfig;
    }

    isSelectable() {
        return getPropertyOrDefaultToTrue(this.getNodeConfig(), 'isSelectable');
    }

    isEditable() {
        return getPropertyOrDefaultToTrue(this.getNodeConfig(), 'isEditable');
    }

    getIconShape() {
        return this.getNodeConfig().iconShape;
    }

    getAdditionalClasses() {
        let classes = '';
        if (this.node.config.isSelected) {
            classes = `${classes} selected`;
        }

        if (this.node.config.hasError) {
            classes = `${classes} has-error`;
        }

        return classes;
    }

    get nodeLocation() {
        return `left: ${this.node.locationX}px; top: ${this.node.locationY}px`;
    }

    get nodeClasses() {
        let classes = 'icon-section slds-align_absolute-center';
        if (this.getIconShape() === ICON_SHAPE.DIAMOND) {
            classes = `${classes} decision-icon-section`;
        }

        return `${classes} ${this.getAdditionalClasses()}`;
    }

    get startBoxClasses() {
        const classes = 'start-node-box';
        return `${classes} ${this.getAdditionalClasses()}`;
    }

    get rotateIconClass() {
        return this.getIconShape() === ICON_SHAPE.DIAMOND ? 'rotate-icon' : '';
    }

    get buttonClass() {
        return this.getIconShape() === ICON_SHAPE.CIRCLE
            ? `icon slds-icon_container slds-icon__container_circle`
            : `icon slds-icon_container`;
    }

    get iconName() {
        return this.getNodeConfig().iconName;
    }

    get iconShape() {
        return this.getIconShape();
    }

    get iconSize() {
        return this.getNodeConfig().iconSize || 'large';
    }

    get iconBackgroundColor() {
        return this.getNodeConfig().iconBackgroundColor;
    }

    get hasAvailableConnections() {
        return this.node.maxConnections !== this.node.connectorCount && !this.disableAddConnectors;
    }

    get showTrashIcon() {
        return (
            this.node.config.isSelected &&
            getPropertyOrDefaultToTrue(getConfigForElement(this.node), 'isDeletable') &&
            !this.disableDelete
        );
    }

    get nodeIconTitle() {
        // Special case if elementType equals START_ELEMENT
        if (this.node.elementType === ELEMENT_TYPE.START_ELEMENT) {
            switch (this.node.triggerType) {
                case NONE:
                    return this.labels.nodeIconTitleStartDefault;
                case SCHEDULED:
                case SCHEDULED_JOURNEY:
                    return this.labels.nodeIconTitleStartScheduled;
                default:
                    return '';
            }
        }

        return format(this.labels.nodeIconTitle, getConfigForElement(this.node).labels.singular, this.node.label);
    }

    get startIconFlowType() {
        return startElementDescription(this.node.triggerType);
    }

    get trashCanAlternativeText() {
        return format(
            this.labels.trashCanAlternativeText,
            getConfigForElement(this.node).labels.singular,
            this.node.label
        );
    }

    get nodeLabel() {
        return getPropertyOrDefaultToTrue(this.getNodeConfig(), 'showLabel') ? this.node.label : '';
    }

    get nodeTypeLabel() {
        return getConfigForElement(this.node).labels.singular;
    }

    /**
     * Build main parent template div class adding some "test mode only" value to it to ease up Selenium effort
     */
    get parentDivComputedClass() {
        let classes = 'node-container slds-is-absolute slds-text-align_center';

        if (!this.isSelectable()) {
            classes = `${classes} nonselectable-cursor-style`;
        }

        if (this.node.config.isHighlighted) {
            classes = `${classes} highlighted-container`;
        }

        if (isTestMode()) {
            classes = `${classes} test-node-${(this.node.elementType || '').toLowerCase()}`;
        }

        if (this.node.config.isSelected) {
            classes = `${classes} node-selected`;
        }

        if (this.node.config.hasError) {
            classes = `${classes} node-has-error`;
        }

        return classes;
    }

    get parentStartDivComputedClass() {
        let classes = 'start-node-container slds-is-absolute slds-text-align_center';

        if (!this.isSelectable()) {
            classes = `${classes} nonselectable-cursor-style`;
        }

        if (this.node.config.isHighlighted) {
            classes = `${classes} highlighted-container`;
        }

        if (isTestMode()) {
            classes = `${classes} test-node-${(this.node.elementType || '').toLowerCase()}`;
        }

        return classes;
    }

    isMultiSelect(event) {
        if (event && event.shiftKey) {
            return event.shiftKey;
        }
        return false;
    }

    isNodeDragging = false;

    /**
     * Handles the node click event on node div and fires off a nodeSelected event.
     *
     * @param {object} event - node clicked event
     */
    handleNodeClick = (event) => {
        event.stopPropagation();
        const isMultiSelectKeyPressed = this.isMultiSelect(event);

        if (
            this.isSelectable() &&
            (!this.node.config.isSelected || !this.isNodeDragging) &&
            (!isMultiSelectKeyPressed || (isMultiSelectKeyPressed && !this.disableMultiSelect))
        ) {
            const nodeSelectedEvent = new SelectNodeEvent(
                this.node.guid,
                isMultiSelectKeyPressed,
                this.node.config.isSelected
            );
            this.dispatchEvent(nodeSelectedEvent);
        }
        this.isNodeDragging = false;
    };

    /**
     * Handles the node double click event on node div and fires off a edit element event.
     *
     * @param {object} event - node double clicked event
     */
    handleDblClick = (event) => {
        event.stopPropagation();

        if (this.isEditable()) {
            const canvasElementGUID = this.node.guid;
            const editElementEvent = new EditElementEvent(canvasElementGUID);
            this.dispatchEvent(editElementEvent);
        }
    };

    /**
     * Fires an event to delete the node. We are passing the guid as an array
     * since multiple elements can be deleted using the delete key.
     *
     * @param {object} event - trash can click event
     */
    handleTrashClick = (event) => {
        event.stopPropagation();
        if (!this.isNodeDragging) {
            const { guid, elementType } = this.node;
            const deleteEvent = new DeleteElementEvent([guid], elementType);
            this.dispatchEvent(deleteEvent);
            logInteraction(`element-trash-can-icon`, 'node-icon', { guid, elementType }, 'click');
        }
        this.isNodeDragging = false;
    };

    /**
     * Handles the mouse down event on node div and fires off a node mousedown event.
     *
     * @param {object} event - node mousedown event
     */
    handleMouseDown = () => {
        const mouseDownEvent = new NodeMouseDownEvent(this.node.guid);
        this.dispatchEvent(mouseDownEvent);
    };

    /**
     * Marks the current node selected and deselects the rest (if not multi-selected)
     * as soon as drag begins
     *
     * @param {object} event - drag start event
     */
    @api
    dragStart = (event) => {
        this.isNodeDragging = true;
        if (this.isSelectable() && !this.node.config.isSelected) {
            const isMultiSelectKeyPressed = this.isMultiSelect(event.e);
            const nodeSelectedEvent = new SelectNodeEvent(this.node.guid, isMultiSelectKeyPressed);
            this.dispatchEvent(nodeSelectedEvent);
        }
    };

    /**
     * Updates the location of the node once the user stops dragging it on the canvas.
     *
     * @param {object} event - drag stop event
     */
    @api
    dragStop = (event) => {
        if (
            (event.finalPos[0] !== this.node.locationX || event.finalPos[1] !== this.node.locationY) &&
            event.selection &&
            event.selection.length > 0
        ) {
            const dragStopEvent = new DragNodeStopEvent(event.selection);
            this.dispatchEvent(dragStopEvent);
        }
    };

    /**
     * Updates the location of the node while the user is dragging it on the canvas.
     *
     * @param {object} event - drag event
     */
    @api
    drag = (event) => {
        const dragNodeEvent = new DragNodeEvent(this.node.guid, event.pos[0], event.pos[1]);
        this.dispatchEvent(dragNodeEvent);
    };

    @api focus() {
        this.template.querySelector('button.icon').focus();
    }

    get isTrigger() {
        switch (this.node.triggerType) {
            case NONE:
                return false;
            default:
                return true;
        }
    }

    get isContext() {
        switch (this.node.triggerType) {
            case NONE:
            case PLATFORM_EVENT:
                return false;
            default:
                return true;
        }
    }

    get isScheduledPath() {
        return shouldSupportScheduledPaths(this.node);
    }

    get isRecordTriggeredFlow() {
        // merge trigger button and context button when it is record-triggered flow
        return isRecordTriggeredFlow(this.node.triggerType);
    }

    render() {
        // Has to be the StartElement and set a processType i.e. not NBA
        if (this.node.elementType === ELEMENT_TYPE.START_ELEMENT && getProcessType()) {
            return startNode;
        }
        return nodeElement;
    }

    renderedCallback() {
        const canvasElementContainer = this.template.querySelector('.node-container');

        // revalidate the specific canvas element when it is being rendered (in case the canvas element's location has been programmatically updated)
        if (canvasElementContainer && canvasElementContainer.getAttribute('id')) {
            getDrawingLibInstance().revalidate(canvasElementContainer);
        }

        const textElementLabel = this.template.querySelector('.text-element-label');
        if (textElementLabel && this.nodeLabel !== this.currentNodeLabel) {
            clamp(textElementLabel, {
                label: this.nodeLabel
            });
        }
        this.currentNodeLabel = this.nodeLabel;

        // End point dynamic position based on start node container height
        if (this.node.elementType === ELEMENT_TYPE.START_ELEMENT && getProcessType()) {
            const startContainer = this.template.querySelector('.start-node-container');
            if (startContainer && startContainer.offsetHeight !== this.currentStartNodeHeight) {
                this.currentStartNodeHeight = startContainer.offsetHeight;
                const boxTop = (1 - 10 / this.currentStartNodeHeight) * 100;
                this.endPointStyle = `top: ${boxTop}%;`;
                if (startContainer.getAttribute('id')) {
                    getDrawingLibInstance().revalidate(startContainer);
                }
            }
        }
    }
}
