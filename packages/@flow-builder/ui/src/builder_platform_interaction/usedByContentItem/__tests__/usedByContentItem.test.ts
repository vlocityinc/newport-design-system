// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { createElement } from 'lwc';
import UsedByContentItem from '../usedByContentItem';

const ELEMENT_ON_OUTCOME = '{0} of {1}';
jest.mock(
    '@salesforce/label/FlowBuilderResourceDetailsPanel.incomingGoToConnectionsWithBranch',
    () => ({ default: ELEMENT_ON_OUTCOME }),
    {
        virtual: true
    }
);

function createComponentForTest(listItem, showLocatorIcon) {
    const el = createElement('builder_platform_interaction-used-by-content-item', { is: UsedByContentItem });
    el.listItem = listItem;
    el.showLocatorIcon = showLocatorIcon;
    setDocumentBodyChildren(el);
    return el;
}

const selectors = {
    usedBySectionElementIcon: 'builder_platform_interaction-element-icon',
    usedBySectionItemName: '.test-list-item-name',
    usedBySectionLocatorIcon: '.test-usage-section-locator-icon'
};

const expectedResult = {
    guid: 'FORMULA_1',
    name: 'Formula_1',
    elementGuidsReferenced: ['OUTCOME_3'],
    isChildElement: true,
    iconName: 'standard:formula'
};
const expectedResultWithBranch = {
    guid: 'FORMULA_1',
    name: 'Formula_1',
    elementGuidsReferenced: ['OUTCOME_3'],
    isChildElement: true,
    iconName: 'standard:formula',
    branchLabel: 'B1'
};
const expectedResultWithEmptyBranch = {
    guid: 'FORMULA_1',
    name: 'Formula_1',
    elementGuidsReferenced: ['OUTCOME_3'],
    isChildElement: true,
    iconName: 'standard:formula',
    branchLabel: ''
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
            const usedByContentItemComponent = createComponentForTest(expectedResult, true);
            await ticks(1);
            const usedBySectionItemName = usedByContentItemComponent.shadowRoot.querySelector(
                selectors.usedBySectionItemName
            );
            expect(usedBySectionItemName.classList).not.toBeNull();
        });
        it("Should have the verbiage 'Element on Outcome' when the list item has a non empty branchLabel", async () => {
            const usedByContentComponent = createComponentForTest(expectedResultWithBranch, true);
            await ticks(1);
            const usedByContentName = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedBySectionItemName
            ).textContent;
            expect(usedByContentName).toEqual('B1 of Formula_1');
            expect(usedByContentName).not.toEqual(expectedResultWithBranch.name);
        });
        it("Should not have the verbiage 'Element on Outcome' when the list item has a empty branchLabel", async () => {
            const usedByContentComponent = createComponentForTest(expectedResultWithEmptyBranch, true);
            await ticks(1);
            const usedByContentName = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedBySectionItemName
            ).textContent;
            expect(usedByContentName).toEqual(expectedResultWithEmptyBranch.name);
        });
        it("Should not have the verbiage 'Element on Outcome' when the list item has no branchLabel property", async () => {
            const usedByContentComponent = createComponentForTest(expectedResult, true);
            await ticks(1);
            const usedByContentName = usedByContentComponent.shadowRoot.querySelector(
                selectors.usedBySectionItemName
            ).textContent;
            expect(usedByContentName).toEqual(expectedResult.name);
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
