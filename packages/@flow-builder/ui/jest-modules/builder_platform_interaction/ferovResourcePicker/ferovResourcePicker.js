import { api, LightningElement } from 'lwc';

export default class FerovResourcePicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-ferov-resource-picker';

    @api elementConfig;

    @api propertyEditorElementType;

    @api value;

    @api comboboxConfig;

    @api elementParam;

    @api showNewResource;

    @api enableFieldDrilldown;
    
    @api hideGlobalConstants;

    @api errorMessage;

    @api rules;
}
