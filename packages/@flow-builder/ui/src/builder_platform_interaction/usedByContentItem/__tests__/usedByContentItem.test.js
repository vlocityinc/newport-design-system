import { createElement } from 'lwc';
import UsedByContentItem from '../usedByContentItem';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

function createComponentForTest(listItem, showLocatorIcon) {
    const el = createElement('builder_platform_interaction-used-by-content-item', { is: UsedByContentItem });
    el.listItem = listItem;
    el.showLocatorIcon = showLocatorIcon;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    usedBySectionElementIcon: 'builder_platform_interaction-element-icon',
    usedBySectionItemName: '.test-list-item-name',
    usedBySectionLocatorIcon: '.test-usage-section-locator-icon'
};

describe('Used-By-Content-Item component', () => {
    describe('builder_platform_interaction-element-icon', () => {
        it('when null or undefined should not render element icon component', async () => {
            const expectedResult = {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                iconName: undefined
            };
            const usedByContentItemComponent = createComponentForTest(expectedResult, true);
            await ticks(1);
            const usedBySectionItemElementIcon = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionElementIcon
            );
            expect(usedBySectionItemElementIcon).toBeNull();
        });
        it('when not null and not undefined should render element icon component', async () => {
            const expectedResult = {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                iconName: 'standard:formula'
            };
            const usedByContentItemComponent = createComponentForTest(expectedResult, true);
            await ticks(1);
            const usedBySectionItemElementIcon = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionElementIcon
            );
            expect(usedBySectionItemElementIcon.classList).not.toBeNull();
        });
    });

    describe('section-list-item-name', () => {
        it('should render section list item name component', async () => {
            const expectedResult = {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                isChildElement: true,
                iconName: 'standard:formula'
            };
            const usedByContentItemComponent = createComponentForTest(expectedResult, true);
            await ticks(1);
            const usedBySectionItemName = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionItemName
            );
            expect(usedBySectionItemName.classList).not.toBeNull();
        });
    });

    describe('showLocatorIconForNonChildElements', () => {
        it('when showLocatorIcon is true and isCanvasElement is false, should be hidden', async () => {
            const expectedResult = {
                guid: 'OUTCOME_1',
                name: 'Outcome_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                iconName: 'standard:outcome'
            };
            const usedByContentItemComponent = createComponentForTest(expectedResult, true);
            await ticks(1);
            const usedBySectionLocatorIcon = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionLocatorIcon
            );
            expect(usedBySectionLocatorIcon).toBeNull();
        });
        it('when showLocatorIcon is false and isCanvasElement is false, should be hidden', async () => {
            const expectedResult = {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                iconName: 'standard:formula'
            };
            const usedByContentItemComponent = createComponentForTest(expectedResult, false);
            await ticks(1);
            const usedBySectionLocatorIcon = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionLocatorIcon
            );
            expect(usedBySectionLocatorIcon).toBeNull();
        });
        it('when showLocatorIcon is false and isCanvasElement is true, should be hidden', async () => {
            const expectedResult = {
                guid: 'ASSIGNMENT_1',
                name: 'Assignment_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                isCanvasElement: true,
                iconName: 'standard:assignment'
            };
            const usedByContentItemComponent = createComponentForTest(expectedResult, false);
            await ticks(1);
            const usedBySectionLocatorIcon = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionLocatorIcon
            );
            expect(usedBySectionLocatorIcon).toBeNull();
        });
        it('when showLocatorIcon is true and isCanvasElement is true, should be shown', async () => {
            const expectedResult = {
                guid: 'ASSIGNMENT_1',
                name: 'ASSIGNMENT_1',
                elementGuidsReferenced: ['OUTCOME_3'],
                isCanvasElement: true,
                iconName: 'standard:assignment'
            };
            const usedByContentItemComponent = createComponentForTest(expectedResult, true);
            await ticks(1);
            const usedBySectionLocatorIcon = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionLocatorIcon
            );
            expect(usedBySectionLocatorIcon.classList).not.toBeNull();
        });
    });
});
