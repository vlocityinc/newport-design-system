import { Element, api } from 'engine';
import { nodeIconMap } from './icon-name.js';
import { EVENT } from 'builder_platform_interaction-constant';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

/**
 * Node component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */

export default class Node extends Element {
    @api node;

    get nodeLocation() {
        return `left: ${this.node.locationX}px; top: ${this.node.locationY}px`;
    }

    get nodeClasses() {
        let classes = 'icon-section';
        if (this.node.isSelected) {
            classes = 'icon-section selected';
        }
        return classes;
    }

    get iconName() {
        return nodeIconMap.get(this.node.elementType);
    }

    /**
     * Handles the native double click event on node div and fires off a nodeDblClicked event.
     * @param {object} event - node double clicked event
     */
    handleDblClick = (event) => {
        event.stopPropagation();
        const nodeDblClickedEvent = new CustomEvent(EVENT.NODE_DBLCLICKED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                nodeGUID : this.node.guid
            }
        });
        this.dispatchEvent(nodeDblClickedEvent);
    };

    /**
     * Handles the native click event on node div and fires off a nodeSelected event.
     * TODO: Hide trash-cans when multiple elements are selected
     * @param {object} event - node clicked event
     */
    handleNodeClick = (event) => {
        event.stopPropagation();
        if ((!this.node.isSelected || event.shiftKey)) {
            const nodeSelectedEvent = new CustomEvent('nodeselected', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    nodeGUID : this.node.guid,
                    isMultiSelect: event.shiftKey
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
                    nodeGUID: this.node.guid,
                    locationX: event.finalPos[0],
                    locationY: event.finalPos[1]
                }
            });
            this.dispatchEvent(dragStopEvent);
        }
    };

    renderedCallback() {
        if (lib.getContainer().classList.contains('innerCanvas')) {
            const nodeContainer = document.getElementById(this.node.guid).parentElement;
            lib.setDraggable(nodeContainer, {
                stop: (event) => this.dragStop(event)
            });

            if (!lib.isSource(this.node.guid)) {
                lib.makeSource(this.node.guid, 1);
            }

            if (!lib.isTarget(this.node.guid)) {
                lib.makeTarget(this.node.guid);
            }

            if (this.node.isSelected) {
                lib.addToDragSelection(nodeContainer);
            } else {
                lib.removeFromDragSelection(nodeContainer);
            }
        }
    }
}