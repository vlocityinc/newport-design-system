// @ts-nocheck
import { createComponent, ticks } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';

jest.mock('builder_platform_interaction/fieldInputBox', () =>
    require('builder_platform_interaction_mocks/fieldInputBox')
);

jest.mock('builder_platform_interaction/fieldInputMenu', () =>
    require('builder_platform_interaction_mocks/fieldInputMenu')
);

const tag = 'builder_platform_interaction-field-input';

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
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
    await ticks(1);
    assertMenuDisplayed(cmp, true);
};

const waitFor = (timeout = 0) => {
    return new Promise((resolve) => {
        /* eslint-disable @lwc/lwc/no-async-operation */
        setTimeout(() => resolve(), timeout);
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
        it('Show menu when menu input box gets focus', async () => {
            await focusIntoInputBoxAndAssert(cmp, dom);
        });

        describe('When input box loses focus', () => {
            it('Hide menu', async () => {
                await focusIntoInputBoxAndAssert(cmp, dom);
                await focusOutOfInputBox(cmp, dom);
            });

            it('Dont hide menu when focus is moved to the menu', async () => {
                const { fieldInputBox, fieldInputContainer } = dom;
                await focusIntoInputBoxAndAssert(cmp, dom);

                dispatch(fieldInputBox, 'focusout');
                dispatch(fieldInputContainer, 'focusin');

                await waitFor(0);

                assertMenuDisplayed(cmp);
            });
        });
    });
});
