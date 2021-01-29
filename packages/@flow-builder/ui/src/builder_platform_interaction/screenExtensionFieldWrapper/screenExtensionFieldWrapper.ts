import { api, LightningElement } from 'lwc';
import { getRequiredParametersForExtension } from 'builder_platform_interaction/screenEditorUtils';
import { orgHasFlowBuilderDebug, orgHasComponentPreview } from 'builder_platform_interaction/contextLib';
import { getCachedExtensionType } from 'builder_platform_interaction/flowExtensionLib';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import {
    isExtensionAttributeLiteral,
    isExtensionAttributeGlobalConstant
} from 'builder_platform_interaction/flowExtensionLib';

// This list should go away once we switch to rendering standard
// components once all required inputs are set.
// This is needed in the meantime to prevent existing flows
// (even those in internal test envs) from breaking.
const stdComponentsAllowedToPreview = [
    'flowruntime:address',
    'flowruntime:email',
    'flowruntime:lookup',
    'flowruntime:dependentPicklists',
    'flowruntime:image',
    'flowruntime:name',
    'flowruntime:phone',
    'flowruntime:slider',
    'flowruntime:toggle',
    'flowruntime:url',
    'lbpm:flowScript',
    'interactiontest:flowMarkerIntfTestComponent',
    'interactiontest:LcInAllFlows',
    'interactiontest:lwcDynTypedScreensTestComponent',
    'interactiontest:lwcDynTypes',
    'interactiontest:lwcGenericLookup',
    'interactiontest:lwcScreensTestComponent'
];

export default class ScreenExtensionFieldWrapper extends LightningElement {
    @api screenfield;
    @api descriptor;
    @api name;
    @api icon;
    @api title;
    @api text;

    dummyMode = false;

    // Should we render the component in the screen canvas right now.
    // This is really the decision based on all other factors (does the org allow
    // for component preview, does the component itself allow for preview, are required
    // inputs set, etc).
    get isDisplayComponentPreview() {
        return (
            !this.dummyMode &&
            this.isComponentPreviewSupportedInOrg &&
            this.isExtensionAllowedToPreview &&
            this.isExtensionDetailAvailable
        );
    }

    get isComponentPreviewSupportedInOrg() {
        return orgHasComponentPreview();
    }

    get isExtensionDetailAvailable() {
        return getCachedExtensionType(this.screenfield.type.name);
    }

    // The contents of this check will change over time, as we allow component preview
    // for more component types. As of 232, we allow individual components to be previewed if:
    // 1) A standard (internally written) component (Aura or LWC) which has been allow-listed.
    // 2) OR if the flowBuilderDebug perm is enabled
    // 3) AND all required inputs are set.
    get isExtensionAllowedToPreview() {
        return (
            this.screenfield.extensionName &&
            // The FlowBuilderDebug check is temporary and will be deleted before 232 goes out.
            // In order for partner teams to test comp preview with their components, they can
            // enable this perm so their component is previewed and they can test it.
            // This line should be replaced with:
            // stdComponentsAllowedToPreview.indexOf(this.screenfield.type.name) > -1 &&
            (stdComponentsAllowedToPreview.indexOf(this.screenfield.type.name) > -1 || orgHasFlowBuilderDebug()) &&
            this.areRequiredParamsSet
        );
    }

    get areRequiredParamsSet() {
        const requiredParams: any = getRequiredParametersForExtension(this.screenfield.type.name);
        if (requiredParams && requiredParams.length > 0) {
            const inputParams = this.screenfield.inputParameters;
            for (const param of requiredParams) {
                let valueSet = false;
                let valueDisplayable = false;
                const paramName = param.apiName;
                for (const screenFieldInput of inputParams) {
                    if (screenFieldInput.name.value.toLowerCase() === paramName.toLowerCase()) {
                        valueSet = true;
                        if (isExtensionAttributeLiteral(screenFieldInput)) {
                            valueDisplayable = true;
                            break;
                        } else if (isExtensionAttributeGlobalConstant(screenFieldInput)) {
                            valueDisplayable = true;
                            break;
                        }
                        /* Enable this block as needed for testing. Leaving out for now.
                        else {
                            // This entire else block will be removed in 232. For 232, we will NOT pass on
                            // references as attributes for extension components. We'll only pass literals.
                            // However, to enable testing of what the user experience would be if we allowed this
                            // this block can be enabled if the org has the FlowBuidlerDebug perm enabled.
                            const inputType: string | null = getExtensionAttributeType(
                                this.screenfield.type.name,
                                screenFieldInput.name.value
                            );
                            const isRefDisplayable = isExtensionRefDisplayable(screenFieldInput, inputType);
                            if (isRefDisplayable) {
                                valueDisplayable = true;
                                break;
                            }
                        }
                        */
                    }
                }
                // If there is no value set for this parameter, but the component provides a default value,
                // we can use that default value for preview. If not, we cannot preview this component
                // because there is no value set and no default.
                if (!valueSet) {
                    if (!param.hasDefaultValue || !param.defaultValue) {
                        return false;
                    }
                    valueDisplayable = true;
                }

                if (!valueDisplayable) {
                    return false;
                }
            }
            // There are no required params for this component or all required inputs are set.
            return true;
        } else if (requiredParams && requiredParams.length === 0) {
            return true;
        }
        // If we don't have the component's descriptor, we can't tell if it's safe to preview
        // or not, so return false.
        return false;
    }

    get componentInstanceAttributes() {
        const inputs = this.screenfield.inputParameters;
        const attributes = {};
        for (const input of inputs) {
            if (isExtensionAttributeLiteral(input)) {
                // Input is a literal, so just use the input as is.
                attributes[input.name.value] = input.value.value;
            } else if (isExtensionAttributeGlobalConstant(input)) {
                // If the input is a global constant, it needs to be converted to its
                // literal value, which can be displayed and sent to a component.
                if (input.value.value === GLOBAL_CONSTANTS.BOOLEAN_TRUE) {
                    attributes[input.name.value] = true;
                } else if (input.value.value === GLOBAL_CONSTANTS.BOOLEAN_FALSE) {
                    attributes[input.name.value] = false;
                } else if (input.value.value === GLOBAL_CONSTANTS.EMPTY_STRING) {
                    attributes[input.name.value] = '';
                }
            }
            /* Enable this block as needed for testing. Leaving out for now.
            else {
                // This entire else block will be removed in 232. For 232, we will NOT pass on
                // references as attributes for extension components. We'll only pass literals.
                // However, to enable testing of what the user experience would be if we allowed this
                // this block can be enabled if the org has the FlowBuidlerDebug perm enabled.
                const inputType = getExtensionAttributeType(this.screenfield.type.name, input.name.value);
                const isRefDisplayable = isExtensionRefDisplayable(input, inputType);
                if (isRefDisplayable) {
                    if (!isReference(input.value.value)) {
                        // Check to see if the input is a reference, but it's not stored in reference format.
                        // If so, that means it's in GUID format and needs to be converted.
                        const normalizedValue = normalizeFEROV(input.value.value).itemOrDisplayText;
                        const defaultValue = isObject(normalizedValue)
                            ? (normalizedValue as UI.ComboboxItem).displayText
                            : normalizedValue;
                        attributes[input.name.value] = defaultValue;
                    } else {
                        attributes[input.name.value] = input.value.value;
                    }
                }
            }
            */
        }
        return attributes;
    }

    handleDummyModeChange = (event) => {
        event.stopPropagation();
        this.dummyMode = event.detail.enableDummyMode;
    };
}
