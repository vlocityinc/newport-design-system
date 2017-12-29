import { Element } from 'engine';
import { nodeIconMap } from './icon-name.js';
import { EVENT } from 'builder_platform_interaction-constant';

/**
 * Node component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */

export default class Node extends Element {
    @api node;

    get styling() {
        const style = `left: ${this.node.positionX}px; top: ${this.node.positionY}px`;
        return style;
    }

    get iconName() {
        return nodeIconMap.get(this.node.type);
    }

    /**
     * Handles the native double click event on node div and fires off a nodeClicked event
     */
    handleDblClick() {
        const nodeClickedEvent = new CustomEvent(EVENT.NODE_CLICKED, {bubbles: true, cancelable: true, detail: {
            node : this.node
        }});
        this.dispatchEvent(nodeClickedEvent);
    }
}