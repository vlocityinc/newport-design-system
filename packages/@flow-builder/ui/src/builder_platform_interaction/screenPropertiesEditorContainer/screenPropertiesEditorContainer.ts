import { shortcuts } from 'builder_platform_interaction/app';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { createScreenNodeSelectedEvent } from 'builder_platform_interaction/events';
import { describeExtension } from 'builder_platform_interaction/flowExtensionLib';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import * as screenEditorUtils from 'builder_platform_interaction/screenEditorUtils';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement, readonly, track } from 'lwc';
const { BaseKeyboardInteraction, withKeyboardInteractions, createShortcut } = keyboardInteractionUtils;
const { ShiftF6 } = commands;
const SELECTORS = {
    BACK_BUTTON: 'lightning-button-icon.back-button',
    EXPAND_BUTTON: 'lightning-button-icon.expand-button',
    SCREEN_PROPERTIES_EDITOR: 'builder_platform_interaction-screen-properties-editor'
};

/*
 * Right hand side component, used to toggle between screen and field property editors.
 */
export default class ScreenPropertiesEditorContainer extends withKeyboardInteractions(LightningElement) {
    @track
    _node;

    @track
    extendedInfo;

    @track
    toggleIconName = 'utility:expand_alt';

    @track
    displaySpinner;

    @track
    configurationEditor;

    labels = LABELS;
    processTypeValue = '';

    focusExpandOnRender = false;

    @api
    focus() {
        this.focusExpandOnRender = true;
    }

    @api
    focusExpandButton() {
        const button = this.template.querySelector(SELECTORS.EXPAND_BUTTON);
        button?.focus();
    }

    @api
    focusLabelDescription() {
        const screenPropertiesEditor = this.template.querySelector(SELECTORS.SCREEN_PROPERTIES_EDITOR);
        screenPropertiesEditor?.focus();
    }

    private getScreenFieldPropertiesEditorPanelTitle() {
        return this.node.fieldType === FlowScreenFieldType.ObjectProvided
            ? LABELS.automaticFieldPropertyEditorPanelTitle
            : this.node.type.label;
    }

    renderedCallback() {
        if (this.focusExpandOnRender) {
            const button =
                this.template.querySelector(SELECTORS.BACK_BUTTON) ||
                this.template.querySelector(SELECTORS.EXPAND_BUTTON);
            if (button) {
                button.focus();
                this.focusExpandOnRender = false;
            }
        }
    }

    set node(value) {
        if (this._node && this._node.guid !== value.guid) {
            this.displaySpinner = true;
            this._node = null;
            Promise.resolve().then(() => {
                this.displaySpinner = false;
                this._node = value;
                if (this.isExtensionField) {
                    this.fetchDescription();
                } else {
                    this.extendedInfo = null;
                }
            });
        } else {
            this.displaySpinner = false;
            this._node = value;
        }
    }

    @api get node() {
        return this._node;
    }

    get isScreen() {
        return screenEditorUtils.isScreen(this.node);
    }

    get isExtensionField() {
        return screenEditorUtils.isExtensionField(this.node);
    }

    get isDisplayField() {
        return screenEditorUtils.isDisplayTextField(this.node);
    }

    get isInputField() {
        return screenEditorUtils.isInputField(this.node) || screenEditorUtils.isPasswordField(this.node);
    }

    get isTextAreaField() {
        return screenEditorUtils.isTextAreaField(this.node);
    }

    get isChoiceField() {
        return screenEditorUtils.isChoiceField(this.node);
    }

    get isRegionContainerField() {
        return screenEditorUtils.isRegionContainerField(this.node);
    }

    get isObjectProvided() {
        return screenEditorUtils.isAutomaticField(this.node);
    }

    get hasErrors() {
        return getErrorsFromHydratedElement(this.node).length > 0;
    }

    get getPanelTitle() {
        let title = '';
        if (this.node) {
            title = screenEditorUtils.isScreen(this.node)
                ? LABELS.screenProperties
                : this.getScreenFieldPropertiesEditorPanelTitle();
        }
        return title;
    }

    get panelHeaderTextClasses() {
        let classes = 'slds-col slds-truncate';
        if (!screenEditorUtils.isScreen(this.node)) {
            classes = `${classes} slds-p-top_xxx-small`;
        }
        return classes;
    }

    @api
    get processType() {
        return this.processTypeValue;
    }

    set processType(newValue) {
        this.processTypeValue = newValue;
    }

    @api
    extensionTypes;

    @api
    mode;

    @api
    validate() {
        if (this.configurationEditor) {
            const screenExtensionPropertiesEditor = this.template.querySelector(
                'builder_platform_interaction-screen-extension-properties-editor'
            );
            if (screenExtensionPropertiesEditor) {
                return screenExtensionPropertiesEditor.validate();
            }
        }
        return [];
    }

    handleToggleExpand = () => {
        const container = this.template.querySelector('.properties-container');

        container.classList.toggle('slds-size_medium');
        const expanded = container.classList.toggle('slds-size_x-large');

        this.toggleIconName = expanded ? 'utility:contract_alt' : 'utility:expand_alt';
    };

    handleScreenSelection = () => {
        this.dispatchEvent(createScreenNodeSelectedEvent(this.node));
    };

    getKeyboardInteractions() {
        return [
            new BaseKeyboardInteraction([
                createShortcut(shortcuts.shiftFocusBackward, new ShiftF6(() => this.handleShiftFocusBackward()))
            ])
        ];
    }

    handleShiftFocusBackward() {
        this.dispatchEvent(new CustomEvent('focusscreenelement'));
    }

    fetchDescription() {
        this.displaySpinner = true;
        const node = this.node; // closure
        const extensionName = node.extensionName.value;
        // Needed to unrender the existing configuration editor
        this.configurationEditor = undefined;
        describeExtension(extensionName)
            .then((desc) => {
                this.displaySpinner = false;
                if (this.node === node) {
                    this.configurationEditor = desc.configurationEditor;
                    const genericTypes = this.extensionTypes
                        ? this.extensionTypes.find((extensionType) => extensionType.name === extensionName).genericTypes
                        : undefined;
                    if (genericTypes && genericTypes.length > 0) {
                        desc = readonly({
                            ...desc,
                            genericTypes
                        });
                    }
                    this.extendedInfo = desc;
                }
            })
            .catch(() => {
                this.displaySpinner = false;
            });
    }
}
