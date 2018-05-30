export * from './screen-editor-model-utils.js';
export * from './screen-editor-field-type-utils.js';
// export {translateCFDtoQuill} from './rich-text-utils.js'; TODO - W-4947234

export const currencyFormat = 'currency';
export const lightningInputTypes = {
    checkbox: 'checkbox',
    date: 'date',
    dateTime: 'datetime-local',
    number: 'number',
    password: 'password'
};

export function isScreen(element) {
    return element && element.elementType && element.elementType === 'SCREEN';
}

export function getVariant(label) {
    // field labels are not required in flow, but they are required by the lightning component
    // we're using to preview them. Hide the label if the label is an empty string or equivalent.
    return (label && label.trim().length > 0) ? 'standard' : 'label-hidden';
}