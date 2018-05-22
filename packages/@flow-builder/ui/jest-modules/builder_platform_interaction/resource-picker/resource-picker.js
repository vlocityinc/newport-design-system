import { Element, api } from 'engine';
import { elementPropertyEditorSelector } from '../../../modules/builder_platform_interaction/selectors/selectors';

export default class ResourcePicker extends Element {
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

