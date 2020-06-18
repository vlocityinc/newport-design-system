import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { GLOBAL_CONSTANT_PREFIX, SYSTEM_VARIABLE_PREFIX } from 'builder_platform_interaction/systemLib';
import { format } from 'builder_platform_interaction/commonUtils';

/**
 * Combobox Item
 */
type ComboboxItem = {
    type: string;
    text: any;
    subText: any;
    displayText: string;
    iconName: string;
    iconAlternativeText: string;
    iconSize: string;
    value: string;
    /**
     * @summary Parent combobox item if any, undefined otherwise
     * @type {ComboboxItem?}
     */
    parent?: ComboboxItem;
    dataType: string;
};

/**
 * Separator used for pill label between each levels
 */
const PILL_LABEL_SEPARATOR = ' > ';

const API_NAME_SEPARATOR = '.';
const API_NAME_GLOBAL_PREFIX_REGEX = new RegExp('^\\$');
const GLOBAL_CONSTANTS_SYSTEM_VARIABLES_GLOBALS_PREFIX_FIRST_LETTER = '$';
const GLOBAL_CONSTANT_SYS_VARIABLES_TO_LABEL_MAP = new Map([
    [`${GLOBAL_CONSTANT_PREFIX}.True`, 'True'],
    [`${GLOBAL_CONSTANT_PREFIX}.False`, 'False'],
    [`${GLOBAL_CONSTANT_PREFIX}.EmptyString`, 'EmptyString'],
    [`${SYSTEM_VARIABLE_PREFIX}.CurrentDate`, 'Current Date'],
    [`${SYSTEM_VARIABLE_PREFIX}.CurrentDateTime`, 'Current Date & Time'],
    [`${SYSTEM_VARIABLE_PREFIX}.FaultMessage`, 'Error Text'],
    [`${SYSTEM_VARIABLE_PREFIX}.CurrentStage`, 'Current Flow Stage'],
    [`${SYSTEM_VARIABLE_PREFIX}.InterviewStartTime`, 'Flow Start Time'],
    [`${SYSTEM_VARIABLE_PREFIX}.ActiveStages`, 'Active Flow Stage'],
    [`${SYSTEM_VARIABLE_PREFIX}.InterviewGuid`, 'Flow Instance Id'],
    [`${SYSTEM_VARIABLE_PREFIX}.CurrentRecord`, 'Specified Related Record'],
    ['$API.Session_ID', 'Session Id']
]);
const OTHER_GLOBALS_PREFIXES = ['$Profile.', '$Organization.', '$System.', '$User.', '$UserRole.'];
const CAPITALIZED_FIRST_LETTERS_REGEX = RegExp('[A-Z][a-z]*', 'g');

// TODO: to be added to dedicated externalized label
const OTHER_GLOBAL_LABEL_FORMAT = '{0} for {1}';
/**
 * Given a polymorphic field text property value returns the entity label part
 * eg: CreatedBy (User) will return (User)
 * @param {string} fieldTextWithEntityLabel
 * @returns {string} entity label part zz
 */
const getEntityLabelPartFromPolymorphicFieldText = (fieldTextWithEntityLabel: string) =>
    fieldTextWithEntityLabel.split(' ').slice(-1);

/**
 * Helps to determine if the field is polymorphic based on its text property value
 * @param {string} fieldText - field's text property value
 * @returns {boolean} true if polymorphic otherwise false
 */
const isPolymorphicField = (fieldText: string): boolean => (fieldText || '').includes('(');

/**
 * Handle text subtext combobox item being from time to time some array some other time some string
 * in order to return in any cases a single string (joining all array value if needed)
 * @param {ComboboxItem} item - current combobox item
 * @param {string} propertyName - property name to fetch inside the given combobox item object
 * @returns {string} value of the given property as a single string (array values joined if we deal with an array)
 */
const getPropertyFieldValueAsString = (item: ComboboxItem, propertyName: string): string => {
    let itemLabel = item[propertyName];
    if (Array.isArray(itemLabel)) {
        itemLabel = itemLabel.map(({ text }) => text).join('');
    }
    return itemLabel;
};

/**
 * Returns API name from global entry (eg: $Profile.CurrentDate returns Profile)
 * @param {string} globalEntry - string with capitalized first letter (eg: MiddleName)
 * @returns {string} API name
 */
export const getOtherGlobalApiName = (globalEntry: string): string => {
    return globalEntry ? globalEntry.split(API_NAME_SEPARATOR)[0].replace(API_NAME_GLOBAL_PREFIX_REGEX, '') : '';
};

/**
 * Returns field name from global entry (eg: $Profile.CurrentDate returns CurrentDate)
 * @param {string} globalEntry - string with capitalized first letter (eg: MiddleName)
 * @returns {string | null} field name or null
 */
