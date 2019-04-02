import { createElement } from 'lwc';
import UsedByContent from "../usedByContent";

function createComponentForTest(listSectionHeader, listSectionItems) {
    const el = createElement('builder_platform_interaction-used-by-content', { is: UsedByContent });
    el.listSectionHeader = listSectionHeader;
    el.listSectionItems = listSectionItems;
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
        it('when null or undefined should be hidden.', () => {
            const usedByContentComponent = createComponentForTest();
            return Promise.resolve().then(() => {
                const usedBySectionHeader = usedByContentComponent.shadowRoot.querySelector(selectors.usedBySectionHeader);
                expect(usedBySectionHeader).toBeNull();
            });
        });
        it('when not null should be diplay the header content', () => {
            const usedByContentComponent = createComponentForTest('Section-Header');
            return Promise.resolve().then(() => {
                const usedBySectionHeaderTitle = usedByContentComponent.shadowRoot.querySelector(selectors.usedBySectionHeaderTitle);
                expect(usedBySectionHeaderTitle.classList).not.toBeNull();
            });
        });
    });
    describe('section-list', () => {
        it('when null or undefined should be hidden.', () => {
            const usedByContentComponent = createComponentForTest('Section Header');
            return Promise.resolve().then(() => {
                const usedBySectionItems = usedByContentComponent.shadowRoot.querySelector(selectors.usedBySectionItems);
                expect(usedBySectionItems).toBeNull();
            });
        });
        it('when not null should be diplay the section list', () => {
            const expectedResult = [{
                'guid': 'FORMULA_1',
                'name': 'Formula_1',
                'elementGuidsReferenced': [
                    'OUTCOME_3'
                ],
                iconName: 'standard:formula'
            }];
            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult);
            return Promise.resolve().then(() => {
                const usedBySectionItems = usedByContentComponent.shadowRoot.querySelector(selectors.usedBySectionItems);
                expect(usedBySectionItems.classList).not.toBeNull();
            });
        });
        it('when not null should render element icon component.', () => {
            const expectedResult = [{
                'guid': 'FORMULA_1',
                'name': 'Formula_1',
                'elementGuidsReferenced': [
                    'OUTCOME_3'
                ],
                iconName: 'standard:formula'
            }];
            const usedByContentComponent = createComponentForTest('Section-Header', expectedResult);
            return Promise.resolve().then(() => {
                const usedBySectionItemContentItem = usedByContentComponent.shadowRoot.querySelector(selectors.usedByContentItem);
                expect(usedBySectionItemContentItem).not.toBeNull();
            });
        });
    });
});