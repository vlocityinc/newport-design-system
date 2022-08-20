import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    mouseenterEvent,
    mouseleaveEvent,
    ticks
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldInputRichHelpPopup', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputRichHelpPopup')
);

jest.mock('lightning/icon', () => jest.requireActual('lightning/icon'));

const defaultSectionItem = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',

        iconAlternativeText: 'Screen',
        iconName: 'standard:screen',
        iconSize: 'small',
        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',

        value: '23a963ec-f168-4151-804b-9541689dc879',
        text: 'ScreenWithSection',
        view: { type: 'FlowElement' }
    }
};

const defaultSectionItemDiamondIcon = {
    item: {
        dataType: undefined,
        displayText: 'Decision',

        iconAlternativeText: 'Decision',
        iconName: 'standard:decision',
        iconSize: 'small',
        iconShape: 'diamond',
        subtype: null,
        label: 'Decision',
        name: 'Decision',

        value: 'DecisionGuid',
        text: 'Decision',
        view: { type: 'FlowElement' }
    }
};

const defaultSectionItemIconWithBackgroundColor = {
    item: {
        dataType: undefined,
        displayText: 'RecordCreate',

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

        value: 'RecordCreate',
        text: 'RecordCreate',
        view: { type: 'FlowElement' }
    }
};

const defaultSectionItemNoNext = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',
        iconAlternativeText: 'Screen',
        iconName: 'standard:screen',
        iconSize: 'small',
        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',

        value: '23a963ec-f168-4151-804b-9541689dc879',
        text: 'ScreenWithSection'
    }
};

const defaultSectionItemNoIcon = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',

        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',

        value: '23a963ec-f168-4151-804b-9541689dc879',
        text: 'ScreenWithSection',
        view: { type: 'FlowElement' }
    }
};

const defaultSectionItemNoChevronIcon = {
    item: {
        dataType: undefined,
        displayText: 'ScreenWithSection',

        iconAlternativeText: 'Screen',
        iconName: 'standard:screen',
        iconSize: 'small',
        subtype: null,
        label: 'ScreenWithSection',
        name: 'ScreenWithSection',

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
    chevronIconClass: '.chevron'
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
        cmp.addEventListener('selectitem', selectHandler);
        row.click();
        expect(selectHandler).toHaveBeenCalledTimes(1);
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
        expect(chevronIcon.size).toBe('x-small');
    });

    it('Should render the right chevron icon alternative text if item has chevron icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const chevronIcon = menu.shadowRoot.querySelector(selectors.chevronIconClass);
        expect(chevronIcon.alternativeText).toBe('Chevron Right');
    });

    it('Should render the right chevron icon name if item has chevron icon', async () => {
        const menu = await createComponentUnderTest(defaultSectionItem);
        const chevronIcon = menu.shadowRoot.querySelector('.chevron');
        expect(chevronIcon.iconName).toBeTruthy();
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
