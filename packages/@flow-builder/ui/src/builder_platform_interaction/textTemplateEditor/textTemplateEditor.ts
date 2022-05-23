// @ts-nocheck
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './textTemplateEditorLabels';
import { textTemplateReducer } from './textTemplateReducer';

/**
 * Text template property editor for Flow Builder
 */
export default class TextTemplateEditor extends LightningElement {
    _rteId = generateGuid();

    labels = LABELS;
    /**
     * Internal state for the text template editor
     */
    @track
    textTemplateResource;

    @api
    isNewMode = false;

    @api
    mode;

    @api
    editorParams;

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
     *
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
    handlePropertyChanged = (event) => {
        event.stopPropagation();
        const propertyName = event.detail.propertyName;
        this.updateProperty(propertyName, event);
    };

    /**
     * @param {object} event property changed event coming from resourced-textarea component
     */
    handleResourceTextAreaChanged = (event) => {
        event.stopPropagation();
        const propertyName = 'text';
        this.updateProperty(propertyName, event);
    };

    handleRichTextPlainTextSwitchChange(event) {
        event.stopPropagation();
        const propertyName = 'isViewedAsPlainText';
        const value = event.detail.isPlainText;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value });
        this.textTemplateResource = textTemplateReducer(this.textTemplateResource, action);
    }

    /**
     * Does the update property action with passed in property name, value and error.
     *
     * @param {string} propertyName to update
     * @param {Object} event of type PropertyChangedEvent
     */
    updateProperty = (propertyName, event) => {
        const value = event.detail.value;
        const error = event.detail.error || null;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.textTemplateResource = textTemplateReducer(this.textTemplateResource, action);
    };

    /** */
    /*       Validation methods         */
    /** */

    /**
     * public api function to run the rules from validation library
     *
     * @returns {object} list of errors
     */
    @api
    validate() {
        const event = { type: VALIDATE_ALL };
        this.textTemplateResource = textTemplateReducer(this.textTemplateResource, event);
        const errors = getErrorsFromHydratedElement(this.textTemplateResource);
        return errors;
    }
}
