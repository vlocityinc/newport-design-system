import { LightningElement, api, track } from 'lwc';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';
import { textTemplateReducer } from './textTemplateReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { LABELS } from './textTemplateEditorLabels';

/**
 * Text template property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author cnastasa
 * @since 218
 */
export default class TextTemplateEditor extends LightningElement {
    labels = LABELS;
    /**
     * Internal state for the text template editor
     */
    @track
    textTemplateResource;

    @api
    isNewMode = false;

    @api
    get node() {
        return this.textTemplateResource;
    }

    set node(newValue) {
        this.textTemplateResource = newValue || {};
    }

    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.textTemplateResource;
    }

    get hideNewResourceButton() {
        return this.isNewMode;
    }
    get apiNameLabel() {
        return LABELS.apiNameLabel;
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {Object} event property changed event coming from label-description component
     */
    handlePropertyChanged = event => {
        event.stopPropagation();
        const propertyName = event.detail.propertyName;
        this.updateProperty(propertyName, event);
    };

    /**
     * @param {object} event property changed event coming from resourced-textarea component
     */
    handleResourceTextAreaChanged = event => {
        event.stopPropagation();
        const propertyName = 'text';
        this.updateProperty(propertyName, event);
    };

    /**
     * Does the update property action with passed in property name, value and error.
     * @param {String} propertyName to update
     * @param {Object} event of type PropertyChangedEvent
     */
    updateProperty = (propertyName, event) => {
        const value = event.detail.value;
        const error = event.detail.error || null;
        const action = createAction(
            PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            { propertyName, value, error }
        );
        this.textTemplateResource = textTemplateReducer(
            this.textTemplateResource,
            action
        );
    };

    /** *********************************/
    /*       Validation methods         */
    /** *********************************/

    /**
     * public api function to run the rules from validation library
     * @returns {object} list of errors
     */
    @api
    validate() {
        const event = { type: VALIDATE_ALL };
        this.textTemplateResource = textTemplateReducer(
            this.textTemplateResource,
            event
        );
        const errors = getErrorsFromHydratedElement(this.textTemplateResource);
        return errors;
    }
}
