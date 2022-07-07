import { createComponent, tick } from 'builder_platform_interaction/builderTestUtils';
import { newMenuSelectItemEvent } from 'builder_platform_interaction/fieldInputUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';

jest.mock('builder_platform_interaction/fieldInputBox', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputBox')
);

jest.mock('builder_platform_interaction/fieldInputMenu', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputMenu')
);

const tag = 'builder_platform_interaction-field-input';

const context: FieldInput.Context = {
    flowElements: []
};

const defaultProps = {
    context
};
const createComponentUnderTest = async (overrideProps) => {
    return createComponent(tag, defaultProps, overrideProps);
};

const selectors = {
    fieldInputBox: 'builder_platform_interaction-field-input-box',
    fieldInputMenu: 'builder_platform_interaction-field-input-menu',
    fieldInputContainer: '.container'
};

function dispatch(cmp, eventName) {
    cmp.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, cancelable: true }));
}

const focusIntoInputBoxAndAssert = async (cmp, dom) => {
    dispatch(dom.fieldInputBox, 'focusin');
    await tick();
    assertMenuDisplayed(cmp, true);
};

const waitFor = (timeout = 0) => {
    return new Promise((resolve) => {
        /* eslint-disable @lwc/lwc/no-async-operation */
        setTimeout(() => resolve(undefined), timeout);
    });
};

const assertMenuDisplayed = (cmp, expectDisplayed = true) => {
    const menu = cmp.shadowRoot.querySelector(selectors.fieldInputMenu);

    if (expectDisplayed) {
        expect(menu).not.toBeNull();
    } else {
        expect(menu).toBeNull();
    }
};

async function focusOutOfInputBox(cmp, dom) {
    dispatch(dom.fieldInputBox, 'focusout');
    await waitFor(0);

    assertMenuDisplayed(cmp, false);
}

async function selectMenuItem(dom, item) {
    dom.fieldInputMenu.dispatchEvent(newMenuSelectItemEvent(item));
    await tick();
}

describe('Field Input Tests', () => {
    let cmp;
    let dom;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
        dom = lwcUtils.createDomProxy(cmp, selectors);
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
        assertMenuDisplayed(cmp, false);
    });

    describe('focus management', () => {
        beforeEach(async () => {
            await focusIntoInputBoxAndAssert(cmp, dom);
        });

        it('Show menu when menu input box gets focus', async () => {
            await focusIntoInputBoxAndAssert(cmp, dom);
            assertContextItems(dom, [{ type: 'All', name: 'All' }]);
        });

        describe('When input box loses focus', () => {
            it('Hide menu', async () => {
                await focusOutOfInputBox(cmp, dom);
            });

            it('Dont hide menu when focus is moved to the menu', async () => {
                const { fieldInputBox, fieldInputContainer } = dom;

                dispatch(fieldInputBox, 'focusout');
                dispatch(fieldInputContainer, 'focusin');

                await waitFor(0);

                assertMenuDisplayed(cmp);
            });
        });
    });

    describe('menu navigation', () => {
        const item: FieldInput.MenuItem = {
            view: undefined,
            label: 'Account',
            value: 'account',
            name: 'account',
            iconName: 'utility:screen',
            iconSize: 'x-small'
        };

        const view: FieldInput.MenuItemView = { type: 'ObjectFields' };
        const itemWithView = { ...item, view };

        beforeEach(async () => {
            await focusIntoInputBoxAndAssert(cmp, dom);
        });

        it('when a menu item with no view is selected', async () => {
            dom.fieldInputMenu.dispatchEvent(newMenuSelectItemEvent(item));
            await tick();

            assertMenuDisplayed(cmp, false);
        });

        it('when a menu item with a view is selected', async () => {
            await selectMenuItem(dom, itemWithView);
            assertMenuDisplayed(cmp);

            const contextItems = [
                { type: 'All', name: 'All' },
                { type: 'ObjectFields', label: 'Account', name: 'account' }
            ];
            assertContextItems(dom, contextItems);
        });

        it('when a breadcrumb is selected', async () => {
            await selectMenuItem(dom, itemWithView);
        });
    });
});

function assertContextItems(dom, contextItems) {
    expect(dom.fieldInputMenu.contextItems).toEqual(contextItems);
}
