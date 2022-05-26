// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';
import FieldInputMenuView from 'builder_platform_interaction/fieldInputMenuView';
import { api, createElement } from 'lwc';

const componentWithSectionLabel = {
    section: {
        key: 'Component With Section Label',
        label: 'Section Label',
        items: [
            {
                dataType: undefined,
                label: 'ScreenWithSection',
                iconAlternativeText: 'Screen',
                iconName: 'standard:screen',
                iconSize: 'small',
                subtype: null,
                name: 'ScreenWithSection',
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
                label: 'item-1',
                iconAlternativeText: 'DateTime',
                iconName: 'utility:date_time',
                iconSize: 'x-small',
                subtype: null,
                name: 'item-1',
                value: '8c861e30-c3c6-481d-a8b1-f43bc38f10c9'
            },
            {
                dataType: 'Date',
                label: 'item-2',
                iconAlternativeText: 'Date',
                iconName: 'utility:event',
                iconSize: 'x-small',
                subtype: null,
                name: 'item-2',
                value: '82ca4cf8-12df-43c4-ab7c-c29a7eb6a020'
            }
        ]
    }
};

const Component = class extends FieldInputMenuView {
    _apiResult;

    @api set apiResult(apiResult) {
        this._apiResult = apiResult;
        this.updateSections(apiResult);
    }

    get apiResult() {
        return this._apiResult;
    }

    updateSectionsWithData(data) {
        this.sections = data;
    }
};

const createComponentUnderTest = async (props) => {
    const el = createElement('builder_platform_interaction-field-input-menu-view', {
        is: Component
    });

    Object.assign(el, props);

    setDocumentBodyChildren(el);
    return el;
};

function createApiResult(section) {
    return { data: [section] };
}
describe('Field Input Menu Section Tests', () => {
    test('sanity', async () => {
        const cmp = await createComponentUnderTest(componentWithSectionLabel);
        expect(cmp).toBeTruthy();
    });

    it('Should have the correct menu section label when component is rendered', async () => {
        const apiResult = createApiResult(componentWithSectionLabel.section);
        const menu = await createComponentUnderTest({ apiResult });
        const sectionLabel = menu.shadowRoot.querySelector('h3');
        expect(sectionLabel.textContent).toEqual(componentWithSectionLabel.section.label);
    });

    it('Should render component with section containing two rows', async () => {
        const apiResult = createApiResult(sectionWithTwoItems.section);
        const menu = await createComponentUnderTest({ apiResult });
        const expectedNumberOfItems = sectionWithTwoItems.section.items.length;
        const rows = menu.shadowRoot.querySelectorAll('builder_platform_interaction-field-input-menu-section-item');
        expect(rows).toHaveLength(expectedNumberOfItems);
    });

    it('Should render component with section containing two rows with the right items', async () => {
        const apiResult = createApiResult(sectionWithTwoItems.section);
        const menu = await createComponentUnderTest({ apiResult });
        const expectedValue = sectionWithTwoItems.section.items;
        const value = menu.shadowRoot.querySelectorAll('builder_platform_interaction-field-input-menu-section-item');

        expect(value[0].item.value).toEqual(expectedValue[0].value);
        expect(value[1].item.value).toEqual(expectedValue[1].value);
    });
});
