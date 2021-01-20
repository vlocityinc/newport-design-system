// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { hydrateWithErrors, getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { isObject, isReference } from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { normalizeFEROV } from 'builder_platform_interaction/expressionUtils';
import { getCachedExtensionType } from 'builder_platform_interaction/flowExtensionLib';
import { orgHasComponentPreview } from 'builder_platform_interaction/contextLib';

import {
    isExtensionField,
    isNumberField,
    isDateField,
    isDateTimeField,
    isCurrencyField,
    isChoiceField,
    getPlaceHolderLabel
} from 'builder_platform_interaction/screenEditorUtils';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

// This list should go away once we switch to rendering standard
// components once all required inputs are set.
// This is needed in the meantime to prevent existing flows
// (even those in internal test envs) from breaking.
const stdComponentsAllowedToPreview = [
    'flowruntime:address'
    /* These will be enabled when we
    'flowruntime:email',
    'flowruntime:image',
    'flowruntime:lookup',
    'flowruntime:name',
    'flowruntime:phone',
    'flowruntime:slider',
    'flowruntime:toggle',
    'flowruntime:url',
    'forceContent:fileUpload',
    'interactiontest:flowMarkerIntfTestComponent',
    'interactiontest:LcInAllFlows',
    'interactiontest:lwcDynTypedScreensTestComponent',
    'interactiontest:lwcDynTypes',
    'interactiontest:lwcGenericLookup',
    'interactiontest:lwcScreensTestComponent',
    'lbpm:flowScript'
    */
];

/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends LightningElement {
    @api screenfield;
    @api selectedItemGuid;

    labels = LABELS;
    dummyMode = false;

    get calculatedClass() {
        let classString = '';
        if (!this.isExtension && !this.hasErrors) {
            classString = this.isSectionType
                ? 'slds-p-vertical_medium'
                : 'slds-p-vertical_x-small slds-p-horizontal_small';
        }
        return classString;
    }

    get hasErrors() {
        const errors = this.screenfield && getErrorsFromHydratedElement(this.screenfield);
        return errors && errors.length > 0 && !this.isSectionType;
    }

    get isExtension() {
        return isExtensionField(this.screenfield.type);
    }

    // Should we render the component in the screen canvas right now.
    // This is really the decision based on all other factors (does the org allow
    // for component preview, does the component itself allow for preview, are required
    // inputs set, etc).
    get isDisplayComponentPreview() {
        return (
            this.isExtension &&
            !this.dummyMode &&
            this.isComponentPreviewSupportedInOrg &&
            this.isExtensionAllowedToPreview &&
            this.isExtensionDetailAvailable
        );
    }

    get isExtensionDetailAvailable() {
        return getCachedExtensionType(this.screenfield.type.name);
    }

    // The contents of this check will change over time, as we allow component preview
    // for more component types. As of 232, we allow individual components to be previewed if:
    // 1) A standard (internally written) LWC which has been allow-listed.
    // 2) A standard Aura component which has been allow-listed.
    // 3) (not yet, but soon we'll need to check for required inputs being set)
    get isExtensionAllowedToPreview() {
        return this.screenfield.type && stdComponentsAllowedToPreview.indexOf(this.screenfield.type.name) > -1;
    }

    get isComponentPreviewSupportedInOrg() {
        return orgHasComponentPreview();
    }

    get isInputFieldType() {
        return (
            this.screenfield.type.fieldType === FlowScreenFieldType.InputField ||
            this.screenfield.type.fieldType === FlowScreenFieldType.PasswordField
        );
    }

    /**
     * Whether or not the current field is an ObjectProvided one, aka "automatic field"
     */
    get isObjectProvided() {
        return this.screenfield.type.fieldType === FlowScreenFieldType.ObjectProvided;
    }

    get isChoiceField() {
        return isChoiceField(this.screenfield);
    }

    get isTextAreaType() {
        return this.screenfield.type.name === 'LargeTextArea';
    }

    get isDisplayTextType() {
        return this.screenfield.type.fieldType === FlowScreenFieldType.DisplayText;
    }

    get isSectionType() {
        return this.screenfield.type.name === 'Section';
    }

    get isRequired() {
        // There is no concept of required for a checkbox.
        if (this.screenfield.type.name === 'Checkbox') {
            return false;
        }
        return this.screenfield.isRequired;
    }

    get name() {
        return this.screenfield && this.screenfield.name ? this.screenfield.name.value : '';
    }

    get displayName() {
        return this.screenfield.type.label !== null ? this.screenfield.type.label : this.screenfield.type.name;
    }

    get fieldText() {
        // The LWC components used to render these screen fields require a value for this property. however Flow doesn't require this.
        // If the user didn't provide a label, use a placeholder label for preview.
        if (this.screenfield && this.screenfield.fieldText && this.screenfield.fieldText.value !== null) {
            return this.screenfield.fieldText;
        }
        return hydrateWithErrors(getPlaceHolderLabel(this.screenfield.type.name));
    }

    get defaultValue() {
        let defaultValue =
            this.screenfield.defaultValue && this.screenfield.defaultValue.hasOwnProperty('value')
                ? this.screenfield.defaultValue.value
                : this.screenfield.defaultValue;

        const shouldNotPreviewFERs =
            isCurrencyField(this.screenfield) ||
            isNumberField(this.screenfield) ||
            isDateField(this.screenfield) ||
            isDateTimeField(this.screenfield);

        if (this.screenfield.defaultValueDataType === FEROV_DATA_TYPE.REFERENCE && shouldNotPreviewFERs) {
            defaultValue = '';
        } else if (!isReference(defaultValue)) {
            const normalizedValue = normalizeFEROV(defaultValue).itemOrDisplayText;
            defaultValue = isObject(normalizedValue) ? normalizedValue.displayText : normalizedValue;
        }

        return defaultValue;
    }

    get componentInstanceAttributes() {
        const availableActions = this.screenfield.allowedActions;
        const screenHelpText = this.screenfield.screenHelpText;
        const props = this.screenfield.localValues;

        const attributes = {
            availableActions,
            screenHelpText,
            ...props
        };
        return attributes;
    }

    handleDummyModeChange = (event) => {
        event.stopPropagation();
        this.dummyMode = event.detail.enableDummyMode;
    };
}
