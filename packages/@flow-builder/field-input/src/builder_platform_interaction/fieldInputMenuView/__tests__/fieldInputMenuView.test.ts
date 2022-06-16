import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import FieldInputMenuView from 'builder_platform_interaction/fieldInputMenuView';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, createElement } from 'lwc';

jest.mock('builder_platform_interaction/fieldInputMenuSectionItem', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputMenuSectionItem')
);

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
                subtype: undefined,
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
                subtype: undefined,
                name: 'item-1',
                value: '8c861e30-c3c6-481d-a8b1-f43bc38f10c9'
            },
            {
                dataType: 'Date',
                label: 'item-2',
                iconAlternativeText: 'Date',
                iconName: 'utility:event',
                iconSize: 'x-small',
                subtype: undefined,
                name: 'item-2',
                value: '82ca4cf8-12df-43c4-ab7c-c29a7eb6a020'
            }
        ]
    }
};

class Component<T extends FieldInput.MenuSection[]> extends FieldInputMenuView<T> {
    _apiResponse;

    @api set apiResponse(apiResponse: WireResponse<T>) {
        this._apiResponse = apiResponse;
        this.updateSections(apiResponse);
    }

    get apiResponse() {
        return this._apiResponse;
    }

    updateSectionsWithData(data: T) {
        this.sections = data;
    }
}

const createComponentUnderTest = async (props) => {
    const el = createElement('builder_platform_interaction-field-input-menu-view', {
        is: Component
    });

    Object.assign(el, props);

    setDocumentBodyChildren(el);
    return el;
};

function createApiResponse(sections: FieldInput.MenuSection[]) {
    return { data: sections };
}

async function createComponentWithApiResponse(sections) {
    const apiResponse = createApiResponse(sections);
    const cmp = await createComponentUnderTest({ apiResponse });
    const dom = lwcUtils.createDomProxy(cmp, selectors);

    return [cmp, dom];
}

const selectors = {
    sectionItem: 'builder_platform_interaction-field-input-menu-section-item',
    sectionHeader: 'h3'
};

function assertSectionItem(firstItem, expectedValue) {
    expect(firstItem.item.value).toEqual(expectedValue.value);
}

function assertSectionItems(items, expectedItems) {
    expect(items).toHaveLength(expectedItems.length);

    for (let i = 0; i < expectedItems.length; i++) {
        assertSectionItem(items[i], expectedItems[i]);
    }
}

describe('Field Input Menu View Tests', () => {
    test('sanity', async () => {
        const [cmp] = await createComponentWithApiResponse([componentWithSectionLabel]);
        expect(cmp).toBeTruthy();
    });

    it('Should have the correct menu section label when component is rendered', async () => {
        const [_, dom] = await createComponentWithApiResponse([componentWithSectionLabel.section]);
        expect(dom.sectionHeader.textContent).toEqual(componentWithSectionLabel.section.label);
    });

    it('Should render component with section containing two items', async () => {
        const [_, dom] = await createComponentWithApiResponse([sectionWithTwoItems.section]);
        assertSectionItems(dom.all.sectionItem, sectionWithTwoItems.section.items);
    });
});
