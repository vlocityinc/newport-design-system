import { LightningElement, api } from 'lwc';
import { elementPropertyEditorSelector } from '../../../modules/builder_platform_interaction/selectors/selectors';

export default class ResourcePicker extends LightningElement {
    @api
    label;

    @api
    placeholder;

    @api
    disabled;

    @api
    required;

    @api
    literalsAllowed;

    @api
    initialItem;

    @api
    mode;

    @api
    crudFilterType;

    @api
    elementDataType;

    @api
    elementIsCollection;

    @api
    elementType;
}

