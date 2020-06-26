// @ts-nocheck
import { createElement } from 'lwc';
import UsedByContent from '../usedByContent';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

jest.mock('builder_platform_interaction/contextLib', () => {
    return {
        useFixedLayoutCanvas: jest.fn()
    };
});

function createComponentForTest(listSectionHeader, listSectionItems, isResourceDetails = false) {
    const el = createElement('builder_platform_interaction-used-by-content', {
        is: UsedByContent
    });
    el.listSectionHeader = listSectionHeader;
    el.listSectionItems = listSectionItems;
    el.isResourceDetails = isResourceDetails;
    document.body.appendChild(el);
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
        it('Should show locator icon when not in Auto-Layout mode and section list exists', async () => {
            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult, true);
            await ticks(1);
            const usedBySectionItemContentItem = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedByContentItem
            );
            expect(usedBySectionItemContentItem.showLocatorIcon).toBeTruthy();
        });
        it('Should not show locator icon when in Auto-Layout mode and section list exists', async () => {
            useFixedLayoutCanvas.mockImplementation(() => true);

            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult, true);
            await ticks(1);
            const usedBySectionItemContentItem = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedByContentItem
            );
            expect(usedBySectionItemContentItem.showLocatorIcon).toBeFalsy();
        });
    });
});
