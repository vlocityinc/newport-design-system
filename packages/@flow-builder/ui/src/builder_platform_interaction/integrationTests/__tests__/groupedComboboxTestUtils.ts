import { ticks, selectEvent, blurEvent, textInputEvent } from 'builder_platform_interaction/builderTestUtils';
import { TestComponent } from './testComponent';

export class GroupedComboboxTestComponent extends TestComponent<any> {
    public async type(value: string) {
        this.element.dispatchEvent(textInputEvent(value));
        await ticks(50);
        this.element.dispatchEvent(blurEvent);
        await ticks(50);
    }

    public async select(value: string, { blur = true } = {}) {
        this.element.dispatchEvent(selectEvent(value));
        await ticks(50);
        if (blur) {
            this.element.dispatchEvent(blurEvent);
        }
        await ticks(50);
    }

    public getItemBy(propertyName: string, propertyValue) {
        if (this.element.items) {
            for (const item of this.element.items) {
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
    }
    public getSelectableItems() {
        const result: any[] = [];
        if (this.element.items) {
            for (const item of this.element.items) {
                if (item.items) {
                    for (const subItem of item.items) {
                        result.push(subItem);
                    }
                } else {
                    result.push(item);
                }
            }
        }
        return result;
    }
    public getGroupLabel(propertyName: string, propertyValue) {
        if (this.element.items) {
            for (const item of this.element.items) {
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
    }
    public getItemInGroup(groupLabel: string, propertyName: string, propertyValue) {
        for (const item of this.element.items) {
            if (item.label === groupLabel && item.items) {
                for (const subItem of item.items) {
                    if (subItem[propertyName] === propertyValue) {
                        return subItem;
                    }
                }
            }
        }
        return undefined;
    }
    public async loadMore() {
        this.element.dispatchEvent(
            new CustomEvent('endreached', {
                bubbles: true,
                cancelable: false
            })
        );
        await ticks(50);
    }
    public async loadAll() {
        let previousComboboxItems;
        do {
            previousComboboxItems = this.element.items;
            // eslint-disable-next-line no-await-in-loop
            await this.loadMore();
        } while (this.element.items !== previousComboboxItems);
    }
    public async selectItemBy(propertyName: string, propertyValues: any[], { blur = true } = {}) {
        let comboboxItem;
        if (this.element.inputText !== '') {
            this.element.dispatchEvent(textInputEvent(''));
        }
        for (const propertyValue of propertyValues) {
            // eslint-disable-next-line no-await-in-loop
            await ticks(50);
            comboboxItem = this.getItemBy(propertyName, propertyValue);
            if (!comboboxItem) {
                // eslint-disable-next-line no-await-in-loop
                await this.loadAll();
                comboboxItem = this.getItemBy(propertyName, propertyValue);
            }
            if (!comboboxItem) {
                break;
            }
            this.element.dispatchEvent(selectEvent(comboboxItem.value));
        }
        await ticks(50);
        if (blur) {
            this.element.dispatchEvent(blurEvent);
        }
        await ticks(50);
        return comboboxItem;
    }
}

const checkHasNext = (selectedItem, expectedHasNext: boolean) => {
    return !expectedHasNext
        ? !selectedItem.rightIconName || selectedItem.rightIconName === ''
        : selectedItem.rightIconName === 'utility:chevronright';
};

/**
 * Verify that given propertyName property values are selectable in the given combobox and that they can be traversed (i.e. they have next value)
 * @param {Object} combobox a grouped combobox
 * @param {String} propertyName the name of the property propertyValues correspond to
 * @param {Array} propertyValues an array of value that correspond to propertyName of the menu items (e.g. ['myTraversableProperty','nextValue'])
 */
export const expectCanBeTraversed = async (
    combobox: GroupedComboboxTestComponent,
    propertyName: string,
    propertyValues: any[]
) => {
    const selectedItem = await combobox.selectItemBy(propertyName, propertyValues, { blur: false });

    expect(selectedItem).toBeDefined();
    expect(checkHasNext(selectedItem, true)).toBe(true);
};

/**
 * Verify that given propertyName property values are selectable in the given combobox and that they cannot be traversed (i.e. they do not have next value)
 * @param {Object} combobox a grouped combobox
 * @param {String} propertyName the name of the property propertyValues correspond to
 * @param {Array} propertyValues an array of value that correspond to propertyName of the menu items (e.g. ['myTraversableProperty','nextValue'])
 */
export const expectCannotBeTraversed = async (combobox: GroupedComboboxTestComponent, propertyName, propertyValues) => {
    const selectedItem = await combobox.selectItemBy(propertyName, propertyValues, { blur: false });

    expect(selectedItem).toBeDefined();
    expect(checkHasNext(selectedItem, false)).toBe(true);
};

/**
 * Verify that given propertyName property values are not selectable in the given combobox
 * @param {Object} combobox a grouped combobox
 * @param {String} propertyName the name of the property propertyValues correspond to
 * @param {Array} propertyValues an array of value that correspond to propertyName of the menu items (e.g. ['myTraversableProperty','nextValue'])
 */
export const expectCannotBeSelected = async (combobox: GroupedComboboxTestComponent, propertyName, propertyValues) => {
    const itemNotToBeSelected = await combobox.selectItemBy(propertyName, propertyValues, {
        blur: false
    });
    expect(itemNotToBeSelected).toBeUndefined();
};
