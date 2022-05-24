// @ts-nocheck
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    mouseenterEvent,
    mouseleaveEvent
} from 'builder_platform_interaction/builderTestUtils';
import { createComponent, ticks } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { FetchFieldInputMenuDataEvent } from 'builder_platform_interaction/events';

const defaultSectionItem = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',
        hasNext: true,
        iconAlternativeText: 'Screen',
        iconName: 'standard:screen',
        iconSize: 'small',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'x-small',
        rightIconAlternativeText: 'Chevron Right',
        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',
        type: 'option-card',
        value: '23a963ec-f168-4151-804b-9541689dc879',
        text: 'ScreenWithSection'
    }
};

const defaultSectionItemDiamondIcon = {
    item: {
        dataType: undefined,
        displayText: 'Decision',
        hasNext: true,
        iconAlternativeText: 'Decision',
        iconName: 'standard:decision',
        iconSize: 'small',
        iconShape: 'diamond',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'x-small',
        rightIconAlternativeText: 'Chevron Right',
        subtype: null,
        label: 'Decision',
        name: 'Decision',
        type: 'option-card',
        value: 'DecisionGuid',
        text: 'Decision'
    }
};

const defaultSectionItemIconWithBackgroundColor = {
    item: {
        dataType: undefined,
        displayText: 'RecordCreate',
        hasNext: true,
        iconAlternativeText: 'RecordCreate',
        iconName: 'standard:record_create',
        iconSize: 'small',
        iconBackgroundColor: 'background-navy',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'x-small',
        rightIconAlternativeText: 'Chevron Right',
        subtype: null,
        label: 'RecordCreate',
        name: 'RecordCreate',
        type: 'option-card',
        value: 'RecordCreate',
        text: 'RecordCreate'
    }
};

const defaultSectionItemDiamondIconWithBackgroundColor = {
    item: {
        dataType: undefined,
        displayText: 'Decision',
        hasNext: true,
        iconAlternativeText: 'Decision',
        iconName: 'standard:decision',
        iconSize: 'small',
        iconShape: 'diamond',
        iconBackgroundColor: 'background-navy',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'x-small',
        rightIconAlternativeText: 'Chevron Right',
        subtype: null,
        label: 'Decision',
        name: 'Decision',
        type: 'option-card',
        value: 'DecisionGuid',
        text: 'Decision'
    }
};

const defaultSectionItemNoNext = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',
        hasNext: false,
        iconAlternativeText: 'Screen',
        iconName: 'standard:screen',
        iconSize: 'small',
        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',
        type: 'option-card',
        value: '23a963ec-f168-4151-804b-9541689dc879',
        text: 'ScreenWithSection'
    }
};

const defaultSectionItemNoIcon = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',
        hasNext: true,
        rightIconName: 'utility:chevronright',
        rightIconSize: 'x-small',
        rightIconAlternativeText: 'Chevron Right',
        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',
        type: 'option-card',
        value: '23a963ec-f168-4151-804b-9541689dc879',
        text: 'ScreenWithSection'
    }
};

const defaultSectionItemNoChevronIcon = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',
        hasNext: true,
        iconAlternativeText: 'Screen',
        iconName: 'standard:screen',
        iconSize: 'small',
        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',
        type: 'option-card',
        value: '23a963ec-f168-4151-804b-9541689dc879',
        text: 'ScreenWithSection'
    }
};

const createComponentUnderTest = async (props) => {
    return createComponent(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_MENU_SECTION_ITEM, props);
};

const selectors = {
    row: 'div.slds-grid',
    defaultComboboxItemClass: '.slds-media.slds-media_center.slds-p-right_none.slds-col.slds-listbox__option_entity',
    itemIconClass: `.slds-media__figure.slds-listbox__option-icon ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON}`,
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    diamondIconContainerClass:
        'slds-media__figure slds-listbox__option-icon rotate-icon-container slds-icon-standard-decision',
    diamondIconClass: 'rotate-icon-svg',
    chevronIconClass: `.slds-media__figure.slds-media__figure_reverse ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON}`
};

