import {createElement} from 'engine';
import ReorderableVerticalNavigationItem from 'builder_platform_interaction-reorderable-vertical-navigation-item';

const selectors = {
    frontIcon: 'div[slot="front-icon"]',
    endIcon: 'div[slot="end-icon"]',
    div: 'div',
    link: 'a'
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-vertical-nav-item', {
        is: ReorderableVerticalNavigationItem
    });
    document.body.appendChild(el);
    return el;
};

describe('ReorderableVerticalNavigationItem', () => {
    it('does not have front or end icon by default', () => {
        const element = createComponentUnderTest();
        return Promise.resolve().then(() => {
            const frontIcon = element.querySelectorAll(selectors.frontIcon);
            const endIcon = element.querySelectorAll(selectors.endIcon);

            expect(frontIcon).toHaveLength(0);
            expect(endIcon).toHaveLength(0);
        });
    });
    it('has correct class when item is selected', () => {
        const element = createComponentUnderTest();
        element.navItemId = '1';
        element.activeId = element.navItemId;
        return Promise.resolve().then(() => {
            const div = element.querySelectorAll(selectors.div);
            expect(div).toHaveLength(1);
            expect(div[0].getAttribute('class')).toContain('slds-vertical-tabs__nav-item slds-is-active');
        });
    });
    it('has correct title', () => {
        const testItemTitle = 'Test Item Title';
        const element = createComponentUnderTest();
        element.label = testItemTitle;
        return Promise.resolve().then(() => {
            const div = element.querySelectorAll(selectors.div);
            expect(div).toHaveLength(1);
            expect(div[0].getAttribute('title')).toContain(testItemTitle);
        });
    });
    it('fires itemclicked that includes itemId when an item is clicked', () => {
        const element = createComponentUnderTest();
        const testNavItemId = '1';
        element.navItemId = testNavItemId;
        return Promise.resolve().then(() => {
            const link = element.querySelector(selectors.link);

            const eventCallback = jest.fn();
            element.addEventListener('itemclicked', eventCallback);
            link.click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({itemId: testNavItemId});
        });
    });
});