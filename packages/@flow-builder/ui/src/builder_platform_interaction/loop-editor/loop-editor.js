import { Element, api, track, unwrap } from 'engine';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { loopReducer } from './loop-reducer';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

export default class LoopEditor extends Element {
    /**
     * internal state for the loop editor
     */
    @track loopElement;

    get expressionBuilderConfig() {
        return { elementType: ELEMENT_TYPE.LOOP };
    }

    @api
    get node() {
        return this.loopElement;
    }

    @api
    set node(newValue) {
        this.loopElement = newValue || {};
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.loopElement);
    }

    /**
     * public api function to run the rules from loop validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.loopElement = loopReducer(this.loopElement, event);
        return getErrorsFromHydratedElement(this.loopElement);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.loopElement = loopReducer(this.loopElement, event);
    }
}

