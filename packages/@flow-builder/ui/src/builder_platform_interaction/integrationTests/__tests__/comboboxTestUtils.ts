import {
    ticks,
    LIGHTNING_COMPONENTS_SELECTORS,
    blurEvent,
    textInputEvent,
    clickPill,
    removePill,
    getComboboxPill
} from 'builder_platform_interaction/builderTestUtils';
import {
    addCurlyBraces,
    removeCurlyBraces,
    splitStringBySeparator,
    isReference
} from 'builder_platform_interaction/commonUtils';
import { GroupedComboboxTestComponent } from './groupedComboboxTestUtils';
import Combobox from 'builder_platform_interaction/combobox';
import { TestComponent } from './testComponent';

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
     * @param {HTMLElement} combobox - combobox box you type into
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

    public async selectItemBy(propertyName: string, propertyValues: string[], { blur = true } = {}) {
        return this.getGroupedCombobox().selectItemBy(propertyName, propertyValues, { blur });
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
