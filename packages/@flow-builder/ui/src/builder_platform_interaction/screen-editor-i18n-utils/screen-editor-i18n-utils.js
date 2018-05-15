export const I18N_KEY_SCREEN_ERROR_REQUIRED = 'screen.error.required';
export const I18N_KEY_SCREEN_REVIEW_ERRORS = 'screen.review.errors';

export const I18N_KEY_SCREEN_SCREEN = 'screen.screen';
export const I18N_KEY_SCREEN_FINISH = 'screen.finish';
export const I18N_KEY_SCREEN_PREVIOUS = 'screen.previous';
export const I18N_KEY_SCREEN_PAUSE = 'screen.pause';
export const I18N_KEY_SCREEN_HEADER = 'screen.header';
export const I18N_KEY_SCREEN_FOOTER = 'screen.footer';

export const I18N_KEY_SCREEN_FIELD_EXTENSION_PREVIEW_DESCRIPTION = 'screen.field.extension.preview.description';
export const I18N_KEY_SCREEN_PROPERTIES = 'screen.properties';

export const I18N_KEY_SCREEN_PALETTE_TITLE = 'screen.palette.title';
export const I18N_KEY_SCREEN_PALETTE_SEARCH = 'search.palette.search';
export const I18N_KEY_SCREEN_PALETTE_SEARCH_PLACEHOLDER = 'search.palette.search.placeholder';

export const I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT = 'screen.field.category.input';
export const I18N_KEY_SCREEN_FIELD_CATEGORY_DISPLAY = 'screen.field.category.display';
export const I18N_KEY_SCREEN_FIELD_CATEGORY_CUSTOM = 'screen.field.category.custom';

export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_TEXT_FIELD = 'screen.field.type.label.text.field';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_LARGE_TEXT_AREA = 'screen.field.type.label.large.text.area';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_NUMBER = 'screen.field.type.label.number';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CURRENCY = 'screen.field.type.label.currency';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DATE = 'screen.field.type.label.date';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_PASSWORD = 'screen.field.type.label.password';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CHECKBOX = 'screen.field.type.label.checkbox';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_RADIO_BUTTONS = 'screen.field.type.label.radio.buttons';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_TEXT = 'screen.field.type.label.display.text';
export const I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_RICH_TEXT = 'screen.field.type.label.display.rich.text';

function buildStrings() {
    const strs = {};
    strs[I18N_KEY_SCREEN_ERROR_REQUIRED] = 'Complete this field';
    strs[I18N_KEY_SCREEN_REVIEW_ERRORS] = 'Review the errors on this page:';
    strs[I18N_KEY_SCREEN_FINISH] = 'Finish';
    strs[I18N_KEY_SCREEN_PREVIOUS] = 'Previous';
    strs[I18N_KEY_SCREEN_PAUSE] = 'Pause';
    strs[I18N_KEY_SCREEN_HEADER] = 'Header';
    strs[I18N_KEY_SCREEN_FOOTER] = 'Footer';
    strs[I18N_KEY_SCREEN_FIELD_EXTENSION_PREVIEW_DESCRIPTION] = 'This is a placeholder. No preview is available for this component';
    strs[I18N_KEY_SCREEN_PROPERTIES] = 'Properties';
    strs[I18N_KEY_SCREEN_SCREEN] = 'Screen';

    strs[I18N_KEY_SCREEN_PALETTE_TITLE] = 'Screen Components';
    strs[I18N_KEY_SCREEN_PALETTE_SEARCH] = 'Search';
    strs[I18N_KEY_SCREEN_PALETTE_SEARCH_PLACEHOLDER] = 'Search elements...';

    strs[I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT] = 'Input Components';
    strs[I18N_KEY_SCREEN_FIELD_CATEGORY_DISPLAY] = 'Display Components';
    strs[I18N_KEY_SCREEN_FIELD_CATEGORY_CUSTOM] = 'Custom';

    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_TEXT_FIELD] = 'Text Field';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_LARGE_TEXT_AREA] = 'Large Text Area';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_NUMBER] = 'Number';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CURRENCY] = 'Currency';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DATE] = 'Date';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_PASSWORD] = 'Password';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CHECKBOX] = 'Checkbox';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_RADIO_BUTTONS] = 'Radio Buttons';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_TEXT] = 'Display Text';
    strs[I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_RICH_TEXT] = 'Display Rich Text';

    return strs;
}

const STRINGS = buildStrings();

// Plug FB translation framework here when ready
export function localizeString(key) {
    const label = STRINGS[key];
    return label || key;
}