// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { modalBodyVariant } from 'builder_platform_interaction/builderUtils';

export default class ModalBody extends LightningElement {
    @api bodyTextOne;
    @api bodyTextTwo;
    @api listSectionHeader;
    @api listSectionItems: Array[object];
    @api listWarningItems: Array[object];
    @api bodyVariant;

    get bodyTextContainerClass() {
        return this.bodyVariant === modalBodyVariant.WARNING_ON_CANVAS_MODE_TOGGLE
            ? ''
            : 'slds-text-longform slds-p-horizontal_small slds-p-top_small';
    }

    get bodyTextOneClass() {
        return this.bodyVariant === modalBodyVariant.WARNING_ON_CANVAS_MODE_TOGGLE ? '' : 'slds-text-align_center';
    }

    get hasUsedByContent() {
        return (
            this.listSectionItems !== undefined && this.listSectionItems !== null && this.listSectionItems.length > 0
        );
    }

    get hasWarningList() {
        return (
            this.listWarningItems !== undefined && this.listWarningItems !== null && this.listWarningItems.length > 0
        );
    }
}
