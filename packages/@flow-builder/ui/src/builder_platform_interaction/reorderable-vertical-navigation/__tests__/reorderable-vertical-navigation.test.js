import {createElement} from 'engine';
import ReorderableVerticalNavigation from 'builder_platform_interaction-reorderable-vertical-navigation';

const selectors = {
    frontIcon: 'div[slot="front-icon"]',
    endIcon: 'div[slot="end-icon"]',
    div: 'div',
    link: 'a',
    listItem: 'li',
    firstItemLink: '#item1'
};

const initialMenu = [
    {
        guid: 'item1',
        label: 'item1'
    },
    {
        guid: 'item2',
        label: '<script>alert(document.cookie);</script>'}
];

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-vertical-nav', {
        is: ReorderableVerticalNavigation
    });
    document.body.appendChild(el);
    return el;
};

describe('ReorderableVerticalNavigation', () => {
    it('is styled with vertical tabs', () => {
        const element = createComponentUnderTest();
        return Promise.resolve().then(() => {
            const div = element.querySelectorAll(selectors.div);
            expect(div).toHaveLength(3);
            expect(div[0].getAttribute('class')).toContain('slds-vertical-tabs__nav');
        });
    });
    it('renders all initial menu items', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        return Promise.resolve().then(() => {
            const menuItems = element.querySelectorAll(selectors.link);
            expect(menuItems).toHaveLength(2);
        });
    });
    it('renders each item with front icon by default', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        return Promise.resolve().then(() => {
            const frontIcon = element.querySelectorAll(selectors.frontIcon);
            expect(frontIcon).toHaveLength(2);
        });
    });
    it('fires itemselected that includes itemId when an item is clicked', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        return Promise.resolve().then(() => {
            const firstMenuItem = element.querySelector(selectors.firstItemLink);

            const eventCallback = jest.fn();
            element.addEventListener('itemselected', eventCallback);
            firstMenuItem.click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({itemId: 'item1'});
        });
    });
    it('has correct classes applied to its menu items when an item is selected', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        element.activeItemId = 'item1';
        return Promise.resolve().then(() => {
            const listItems = element.querySelectorAll(selectors.listItem);
            expect(listItems[0].getAttribute('class')).toContain('slds-vertical-tabs__nav-item slds-is-active');
            expect(listItems[1].getAttribute('class')).toContain('slds-vertical-tabs__nav-item');
            expect(listItems[1].getAttribute('class')).not.toContain('slds-is-active');
        });
    });
});