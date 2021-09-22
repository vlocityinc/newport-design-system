// @ts-nocheck
import { createElement } from 'lwc';
import ReorderableVerticalNavigationItem from 'builder_platform_interaction/reorderableVerticalNavigationItem';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ListItemInteractionEvent } from 'builder_platform_interaction/events';

const SELECTORS = {
    DRAGGABLE: 'builder_platform_interaction-draggable',
    FRONT_ICON: 'div[slot="front-icon"]',
    END_ICON: 'div[slot="end-icon"]',
    LINK: '.slds-vertical-tabs__link',
    LIST_ITEM: '.slds-vertical-tabs__nav-item'
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-vertical-nav-item', {
        is: ReorderableVerticalNavigationItem
    });
    setDocumentBodyChildren(el);
    return el;
};

describe('ReorderableVerticalNavigationItem', () => {
    it('does not have front or end icon by default', async () => {
        const element = createComponentUnderTest();
        await ticks(1);
        const frontIcon = element.shadowRoot.querySelectorAll(SELECTORS.FRONT_ICON);
        const endIcon = element.shadowRoot.querySelectorAll(SELECTORS.END_ICON);

        expect(frontIcon).toHaveLength(0);
        expect(endIcon).toHaveLength(0);
    });
    it('has correct text', async () => {
        const testItemTitle = 'Test Item Title';
        const element = createComponentUnderTest();
        element.label = testItemTitle;
        await ticks(1);
        const link = element.shadowRoot.querySelectorAll(SELECTORS.LINK);
        expect(link).toHaveLength(1);
        expect(link[0].textContent).toContain(testItemTitle);
    });
    it('fires ListItemInteractionEvent that includes itemId and "click" interactionType when an item is clicked', async () => {
        const element = createComponentUnderTest();
        const testNavItemId = '1';
        element.navItemId = testNavItemId;
        await ticks(1);
        const link = element.shadowRoot.querySelector(SELECTORS.LINK);

        const eventCallback = jest.fn();
        element.addEventListener(ListItemInteractionEvent.EVENT_NAME, eventCallback);
        link.click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            itemId: testNavItemId,
            interactionType: ListItemInteractionEvent.Type.Click
        });
    });

    it('fires ListItemInteractionEvent that includes itemId and "blur" interactionType when an item is blurred', async () => {
        const element = createComponentUnderTest();
        const testNavItemId = '1';
        element.navItemId = testNavItemId;
        await ticks(1);
        const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);

        const eventCallback = jest.fn();
        element.addEventListener(ListItemInteractionEvent.EVENT_NAME, eventCallback);
        listItem.dispatchEvent(new CustomEvent('blur', {}));
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            itemId: testNavItemId,
            interactionType: ListItemInteractionEvent.Type.Blur
        });
    });

    it('fires focus event via the api method', async () => {
        const element = createComponentUnderTest();
        const testNavItemId = '1';
        element.navItemId = testNavItemId;
        await ticks(1);
        const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);

        const eventCallback = jest.fn();
        listItem.addEventListener('focus', eventCallback);
        listItem.focus();
        expect(eventCallback).toHaveBeenCalled();
    });

    describe('isDraggable', () => {
        it('is wrapped in a draggable if isDraggable', async () => {
            const element = createComponentUnderTest();
            element.isDraggable = true;

            await ticks(1);
            const draggables = element.shadowRoot.querySelectorAll(SELECTORS.DRAGGABLE);
            expect(draggables).toHaveLength(1);
        });

        it('is not wrapped in a draggable if not isDraggable', async () => {
            const element = createComponentUnderTest();
            element.isDraggable = false;

            await ticks(1);
            const draggables = element.shadowRoot.querySelectorAll(SELECTORS.DRAGGABLE);
            expect(draggables).toHaveLength(0);
        });
    });

    describe('class', () => {
        it('has slds-is-active applied to the base div when selected', async () => {
            const element = createComponentUnderTest();
            element.navItemId = 'item1';
            element.activeId = 'item1';

            await ticks(1);
            const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);
            expect(listItem.getAttribute('class')).toContain('slds-is-active');
        });
        it('does not have slds-is-active applied to the base div when not selected', async () => {
            const element = createComponentUnderTest();
            element.navItemId = 'item1';
            element.activeId = 'item2';

            await ticks(1);
            const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);
            expect(listItem.getAttribute('class')).not.toContain('slds-is-active');
        });
    });

    describe('tabindex', () => {
        it('Focused item should get tabindex 0', async () => {
            const element = createComponentUnderTest();
            element.navItemId = 'item1';
            element.activeId = 'item2';
            element.focusId = 'item1';

            await ticks(1);
            const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);
            expect(listItem.getAttribute('tabindex')).toBe('0');
        });

        it('Un-focused item should get tabindex -1', async () => {
            const element = createComponentUnderTest();
            element.navItemId = 'item1';
            element.activeId = 'item2';
            element.focusId = 'item2';

            await ticks(1);
            const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);
            expect(listItem.getAttribute('tabindex')).toBe('-1');
        });

        it('Active item should get tabindex 0 if there is no focused item', async () => {
            const element = createComponentUnderTest();
            element.navItemId = 'item1';
            element.activeId = 'item1';

            await ticks(1);
            const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);
            expect(listItem.getAttribute('tabindex')).toBe('0');
        });

        it('Inactive item should get tabindex -1 if there is no focused item', async () => {
            const element = createComponentUnderTest();
            element.navItemId = 'item1';
            element.activeId = 'item2';

            await ticks(1);
            const listItem = element.shadowRoot.querySelector(SELECTORS.LIST_ITEM);
            expect(listItem.getAttribute('tabindex')).toBe('-1');
        });
    });
});
