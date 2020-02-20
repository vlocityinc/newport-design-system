import { LightningElement, track, api } from 'lwc';

import { LABELS } from './leftPanelElementsLabels';
import { APP_EXCHANGE_LINK } from 'builder_platform_interaction/commonUtils';
import { getElementSections } from 'builder_platform_interaction/editorElementsUtils';

export default class LeftPanelElements extends LightningElement {
    /**
     * The data format should be compatible with lightning-tree-grid.
     */
    @track leftPanelElementsList = [];

    appExchangeLink = APP_EXCHANGE_LINK;

    appExchangeButtonLabel = LABELS.appExchangeButtonLabel;

    @api
    get elements() {
        return this.leftPanelElementsList;
    }

    set elements(elementsData) {
        this.leftPanelElementsList = getElementSections(elementsData);
    }
}
