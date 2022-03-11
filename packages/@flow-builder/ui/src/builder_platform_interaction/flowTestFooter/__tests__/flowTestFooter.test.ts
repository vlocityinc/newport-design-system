// @ts-nocheck
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';

const closeModalCallback = jest.fn();
const callback = jest.fn();

const DEFAULT_PROPS = {
    flowTestButtons: {
        flowTestButtonOne: {
            buttonLabel: 'button one',
            buttonVariant: 'neutral',
            buttonCallback: callback
        },
        flowTestButtonTwo: {
            buttonLabel: 'button two',
            buttonVariant: 'neutral',
            buttonCallback: callback
        }
    }
};
const createComponentUnderTest = async (overriddenProps) => {
    return createComponent(INTERACTION_COMPONENTS_SELECTORS.FLOW_TEST_FOOTER, DEFAULT_PROPS, overriddenProps);
};

describe('flow-test-footer', () => {
    it('should show button one and two when added', async () => {
        const component = await createComponentUnderTest();
        const buttons = component.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON);
        expect(buttons[0].label).toBe('button one');
        expect(buttons[1].label).toBe('button two');
    });
    it('should invoke callback on button two click', async () => {
        const component = await createComponentUnderTest();
        component.closeModalCallback = closeModalCallback;
        const button = component.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON)[1];
        button.click();
        expect(callback).toHaveBeenCalled();
        expect(closeModalCallback).toHaveBeenCalled();
    });
    it('should have button one disabled when expected', async () => {
        const component = await createComponentUnderTest();
        component.disableFlowTestButtonOne(true);
        await ticks(1);
        const button = component.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON)[0];
        expect(button.disabled).toBe(true);
    });
    it('should have button one enabled when expected', async () => {
        const component = await createComponentUnderTest();
        component.disableFlowTestButtonOne(false);
        await ticks(1);
        const button = component.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON)[0];
        expect(button.disabled).toBe(false);
    });
});
