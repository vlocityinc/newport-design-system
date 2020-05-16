// @ts-nocheck
import { ticks, selectEvent, blurEvent } from 'builder_platform_interaction/builderTestUtils';

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

export const getGroupedComboboxGroupLabel = (groupedCombobox, propertyName, propertyValue) => {
    if (groupedCombobox.items) {
        for (const item of groupedCombobox.items) {
            if (item.items) {
                for (const subItem of item.items) {
                    if (subItem[propertyName] === propertyValue) {
                        return item.label;
                    }
                }
            }
        }
    }
    return undefined;
};

export const getGroupedComboboxItemInGroup = (groupedCombobox, groupLabel, propertyName, propertyValue) => {
    for (const item of groupedCombobox.items) {
        if (item.label === groupLabel && item.items) {
            for (const subItem of item.items) {
                if (subItem[propertyName] === propertyValue) {
                    return subItem;
                }
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
