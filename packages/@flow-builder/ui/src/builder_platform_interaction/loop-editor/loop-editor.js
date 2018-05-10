import { Element, api, track, unwrap } from 'engine';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

export default class DecisionEditor extends Element {
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
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        // TODO : this.loopElement = loopReducer(this.loopElement, event);
    }
}

