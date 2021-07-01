import { LightningElement, api } from 'lwc';
import { LABELS } from './mapItemsLabels';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';
import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';

export default class MapItems extends LightningElement {
    labels = LABELS;
    @api
    mapItems = [];

    @api
    inputObjectType;

    @api
    outputObjectType;

    @api
    recordFields;

    get elementType() {
        return ELEMENT_TYPE.COLLECTION_PROCESSOR;
    }

    get subtitle() {
        return format(this.labels.assignValuesSubtitle, this.outputObjectType);
    }
    /**
     * Format assignment items to add some properties: required, deletable, lhsDisabled
     *
     * @returns list of converted assignment items
     */
    get convertedMapItems() {
        const _mapItems: Object[] = [];
        if (this.mapItems) {
            const fields = this.recordFields && Object.values(this.recordFields);
            this.mapItems.forEach((item) => {
                const required = this.isItemRequired(item, fields);
                const deletable = this.mapItems.length > 1 && !required;
                const lhsDisabled = required;
                _mapItems.push(Object.assign({ required, deletable, lhsDisabled }, item));
            });
            return _mapItems;
        }
        return _mapItems;
    }

    getFieldName(item) {
        const sanitizedGuid = sanitizeGuid(item.leftHandSide.value);
        if (sanitizedGuid.fieldNames && sanitizedGuid.fieldNames.length === 1) {
            return sanitizedGuid.fieldNames[0];
        }
        return '';
    }

    /**
     * Check if item is required
     *
     * @param {Object} item item to be checked
     * @param {Object[]} fields list of fields
     * @returns true if item is required
     */
    isItemRequired(item, fields) {
        const index = fields.findIndex((field) => field.apiName === this.getFieldName(item) && field.required);
        return index !== -1 && this.inputObjectType !== this.outputObjectType;
    }
}
