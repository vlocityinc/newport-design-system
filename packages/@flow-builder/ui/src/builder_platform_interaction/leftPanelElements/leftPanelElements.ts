// @ts-nocheck
import { APP_EXCHANGE_LINK } from 'builder_platform_interaction/commonUtils';
import { getElementSections } from 'builder_platform_interaction/editorElementsUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './leftPanelElementsLabels';

export default class LeftPanelElements extends LightningElement {
    appExchangeLink = APP_EXCHANGE_LINK;

    appExchangeButtonLabel = LABELS.appExchangeButtonLabel;

    @api
    elements;

    @api
    palette;

    /**
     * The data format should be compatible with lightning-tree-grid.
     * Filter out invisible item in elements list
     */
    get leftPanelElementsList() {
        if (this.elements && this.palette) {
            const updatedSection = [];
            getElementSections(this.elements, this.palette).forEach((section) => {
                const children = section._children?.filter((child) => child.freeformVisible);
                if (children?.length > 0) {
                    updatedSection.push({ ...section, _children: children });
                }
            });
            return updatedSection;
        }
        return [];
    }
}
