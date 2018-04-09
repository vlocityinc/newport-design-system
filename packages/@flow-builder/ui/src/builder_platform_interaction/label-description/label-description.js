import {Element, api, track} from "engine";
import {PropertyChangedEvent} from 'builder_platform_interaction-events';

const SELECTORS = {
    LABEL: '.label',
    DEV_NAME: '.devName',
    DESCRIPTION: '.description',
};

/**
 * Usage: <builder_platform_interaction-label-description></builder_platform_interaction-label-description>
 */
export default class LabelDescription extends Element {
    @track
    state = {
        label: {value: '', error: null},
        devName: {value: '', error: null},
        description: {value: '', error: null},
    };

    /**
     *
     * @param {Object} label - object with {value, error}
     */
    @api
    set label(label) {
        this.state.label = label;

        const labelInput = this.root.querySelector(SELECTORS.LABEL);
        this.setInputErrorMessage(labelInput, label.error);
    }

    @api
    get label() {
        return this.state.label;
    }

    /**
     *
     * @param {Object} devName - object with {value, error}
     */
    @api
    set devName(devName) {
        this.state.devName = devName;

        const devNameInput = this.root.querySelector(SELECTORS.DEV_NAME);
        this.setInputErrorMessage(devNameInput, devName.error);
    }

    @api
    get devName() {
        return this.state.devName;
    }

    /**
     *
     * @param {Object} description - object with {value, error}
     */
    @api
    set description(description) {
        this.state.description = description;

        // TODO: blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
        // const descriptionTextArea = this.root.querySelector(SELECTORS.DESCRIPTION);
        // this.setInputErrorMessage(descriptionTextArea, description.error);
    }

    @api
    get description() {
        return this.state.description;
    }

    // Would prefer to use showLabel = true, but cannot due to public attributes not being able to have true as
    // a default value
    // See https://git.soma.salesforce.com/lwc/lwc/issues/241#issuecomment-326927
    // and https://www.polymer-project.org/2.0/docs/devguide/properties#configuring-boolean-properties
    @api
    hideLabel;
    @api
    hideDescription;

    setInputErrorMessage(element, error) {
        if (element) {
            if (error) {
                element.setCustomValidity(error);
            } else {
                element.setCustomValidity('');
            }
            element.showHelpMessageIfInvalid();
        }
    }

    /**
     * Set all errors via setCustomValidity.  This can only be done once the children elements have been rendered
     * at least once
     */
    renderedCallback() {
        const labelInput = this.root.querySelector(SELECTORS.LABEL);
        this.setInputErrorMessage(labelInput, this.state.label.error);

        const devNameInput = this.root.querySelector(SELECTORS.DEV_NAME);
        this.setInputErrorMessage(devNameInput, this.state.devName.error);

        // TODO: blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
        // const descriptionInput = this.root.querySelector(SELECTORS.DESCRIPTION);
        // this.setInputErrorMessage(descriptionInput, this.state.description.error);
    }

    handleLabelFocusOut(e) {
        const newLabel = e.target.value;
        this.updateStateAndDispatch(newLabel, 'label');
        if (!this.state.devName.value) {
            this.updateDevName(this.sanitizeDevName(newLabel));
        }
    }

    handleDevNameFocusOut(e) {
        const newDevName = e.target.value;

        if (this.state.devName.value !== newDevName) {
            this.updateDevName(newDevName);
        }
    }

    handleDescriptionFocusOut(e) {
        this.updateStateAndDispatch(e.target.value, 'description');
    }

    updateStateAndDispatch(value, prop) {
        if (this.state[prop].value !== value) {
            const event = new PropertyChangedEvent(
                // TODO get property name from constant source
                prop,
                value);
            this.dispatchEvent(event);
        }
    }

    /**
     * Fire off an event to update dev name and update internal state
     *
     * @param {String} newDevName - the dev name entered by the user
     */
    updateDevName(newDevName) {
        const event = new PropertyChangedEvent(
            // TODO get property name from constant source
            'name',
            newDevName);
        this.dispatchEvent(event);
    }

    /**
     * Sanitize a string so it is a valid dev name
     *
     * This includes:
     *
     * Prepending an 'X' if it begins with a number
     * Stripping off preceding and trailing invalid characters
     * Replacing any number of concurrent invalid characters with a single underscore
     * Limiting to 80 characters
     *
     * Where invalid characters are anything non-alphanumeric
     *
     * @param {String} value - the value to be converted in to a valid dev name
     * @returns {String} The sanitized, dev name safe version of the value passed in
     */
    sanitizeDevName(value) {
        value = value.replace(/[\W_]+/g, '_');
        value = value.replace(/_+$/, '');
        value = value.replace(/^_+/, '');

        if (value.match(/^\d/)) {
            value = 'X' + value;
        }

        value = value.substr(0, 80);

        return value;
    }
}
