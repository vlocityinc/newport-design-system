import { Element, api, track } from 'engine';
import { generateGuid } from 'builder_platform_interaction-store-lib';

/*
 * A list of errors
 */
export default class ScreenEditorErrorsPanel extends Element {
    @track _errors;
    @api label;

    @api set errors(errs) {
        this._errors = [];
        for (const error of errs) {
            this._errors.push({error, guid: generateGuid()});
        }
    }

    @api get errors() {
        const errs = [];
        for (const error of this._errors) {
            errs.push(error.error);
        }
        return errs;
    }
}