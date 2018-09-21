import { LightningElement, api } from 'lwc';
import { getConfigForElementType } from "builder_platform_interaction/elementConfig";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { CANVAS_EVENT, EditElementEvent, DeleteElementEvent } from "builder_platform_interaction/events";
import { LABELS } from "./nodeLabels";
import { format } from "builder_platform_interaction/commonUtils";
import startElement from "./startElement.html";
import nodeElement from './node.html';
import { isTestMode } from "builder_platform_interaction/contextLib";


/**
 * Node component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

export default class Node extends LightningElement {
    @api node = {
        config: {}
    };

    get nodeGuid() {
        return this.node.guid;
    }

    get nodeLocation() {
        return `left: ${this.node.locationX}px; top: ${this.node.locationY}px`;
    }

    get nodeClasses() {
        let classes = 'icon-section slds-align_absolute-center';

        if (this.node.elementType === ELEMENT_TYPE.DECISION) {
            classes = `${classes} decision-icon-section`;
        }

        if (this.node.config.isSelected) {
            classes = `${classes} selected`;
        }
        return classes;
    }

    get rotateIconClass() {
        let rotateIconClass = '';
        if (this.node.elementType === ELEMENT_TYPE.DECISION) {
            rotateIconClass = 'rotate-icon';
        }
        return rotateIconClass;
    }

    get iconName() {
        return getConfigForElementType(this.node.elementType).nodeConfig.iconName;
    }

    get hasAvailableConnections() {
        return (this.node.maxConnections !== this.node.connectorCount);
    }

    get isSelected() {
        return this.node.config.isSelected;
    }

    get nodeIconTitle() {
        return format(LABELS.nodeIconTitle, getConfigForElementType(this.node.elementType).labels.singular, this.node.label);
    }

    get endPointTitle() {
        return LABELS.endPointTitle;
    }

    get trashCanAlternativeText() {
        return format(LABELS.trashCanAlternativeText, getConfigForElementType(this.node.elementType).labels.singular, this.node.label);
    }

    get nodeLabel() {
        return this.node.label;
    }

    get nodeTypeLabel() {
        return getConfigForElementType(this.node.elementType).labels.singular;
    }

    /**
     * Is the component running in test mode?
     */
    get isTestMode() {
        return isTestMode();
    }

    /**
     * Build the 'test mode only' class used to ease up Selenium effort
     */
    get computedTestClass() {
        return `test-node-${(this.node.elementType || '').toLowerCase()}`;
    }

    isMultiSelect(event) {
        return event.shiftKey || event.metaKey;
    }

    isNodeDragging = false;

    /**
     * Handles the node click event on node div and fires off a nodeSelected event.
     * @param {object} event - node clicked event
     */
    handleNodeClick = (event) => {
        event.stopPropagation();
        const isMultiSelectKeyPressed = this.isMultiSelect(event);
        if (!this.node.config.isSelected || !this.isNodeDragging) {
            const nodeSelectedEvent = new CustomEvent(CANVAS_EVENT.NODE_SELECTED, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    canvasElementGUID: this.node.guid,
                    isMultiSelectKeyPressed
                }
            });
            this.dispatchEvent(nodeSelectedEvent);
        }
        this.isNodeDragging = false;
    };

    /**
     * Handles the node double click event on node div and fires off a edit element event.
     * @param {object} event - node double clicked event
     */
    handleDblClick = (event) => {
        event.stopPropagation();
        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID);
        this.dispatchEvent(editElementEvent);
    };

    /**
     * Fires an event to delete the node.
     * @param {object} event - trash can click event
     */
    handleTrashClick = (event) => {
        event.stopPropagation();
        if (!this.isNodeDragging) {
            const deleteEvent = new DeleteElementEvent([this.node.guid], this.node.elementType);
            this.dispatchEvent(deleteEvent);
        }
        this.isNodeDragging = false;
    };

    /**
     * Handles the mouse down event on node div and fires off a node mousedown event.
     * @param {object} event - node mousedown event
     */
    handleMouseDown = () => {
        const mouseDownEvent = new CustomEvent(CANVAS_EVENT.NODE_MOUSE_DOWN, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID: this.node.guid
            }
        });

        this.dispatchEvent(mouseDownEvent);
    };

    /**
     * Marks the current node selected and deselects the rest (if not multi-selected)
     * as soon as drag begins
     * @param {object} event - drag start event
     */
    @api dragStart = (event) => {
        this.isNodeDragging = true;
        if (!this.node.config.isSelected) {
            const isMultiSelectKeyPressed = this.isMultiSelect(event.e);
            const nodeSelectedEvent = new CustomEvent(CANVAS_EVENT.NODE_SELECTED, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    canvasElementGUID: this.node.guid,
                    isMultiSelectKeyPressed
                }
            });
            this.dispatchEvent(nodeSelectedEvent);
        }
    };

    /**
     * Updates the location of the node once the user stops dragging it on the canvas.
     * @param {object} event - drag stop event
     */
    @api dragStop = (event) => {
        if (event.finalPos[0] !== this.node.locationX || event.finalPos[1] !== this.node.locationY) {
            const dragStopEvent = new CustomEvent(CANVAS_EVENT.DRAG_STOP, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    canvasElementGUID: this.node.guid,
                    elementType: this.node.elementType,
                    locationX: event.finalPos[0],
                    locationY: event.finalPos[1]
                }
            });
            this.dispatchEvent(dragStopEvent);
        }
    };

    /**
     * Updates the location of the node while the user is dragging it on the canvas.
     * @param {object} event - drag event
     */
    @api drag = (event) => {
        const dragNodeEvent = new CustomEvent(CANVAS_EVENT.DRAG_NODE, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID: this.node.guid,
                locationX: event.pos[0],
                locationY: event.pos[1]
            }
        });
        this.dispatchEvent(dragNodeEvent);
    };

    render() {
        if (this.node.elementType === ELEMENT_TYPE.START_ELEMENT) {
            return startElement;
        }
        return nodeElement;
    }
}