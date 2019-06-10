import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
export * from './screenEditorFieldTypeUtils.js';
export * from './screenEditorExtensionUtils.js';

// export {translateCFDtoQuill} from './rich-text-utils.js'; TODO - W-4947234

export const CURRENCY_FORMAT = 'currency';

export const LIGHTNING_INPUT_TYPES = {
    CHECKBOX: 'checkbox',
    DATE: 'date',
    DATE_TIME: 'datetime-local',
    NUMBER: 'number',
    PASSWORD: 'password'
};

export const LIGHTNING_INPUT_VARIANTS = {
    STANDARD: 'standard',
    LABEL_HIDDEN: 'label-hidden'
};

export const CANVAS_SCREEN_GUIDS = {
    HEADER_GUID: 'showHeader',
    FOOTER_GUID: 'showFooter'
};

export const EXTENSION_PARAM_PREFIX = {
    INPUT: '$$input$$',
    OUTPUT: '$$output$$'
};

export const SELECTED_CLASS = 'selected';
export const DRAGGING_CLASS = 'dragging';
export const CONTAINER_DIV_SELECTOR = 'div.highlight';

export function isScreen(element) {
    return (
        element &&
        element.elementType &&
        element.elementType === ELEMENT_TYPE.SCREEN
    );
}

export function getVariant(label) {
    // field labels are not required in flow, but they are required by the lightning component
    // we're using to preview them. Hide the label if the label is an empty string or equivalent.
    const displayText = typeof label === 'string' ? label : label.value;
    return displayText && displayText.trim().length > 0
        ? LIGHTNING_INPUT_VARIANTS.STANDARD
        : LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN;
}

export function booleanAttributeValue(element, property) {
    if (element && property) {
        return booleanValue(element[property], property);
    }

    return false;
}

export function booleanValue(value, name) {
    return value && (value === 'true' || value === true || value === name);
}

function getNormalizedValue(value, propertyName = 'value') {
    const hydrated = value && value.hasOwnProperty('value');
    const val = hydrated ? value[propertyName] : value;
    return !val || val === '' ? null : val;
}

/**
 * Compares two values and returns true if they are different.
 * null, undefined and empty strings are considered to be equal.
 *
 * @param {*} value1 - The first value
 * @param {*} value2 - The second value
 * @param {*} includeErrors - Should errors be considered in the equality check
 * @returns true if values are different
 */
export function compareValues(value1, value2, includeErrors = false) {
    const normValue1 = getNormalizedValue(value1, 'value');
    const normValue2 = getNormalizedValue(value2, 'value');
    const result = normValue1 !== normValue2;
    if (!result && includeErrors) {
        const err1 = getNormalizedValue(value1, 'error');
        const err2 = getNormalizedValue(value2, 'error');
        return err1 !== err2;
    }

    return result;
}
