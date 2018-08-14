import { LightningElement, track } from "lwc";
import { transformLeftPanelElements } from './left-panel-elements-helper';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { logPerfMarkStart, logPerfMarkEnd } from 'builder_platform_interaction-logging-utils';
const leftPanelElements = 'leftPanelElements';

export default class LeftPanelElements extends LightningElement {
    /**
     * The data format should be compatible with lightning-tree-grid.
     */
    @track leftPanelElementsList = [];

    constructor() {
        super();
        logPerfMarkStart(leftPanelElements);
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

    renderedCallback() {
        if (this.leftPanelElementsList && this.leftPanelElementsList.length > 0) {
            logPerfMarkEnd(leftPanelElements);
        }
    }
}