export const getOtherGlobalFieldName = (globalEntry: string): string | null => {
    if (!globalEntry) {
        return null;
    }
    const fieldSeparatorIndex = globalEntry.indexOf(API_NAME_SEPARATOR);
    return fieldSeparatorIndex > -1 ? globalEntry.substring(fieldSeparatorIndex + 1) : null;
};

/**
 * Convert string with capitalized first letters to a string separated with string
 * (eg: ThisIsMyMiddleName becomes This Is My Middle Name)
 * @param {string} capitalizedString - string with capitalized first letter (eg: MiddleName)
 * @returns {string} spaced converted string
 */
export const convertCapitalizedToSpacedString = (capitalizedString: string): string => {
    const matches = (capitalizedString || '').match(CAPITALIZED_FIRST_LETTERS_REGEX);
    return matches === null ? capitalizedString || '' : matches.join(' ');
};

/**
 * Returns label for a given global (eg: $Profile.CurrentDate becomes Current Date for profile)
 * @param {string} globalEntry - global entry (eg: $Profile.CurrentDate)
 * @returns {string} label for the given global entry
 */
export const getOtherGlobalLabel = (globalEntry: string): string => {
    const apiName = getOtherGlobalApiName(globalEntry);
    const fieldName = getOtherGlobalFieldName(globalEntry);
    if (apiName && fieldName) {
        const convertedFieldName = convertCapitalizedToSpacedString(fieldName);
        return format(OTHER_GLOBAL_LABEL_FORMAT, convertedFieldName, apiName);
    }
    return globalEntry || '';
};

/**
 * Converts given "raw" picked global constant or system variable or other globals value to some label displayed in combobox pill
 * @param {string} text - raw value to be converted (eg: '$GlobalConstant.True')
 * @returns {string} corresponding label (eg: for given '$GlobalConstant.True' we return 'True')
 */
export const getGlobalConstantOrSystemVariableOrOtherGlobalsLabel = (text: string): string => {
    if (!text || !text.startsWith(GLOBAL_CONSTANTS_SYSTEM_VARIABLES_GLOBALS_PREFIX_FIRST_LETTER)) {
        return text || '';
    }
    const label = GLOBAL_CONSTANT_SYS_VARIABLES_TO_LABEL_MAP.get(text);
    if (label) {
        return label;
    }
    const isOtherGlobalEntry = OTHER_GLOBALS_PREFIXES.some(prefix => text.startsWith(prefix));
    if (isOtherGlobalEntry) {
        return getOtherGlobalLabel(text);
    }
    return text;
};

/**
 * Construct pill label based on given combobox selected item passed
 * @param {ComboboxItem} item - combobox selected item
 * @param {ComboboxItem} item.parent - parent of the selected item if any.
 * @param {string} item.parent.dataType - data type of the parent of the selected item if any (eg: SObject).
 * @param {string} item.displayText - selected item displayed text.
 * @returns {string} pill label to be displayed (fallback to combobox selected item's display text)
 */
const getPillItemLabel = (item: ComboboxItem): string => {
    const itemText = getPropertyFieldValueAsString(item, 'text');
    const itemSubText = getPropertyFieldValueAsString(item, 'subText');

    let itemLabel =
        item.parent &&
        (item.parent.dataType === FLOW_DATA_TYPE.SOBJECT.value ||
            item.parent.dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value)
            ? itemSubText
            : itemText;
    if (isPolymorphicField(itemText)) {
        const entityLabel = getEntityLabelPartFromPolymorphicFieldText(itemText);
        itemLabel += ` ${entityLabel}`;
    }
    return itemLabel ? getGlobalConstantOrSystemVariableOrOtherGlobalsLabel(itemLabel) : item.displayText;
};

/**
 * Construct label for pill
 * @param {ComboboxItem | undefined} item - combobox item
 * @param {string} label - item label
 * @returns {string} label to be displayed inside pill
 */
export const getPillLabel = (item: ComboboxItem | undefined, label?: string): string => {
    if (item) {
        return getPillLabel(
            item.parent,
            label ? `${getPillItemLabel(item)}${PILL_LABEL_SEPARATOR}${label}` : getPillItemLabel(item)
        );
    }
    return label || '';
};

/**
 * Return pill tooltip with error message if any
 * @param {string} label - pill label
 * @param {string | null} errorMessage - pill error message
 * @returns {string} pill tooltip with possible error message
 */
export const getPillTooltip = (label: string, errorMessage: string | null): string => {
    return label ? `${label}${errorMessage ? '\n' + errorMessage : ''}` || '' : '';
};
