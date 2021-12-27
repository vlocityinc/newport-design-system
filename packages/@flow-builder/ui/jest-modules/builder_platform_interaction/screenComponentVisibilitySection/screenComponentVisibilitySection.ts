import { api, LightningElement } from 'lwc';

export default class ScreenComponentVisibilitySection extends LightningElement {
    @api
    field;

    @api
    accordionSectionLabel;

    @api
    visibilityLogicComboboxLabel;
}
