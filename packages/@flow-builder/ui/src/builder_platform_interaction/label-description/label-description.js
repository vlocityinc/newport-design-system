import {Element, api, track} from "engine";
import {PropertyChangedEvent} from 'builder_platform_interaction-events';
import {isUniqueDevNameInStore} from 'builder_platform_interaction-validation-rules';

const SELECTORS = {
    LABEL: '.label',
    DEV_NAME: '.devName',
    DESCRIPTION: '.description',
};

export default class LabelDescription extends Element {
    /** @track decorators **/
    @track
    state = {
        label: {value: '', error: null},
        devName: {value: '', error: null},
        description: {value: '', error: null},
    };

    @track
    showErrorMessageIfBlank = "Cannot be Blank.";
    // TODO: Import Localization Labels & getter for the component to use that.
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004ftBbIAI/view

    /** @api decorators **/
    @api
    hideLabel;
    // TODO: Would prefer to use showLabel = true, but cannot due to public attributes not being able to have true as a default value.
    // See https://git.soma.salesforce.com/lwc/lwc/issues/241#issuecomment-326927
    // and https://www.polymer-project.org/2.0/docs/devguide/properties#configuring-boolean-properties

    @api
    hideDevName;

    // this is needed for checking uniqueness of devName from store
    @api
    guid;

    @api
    hideDescription;

    @api
    devNameLabel = 'Unique Name';

    @api
    layoutMode = 'horizontal';

    @api
    get label() {
        return this.state.label;
    }

    @api
    get devName() {
        return this.state.devName;
    }

    @api
    get description() {
        return this.state.description;
    }

    /** @param {Object} label - object with {value, error} **/
    @api
    set label(label) {
        this.state.label = label;
        const labelInput = this.template.querySelector(SELECTORS.LABEL);
        this.setInputErrorMessage(labelInput, this.state.label.error);
    }

    /** @param {Object} devName - object with {value, error} **/
    @api
    set devName(devName) {
        this.state.devName = devName;
        const devNameInput = this.template.querySelector(SELECTORS.DEV_NAME);
        this.setInputErrorMessage(devNameInput, this.state.devName.error);
    }

    /** @param {Object} description - object with {value, error} **/
    @api
    set description(description) {
        this.state.description = description;
        // TODO setting CustomValidity for Description: blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
    }

    /** Focus the label field */
    @api focus() {
        const labelInput = this.template.querySelector(SELECTORS.LABEL);
        labelInput.focus();
    }

    /** LWC hook after rendering every component we are setting all errors via setCustomValidity except initial rendering. **/
    renderedCallback() {
        if (this.state.label.value !== '') {
            const labelInput = this.template.querySelector(SELECTORS.LABEL);
            this.setInputErrorMessage(labelInput, this.state.label.error);
        }
        if (this.state.devName.value !== '') {
            const devNameInput = this.template.querySelector(SELECTORS.DEV_NAME);
            this.setInputErrorMessage(devNameInput, this.state.devName.error);
        }
        // TODO setting Render Callback CustomValidity for Description: blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
    }

    /** Fire off an event to update name and update internal state
     * @param {String} value - the name entered by the user
     * @param {String} prop - the prop type
     */
    updateStateAndDispatch(value, prop) {
        if (this.state[prop].value !== value) {
            const event = new PropertyChangedEvent(
                // TODO get property name from constant source
                prop,
                value);
            this.dispatchEvent(event);
        }
    }

    /** Fire off an event to update dev name and update internal state
     * @param {String} newDevName - the dev name entered by the user
     */
    updateDevName(newDevName) {
        const error = isUniqueDevNameInStore(newDevName, [this.guid]);
        const event = new PropertyChangedEvent(
            // TODO get property name from constant source
            'name',
            newDevName,
            error);
        this.dispatchEvent(event);
    }

    /** Sanitize a string so it is a valid dev name
     * This includes:
     * Prepending an 'X' if it begins with a number
     * Stripping off preceding and trailing invalid characters
     * Replacing any number of concurrent invalid characters with a single underscore
     * Limiting to 80 characters
     * Where invalid characters are anything non-alphanumeric
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

    /** Sets the CustomValidity if there is a valid error message.
     * @param {Object} element - the input component
     * @param {Object} error - the input component
     */
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

    get isVertical() {
        return this.layoutMode && this.layoutMode.toLowerCase() === 'vertical';
    }

    /**
     * Returns class for label to display according to the layout mode (width set to 50% when horizontal)
     * @returns {string} class name for name
     */
    get computedNameClass() {
        return 'slds-col label' + (this.isVertical ? '' :  ' slds-size_1-of-2');
    }

    /**
     * Returns class for devName to expand full width when label is hidden.
     * @returns {string} class name for dev name
     */
    get computedDevNameClass() {
        return this.isVertical ?
            'slds-col devName slds-m-top_x-small' :
            'slds-col devName' + (this.hideLabel ? '' : ' slds-size_1-of-2');
    }

    /**
     * Returns class for the container to display according to the layout mode (flex-direction: vertical when vertical)
     * @returns {string} class name for name
     */
    get computedNameAndDevContainerClass() {
        return 'container slds-form-element__group slds-grid slds-gutters slds-gutters_xx-small slds-m-bottom_x-small' +
            (this.isVertical ? ' slds-grid_vertical' : '');
    }

    handleLabelFocusOut(e) {
        const inputElement = e.target;
        let newLabel = inputElement.value;
        newLabel = (newLabel || '').trim();
        if (newLabel !== inputElement.value) {
            // if whitespace was removed we need to update the input
            // only required if the user makes a whitespace only change such as 'a' to 'a '
            inputElement.value = newLabel;
        }

        this.updateStateAndDispatch(newLabel, 'label');

        // Update devName if it is present and blank
        if (newLabel !== '' && !this.hideDevName && !this.state.devName.value) {
            if (newLabel.match(/^\W+$/)) {
                newLabel = 'UniqueName';
            }
            this.updateDevName(this.sanitizeDevName(newLabel));
        }
    }

    handleDevNameFocusOut(e) {
        const inputElement = e.target;
        let newDevName = inputElement.value;

        // remove all empty space from the dev name ( including in the middle of the string )
        newDevName = (newDevName || '').replace(/\s/g, '');
        if (newDevName !== inputElement.value) {
            // if whitespace was removed we need to update the input
            // only required if the user makes a whitespace only change such as 'a' to 'a '
            inputElement.value = newDevName;
        }

        if (this.state.devName.value !== newDevName) {
            this.updateDevName(newDevName);
        }
    }

    handleDescriptionFocusOut(e) {
        this.updateStateAndDispatch(e.target.value, 'description');
    }
}
