import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

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
    return itemLabel ? itemLabel : item.displayText;
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
