// @ts-nocheck
import { LightningElement, api } from 'lwc';

import { LABELS } from './leftPanelElementsLabels';
import { APP_EXCHANGE_LINK } from 'builder_platform_interaction/commonUtils';
import { getElementSections } from 'builder_platform_interaction/editorElementsUtils';

export default class LeftPanelElements extends LightningElement {
    appExchangeLink = APP_EXCHANGE_LINK;

    appExchangeButtonLabel = LABELS.appExchangeButtonLabel;

    @api
    elements;

    @api
    palette;

    /**
     * The data format should be compatible with lightning-tree-grid.
     */
    get leftPanelElementsList() {
        if (this.elements && this.palette) {
            return getElementSections(this.elements, this.palette);
        }
        return [];
    }
}
