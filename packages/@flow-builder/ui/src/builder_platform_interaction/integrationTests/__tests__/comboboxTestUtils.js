import {
    ticks,
    deepQuerySelector,
    LIGHTNING_COMPONENTS_SELECTORS,
    blurEvent,
    textInputEvent
} from 'builder_platform_interaction/builderTestUtils';
import {
    addCurlyBraces,
    removeCurlyBraces,
    splitStringBySeparator,
    isReference
} from 'builder_platform_interaction/commonUtils';
import { getGroupedComboboxGroupLabel, selectGroupedComboboxItemBy } from './groupedComboboxTestUtils';

export const getGroupedComboboxFromCombobox = combobox =>
    deepQuerySelector(combobox, [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);

export const typeLiteralValueInCombobox = async (combobox, value) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    groupedCombobox.dispatchEvent(textInputEvent(value));
    await ticks(50);
    groupedCombobox.dispatchEvent(blurEvent);
};

export const typeMergeFieldInCombobox = async (combobox, mergeField) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    const parts = splitStringBySeparator(removeCurlyBraces(mergeField));
    let promise = Promise.resolve();
    for (let i = 0; i < parts.length; i++) {
        promise = promise.then(() => {
            let displayText = parts.slice(0, i + 1).join('.');
            displayText = addCurlyBraces(displayText);
            groupedCombobox.dispatchEvent(textInputEvent(displayText));
            return ticks(50);
        });
    }
    await promise;
    groupedCombobox.dispatchEvent(blurEvent);
};

export const typeReferenceOrValueInCombobox = async (combobox, referenceOrValue) => {
    if (isReference(referenceOrValue)) {
        await typeMergeFieldInCombobox(combobox, referenceOrValue);
    } else {
        await typeLiteralValueInCombobox(combobox, referenceOrValue);
    }
};

export const getComboboxGroupLabel = (combobox, propertyName, propertyValue) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    return getGroupedComboboxGroupLabel(groupedCombobox, propertyName, propertyValue);
};

export const selectComboboxItemBy = async (combobox, propertyName, propertyValues, { blur = true } = {}) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    return selectGroupedComboboxItemBy(groupedCombobox, propertyName, propertyValues, { blur });
};

export const getComboboxItems = combobox => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    return groupedCombobox.items;
};
