import {createElement} from 'engine';
import ReorderableVerticalNavigation from 'builder_platform_interaction-reorderable-vertical-navigation';

const SELECTORS = {
    ITEM: 'li',
    FRONT_ICON: 'div[slot="front-icon"]',
    END_ICON: 'div[slot="end-icon"]',
    DIV: 'div',
    LINK: 'a',
    LIST_ITEM: 'li',
    FIRST_LIST_ITEM: '#item1',
    VERTICAL_TAB_NAV_ITEM: '.slds-vertical-tabs__nav-item'
};

const initialMenu = [
    {
        element: {
            guid: 'item1',
            label: 'item1'
        },
        isDraggable: true
    },
    {
        element: {
            guid: 'item2',
            label: '<script>alert(document.cookie);</script>'
        },
        isDraggable: false
    }
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
            const div = element.querySelectorAll(SELECTORS.DIV);
            expect(div).toHaveLength(3);
            expect(div[0].getAttribute('class')).toContain('slds-vertical-tabs__nav');
        });
    });
    it('renders all initial menu items', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        return Promise.resolve().then(() => {
            const items = element.querySelectorAll(SELECTORS.ITEM);

            expect(items).toHaveLength(2);
        });
    });
    it('renders each item with isDraggable based on the menu item', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        return Promise.resolve().then(() => {
            const menuItems = element.querySelectorAll(SELECTORS.ITEM);
            expect(menuItems[0].isDraggable).toBeTruthy();
            expect(menuItems[1].isDraggable).toBeFalsy();
        });
    });
    it('renders each draggable item with front icon by default', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        return Promise.resolve().then(() => {
            const frontIcon = element.querySelectorAll(SELECTORS.FRONT_ICON);
            expect(frontIcon).toHaveLength(1);
        });
    });
    it('fires itemselected that includes itemId when an item is clicked', () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        return Promise.resolve().then(() => {
            const firstMenuItem = element.querySelector(SELECTORS.VERTICAL_TAB_NAV_ITEM).shadowRoot.querySelector(SELECTORS.FIRST_LIST_ITEM);

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
            const listItems = element.querySelectorAll(SELECTORS.LIST_ITEM);
            expect(listItems[0].getAttribute('class')).toContain('slds-vertical-tabs__nav-item slds-is-active');
            expect(listItems[1].getAttribute('class')).toContain('slds-vertical-tabs__nav-item');
            expect(listItems[1].getAttribute('class')).not.toContain('slds-is-active');
        });
    });
});