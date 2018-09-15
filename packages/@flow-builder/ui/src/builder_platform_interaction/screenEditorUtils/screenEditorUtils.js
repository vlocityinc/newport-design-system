export * from "./screenEditorModelUtils.js";
export * from "./screenEditorFieldTypeUtils.js";
export * from "./screenEditorExtensionUtils.js";

import { PropertyChangedEvent } from "builder_platform_interaction/events";

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

export const SELECTED_CLASS = 'selected';
export const DRAGGING_CLASS = 'dragging';
export const CONTAINER_DIV_SELECTOR = 'div.highlight';

export function isScreen(element) {
    return element && element.elementType && element.elementType === 'SCREEN';
}

export function getVariant(label) {
    // field labels are not required in flow, but they are required by the lightning component
    // we're using to preview them. Hide the label if the label is an empty string or equivalent.
    const displayText = typeof label === 'string' ? label : label.value;
    return displayText && displayText.trim().length > 0 ? LIGHTNING_INPUT_VARIANTS.STANDARD : LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN;
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


export function addGuidAndCurrentValueToEvent(event, field) {
    return new PropertyChangedEvent(
        event.detail.propertyName,
        event.detail.value,
        event.detail.error,
        field.guid,
        field[event.detail.propertyName]);
}

export function addHydratedCurrentValueToEvent(event, field, currentValue) {
    return new PropertyChangedEvent(
        event.detail.propertyName,
        event.detail.value,
        event.detail.error,
        field.guid,
        {value: currentValue, error: null});
}