import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from './integrationTestUtils';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    INPUT_TAB: '.tabitem-inputs',
    OUTPUT_TAB: '.tabitem-outputs',
    HIDDENT_FEROV_RESOURCE_PICKER:
        'builder_platform_interaction-ferov-resource-picker.slds-hide',
    LIGHTNING_TOGGLE: 'lightning-input',
    PARAMETER_LABEL: 'label',
    WARNING_ICON: 'builder_platform_interaction-status-icon',
    WARNING_BADGE: 'lightning-badge',
    DELETE_BUTTON: 'lightning-button-icon'
};

export const getBaseCalloutElement = actionEditor => {
    return actionEditor.shadowRoot.querySelector(SELECTORS.BASE_CALLOUT_EDITOR);
};

const getParameterList = actionEditor => {
    return getBaseCalloutElement(actionEditor).shadowRoot.querySelector(
        SELECTORS.PARAMETER_LIST
    );
};

export const getInputParameterItems = actionEditor => {
    return getParameterList(actionEditor)
        .shadowRoot.querySelector(SELECTORS.INPUT_TAB)
        .querySelectorAll(SELECTORS.PARAMETER_ITEM);
};

export const getOutputParameterItems = actionEditor => {
    return getParameterList(actionEditor)
        .shadowRoot.querySelector(SELECTORS.OUTPUT_TAB)
        .querySelectorAll(SELECTORS.PARAMETER_ITEM);
};

const getFerovResourcePicker = parameterItem => {
    return parameterItem.shadowRoot.querySelector(
        SELECTORS.FEROV_RESOURCE_PICKER
    );
};

export const getInputParameterComboboxElement = parameterItem => {
    const ferovResourcePicker = parameterItem.shadowRoot.querySelector(
        SELECTORS.FEROV_RESOURCE_PICKER
    );
    const resourcePicker = ferovResourcePicker.shadowRoot.querySelector(
        SELECTORS.BASE_RESOURCE_PICKER
    );
    const combobox = resourcePicker.shadowRoot.querySelector(
        SELECTORS.COMBOBOX
    );
    const lightningGroupCombobox = combobox.shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
    return lightningGroupCombobox;
};

export const getOutputParameterComboboxElement = parameterItem => {
    const outputResourcePicker = parameterItem.shadowRoot.querySelector(
        SELECTORS.OUTPUT_RESOURCE_PICKER
    );
    const resourcePicker = outputResourcePicker.shadowRoot.querySelector(
        SELECTORS.BASE_RESOURCE_PICKER
    );
    const combobox = resourcePicker.shadowRoot.querySelector(
        SELECTORS.COMBOBOX
    );
    const lightningGroupCombobox = combobox.shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
    return lightningGroupCombobox;
};

export const getLightningInputToggle = parameterItem => {
    return parameterItem.shadowRoot.querySelector(SELECTORS.LIGHTNING_TOGGLE);
};

const getParameterLabel = parameterItem => {
    return parameterItem.shadowRoot.querySelector(SELECTORS.PARAMETER_LABEL);
};

export const getParameterIcon = parameterItem => {
    return parameterItem.shadowRoot.querySelector(SELECTORS.LIGHTNING_ICON);
};

export const getWarningIcon = parameterItem => {
    return parameterItem.shadowRoot.querySelector(SELECTORS.WARNING_ICON);
};

export const getWarningBadge = parameterItem => {
    return parameterItem.shadowRoot.querySelector(SELECTORS.WARNING_BADGE);
};

export const getDeleteButton = parameterItem => {
    return parameterItem.shadowRoot.querySelector(SELECTORS.DELETE_BUTTON);
};

export const VALIDATION_ERROR_MESSAGES = {
    GENERIC: 'FlowBuilderCombobox.genericErrorMessage',
    NUMBER_ERROR_MESSAGE: 'FlowBuilderCombobox.numberErrorMessage',
    CURRENCY_ERROR_MESSAGE: 'FlowBuilderCombobox.currencyErrorMessage',
    INVALID_DATA_TYPE: 'FlowBuilderMergeFieldValidation.invalidDataType',
    ...FLOW_BUILDER_VALIDATION_ERROR_MESSAGES
};

export const toggleChangeEvent = checked => {
    return new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { checked }
    });
};

export const verifyRequiredInputParameter = (parameter, label, value) => {
    const inputComboboxElement = getInputParameterComboboxElement(parameter);
    const toggleInput = getLightningInputToggle(parameter);
    const icon = getParameterIcon(parameter);
    expect(inputComboboxElement.required).toBe(true);
    expect(inputComboboxElement.label).toEqual(label);
    expect(inputComboboxElement.value).toEqual(value);
    expect(toggleInput).toBeNull();
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

export const verifyOptionalInputParameterWithValue = (
    parameter,
    label,
    value
) => {
    const inputComboboxElement = getInputParameterComboboxElement(parameter);
    const toggleInput = getLightningInputToggle(parameter);
    const icon = getParameterIcon(parameter);
    expect(inputComboboxElement.required).toBe(false);
    expect(inputComboboxElement.label).toEqual(label);
    expect(inputComboboxElement.value).toEqual(value);
    expect(toggleInput.checked).toBe(true);
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

export const verifyOptionalInputParameterNoValue = (parameter, label) => {
    const ferovResourcePicker = getFerovResourcePicker(parameter);
    const toggleInput = getLightningInputToggle(parameter);
    const parameterLabel = getParameterLabel(parameter);
    const icon = getParameterIcon(parameter);
    expect(ferovResourcePicker.classList).toContain('slds-hide');
    expect(parameterLabel.textContent).toEqual(label);
    expect(toggleInput.checked).toBe(false);
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

export const verifyOutputParameter = (parameter, label, value) => {
    const outputComboboxElement = getOutputParameterComboboxElement(parameter);
    const icon = getParameterIcon(parameter);
    expect(outputComboboxElement.required).toBe(false);
    expect(outputComboboxElement.label).toEqual(label);
    if (value) {
        expect(outputComboboxElement.value).toEqual(value);
    }
    const iconName = getDataTypeIcons(parameter.item.dataType, 'utility');
    expect(icon.iconName).toEqual(iconName);
};

export const getParameter = (parameters, name) =>
    parameters.find(parameter => parameter.name === name);

export const findParameterElement = (parameterElements, name) => {
    return Array.from(parameterElements).find(
        parameter => parameter.item.name === name
    );
};

export const filterParameterElements = (parameterElements, name) => {
    return Array.from(parameterElements).filter(
        parameter => parameter.item.name === name
    );
};

export const findIndex = (parameters, rowIndex) => {
    return parameters.findIndex(parameter => parameter.rowIndex === rowIndex);
};

export const findByIndex = (parameters, rowIndex) => {
    return parameters.find(parameter => parameter.rowIndex === rowIndex);
};

export const getElementGuid = elementDevName => {
    const element = getElementByDevName(elementDevName);
    return element === undefined ? undefined : element.guid;
};