describe('Field Input Menu Section Item Tests', () => {
    test('sanity', async () => {
        const cmp = await createComponentUnderTest(defaultSectionItem);
        expect(cmp).toBeTruthy();
    });

    it('Should render a combobox item component', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const row = menu.shadowRoot.querySelector(selectors.defaultComboboxItemClass);
        expect(row).not.toBeNull();
    });

    it('should fire the fetch field input menu data event when row is selected and item has next', async () => {
        const cmp = await createComponentUnderTest(defaultSectionItem);
        const row = cmp.shadowRoot.querySelector(selectors.defaultComboboxItemClass);
        const selectHandler = jest.fn();
        cmp.addEventListener(FetchFieldInputMenuDataEvent.EVENT_NAME, selectHandler);
        row.click();
        expect(selectHandler).toHaveBeenCalledTimes(1);
    });

    it('should not fire the fetch field input menu data event when row is selected and item does not have next', async () => {
        const cmp = await createComponentUnderTest(defaultSectionItemNoNext);
        const row = cmp.shadowRoot.querySelector(selectors.defaultComboboxItemClass);
        const selectHandler = jest.fn();
        cmp.addEventListener(FetchFieldInputMenuDataEvent.EVENT_NAME, selectHandler);
        row.click();
        expect(selectHandler).not.toBeCalled();
    });

    it('Should render the right icon container class', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const icon = menu.shadowRoot.querySelector(`${selectors.defaultComboboxItemClass} span`);
        expect(icon.className).toBe(selectors.iconContainerClass);
    });

    it('Should render the right icon class', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const icon = menu.shadowRoot.querySelector(
            `${selectors.defaultComboboxItemClass} ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON}`
        );
        expect(icon.className).toBe('');
    });

    it('Should render the right icon class if icon has background color', async () => {
        const menu = await createComponentUnderTest(defaultSectionItemIconWithBackgroundColor);
        const icon = menu.shadowRoot.querySelector(
            `${selectors.defaultComboboxItemClass} ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON}`
        );
        expect(icon.className).toBe(defaultSectionItemIconWithBackgroundColor.item.iconBackgroundColor);
    });

    it('Should render icon if item has icon name', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const itemIcon = menu.shadowRoot.querySelector(selectors.itemIconClass);
        expect(itemIcon).not.toBeNull();
    });

    it('Should render the right icon container class if icon is a diamond shape', async () => {
        const menu = await createComponentUnderTest(defaultSectionItemDiamondIcon);
        const diamondIcon = menu.shadowRoot.querySelector(`${selectors.defaultComboboxItemClass} span`);
        expect(diamondIcon.className).toBe(selectors.diamondIconContainerClass);
    });

    it('Should render the right icon class if icon is a diamond shape', async () => {
        const menu = await createComponentUnderTest(defaultSectionItemDiamondIcon);
        const diamondIcon = menu.shadowRoot.querySelector(
            `${selectors.defaultComboboxItemClass} ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON}`
        );
        expect(diamondIcon.className).toBe(selectors.diamondIconClass);
    });

    it('Should render the right icon size if item has icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const itemIcon = menu.shadowRoot.querySelector(selectors.itemIconClass);
        expect(itemIcon.size).toBe(defaultSectionItem.item.iconSize);
    });

    it('Should render the right icon alternative text if item has icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const itemIcon = menu.shadowRoot.querySelector(selectors.itemIconClass);
        expect(itemIcon.alternativeText).toBe(defaultSectionItem.item.iconAlternativeText);
    });

    it('Should render the right icon name if item has icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const itemIcon = menu.shadowRoot.querySelector(selectors.itemIconClass);
        expect(itemIcon.iconName).toBe(defaultSectionItem.item.iconName);
    });

    it('Should not render icon if item does not have icon name', async () => {
        const menu = await createComponentUnderTest(defaultSectionItemNoIcon);
        const itemIcon = menu.shadowRoot.querySelector(selectors.itemIconClass);
        expect(itemIcon).toBeNull();
    });

    it('Should render the right item text', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const item = menu.shadowRoot.querySelector(selectors.defaultComboboxItemClass);
        expect(item.textContent).toBe(defaultSectionItem.item.text);
    });

    it('Should render chevron icon if item has chevron icon name', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const chevronIcon = menu.shadowRoot.querySelector(selectors.chevronIconClass);
        expect(chevronIcon).not.toBeNull();
    });

    it('Should render the right chevron icon size if item has chevron icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const chevronIcon = menu.shadowRoot.querySelector(selectors.chevronIconClass);
        expect(chevronIcon.size).toBe(defaultSectionItem.item.rightIconSize);
    });

    it('Should render the right chevron icon alternative text if item has chevron icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const chevronIcon = menu.shadowRoot.querySelector(selectors.chevronIconClass);
        expect(chevronIcon.alternativeText).toBe(defaultSectionItem.item.rightIconAlternativeText);
    });

    it('Should render the right chevron icon name if item has chevron icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const chevronIcon = menu.shadowRoot.querySelector(selectors.chevronIconClass);
        expect(chevronIcon.iconName).toBe(defaultSectionItem.item.rightIconName);
    });

    it('Should not render chevron icon if item does not have chevron icon name', async () => {
        const menu = await createComponentUnderTest(defaultSectionItemNoChevronIcon);
        const chevronIcon = menu.shadowRoot.querySelector(selectors.chevronIconClass);
        expect(chevronIcon).toBeNull();
    });

    it('Should render tooltip when mouse hovers row and info icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const li = menu.shadowRoot.querySelector(selectors.row);
        li.dispatchEvent(mouseenterEvent());
        await ticks(1);
        const tooltip = menu.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_RICH_HELP_POPUP);
        expect(tooltip).not.toBeNull();
    });

    it('Should not render tooltip when mouse leaves row and info icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const li = menu.shadowRoot.querySelector(selectors.row);
        li.dispatchEvent(mouseenterEvent());
        await ticks(1);
        let tooltip = menu.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_RICH_HELP_POPUP);
        expect(tooltip).not.toBeNull();
        li.dispatchEvent(mouseleaveEvent());
        await ticks(1);
        tooltip = menu.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_RICH_HELP_POPUP);
        expect(tooltip).toBeNull();
    });

    it('Should have aria-expanded="false" if item has chevron icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const div = menu.shadowRoot.querySelector(selectors.row);
        expect(div.hasAttribute('aria-expanded')).toBeTruthy();
    });

    it('Should not have aria-expanded if item does not have chevron icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItemNoNext);
        const div = menu.shadowRoot.querySelector(selectors.row);
        expect(div.hasAttribute('aria-expanded')).toBeFalsy();
    });
});
