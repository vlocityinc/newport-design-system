// @ts-nocheck
import { createElement } from 'lwc';
import ReorderableVerticalNavigation from 'builder_platform_interaction/reorderableVerticalNavigation';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ListItemInteractionEvent, ReorderListEvent } from 'builder_platform_interaction/events';
import { commands } from 'builder_platform_interaction/sharedUtils';
const { ArrowDown, ArrowUp, SpaceCommand, EnterCommand } = commands;

const SELECTORS = {
    ITEM: 'builder_platform_interaction-reorderable-vertical-navigation-item',
    FRONT_ICON: 'div[slot="front-icon"]',
    END_ICON: 'div[slot="end-icon"]',
    DIV: 'div',
    FIRST_LIST_ITEM_ANCHOR:
        'builder_platform_interaction-reorderable-vertical-navigation-item .slds-vertical-tabs__link',
    VERTICAL_TAB_NAV_ITEM: '.slds-vertical-tabs__nav-item',
    LIST_SECTION: '.navigation-content'
};

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

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
        isDraggable: true
    },
    {
        element: {
            guid: 'defaultItem',
            label: '<script>alert(document.cookie);</script>'
        },
        isDraggable: false
    }
];

async function dispatchKeyboardCommand(element, command) {
    element.keyboardInteractions.execute(command);
    await ticks(1);
}

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-vertical-nav', {
        is: ReorderableVerticalNavigation
    });
    setDocumentBodyChildren(el);
    return el;
};

