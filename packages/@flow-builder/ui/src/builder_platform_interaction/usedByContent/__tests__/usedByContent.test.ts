// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { createElement } from 'lwc';
import UsedByContent from '../usedByContent';

function createComponentForTest(
    listSectionHeader,
    listSectionItems,
    isResourceDetails = false,
    showLocatorIcon = true
) {
    const el = createElement('builder_platform_interaction-used-by-content', {
        is: UsedByContent
    });
    el.listSectionHeader = listSectionHeader;
    el.listSectionItems = listSectionItems;
    el.isResourceDetails = isResourceDetails;
    el.showLocatorIcon = showLocatorIcon;
    setDocumentBodyChildren(el);
    return el;
}

const selectors = {
    usedBySectionHeader: '.test-list-section-header',
    usedBySectionHeaderTitle: '.test-list-header-title',
    usedBySectionItems: '.test-list-section-items',
    usedBySectionItem: '.test-list-section-item',
    usedByContentItem: 'builder_platform_interaction-used-by-content-item'
};

describe('Used-By-Content component', () => {
    describe('section-header', () => {
        it('when null or undefined should be hidden.', async () => {
            const usedByContentComponent = createComponentForTest();
            await ticks(1);
            const usedBySectionHeader = usedByContentComponent.shadowRoot.querySelector(selectors.usedBySectionHeader);
            expect(usedBySectionHeader).toBeNull();
        });
        it('when not null should be diplay the header content', async () => {
            const usedByContentComponent = createComponentForTest('Section-Header');
            await ticks(1);
            const usedBySectionHeaderTitle = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedBySectionHeaderTitle
            );
            expect(usedBySectionHeaderTitle.classList).not.toBeNull();
        });
    });
    describe('section-list', () => {
        const expectedResult = [
            {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                iconName: 'standard:formula'
            }
        ];

        it('when null or undefined should be hidden.', async () => {
            const usedByContentComponent = createComponentForTest('Section Header');
            await ticks(1);
            const usedBySectionItems = usedByContentComponent.shadowRoot.querySelector(selectors.usedBySectionItems);
            expect(usedBySectionItems).toBeNull();
        });
        it('when not null should be diplay the section list', async () => {
            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult);
            await ticks(1);
            const usedBySectionItems = usedByContentComponent.shadowRoot.querySelector(selectors.usedBySectionItems);
            expect(usedBySectionItems.classList).not.toBeNull();
        });
        it('when not null should render element icon component.', async () => {
            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult);
            await ticks(1);
            const usedBySectionItemContentItem = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedByContentItem
            );
            expect(usedBySectionItemContentItem).not.toBeNull();
        });
        it('Should show locator icon when showLocatorIcon is true and section list exists', async () => {
            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult, true, true);
            await ticks(1);
            const usedBySectionItemContentItem = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedByContentItem
            );
            expect(usedBySectionItemContentItem.showLocatorIcon).toBeTruthy();
        });
        it('Should not show locator icon when showLocatorIcon is false and section list exists', async () => {
            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult, true, false);
            await ticks(1);
            const usedBySectionItemContentItem = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedByContentItem
            );
            expect(usedBySectionItemContentItem.showLocatorIcon).toBeFalsy();
        });
    });
});
