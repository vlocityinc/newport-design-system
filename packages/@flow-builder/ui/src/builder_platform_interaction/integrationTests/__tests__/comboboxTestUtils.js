import {
    ticks,
    deepQuerySelector,
    LIGHTNING_COMPONENTS_SELECTORS,
    blurEvent,
    textInputEvent,
    selectEvent
} from 'builder_platform_interaction/builderTestUtils';
import {
    addCurlyBraces,
    removeCurlyBraces,
    splitStringBySeparator,
    isReference
} from 'builder_platform_interaction/commonUtils';

export const typeLiteralValueInCombobox = async (combobox, value) => {
    const groupedCombobox = deepQuerySelector(combobox, [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
    groupedCombobox.dispatchEvent(textInputEvent(value));
    await ticks(50);
    groupedCombobox.dispatchEvent(blurEvent);
};

export const typeMergeFieldInCombobox = async (combobox, mergeField) => {
    const groupedCombobox = deepQuerySelector(combobox, [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
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

export const getGroupedComboboxItemBy = (groupedCombobox, propertyName, propertyValue) => {
    if (groupedCombobox.items) {
        for (const item of groupedCombobox.items) {
            if (item.items) {
                for (const subItem of item.items) {
                    if (subItem[propertyName] === propertyValue) {
                        return subItem;
                    }
                }
            } else if (item[propertyName] === propertyValue) {
                return item;
            }
        }
    }
    return undefined;
};

export const selectGroupedComboboxItemBy = async (combobox, propertyName, propertyValues, { blur = true } = {}) => {
    let promise = ticks(50);
    for (const propertyValue of propertyValues) {
        promise = promise.then(() => {
            const comboboxItem = getGroupedComboboxItemBy(combobox, propertyName, propertyValue);
            if (!comboboxItem) {
                return undefined;
            }
            combobox.dispatchEvent(selectEvent(comboboxItem.value));
            return ticks(50).then(() => comboboxItem);
        });
    }
    const comboboxItem = await promise;
    if (blur) {
        combobox.dispatchEvent(blurEvent);
    }
    await ticks(50);
    return comboboxItem;
};

export const selectComboboxItemBy = async (combobox, propertyName, propertyValues, { blur = true } = {}) => {
    const groupedCombobox = deepQuerySelector(combobox, [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
    return selectGroupedComboboxItemBy(groupedCombobox, propertyName, propertyValues, { blur });
};

export const getComboboxItems = combobox => {
    const groupedCombobox = deepQuerySelector(combobox, [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
    return groupedCombobox.items;
};
