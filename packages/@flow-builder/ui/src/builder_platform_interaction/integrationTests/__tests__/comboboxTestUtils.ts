import {
    blurEvent,
    clickPill,
    deepQuerySelector,
    getComboboxPill,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    removePill,
    textInputEvent,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import Combobox from 'builder_platform_interaction/combobox';
import {
    addCurlyBraces,
    isReference,
    removeCurlyBraces,
    splitStringBySeparator
} from 'builder_platform_interaction/commonUtils';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import { GroupedComboboxTestComponent } from './groupedComboboxTestUtils';
import { TestComponent } from './testComponent';

/**
 * Do a deep query selector to get the combobox nested witin a SObjectOrSObjectCollectionPicker
 *
 * @param {SObjectOrSObjectCollectionPicker & HTMLElement} element - value typed in
 * @returns {ComboboxTestComponent} combobox test component
 */
export function getSObjectOrSObjectCollectionPickerCombobox(element: SObjectOrSObjectCollectionPicker & HTMLElement) {
    return new ComboboxTestComponent(
        deepQuerySelector(element, [
            INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
        ])
    );
}

export const getRecordChildrenComboboxMenuItemsValues = async (combobox: ComboboxTestComponent) => {
    await combobox.removePill();
    await combobox.selectItemBy('text', ['$Record'], { blur: false });
    return Object.values(combobox.getItems());
};

export const findComboboxMenuItemByValue = (
    comboboxMenuItemsValues: { value: string }[],
    ownerUserMergeFieldValue: string
) => comboboxMenuItemsValues.find(({ value }) => value === ownerUserMergeFieldValue);

export class ComboboxTestComponent extends TestComponent<Combobox> {
    public getGroupedCombobox() {
        return new GroupedComboboxTestComponent(
            this.deepQuerySelector([LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX])
        );
    }

    public async typeLiteralValue(value: string) {
        const groupedCombobox = this.getGroupedCombobox();
        groupedCombobox.element.dispatchEvent(textInputEvent(value));
        await ticks(50);
        groupedCombobox.element.dispatchEvent(blurEvent);
        await ticks(50);
    }

    public async typeMergeField(mergeField: string) {
        const groupedCombobox = this.getGroupedCombobox();
        const parts = splitStringBySeparator(removeCurlyBraces(mergeField));
        let promise = Promise.resolve();
        for (let i = 0; i < parts.length; i++) {
            promise = promise.then(() => {
                let displayText = parts.slice(0, i + 1).join('.');
                displayText = addCurlyBraces(displayText);
                groupedCombobox.element.dispatchEvent(textInputEvent(displayText));
                return ticks(50);
            });
        }
        await promise;
        groupedCombobox.element.dispatchEvent(blurEvent);
    }

    /**
     * Type into combobox given value
     *
     * @param {string} referenceOrValue - value typed in
     * @param {boolean} [clickOnPill=false] - if true we click on the combobox pill switching to merge field notation
     * @returns {Promise<void>} fulfilled promise
     */
    public async typeReferenceOrValue(referenceOrValue: string, clickOnPill = false) {
        if (clickOnPill) {
            await this.clickPill();
        }
        if (isReference(referenceOrValue)) {
            await this.typeMergeField(referenceOrValue);
        } else {
            await this.typeLiteralValue(referenceOrValue);
        }
    }

    public getPillElement() {
        return getComboboxPill(this.element);
    }

    public async clickPill() {
        await clickPill(this.element);
    }

    public async removePill() {
        await removePill(this.element);
    }

    public getGroupLabel(propertyName: string, propertyValue: string) {
        return this.getGroupedCombobox().getGroupLabel(propertyName, propertyValue);
    }

    public async selectItemBy(propertyName: string, propertyValues: string[], { blur = true, clearText = true } = {}) {
        return this.getGroupedCombobox().selectItemBy(propertyName, propertyValues, { blur, clearText });
    }

    public getSelectableItems() {
        return this.getGroupedCombobox().getSelectableItems();
    }

    public getItems(): any[] {
        return this.getGroupedCombobox().element.items;
    }

    // Used by comboboxMatchers.canSelectInCombobox
    public getComboboxValuesPath(propertyName: string) {
        let value = this.element.value;
        if (typeof value === 'string') {
            return value;
        }
        const result: any[] = [];
        do {
            result.unshift(value[propertyName]);
            value = value.parent;
        } while (value);
        return result;
    }

    public get validity(): string | undefined {
        return this.getGroupedCombobox().validity;
    }
}

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
    async canSelectInCombobox(combobox: ComboboxTestComponent, propertyName: string, propertyValues: string[]) {
        combobox.element.value = '';
        const selectedItem = await combobox.selectItemBy(propertyName, propertyValues, { blur: false });
        if (selectedItem === undefined) {
            const comboboxValues = combobox.getComboboxValuesPath(propertyName);
            const selectableComboboxItems = combobox.getSelectableItems().map((item) => item[propertyName]);
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
        if (!this.isNot && combobox.element.errorMessage != null) {
            return {
                message: () =>
                    `Expected ${this.utils.stringify(
                        propertyValues
                    )} to be selectable in the combobox but there is an error message : '${
                        combobox.element.errorMessage
                    }'`,
                pass: false
            };
        }
        return {
            message: () => `Expected ${this.utils.stringify(propertyValues)} not to be selectable in the combobox`,
            pass: true
        };
    }
});
