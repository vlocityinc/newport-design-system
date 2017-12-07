import { Element } from 'engine';
// import * as lib from './jsPlumb.js';

/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */

// Mock data for nodes
const data =
    [
        {
            id: "1",
            type: "Assignment",
            name: "Assig1",
            label: "Assig1",
            description: "This is my first node",
            positionX: 221,
            positionY: 17
        },
        {
            id: "2",
            type: "Assignment",
            name: "Assig2",
            label: "Assig2",
            description: "This is my second node",
            positionX: 65,
            positionY: 328
        }
    ];

export default class Canvas extends Element {
    get nodes() {
        return data;
    }
}
