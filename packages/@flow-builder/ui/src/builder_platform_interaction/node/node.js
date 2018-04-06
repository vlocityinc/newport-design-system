import { Element, api } from 'engine';
import { getConfigForElementType } from "builder_platform_interaction-element-config";
import { EVENT } from 'builder_platform_interaction-constant';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

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

    get nodeClasses() {
        let classes = 'icon-section';
        if (this.node.config.isSelected) {
            classes = 'icon-section selected';
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
            const nodeSelectedEvent = new CustomEvent(EVENT.NODE_SELECTED, {
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
     * Handles the node double click event on node div and fires off a nodeDblClicked event.
     * @param {object} event - node double clicked event
     */
    handleDblClick = (event) => {
        event.stopPropagation();
        const nodeDblClickedEvent = new CustomEvent(EVENT.NODE_DBLCLICKED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID: this.node.guid
            }
        });
        this.dispatchEvent(nodeDblClickedEvent);
    };

    /**
     * Fires an event to delete the node.
     * @param {object} event - trash can click event
     */
    handleTrashClick = (event) => {
        event.stopPropagation();
        const canvasElementDeleteEvent = new CustomEvent(EVENT.CANVAS_ELEMENT_DELETE, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID: this.node.guid
            }
        });
        this.dispatchEvent(canvasElementDeleteEvent);
    };

    /**
     * Marks the current node selected and deselects the rest (if not multi-selected)
     * as soon as drag begins
     * @param {object} event - drag start event
     */
    dragStart = (event) => {
        this.isNodeDragging = true;
        if (!this.node.config.isSelected) {
            const isMultiSelectKeyPressed = this.isMultiSelect(event.e);
            const nodeSelectedEvent = new CustomEvent(EVENT.NODE_SELECTED, {
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
    dragStop = (event) => {
        if (event.finalPos[0] !== this.node.locationX || event.finalPos[1] !== this.node.locationY) {
            const dragStopEvent = new CustomEvent(EVENT.DRAG_STOP, {
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

    renderedCallback() {
        if (lib.getContainer().classList.contains('inner-canvas')) {
            const nodeContainer = document.getElementById(this.node.guid).parentElement;
            lib.setDraggable(nodeContainer, {
                start : (event) => this.dragStart(event),
                stop: (event) => this.dragStop(event)
            });

            if (!lib.isSource(this.node.guid)) {
                lib.makeSource(this.node.guid, this.node.maxConnections);
            }

            if (!lib.isTarget(this.node.guid)) {
                lib.makeTarget(this.node.guid);
            }

            if (this.node.config.isSelected) {
                lib.addToDragSelection(nodeContainer);
            } else {
                lib.removeFromDragSelection(nodeContainer);
            }
        }
    }

    disconnectedCallback() {
        // Remove the node from JsPlumb
        lib.removeNodeFromLib(this.node.guid);
    }
}