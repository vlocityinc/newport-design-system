import { api, Element } from 'engine';

export default class FerovResourcePicker extends Element {
    @api elementConfig;

    @api propertyEditorElementType;

    @api value;

    @api comboboxConfig;

    @api elementParam;

    @api showNewResource;

    @api disableFieldDrilldown;
}

