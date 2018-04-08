import { Element, track } from 'engine';
import { transformLeftPanelElements } from './left-panel-elements-helper';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';

export default class LeftPanelElements extends Element {
    /**
     * The data format should be compatible with lightning-tree-grid.
     */
    @track leftPanelElementsList = [];

    constructor() {
        super();
        fetch(SERVER_ACTION_TYPE.GET_LEFT_PANEL_ELEMENTS, this.getElementsLeftPalette);
    }

    /**
     * Callback which gets executed after getting elements for left panel palette
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    getElementsLeftPalette = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
            this.leftPanelElementsList = transformLeftPanelElements(data);
        }
    };
}

