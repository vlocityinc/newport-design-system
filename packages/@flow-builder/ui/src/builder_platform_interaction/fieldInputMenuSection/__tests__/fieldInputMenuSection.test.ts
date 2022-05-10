// @ts-nocheck
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';

const componentWithSectionLabel = {
    section: {
        key: 'Component With Section Label',
        label: 'Section Label',
        items: [
            {
                dataType: undefined,
                displayText: 'ScreenWithSection',
                hasNext: true,
                iconAlternativeText: 'Screen',
                iconName: 'standard:screen',
                iconSize: 'small',
                rightIconName: 'utility:chevronright',
                rightIconSize: 'x-small',
                subtype: null,
                label: 'ScreenWithSection',
                name: 'ScreenWithSection',
                type: 'option-card',
                value: '23a963ec-f168-4151-804b-9541689dc879',
                text: 'ScreenWithSection'
            }
        ]
    }
};

const sectionWithTwoItems = {
    section: {
        key: 'Component With Section With Two Items',
        label: 'Section With Two Items',
        items: [
            {
                dataType: 'DateTime',
                displayText: 'item-1',
                hasNext: false,
                iconAlternativeText: 'DateTime',
                iconName: 'utility:date_time',
                iconSize: 'x-small',
                rightIconName: '',
                subtype: null,
                name: 'item-1',
                type: 'option-card',
                value: '8c861e30-c3c6-481d-a8b1-f43bc38f10c9',
                text: 'item-1'
            },
            {
                dataType: 'Date',
                displayText: 'item-2',
                hasNext: false,
                iconAlternativeText: 'Date',
                iconName: 'utility:event',
                iconSize: 'x-small',
                rightIconName: '',
                subtype: null,
                name: 'item-2',
                type: 'option-card',
                value: '82ca4cf8-12df-43c4-ab7c-c29a7eb6a020',
                text: 'item-2'
            }
        ]
    }
};

const createComponentUnderTest = async (props) => {
    return createComponent(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_MENU_SECTION, props);
};

describe('Field Input Menu Section Tests', () => {
    test('sanity', async () => {
        const cmp = await createComponentUnderTest(componentWithSectionLabel);
        expect(cmp).toBeTruthy();
    });

    it('Should have the correct menu section label when component is rendered', async () => {
        const menu = await createComponentUnderTest(componentWithSectionLabel);
        const sectionLabel = menu.shadowRoot.querySelector('h3');
        expect(sectionLabel.textContent).toEqual(componentWithSectionLabel.section.label);
    });

    it('Should render component with section containing two rows', async () => {
        const menu = await createComponentUnderTest(sectionWithTwoItems);
        const expectedNumberOfItems = sectionWithTwoItems.section.items.length;
        const rows = menu.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_MENU_SECTION_ITEM);
        expect(rows).toHaveLength(expectedNumberOfItems);
    });

    it('Should render component with section containing two rows with the right items', async () => {
        const menu = await createComponentUnderTest(sectionWithTwoItems);
        const expectedValue = sectionWithTwoItems.section.items;
        const value = menu.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_MENU_SECTION_ITEM);
        expect(value[0].item.value).toEqual(expectedValue[0].value);
        expect(value[1].item.value).toEqual(expectedValue[1].value);
    });
});
