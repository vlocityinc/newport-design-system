import { Element, api } from 'engine';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { EditElementEvent, CANVAS_EVENT } from 'builder_platform_interaction-events';
import labelAlternativeText from '@label/FlowBuilderCanvasElement.labelAlternativeText';
import descriptionAlternativeText from '@label/FlowBuilderCanvasElement.descriptionAlternativeText';
import trashCanAlternativeText from '@label/FlowBuilderCanvasElement.trashCanAlternativeText';
import startElement from './start-element.html';
import nodeElement from './node.html';

/**
 * Node component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

export default class Node extends Element {
    @api node = {
        config: {}
    };

    get nodeGuid() {
        return this.node.guid;
    }

    get nodeLocation() {
        return `left: ${this.node.locationX}px; top: ${this.node.locationY}px`;
    }

    get nodeTitle() {
        let title = `${labelAlternativeText}: ${this.node.label}`;
        if (this.node.description) {
            title = `${title}, ${descriptionAlternativeText}: ${this.node.description}`;
        }
        return title;
    }

    get nodeClasses() {
        let classes = 'icon-section';
        if (this.node.config.isSelected) {
            classes = `${classes} selected`;
        }
        return classes;
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

    get trashCanAlternativeText() {
        return trashCanAlternativeText + ' ' + this.node.label;
    }

    get nodeLabel() {
        return this.node.label;
    }

    get nodeDescription() {
        return this.node.description;
    }

    // TODO: Move it to a library
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
        const deleteEvent = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedCanvasElementGUID: [this.node.guid]
            }
        });
        this.dispatchEvent(deleteEvent);
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

    render() {
        if (this.node.elementType === ELEMENT_TYPE.START_ELEMENT) {
            return startElement;
        }
        return nodeElement;
    }
}