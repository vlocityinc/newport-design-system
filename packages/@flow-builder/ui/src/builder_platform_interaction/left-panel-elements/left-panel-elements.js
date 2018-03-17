import { Element, track } from 'engine';
import { ElementsPalette } from 'builder_platform_interaction-palette-lib';

let elementsPaletteInstance;
let unsubscribeElementsPalette;

export default class LeftPanelElements extends Element {
    /**
     * The data format should be compatible with lightning-tree-grid.
     */
    @track data = [];

    constructor() {
        super();
        elementsPaletteInstance = ElementsPalette.getInstance();
        unsubscribeElementsPalette = elementsPaletteInstance.subscribe(this.updateElements);
    }

    updateElements = () => {
        this.data = elementsPaletteInstance.getElements();
    };

    disconnectedCallback() {
        unsubscribeElementsPalette();
    }
}