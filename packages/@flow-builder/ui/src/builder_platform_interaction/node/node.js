import { Element } from 'engine';
import { nodeIconMap } from './icon-name.js';

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
}