import { api, Element } from 'engine';

export default class ScreenTextAreaPropertyField extends Element {
    @api
    comboboxConfig;

    @api
    elementConfig;

    @api
    value;

    @api
    showNewResource;
}

