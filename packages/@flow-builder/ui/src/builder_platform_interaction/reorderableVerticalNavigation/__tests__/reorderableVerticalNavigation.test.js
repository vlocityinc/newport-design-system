import { createElement } from 'lwc';
import ReorderableVerticalNavigation from 'builder_platform_interaction/reorderableVerticalNavigation';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

const SELECTORS = {
    ITEM: 'builder_platform_interaction-reorderable-vertical-navigation-item',
    FRONT_ICON: 'div[slot="front-icon"]',
    END_ICON: 'div[slot="end-icon"]',
    DIV: 'div',
    LINK: 'a',
    FIRST_LIST_ITEM_ANCHOR:
        'builder_platform_interaction-reorderable-vertical-navigation-item .slds-vertical-tabs__link',
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
    it('is styled with vertical tabs', async () => {
        const element = createComponentUnderTest();
        await ticks(1);
        const div = element.shadowRoot.querySelectorAll(SELECTORS.DIV);
        expect(div).toHaveLength(4);
        expect(div[2].getAttribute('class')).toContain('slds-vertical-tabs__nav');
    });
    it('renders all initial menu items', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const items = element.shadowRoot.querySelectorAll(SELECTORS.ITEM);

        expect(items).toHaveLength(2);
    });
    it('renders each item with isDraggable based on the menu item', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const menuItems = element.shadowRoot.querySelectorAll(SELECTORS.ITEM);
        expect(menuItems[0].isDraggable).toBeTruthy();
        expect(menuItems[1].isDraggable).toBeFalsy();
    });
    it('renders each draggable item with front icon by default', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const frontIcon = element.shadowRoot.querySelectorAll(SELECTORS.FRONT_ICON);
        expect(frontIcon).toHaveLength(1);
    });
    it('fires itemselected that includes itemId when an itemclicked event is fired', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const firstMenuItem = element.shadowRoot.querySelector(SELECTORS.ITEM);
        const eventCallback = jest.fn();
        element.addEventListener('itemselected', eventCallback);

        const itemClickedEvent = new CustomEvent('itemclicked', {
            detail: {
                itemId: 'someItemId'
            }
        });
        firstMenuItem.dispatchEvent(itemClickedEvent);

        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            itemId: itemClickedEvent.detail.itemId
        });
    });
});
