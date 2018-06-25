import {createElement} from 'engine';
import ReorderableVerticalNavigationItem from 'builder_platform_interaction-reorderable-vertical-navigation-item';
import { getShadowRoot } from 'lwc-test-utils';

const SELECTORS = {
    DRAGGABLE: 'builder_platform_interaction-draggable',
    FRONT_ICON: 'div[slot="front-icon"]',
    END_ICON: 'div[slot="end-icon"]',
    LINK: 'a'
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
            const frontIcon = getShadowRoot(element).querySelectorAll(SELECTORS.FRONT_ICON);
            const endIcon = getShadowRoot(element).querySelectorAll(SELECTORS.END_ICON);

            expect(frontIcon).toHaveLength(0);
            expect(endIcon).toHaveLength(0);
        });
    });
    it('has correct text', () => {
        const testItemTitle = 'Test Item Title';
        const element = createComponentUnderTest();
        element.label = testItemTitle;
        return Promise.resolve().then(() => {
            const link = getShadowRoot(element).querySelectorAll(SELECTORS.LINK);
            expect(link).toHaveLength(1);
            expect(link[0].text).toContain(testItemTitle);
        });
    });
    it('fires itemclicked that includes itemId when an item is clicked', () => {
        const element = createComponentUnderTest();
        const testNavItemId = '1';
        element.navItemId = testNavItemId;
        return Promise.resolve().then(() => {
            const link = getShadowRoot(element).querySelector(SELECTORS.LINK);

            const eventCallback = jest.fn();
            element.addEventListener('itemclicked', eventCallback);
            link.click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({itemId: testNavItemId});
        });
    });
    describe('isDraggable', () => {
        it('is wrapped in a draggable if isDraggable', () => {
            const element = createComponentUnderTest();
            element.isDraggable = true;

            return Promise.resolve().then(() => {
                const draggables = getShadowRoot(element).querySelectorAll(SELECTORS.DRAGGABLE);
                expect(draggables).toHaveLength(1);
            });
        });

        it('is not wrapped in a draggable if not isDraggable', () => {
            const element = createComponentUnderTest();
            element.isDraggable = false;

            return Promise.resolve().then(() => {
                const draggables = getShadowRoot(element).querySelectorAll(SELECTORS.DRAGGABLE);
                expect(draggables).toHaveLength(0);
            });
        });
    });
});