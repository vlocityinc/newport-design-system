import { api, LightningElement } from 'lwc';

export default class FerovResourcePicker extends LightningElement {
    @api elementConfig;

    @api propertyEditorElementType;

    @api value;

    @api comboboxConfig;

    @api elementParam;

    @api showNewResource;

    @api disableFieldDrilldown;
    
    @api disableSobjectForFields;

    @api errorMessage;
}

