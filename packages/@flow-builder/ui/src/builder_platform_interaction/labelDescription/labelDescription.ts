// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { isUniqueDevNameInStore } from 'builder_platform_interaction/validationRules';
import { sanitizeDevName } from 'builder_platform_interaction/commonUtils';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { LABELS } from './labelDescriptionLabels';
import { AddElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';

const { logInteraction } = loggingUtils;

const SELECTORS = {
    LABEL: '.label',
    DEV_NAME: '.devName',
    DESCRIPTION: '.description'
};

export default class LabelDescription extends LightningElement {
    labels = LABELS;

    /** @track decorators */
    @track
    state = {
        label: { value: '', error: null },
        devName: { value: '', error: null },
        description: { value: '', error: null }
    };

    @track
    showErrorMessageIfBlank = LABELS.cannotBeBlank;

    /** @api decorators */
    @api
    hideLabel;
    // TODO: Would prefer to use showLabel = true, but cannot due to public attributes not being able to have true as a default value.
    // See https://git.soma.salesforce.com/lwc/lwc/issues/241#issuecomment-326927
    // and https://www.polymer-project.org/2.0/docs/devguide/properties#configuring-boolean-properties

    // TODO: There are potentially 4 configurations for the dev name field, we may want a
    // configuration object instead. See W-5217399.

    @api
    hideDevName;

    /**
     * Used for cases where the dev name shouldn't be editable such as when we're saving a flow as
     * a new version.
     */
    @api
    disableDevName;

    @api
    disableDevNameValidation = false;

    /**
     * Used for cases where the name shouldn't be editable for Step Elements
     */
    @api
    disableName;

    @api
    editorParams;

    get isLabelCollapsibleToHeader() {
        return this.editorParams && this.editorParams.panelConfig.isLabelCollapsibleToHeader;
    }

    get showNewElementPanelHeader() {
        return this.isLabelCollapsibleToHeader && this.isEditable && this.mode !== EditElementEvent.EVENT_NAME;
    }

    get showCollapsedLabelDescriptionPanelHeader() {
        return this.isLabelCollapsibleToHeader && !this.showNewElementPanelHeader;
    }

    get stylesForLabelDescription() {
        if (this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    /**
     * Used for cases where the name shouldn't be editable for Step Elements
     */
    @api
    disableDescription;

    // this is needed for checking uniqueness of devName from store
    @api
    guid;

    @api
    hideDescription;

    @api
    nameLabel = LABELS.nameLabel;

    @api
    devNameLabel = LABELS.uniqueNameLabel;

    @api
    layoutMode = 'horizontal';

    // The label input field is usually required. Set this to true, if you want to mark it 'not required'.
    @api
    labelOptional = false;

    editPressed = false;

    @api
    mode;

    @api
    get label() {
        return this.state.label;
    }

    get labelRequired() {
        return !this.labelOptional;
    }

    @api
    get devName() {
        return this.state.devName;
    }

    @api
    get description() {
        return this.state.description;
    }

    get hasDescription() {
        return this.description.value !== '';
    }

    get isEditable() {
        return this.editPressed || this.mode === AddElementEvent.EVENT_NAME || this.mode === undefined;
    }

    get readOnlyLabel() {
        if (this.hideLabel) {
            return '';
        }
        return this.state.label.value;
    }

    get readOnlyDevName() {
        if (this.hideDevName) {
            return '';
        }
        if (this.hideLabel) {
            return this.state.devName.value;
        }
        return `(${this.state.devName.value})`;
    }

    get editButtonClass() {
        if (this.isVertical) {
            return 'test-edit-button slds-m-left_xx-small slds-float_right';
        }
        return 'test-edit-button slds-m-left_xx-small slds-align_center';
    }

    get readOnlyInfoClass() {
        if (this.isVertical) {
            return 'test-read-only-info slds-grid';
        }
        if (this.hasDescription) {
            return 'test-read-only-info slds-grid slds-p-bottom_x-small';
        }
        return 'test-read-only-info slds-grid slds-p-bottom_small';
    }

    get readOnlyInfoClassPanel() {
        if (this.hasDescription) {
            return 'slds-p-bottom_x-small';
        }
        return 'slds-p-bottom_small';
    }

    get readOnlyDescriptionClass() {
        if (this.isVertical) {
            return 'slds-line-clamp_small slds-text-color_weak slds-text-body_small slds-p-bottom_xx-small';
        }
        return 'slds-line-clamp_small slds-text-color_weak slds-text-body_small slds-m-bottom_small';
    }

    get conditionalColumnClassInfo() {
        if (this.isVertical) {
            return 'slds-text-heading_small slds-truncate slds-col';
        }
        return 'slds-text-heading_small slds-truncate_container_75 slds-grid';
    }

    get conditionalColumnClassButton() {
        if (this.isVertical) {
            return 'slds-col';
        }
        return '';
    }

    get readOnlyDevNameClass() {
        if (this.isVertical) {
            return 'slds-col slds-truncate slds-text-body_regular';
        }
        return 'slds-col slds-truncate';
    }

    get title() {
        if (this.editorParams) {
            return this.editorParams.panelConfig.titleForModal;
        }
        return '';
    }

    get iconName() {
        if (this.editorParams && this.editorParams.panelConfig) {
            return getConfigForElementType(this.editorParams.panelConfig.elementType).nodeConfig.iconName;
        }
        return '';
    }

    get iconBackgroundColor() {
        if (this.editorParams) {
            const color = getConfigForElementType(this.editorParams.panelConfig.elementType).nodeConfig
                .iconBackgroundColor;
            if (color) {
                return color;
            }
        }
        return '';
    }

    /** @param {Object} label - object with {value, error} */
    set label(label) {
        if (label) {
            this.state.label = label;
            this._shouldSetLabelError = true;
        }
    }

    /** @param {Object} devName - object with {value, error} */
    set devName(devName) {
        if (devName) {
            this.state.devName = devName;
            this._shouldSetDevNameError = true;
        }
    }

    /** @param {Object} description - object with {value, error} */
    set description(description) {
        if (description) {
            this.state.description = description;
        }
        // TODO setting CustomValidity for Description: blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
    }

    /** Focus the label field */
    @api focus() {
        const labelInput = this.template.querySelector(SELECTORS.LABEL);
        labelInput.focus();
    }

    /**
     * Reset the error of the input
     * The lightning-input component does not provide an easy way to reset errors
     * We need to remove requiredness (our only constraint) and report validity
     * Then put the constraint back to its prevous state
     *
     * @param {string} selector of the lightning-input
     * @param element
     * @param {string} error the current error of the element
     * @param {boolean} currentRequiredState of the lightning-input
     * @memberof LabelDescription
     */
    resetError(element, error, currentRequiredState) {
        if (element && !error) {
            element.required = false;
            element.setCustomValidity('');
            element.showHelpMessageIfInvalid();
            element.required = currentRequiredState;
        }
    }

    /**
     * LWC hook after rendering every component we are setting all errors via setCustomValidity except initial rendering.
     *
     */
    renderedCallback() {
        if (this._shouldSetLabelError) {
            const labelInput = this.template.querySelector(SELECTORS.LABEL);
            this.resetError(labelInput, this.state.label.error, this.labelRequired);
            this.setInputErrorMessage(labelInput, this.state.label.error);
            this._shouldSetLabelError = false;
        }

        if (this._shouldSetDevNameError) {
            const devNameInput = this.template.querySelector(SELECTORS.DEV_NAME);
            this.resetError(devNameInput, this.state.devName.error, true);
            this.setInputErrorMessage(devNameInput, this.state.devName.error);
            this._shouldSetDevNameError = false;
        }
        // TODO setting Render Callback CustomValidity for Description: blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
    }

    /**
     * Fire off an event to update name and update internal state
     *
     * @param {string} value - the name entered by the user
     * @param {string} prop - the prop type
     * @param error
     */
    updateStateAndDispatch(value, prop, error) {
        const event = new PropertyChangedEvent(prop, value, error);
        this.dispatchEvent(event);
    }

    /**
     * Fire off an event to update dev name and update internal state
     *
     * @param {string} newDevName - the dev name entered by the user
     */
    updateDevName(newDevName) {
        let error = null;
        if (newDevName && !this.disableDevNameValidation) {
            error = isUniqueDevNameInStore(newDevName, [this.guid]);
        }
        const event = new PropertyChangedEvent(
            // TODO get property name from constant source
            'name',
            newDevName,
            error
        );
        this.dispatchEvent(event);
    }

    /**
     * Sets the CustomValidity if there is a valid error message.
     *
     * @param {Object} element - the input component
     * @param {Object} error - the input component
     */
    setInputErrorMessage(element, error) {
        if (element && error) {
            element.setCustomValidity(error);
            element.showHelpMessageIfInvalid();
        }
    }

    get isVertical() {
        return this.layoutMode && this.layoutMode.toLowerCase() === 'vertical';
    }

    /**
     * Returns class for label to display according to the layout mode (width set to 50% when horizontal)
     *
     * @returns {string} class name for name
     */
    get computedNameClass() {
        return 'slds-col label' + (this.isVertical ? '' : ' slds-size_1-of-2');
    }

    /**
     * Returns class for devName to expand full width when label is hidden.
     *
     * @returns {string} class name for dev name
     */
    get computedDevNameClass() {
        return this.isVertical
            ? 'slds-col devName slds-m-top_x-small'
            : 'slds-col devName' + (this.hideLabel ? '' : ' slds-size_1-of-2');
    }

    /**
     * Returns class for the container to display according to the layout mode (flex-direction: vertical when vertical)
     *
     * @returns {string} class name for name
     */
    get computedNameAndDevContainerClass() {
        return (
            'container slds-form-element__group slds-grid slds-gutters slds-gutters_xx-small slds-m-bottom_x-small' +
            (this.isVertical ? ' slds-grid_vertical' : '')
        );
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
        const error = inputElement.value === '' && this.labelRequired ? this.showErrorMessageIfBlank : null;
        this.updateStateAndDispatch(newLabel, 'label', error);

        // Update devName if it is present, enabled, and blank
        if (newLabel !== '' && !this.hideDevName && !this.disableDevName && !this.state.devName.value) {
            if (newLabel.match(/^\W+$/)) {
                newLabel = 'UniqueName';
            }
            this.updateDevName(sanitizeDevName(newLabel));
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
        this.updateDevName(newDevName);
    }

    handleEditButtonPress() {
        this.editPressed = true;
    }

    handleDescriptionFocusOut(e) {
        this.updateStateAndDispatch(e.target.value, 'description');
    }

    clickDescription() {
        logInteraction('label-description', 'element', null, 'click');
    }
}
