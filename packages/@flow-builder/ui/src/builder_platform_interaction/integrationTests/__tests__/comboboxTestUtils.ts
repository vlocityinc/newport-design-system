import {
    ticks,
    deepQuerySelector,
    LIGHTNING_COMPONENTS_SELECTORS,
    blurEvent,
    textInputEvent,
    clickPill
} from 'builder_platform_interaction/builderTestUtils';
import {
    addCurlyBraces,
    removeCurlyBraces,
    splitStringBySeparator,
    isReference
} from 'builder_platform_interaction/commonUtils';
import {
    getGroupedComboboxGroupLabel,
    selectGroupedComboboxItemBy,
    getSelectableGroupedComboboxItems
} from './groupedComboboxTestUtils';
import Combobox from 'builder_platform_interaction/combobox';

export const getGroupedComboboxFromCombobox = (combobox: Combobox) =>
    deepQuerySelector(combobox, [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);

export const typeLiteralValueInCombobox = async (combobox: Combobox, value: string) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    groupedCombobox.dispatchEvent(textInputEvent(value));
    await ticks(50);
    groupedCombobox.dispatchEvent(blurEvent);
};

export const typeMergeFieldInCombobox = async (combobox: Combobox, mergeField: string) => {
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

/**
 * Type into combobox given value
 * @param {HTMLElement} combobox - combobox box you type into
 * @param {string} referenceOrValue - value typed in
 * @param {boolean} [clickOnPill=false] - if true we click on the combobox pill switching to merge field notation
 * @returns {Promise<void>} fulfilled promise
 */
export const typeReferenceOrValueInCombobox = async (
    combobox: Combobox,
    referenceOrValue: string,
    clickOnPill = false
) => {
    if (clickOnPill) {
        await clickPill(combobox);
    }
    if (isReference(referenceOrValue)) {
        await typeMergeFieldInCombobox(combobox, referenceOrValue);
    } else {
        await typeLiteralValueInCombobox(combobox, referenceOrValue);
    }
};

export const getComboboxGroupLabel = (combobox: Combobox, propertyName: string, propertyValue: string) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    return getGroupedComboboxGroupLabel(groupedCombobox, propertyName, propertyValue);
};

export const selectComboboxItemBy = async (
    combobox: Combobox,
    propertyName: string,
    propertyValues: string[],
    { blur = true } = {}
) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    return selectGroupedComboboxItemBy(groupedCombobox, propertyName, propertyValues, { blur });
};

export const getSelectableComboboxItems = (combobox: Combobox) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    return getSelectableGroupedComboboxItems(groupedCombobox);
};

export const getComboboxItems = (combobox: Combobox) => {
    const groupedCombobox = getGroupedComboboxFromCombobox(combobox);
    return groupedCombobox.items;
};

// Used by comboboxMatchers.canSelectInCombobox
const getComboboxValuesPath = (combobox: Combobox, propertyName: string) => {
    let value = combobox.value;
    if (typeof value === 'string') {
        return value;
    }
    const result: any[] = [];
    do {
        result.unshift(value[propertyName]);
        value = value.parent;
    } while (value);
    return result;
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
    namespace jest {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Matchers<R> {
            canSelectInCombobox(propertyName: string, propertyValues: string[]): CustomMatcherResult;
        }
    }
}

expect.extend({
    async canSelectInCombobox(combobox: Combobox, propertyName: string, propertyValues: string[]) {
        combobox.value = '';
        const selectedItem = await selectComboboxItemBy(combobox, propertyName, propertyValues, { blur: false });
        if (selectedItem === undefined) {
            const comboboxValues = getComboboxValuesPath(combobox, propertyName);
            const selectableComboboxItems = getSelectableComboboxItems(combobox).map((item) => item[propertyName]);
            return {
                message: () =>
                    `Expected ${this.utils.stringify(
                        propertyValues
                    )} to be selectable in the combobox. Selectable combobox items` +
                    (comboboxValues !== '' ? ` from ${this.utils.stringify(comboboxValues)}` : '') +
                    ` are ${this.utils.stringify(selectableComboboxItems)}`,
                pass: false
            };
        }
        if (!this.isNot && combobox.errorMessage != null) {
            return {
                message: () =>
                    `Expected ${this.utils.stringify(
                        propertyValues
                    )} to be selectable in the combobox but there is an error message : '${combobox.errorMessage}'`,
                pass: false
            };
        }
        return {
            message: () => `Expected ${this.utils.stringify(propertyValues)} not to be selectable in the combobox`,
            pass: true
        };
    }
});