describe('ReorderableVerticalNavigation', () => {
    it('is styled with vertical tabs', async () => {
        const element = createComponentUnderTest();
        await ticks(1);
        const div = element.shadowRoot.querySelectorAll(SELECTORS.DIV);
        expect(div).toHaveLength(7);
        expect(div[2].getAttribute('class')).toContain('slds-vertical-tabs__nav');
    });
    it('renders all initial menu items', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const items = element.shadowRoot.querySelectorAll(SELECTORS.ITEM);

        expect(items).toHaveLength(3);
    });
    it('renders each item with isDraggable based on the menu item', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const menuItems = element.shadowRoot.querySelectorAll(SELECTORS.ITEM);
        expect(menuItems[0].isDraggable).toBeTruthy();
        expect(menuItems[1].isDraggable).toBeTruthy();
        expect(menuItems[2].isDraggable).toBeFalsy();
    });
    it('renders each draggable item with front icon by default', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const frontIcon = element.shadowRoot.querySelectorAll(SELECTORS.FRONT_ICON);
        expect(frontIcon).toHaveLength(2);
    });
    it('fires ListItemInteractionEvent that includes itemId and "select" interactionType when an ListItemInteractionEvent event with "click" interactionType is fired', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const firstMenuItem = element.shadowRoot.querySelector(SELECTORS.ITEM);
        const eventCallback = jest.fn();
        element.addEventListener(ListItemInteractionEvent.EVENT_NAME, eventCallback);

        const itemClickedEvent = new ListItemInteractionEvent('someItemId', ListItemInteractionEvent.Type.Click);
        firstMenuItem.dispatchEvent(itemClickedEvent);

        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            itemId: itemClickedEvent.detail.itemId,
            interactionType: ListItemInteractionEvent.Type.Select
        });
    });

    it('fires ListItemInteractionEvent that includes itemId  and select interactionType when an Enter key is pressed', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const firstListItem = element.shadowRoot.querySelector(SELECTORS.ITEM);
        firstListItem.focus();
        const eventCallback = jest.fn();
        element.addEventListener(ListItemInteractionEvent.EVENT_NAME, eventCallback);

        await dispatchKeyboardCommand(element, EnterCommand.COMMAND_NAME);

        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            itemId: 'item1',
            interactionType: ListItemInteractionEvent.Type.Select
        });
    });

    it('Pressing space key and then arrow down key should dispatch the ReorderListEvent', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const firstListItem = element.shadowRoot.querySelector(SELECTORS.ITEM);
        firstListItem.focus();
        await dispatchKeyboardCommand(element, SpaceCommand.COMMAND_NAME);
        const eventCallback = jest.fn();
        element.addEventListener(ReorderListEvent.EVENT_NAME, eventCallback);
        await dispatchKeyboardCommand(element, ArrowDown.COMMAND_NAME);
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            destinationGuid: 'item2',
            sourceGuid: 'item1'
        });
    });

    it('Pressing space key and then arrow up key should dispatch the ReorderListEvent', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const listItems = element.shadowRoot.querySelectorAll(SELECTORS.ITEM);
        listItems[1].focus();
        await dispatchKeyboardCommand(element, SpaceCommand.COMMAND_NAME);
        const eventCallback = jest.fn();
        element.addEventListener(ReorderListEvent.EVENT_NAME, eventCallback);
        await dispatchKeyboardCommand(element, ArrowUp.COMMAND_NAME);
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            destinationGuid: 'item1',
            sourceGuid: 'item2'
        });
    });

    it('Pressing space key and then arrow down key should not dispatch the ReorderListEvent if no item is reorderable', async () => {
        const element = createComponentUnderTest();
        element.menuItems = [
            {
                element: {
                    guid: 'item1',
                    label: 'item1'
                },
                isDraggable: false
            },
            {
                element: {
                    guid: 'item2',
                    label: '<script>alert(document.cookie);</script>'
                },
                isDraggable: false
            },
            {
                element: {
                    guid: 'defaultItem',
                    label: '<script>alert(document.cookie);</script>'
                },
                isDraggable: false
            }
        ];
        await ticks(1);
        const firstListItem = element.shadowRoot.querySelector(SELECTORS.ITEM);
        firstListItem.focus();
        await dispatchKeyboardCommand(element, SpaceCommand.COMMAND_NAME);
        const eventCallback = jest.fn();
        element.addEventListener(ReorderListEvent.EVENT_NAME, eventCallback);
        await dispatchKeyboardCommand(element, ArrowDown.COMMAND_NAME);
        expect(eventCallback).not.toHaveBeenCalled();
    });

    it('Pressing space key and then arrow up key on the first row should not dispatch the ReorderListEvent', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const firstListItem = element.shadowRoot.querySelector(SELECTORS.ITEM);
        firstListItem.focus();
        await dispatchKeyboardCommand(element, SpaceCommand.COMMAND_NAME);
        const eventCallback = jest.fn();
        element.addEventListener(ReorderListEvent.EVENT_NAME, eventCallback);
        await dispatchKeyboardCommand(element, ArrowUp.COMMAND_NAME);
        expect(eventCallback).not.toHaveBeenCalled();
    });

    it('Pressing space key and then arrow down key on the last row should not dispatch the ReorderListEvent', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const listItems = element.shadowRoot.querySelectorAll(SELECTORS.ITEM);
        listItems[2].focus();
        await dispatchKeyboardCommand(element, SpaceCommand.COMMAND_NAME);
        const eventCallback = jest.fn();
        element.addEventListener(ReorderListEvent.EVENT_NAME, eventCallback);
        await dispatchKeyboardCommand(element, ArrowDown.COMMAND_NAME);
        expect(eventCallback).not.toHaveBeenCalled();
    });

    it('Pressing space key twice and then arrow down key should not dispatch the ReorderListEvent', async () => {
        const element = createComponentUnderTest();
        element.menuItems = initialMenu;
        await ticks(1);
        const firstListItem = element.shadowRoot.querySelector(SELECTORS.ITEM);
        firstListItem.focus();
        await dispatchKeyboardCommand(element, SpaceCommand.COMMAND_NAME);
        await dispatchKeyboardCommand(element, SpaceCommand.COMMAND_NAME);
        const eventCallback = jest.fn();
        element.addEventListener(ReorderListEvent.EVENT_NAME, eventCallback);
        await dispatchKeyboardCommand(element, ArrowDown.COMMAND_NAME);
        expect(eventCallback).not.toHaveBeenCalled();
    });
});
