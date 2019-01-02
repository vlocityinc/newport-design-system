import { getShadowRoot } from 'lwc-test-utils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

export const FLOW_BUILDER_VALIDATION_ERROR_MESSAGES = {
    CANNOT_BE_BLANK: 'FlowBuilderValidation.cannotBeBlank',
};

const LABEL_DESCRIPTION_SELECTORS = {
    DEV_NAME: '.devName',
    LABEL: '.label',
};

export const LIGHTNING_COMPONENTS_SELECTORS = {
    LIGHTNING_COMBOBOX: 'lightning-combobox',
    LIGHTNING_GROUPED_COMBOBOX: 'lightning-grouped-combobox',
    LIGHTNING_ICON: 'lightning-icon',
    LIGHTNING_TAB: 'lightning-tab',
    LIGHTNING_RADIO_GROUP: 'lightning-radio-group',
};

export const INTERACTION_COMPONENTS_SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    DATA_TYPE_PICKER: 'builder_platform_interaction-data-type-picker',
    RESOURCED_TEXTAREA: 'builder_platform_interaction-resourced-textarea',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker',
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker',
    INTERACTION_COMBOBOX: 'builder_platform_interaction-combobox',
    OUTPUT_RESOURCE_PICKER: 'builder_platform_interaction-output-resource-picker',
    BASE_CALLOUT_EDITOR: 'builder_platform_interaction-base-callout-editor',
    COMBOBOX: 'builder_platform_interaction-combobox',
    PARAMETER_LIST: 'builder_platform_interaction-parameter-list',
    PARAMETER_ITEM: 'builder_platform_interaction-parameter-item',
    FIELD_TO_FEROV_EXPRESSION_BUILDER: 'builder_platform_interaction-field-to-ferov-expression-builder',
    BASE_EXPRESSION_BUILDER: 'builder_platform_interaction-base-expression-builder',
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
};

export const getLabelDescriptionElement = (editor) => {
    return getShadowRoot(editor).querySelector(INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION);
};

export const getLabelDescriptionNameElement = (editor) => {
    return getShadowRoot(getLabelDescriptionElement(editor)).querySelector(LABEL_DESCRIPTION_SELECTORS.DEV_NAME);
};

export const getLabelDescriptionLabelElement = (editor) => {
    return getShadowRoot(getLabelDescriptionElement(editor)).querySelector(LABEL_DESCRIPTION_SELECTORS.LABEL);
};

export const focusoutEvent = new FocusEvent('focusout', {
    'bubbles'   : true,
    'cancelable': true,
});

export const textInputEvent = (textInput) => {
    return new CustomEvent('textinput', {
        'bubbles'   : true,
        'cancelable': true,
        detail: { text: textInput },
    });
};

export const blurEvent = new FocusEvent('blur', {
    'bubbles'   : true,
    'cancelable': true,
});

export const selectEvent = (value) => {
    return new CustomEvent('select', {
        'bubbles'   : true,
        'cancelable': true,
        detail: { value },
    });
};

export const expectGroupedComboboxItem = (groupedCombobox, itemText) => {
    expect(groupedCombobox.items).toEqual(expect.arrayContaining([expect.objectContaining({"text": itemText})]));
};
export const expectGroupedComboboxItemInGroup = (groupedCombobox, groupLabel, itemText) => {
    expect(groupedCombobox.items).toEqual(expect.arrayContaining([
        expect.objectContaining({label : groupLabel, items: expect.arrayContaining([expect.objectContaining({ "text": itemText})])})
    ]));
};
export const getGroupedComboboxItemInGroup = (groupedCombobox, groupLabel, itemText) => {
    for (const item of groupedCombobox.items) {
        if (item.label === groupLabel && item.items) {
            for (const subItem of item.items) {
                if (subItem.text === itemText) {
                    return subItem;
                }
            }
        }
    }
    return undefined;
};
export const getGroupedComboboxItem = (groupedCombobox, itemText) => {
    for (const item of groupedCombobox.items) {
        if (item.text === itemText) {
            return item;
        }
    }
    return undefined;
};

export const getFieldToFerovExpressionBuilders = (parentElement) => {
    return getShadowRoot(parentElement).querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER);
};

export const getBaseExpressionBuilder = (parentElement) => {
    return getShadowRoot(parentElement).querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER);
};

export const getEntityResourcePicker = (editor) => {
    return getShadowRoot(editor).querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);
};

export const getRadioGroup = (parentElement) => {
    return getShadowRoot(parentElement).querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);
};

export const auraFetch = (actions) => async (actionName, shouldExecuteCallback, callback, params) => {
    await ticks(10);
    if (!shouldExecuteCallback()) {
        return undefined;
    }
    let result;
    if (actions[actionName]) {
        result = actions[actionName](params);
    } else {
        result = { error : 'Unknown actionName'};
    }
    callback(result);
    return undefined;
};