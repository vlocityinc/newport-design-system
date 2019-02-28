import { LightningElement, api } from 'lwc';
const elementPropertyEditorSelector = require('builder_platform_interaction/selectors').elementPropertyEditorSelector; 

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

