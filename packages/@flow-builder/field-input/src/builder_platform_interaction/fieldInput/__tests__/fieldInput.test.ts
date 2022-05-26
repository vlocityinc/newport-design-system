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

describe('Field Input Tests', () => {
    let cmp;
    let dom;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
        dom = lwcUtils.createDomProxy(cmp, selectors);
    });

    const focusOnInputBoxAndAssert = async () => {
        dispatch(dom.fieldInputBox, 'focusin');
        await ticks(1);
        assertMenuDisplayed(true);
    };

    const waitFor = (timeout = 100) => {
        return new Promise((resolve) => {
            /* eslint-disable @lwc/lwc/no-async-operation */
            setTimeout(() => resolve(), timeout);
        });
    };

    const assertMenuDisplayed = (expectDisplayed = true) => {
        const menu = cmp.shadowRoot.querySelector(selectors.fieldInputMenu);

        if (expectDisplayed) {
            expect(menu).not.toBeNull();
        } else {
            expect(menu).toBeNull();
        }
    };

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
        assertMenuDisplayed(false);
    });

    it('Show menu when menu input box gets focus', async () => {
        await focusOnInputBoxAndAssert();
    });

    it('Hide menu when menu input box loses focus', async () => {
        await focusOnInputBoxAndAssert();

        dispatch(dom.fieldInputBox, 'focusout');
        await waitFor(0);

        assertMenuDisplayed(false);
    });

    it('Dont Hide menu when menu gets focus after input box loses focus', async () => {
        const { fieldInputBox, fieldInputContainer } = dom;
        await focusOnInputBoxAndAssert();

        dispatch(fieldInputBox, 'foucusout');
        dispatch(fieldInputContainer, 'foucusin');

        await waitFor(0);

        assertMenuDisplayed();
    });
});
