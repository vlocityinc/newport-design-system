import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { flowPropertiesEditorReducer } from './flow-properties-editor-reducer';
import { SaveType } from 'builder_platform_interaction-save-type';

/**
 * Flow Properties property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Aniko van der Lee
 * @since 216
 */
export default class FlowPropertiesEditor extends Element {
    @api
    get node() {
        return this.flowProperties;
    }

    @api
    set node(newValue) {
        const data = unwrap(newValue);
        this.flowProperties = data;
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.flowProperties);
    }

    /**
     * public api function to run the rules from flow properties validation library
     * @returns {object} list of errors
     */
    @api validate() {
        return getErrorsFromHydratedElement(this.flowProperties);
    }

    /**
     * Internal state for the flow properties editor
     */
    @track
    flowProperties;

    /**
     * The dev name field should be disabled when saving as a new version.
     */
    get disableDevName() {
        return this.node.saveType === SaveType.NEW_VERSION;
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.flowProperties = flowPropertiesEditorReducer(this.flowProperties, event);
    }
}