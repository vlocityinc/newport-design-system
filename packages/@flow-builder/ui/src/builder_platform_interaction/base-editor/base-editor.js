import { api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

// NOTE: IMPLEMENTATION PENDING FURTHER REVIEW
// May need an alternative approach if the raptor team doesn't bless/promise to support this
// one going forward
export const nameDescriptionMixin = (Base) => class extends Base {
    /**
     * @returns {object} label, eg : {value: "xyz", error: null}
     */
    get label() {
        return (this.element && this.element.label) ? this.element.label : undefined;
    }

    /**
     * @returns {object} description
     */
    get description() {
        return (this.element && this.element.description) ? this.element.description : undefined;
    }

    /**
     * @returns {object} devName
     */
    get devName() {
        return (this.element && this.element.name) ? this.element.name : undefined;
    }
};

export const baseEditor = (Base) => class extends Base {
    /**
     * Internal state for the decision editor
     */
    @track element = {};

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.element);
    }

    /**
     * public api function to run the rules from decision validation library
     * @returns {object} list of errors
     */
    @api validate() {
        // NOTE: if we find there is a case where an error can happen on a filed without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        return getErrorsFromHydratedElement(this.element);
    }
};
