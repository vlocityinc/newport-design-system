// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class EntityResourcePicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-entity-resource-picker';

    @api
    value;

    @api
    comboboxConfig;

    @api
    rowIndex;
}
